import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as jose from "npm:jose";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Crear cliente de Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// JWT Secret
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'ifeel-secret-key-change-in-production';
const JWT_SECRET_UINT8 = new TextEncoder().encode(JWT_SECRET);

// Helper to clean tokens (remove Bearer prefix, whitespace, etc)
function cleanToken(token: string): string {
  if (!token) return '';
  let cleaned = token.trim();
  if (cleaned.startsWith('Bearer ')) {
    cleaned = cleaned.substring(7).trim();
  }
  // Eliminar comillas accidentales
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  return cleaned;
}

// HubSpot Configuration
const HUBSPOT_PORTAL_ID = Deno.env.get('HUBSPOT_PORTAL_ID') || '24884594';
const HUBSPOT_FORM_GUID = Deno.env.get('HUBSPOT_FORM_GUID') || '88cd58b0-1586-437c-8b29-0a8fa5f56a74';
const HUBSPOT_MEETING_LINK = Deno.env.get('HUBSPOT_MEETING_LINK') || 'https://ifeelonline.com/info-request/';

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// ========================================================================
// POST /make-server-565cb7e7/download-logs - REGISTRAR DESCARGA
// ========================================================================
app.post("/make-server-565cb7e7/download-logs", async (c) => {
  console.log('🎯 POST /download-logs iniciado - Versión SIN ENVÍO DE EMAILS');

  try {
    const body = await c.req.json();
    const { userName, userEmail, userCompany, sendEmail, fileType, fileName, timestamp, details } = body;

    if (!userName) {
      return c.json({ error: "userName es requerido" }, 400);
    }

    const downloadId = `download_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const valueData = {
      userName,
      userEmail: userEmail || '',
      userCompany: userCompany || '',
      fileType: fileType || 'PDF',
      fileName: fileName || 'Análisis de Benchmark',
      timestamp: timestamp || new Date().toISOString(),
      details: details || {},
    };

    // 1️⃣ GUARDAR EN SUPABASE
    console.log('💾 Guardando en Supabase...');
    const { data, error } = await supabase
      .from('descargas mapa web')
      .insert({
        key: downloadId,
        value: valueData,
        'email adress': userEmail || null,
        'Username': userName,
        'Company Name': userCompany || null,
      })
      .select();

    if (error) {
      console.error('❌ Error Supabase:', error);
      return c.json({ error: `Error al guardar: ${error.message}` }, 500);
    }

    console.log('✅ Guardado en Supabase');

    // 2️⃣ GENERAR JWT TOKEN PARA EL CTA DEL EMAIL
    let demoToken = '';
    if (userEmail && userEmail.trim()) {
      try {
        const tokenPayload = {
          email: userEmail,
          firstName: userName.split(' ')[0] || userName,
          lastName: userName.split(' ').slice(1).join(' ') || '',
          company: userCompany || '',
          country: details?.mercado || '',
          downloadId: downloadId,
        };

        demoToken = await new jose.SignJWT(tokenPayload)
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('30d')
          .sign(JWT_SECRET_UINT8);
        console.log('🔑 Token JWT generado');
      } catch (tokenError) {
        console.error('⚠️ Error generando token:', tokenError.message);
      }
    }

    // 3️⃣ CREAR/ACTUALIZAR CONTACTO EN HUBSPOT
    if (userEmail && userEmail.trim()) {
      try {
        const hubspotApiKey = Deno.env.get('HUBSPOT_API_KEY');

        if (hubspotApiKey) {
          console.log('🔵 Procesando HubSpot...');
          const hubspotBaseUrl = 'https://api.hubapi.com';

          const downloadSummary = `${new Date().toLocaleString('es-ES')} - ${details?.mercado || 'N/A'} | ${details?.industria || 'N/A'} | Abs.Gral: ${details?.absentismoGeneral}% | Abs.SM: ${details?.absentismoSM}%`;

          const contactProperties = {
            properties: {
              email: userEmail,
              firstname: userName.split(' ')[0] || userName,
              lastname: userName.split(' ').slice(1).join(' ') || '',
              company: userCompany || '',
              lifecyclestage: 'lead',
              ultima_descarga_analisis: downloadSummary
            }
          };

          // Intentar crear contacto
          const createResponse = await fetch(`${hubspotBaseUrl}/crm/v3/objects/contacts`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hubspotApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactProperties)
          });

          if (createResponse.ok) {
            const result = await createResponse.json();
            console.log(`✅ Contacto creado en HubSpot (ID: ${result.id})`);
          } else if (createResponse.status === 409) {
            // Contacto existe, actualizar
            console.log('ℹ️ Contacto existe, actualizando...');

            const searchResponse = await fetch(`${hubspotBaseUrl}/crm/v3/objects/contacts/search`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${hubspotApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                filterGroups: [{
                  filters: [{
                    propertyName: 'email',
                    operator: 'EQ',
                    value: userEmail
                  }]
                }]
              })
            });

            const searchResult = await searchResponse.json();

            if (searchResult.results && searchResult.results.length > 0) {
              const contactId = searchResult.results[0].id;

              await fetch(`${hubspotBaseUrl}/crm/v3/objects/contacts/${contactId}`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${hubspotApiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactProperties)
              });

              console.log(`✅ Contacto actualizado en HubSpot (ID: ${contactId})`);
            }
          }
        }
      } catch (hubspotError) {
        console.error('⚠️ Error HubSpot (no crítico):', hubspotError.message);
      }
    }

    // ℹ️ ENVÍO DE EMAIL DESHABILITADO
    console.log('ℹ️ Envío de email deshabilitado');

    console.log('🎉 Proceso completado');
    return c.json({
      success: true,
      message: "Descarga registrada correctamente (sin envío de email)",
      downloadId: downloadId,
      demoToken: demoToken,
      data: data?.[0]
    });

  } catch (error) {
    console.error('❌ Error crítico:', error);
    return c.json({
      error: `Error: ${error.message}`
    }, 500);
  }
});

// ========================================================================
// POST /make-server-565cb7e7/validate-token - VALIDAR TOKEN JWT
// ========================================================================
app.post("/make-server-565cb7e7/validate-token", async (c) => {
  console.log('🔐 POST /validate-token iniciado');

  try {
    const body = await c.req.json();
    const token = cleanToken(body.token);

    if (!token) {
      return c.json({ error: "Token es requerido" }, 400);
    }

    try {
      const { payload: decoded } = await jose.jwtVerify(token, JWT_SECRET_UINT8);
      console.log('✅ Token válido:', decoded);

      return c.json({
        success: true,
        valid: true,
        data: {
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          company: decoded.company,
          country: decoded.country,
          downloadId: decoded.downloadId,
        }
      });
    } catch (jwtError) {
      console.error('❌ Token inválido:', jwtError.message);
      return c.json({
        success: false,
        valid: false,
        error: "Token inválido o expirado"
      }, 401);
    }

  } catch (error) {
    console.error('❌ Error validando token:', error);
    return c.json({
      error: `Error: ${error.message}`
    }, 500);
  }
});

// ========================================================================
// POST /make-server-565cb7e7/submit-demo-request - FLUJO COMPLETO DE DEMO (SIN EMAILS)
// ========================================================================
app.post("/make-server-565cb7e7/submit-demo-request", async (c) => {
  console.log('🚀 POST /submit-demo-request iniciado (SIN ENVÍO DE EMAILS)');

  try {
    const body = await c.req.json();
    const token = cleanToken(body.token);

    if (!token) {
      return c.json({ error: "Token es requerido" }, 400);
    }

    // PASO 1: Validar token
    let contactData;
    let downloadId;
    try {
      const { payload: decoded } = await jose.jwtVerify(token, JWT_SECRET_UINT8);
      contactData = {
        email: decoded.email as string,
        firstName: decoded.firstName as string,
        lastName: decoded.lastName as string,
        company: decoded.company as string,
        country: decoded.country as string,
      };
      downloadId = decoded.downloadId as string;
      console.log('✅ Token válido, datos del contacto extraídos');
    } catch (jwtError) {
      console.error('❌ Token inválido:', jwtError.message);
      return c.json({
        success: false,
        error: "Token inválido o expirado",
        redirect: null
      }, 401);
    }

    // PASO 1.5: Recuperar datos completos del download desde Supabase
    let downloadDetails = {};
    if (downloadId) {
      try {
        console.log(`📊 Recuperando datos de descarga (${downloadId})...`);
        const { data: downloadData, error: downloadError } = await supabase
          .from('descargas mapa web')
          .select('value')
          .eq('key', downloadId)
          .single();

        if (!downloadError && downloadData?.value?.details) {
          downloadDetails = downloadData.value.details;
          console.log('✅ Datos de descarga recuperados:', downloadDetails);
        }
      } catch (downloadFetchError) {
        console.warn('⚠️ Error recuperando datos de descarga:', downloadFetchError.message);
      }
    }

    const hubspotApiKey = Deno.env.get('HUBSPOT_API_KEY');

    if (!hubspotApiKey) {
      console.warn('⚠️ HUBSPOT_API_KEY no configurada');
      return c.json({
        success: true,
        message: "Token válido pero HubSpot no configurado",
        redirect: '/gracias',
        skipped: true
      });
    }

    const hubspotBaseUrl = 'https://api.hubapi.com';

    // PASO 2: Verificar si el contacto ya existe
    let contactExists = false;
    let contactId = null;

    try {
      // Buscar el contacto por email
      const searchResponse = await fetch(`${hubspotBaseUrl}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hubspotApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: 'email',
              operator: 'EQ',
              value: contactData.email
            }]
          }],
          properties: ['email', 'firstname', 'lastname', 'company']
        })
      });

      const searchResult = await searchResponse.json();

      if (searchResult.results && searchResult.results.length > 0) {
        contactExists = true;
        contactId = searchResult.results[0].id;
        console.log(`✅ Contacto YA EXISTE en HubSpot (ID: ${contactId})`);

        // Actualizar datos del contacto
        try {
          await fetch(`${hubspotBaseUrl}/crm/v3/objects/contacts/${contactId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${hubspotApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              properties: {
                firstname: contactData.firstName,
                lastname: contactData.lastName,
                company: contactData.company,
              }
            })
          });
          console.log(`✅ Contacto actualizado en HubSpot`);
        } catch (updateError) {
          console.warn('⚠️ Error actualizando contacto:', updateError.message);
        }

        // SI CONTACTO EXISTE → redirigir a /gracias SIN ENVIAR EMAIL
        console.log('ℹ️ Contacto existente, redirigiendo a /gracias sin enviar email');
        return c.json({
          success: true,
          message: "Contacto ya existe en HubSpot",
          redirect: '/gracias',
          contactExists: true,
          contactId: contactId
        });

      } else {
        console.log('ℹ️ Contacto NUEVO, procediendo...');
      }
    } catch (searchError) {
      console.warn('⚠️ Error buscando contacto:', searchError.message);
      // Continuar de todas formas
    }

    // PASO 3: Crear contacto NUEVO y enviar a HubSpot Forms API
    if (!contactExists) {
      try {
        console.log('📝 Enviando a HubSpot Forms API...');

        const formSubmissionUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

        // Preparar todos los campos de la calculadora
        const formFields = [
          { name: 'email', value: contactData.email },
          { name: 'firstname', value: contactData.firstName },
          { name: 'lastname', value: contactData.lastName },
        ];

        // Agregar campos opcionales solo si tienen valor
        if (contactData.company) {
          formFields.push({ name: 'company', value: contactData.company });
        }

        // Campos del análisis de la calculadora
        if (downloadDetails.mercado) {
          formFields.push({ name: 'country', value: downloadDetails.mercado });
        }
        if (downloadDetails.industria) {
          formFields.push({ name: 'industry', value: downloadDetails.industria });
        }
        if (downloadDetails.absentismoGeneral !== undefined) {
          formFields.push({ name: 'absentismo_general', value: String(downloadDetails.absentismoGeneral) });
        }
        if (downloadDetails.absentismoSM !== undefined) {
          formFields.push({ name: 'absentismo_salud_mental', value: String(downloadDetails.absentismoSM) });
        }

        // Benchmarks
        if (downloadDetails.benchmarkMercadoGeneral) {
          formFields.push({ name: 'benchmark_mercado_general', value: downloadDetails.benchmarkMercadoGeneral });
        }
        if (downloadDetails.benchmarkMercadoSM) {
          formFields.push({ name: 'benchmark_mercado_sm', value: downloadDetails.benchmarkMercadoSM });
        }
        if (downloadDetails.benchmarkIndustriaGeneral) {
          formFields.push({ name: 'benchmark_industria_general', value: downloadDetails.benchmarkIndustriaGeneral });
        }
        if (downloadDetails.benchmarkIndustriaSM) {
          formFields.push({ name: 'benchmark_industria_sm', value: downloadDetails.benchmarkIndustriaSM });
        }

        const formData = {
          fields: formFields,
          context: {
            pageUri: 'https://maker-retina-03986578.figma.site/',
            pageName: 'Descarga Análisis Benchmark Salud Mental'
          }
        };

        console.log('📤 Enviando formulario con campos:', formFields.map(f => f.name).join(', '));

        const formResponse = await fetch(formSubmissionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (formResponse.ok) {
          const formResult = await formResponse.json();
          console.log('✅ Formulario enviado a HubSpot Forms API:', formResult);
        } else {
          const errorText = await formResponse.text();
          console.error('❌ Error enviando formulario:', errorText);
          console.log('⚠️ Continuando proceso a pesar del error en HubSpot Forms');
        }
      } catch (formError) {
        console.error('❌ Error en submission de formulario:', formError.message);
        // Continuar proceso (el error no es crítico)
      }

      // PASO 4: Contacto NUEVO → redirigir a /gracias SIN ENVIAR EMAIL
      console.log('✅ Contacto NUEVO creado, redirigiendo a /gracias sin enviar email');

      return c.json({
        success: true,
        message: "Nuevo contacto creado en HubSpot",
        redirect: '/gracias',
        contactExists: false,
        submitted: true
      });
    }

    // Si llegamos aquí, algo salió mal
    console.error('❌ Flujo inesperado: no se manejó correctamente el caso');
    return c.json({
      success: false,
      error: "Flujo inesperado",
      redirect: null
    }, 500);

  } catch (error) {
    console.error('❌ Error en flujo de demo:', error);
    return c.json({
      error: `Error: ${error.message}`,
      redirect: null
    }, 500);
  }
});

// ========================================================================
// GET /make-server-565cb7e7/register-interest - REGISTRAR INTERÉS (SIN EMAIL)
// ========================================================================
app.get("/make-server-565cb7e7/register-interest", async (c) => {
  console.log('🎯 GET /register-interest iniciado (SIN ENVÍO DE EMAIL)');

  const token = cleanToken(c.req.query('token') || '');

  if (!token) {
    console.error('❌ Token no proporcionado');
    // Retornar pixel transparente
    const transparentGif = Uint8Array.from(atob('R0lHODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0));
    return c.body(transparentGif, 200, { 'Content-Type': 'image/gif' });
  }

  console.log('🔑 Token recibido, decodificando...');

  // Decodificar el token JWT
  let contactData;
  let downloadId;
  try {
    const decoded = await jose.jwtVerify(
      token,
      JWT_SECRET_UINT8
    );
    contactData = decoded.payload;
    downloadId = contactData.downloadId;
    console.log('✅ Token válido para:', contactData.email);
  } catch (jwtError) {
    console.error('❌ Error decodificando token:', jwtError.message);
    // Retornar pixel transparente
    const transparentGif = Uint8Array.from(atob('R0lHODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0));
    return c.body(transparentGif, 200, { 'Content-Type': 'image/gif' });
  }

  // Registrar el interés en Supabase
  try {
    const interestKey = `interest_${downloadId}_${Date.now()}`;
    console.log('💾 Guardando interés en Supabase...');

    const { error: interestError } = await supabase
      .from('descargas mapa web')
      .insert({
        key: interestKey,
        value: {
          downloadId,
          email: contactData.email,
          name: contactData.firstName,
          timestamp: new Date().toISOString(),
          action: 'clicked_meeting_cta'
        },
        'email adress': contactData.email,
        'Username': contactData.firstName
      });

    if (interestError) {
      console.warn('⚠️ Error guardando interés en Supabase:', interestError.message);
    } else {
      console.log('✅ Interés registrado en Supabase');
    }
  } catch (dbError) {
    console.warn('⚠️ Error en base de datos (no crítico):', dbError.message);
  }

  // ℹ️ ENVÍO DE EMAIL DESHABILITADO
  console.log('ℹ️ Envío de email deshabilitado en /register-interest');

  console.log('✅ Proceso de registro de interés completado (sin email)');

  // Retornar un pixel de tracking transparente (1x1 GIF)
  const transparentGif = Uint8Array.from(atob('R0lHODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0));

  return c.body(transparentGif, 200, {
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Access-Control-Allow-Origin': '*'
  });
});

// ========================================================================
// GET /make-server-565cb7e7/download-logs - OBTENER REGISTROS
// ========================================================================
app.get("/make-server-565cb7e7/download-logs", async (c) => {
  try {
    const { data, error } = await supabase
      .from('descargas mapa web')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({
      success: true,
      downloads: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ========================================================================
// GET /make-server-565cb7e7/health - HEALTH CHECK
// ========================================================================
app.get("/make-server-565cb7e7/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "sin-emails"
  });
});

// Iniciar servidor
console.log('🚀 Servidor ifeel iniciado SIN ENVÍO DE EMAILS');
Deno.serve(app.fetch);
