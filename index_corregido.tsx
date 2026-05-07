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
  console.log('🎯 POST /download-logs iniciado');

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

    // 3️⃣ CREAR/ACTUALIZAR CONTACTO EN HUBSPOT + ENVIAR A FORMS API
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

          // Enviar a HubSpot Forms API
          try {
            console.log('📝 Enviando a HubSpot Forms API...');

            const formSubmissionUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

            // Preparar todos los campos de la calculadora
            const formFields = [
              { name: 'email', value: userEmail },
              { name: 'firstname', value: userName.split(' ')[0] || userName },
              { name: 'lastname', value: userName.split(' ').slice(1).join(' ') || '' },
            ];

            // Agregar campos opcionales solo si tienen valor
            if (userCompany) {
              formFields.push({ name: 'company', value: userCompany });
            }

            // Campos del análisis de la calculadora
            if (details?.mercado) {
              formFields.push({ name: 'country', value: details.mercado });
            }
            if (details?.industria) {
              formFields.push({ name: 'industry', value: details.industria });
            }
            if (details?.absentismoGeneral !== undefined) {
              formFields.push({ name: 'absentismo_general', value: String(details.absentismoGeneral) });
            }
            if (details?.absentismoSM !== undefined) {
              formFields.push({ name: 'absentismo_salud_mental', value: String(details.absentismoSM) });
            }

            // Benchmarks
            if (details?.benchmarkMercadoGeneral) {
              formFields.push({ name: 'benchmark_mercado_general', value: details.benchmarkMercadoGeneral });
            }
            if (details?.benchmarkMercadoSM) {
              formFields.push({ name: 'benchmark_mercado_sm', value: details.benchmarkMercadoSM });
            }
            if (details?.benchmarkIndustriaGeneral) {
              formFields.push({ name: 'benchmark_industria_general', value: details.benchmarkIndustriaGeneral });
            }
            if (details?.benchmarkIndustriaSM) {
              formFields.push({ name: 'benchmark_industria_sm', value: details.benchmarkIndustriaSM });
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
          }
        }
      } catch (hubspotError) {
        console.error('⚠️ Error HubSpot (no crítico):', hubspotError.message);
      }
    }

    // 4️⃣ ENVIAR EMAIL CON SENDGRID - ✅ MANTENER ESTE EMAIL
    if (sendEmail && userEmail && userEmail.trim()) {
      try {
        const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');

        if (sendgridApiKey) {
          console.log(`📧 Enviando email del análisis a ${userEmail}...`);

          const emailHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #1A4CA4; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <img src="https://ifeelonline.com/wp-content/uploads/sites/2/2026/04/ifeel-logo.svg" alt="ifeel" style="max-width: 150px; height: auto; margin-bottom: 15px;">
                  <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">Análisis de Salud Mental Laboral</h1>
                </div>

                <div style="background: #F4F7FB; padding: 30px; border-radius: 0 0 8px 8px;">
                  <h2 style="color: #1A4CA4; margin-top: 0;">¡Gracias, ${userName}!</h2>
                  <p style="font-size: 18px; line-height: 1.5; color: #1A4CA4; font-weight: 500;">Descubre los datos que te ayudarán a entender mejor el bienestar en tu organización</p>

                  <!-- Sección: Tus Datos -->
                  <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 6px;">
                    <h3 style="font-weight: 700; font-size: 16px; color: #1B4291; margin: 0 0 10px 0;">Tus Datos</h3>
                    <div style="border-bottom: 2px solid #84B8FA; margin-bottom: 15px;"></div>

                    <p style="margin: 5px 0; padding-bottom: 10px; border-bottom: 1px solid #84B8FA;"><strong>📊 Mercado:</strong> ${details?.mercado || 'N/A'}</p>
                    <p style="margin: 5px 0; padding: 10px 0; border-bottom: 1px solid #84B8FA;"><strong>🏢 Industria:</strong> ${details?.industria || 'N/A'}</p>
                    <p style="margin: 5px 0; padding: 10px 0; border-bottom: 1px solid #84B8FA;"><strong>📈 Absentismo General:</strong> ${details?.absentismoGeneral}%</p>
                    <p style="margin: 5px 0; padding-top: 10px;"><strong>🧠 Absentismo por Salud Mental:</strong> ${details?.absentismoSM}%</p>
                  </div>

                  <!-- Sección: Comparación con Benchmarks -->
                  <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 6px;">
                    <h3 style="font-weight: 700; font-size: 16px; color: #1B4291; margin: 0 0 10px 0;">Comparativa frente a benchmarks de tu sector</h3>
                    <div style="border-bottom: 2px solid #84B8FA; margin-bottom: 20px;"></div>

                    <!-- Subsección: Absentismo General -->
                    <h4 style="font-weight: 700; font-size: 14px; color: #4172D4; margin: 0 0 10px 0;">Absentismo General</h4>
                    <div style="border-bottom: 1px solid #84B8FA; margin-bottom: 15px;"></div>

                    <div style="margin-bottom: 10px;">
                      <div style="margin-bottom: 12px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Tu empresa:</div>
                        <div style="display: flex; align-items: center;">
                          <div style="flex: 1; background: #E7F1FE; border-radius: 4px; height: 24px; position: relative; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #1A4CA4 0%, #3E63BA 100%); height: 100%; width: ${Math.min(details?.absentismoGeneral || 0, 100)}%; border-radius: 4px;"></div>
                          </div>
                          <span style="margin-left: 10px; font-weight: bold; color: #1A4CA4; min-width: 45px;">${details?.absentismoGeneral || 0}%</span>
                        </div>
                      </div>

                      <div style="margin-bottom: 12px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Benchmark Mercado:</div>
                        <div style="display: flex; align-items: center;">
                          <div style="flex: 1; background: #E7F1FE; border-radius: 4px; height: 24px; position: relative; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #84B8FA 0%, #C2DCFD 100%); height: 100%; width: ${Math.min(details?.benchmarkMercadoGeneral || 0, 100)}%; border-radius: 4px;"></div>
                          </div>
                          <span style="margin-left: 10px; font-weight: bold; color: #4172D4; min-width: 45px;">${details?.benchmarkMercadoGeneral || 0}%</span>
                        </div>
                      </div>

                      <div style="margin-bottom: 8px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Benchmark Industria:</div>
                        <div style="display: flex; align-items: center;">
                          <div style="flex: 1; background: #E7F1FE; border-radius: 4px; height: 24px; position: relative; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #84B8FA 0%, #C2DCFD 100%); height: 100%; width: ${Math.min(details?.benchmarkIndustriaGeneral || 0, 100)}%; border-radius: 4px;"></div>
                          </div>
                          <span style="margin-left: 10px; font-weight: bold; color: #4172D4; min-width: 45px;">${details?.benchmarkIndustriaGeneral || 0}%</span>
                        </div>
                      </div>
                    </div>

                    <div style="border-bottom: 1px solid #84B8FA; margin: 15px 0 20px 0;"></div>

                    <!-- Subsección: Absentismo por Salud Mental -->
                    <h4 style="font-weight: 700; font-size: 14px; color: #4172D4; margin: 0 0 10px 0;">Absentismo por Salud Mental</h4>
                    <div style="border-bottom: 1px solid #84B8FA; margin-bottom: 15px;"></div>

                    <div>
                      <div style="margin-bottom: 12px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Tu empresa:</div>
                        <div style="display: flex; align-items: center;">
                          <div style="flex: 1; background: #E7F1FE; border-radius: 4px; height: 24px; position: relative; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #FF9D89 0%, #FFB8AB 100%); height: 100%; width: ${Math.min(details?.absentismoSM || 0, 100)}%; border-radius: 4px;"></div>
                          </div>
                          <span style="margin-left: 10px; font-weight: bold; color: #FF9D89; min-width: 45px;">${details?.absentismoSM || 0}%</span>
                        </div>
                      </div>

                      <div style="margin-bottom: 12px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Benchmark Mercado:</div>
                        <div style="display: flex; align-items: center;">
                          <div style="flex: 1; background: #E7F1FE; border-radius: 4px; height: 24px; position: relative; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #FFDBCF 0%, #FFB8AB 100%); height: 100%; width: ${Math.min(details?.benchmarkMercadoSM || 0, 100)}%; border-radius: 4px;"></div>
                          </div>
                          <span style="margin-left: 10px; font-weight: bold; color: #FF9D89; min-width: 45px;">${details?.benchmarkMercadoSM || 0}%</span>
                        </div>
                      </div>

                      <div>
                        <div style="font-weight: bold; color: #333; margin-bottom: 4px;">Benchmark Industria:</div>
                        <div style="display: flex; align-items: center;">
                          <div style="flex: 1; background: #E7F1FE; border-radius: 4px; height: 24px; position: relative; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #FFDBCF 0%, #FFB8AB 100%); height: 100%; width: ${Math.min(details?.benchmarkIndustriaSM || 0, 100)}%; border-radius: 4px;"></div>
                          </div>
                          <span style="margin-left: 10px; font-weight: bold; color: #FF9D89; min-width: 45px;">${details?.benchmarkIndustriaSM || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">© ${new Date().getFullYear()} ifeel</p>
                </div>
              </body>
            </html>
          `;

          const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sendgridApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              personalizations: [{
                to: [{ email: userEmail, name: userName }],
                subject: 'Tu analisis de benchmarks de salud mental laboral esta listo'
              }],
              from: {
                email: 'business.intelligence@ifeelonline.com',
                name: 'ifeel Business Intelligence'
              },
              content: [{
                type: 'text/html',
                value: emailHtml
              }]
            })
          });

          if (emailResponse.ok || emailResponse.status === 202) {
            console.log(`✅ Email enviado a ${userEmail}`);
            console.log('📬 Status SendGrid:', emailResponse.status);
          } else {
            const errorText = await emailResponse.text();
            console.error('❌ Error SendGrid:', errorText);
            console.error('📧 Email destinatario:', userEmail);
            console.error('🔴 Status code:', emailResponse.status);
          }
        } else {
          console.warn('⚠️ SENDGRID_API_KEY no configurada');
        }
      } catch (emailError) {
        console.error('⚠️ Error email (no crítico):', emailError.message);
      }
    }

    console.log('🎉 Proceso completado');
    return c.json({
      success: true,
      message: "Descarga registrada correctamente",
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
// POST /make-server-565cb7e7/submit-demo-request - FLUJO COMPLETO DE DEMO (SIN EMAIL)
// ========================================================================
app.post("/make-server-565cb7e7/submit-demo-request", async (c) => {
  console.log('🚀 POST /submit-demo-request iniciado');

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
        return c.json({
          success: true,
          message: "Contacto ya existe en HubSpot",
          redirect: '/gracias',
          contactExists: true,
          contactId: contactId
        });

      } else {
        console.log('ℹ️ Contacto NUEVO, procediendo con creación...');
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
// GET /make-server-565cb7e7/register-interest - REGISTRAR INTERÉS (SIN EMAIL) ❌
// ========================================================================
app.get("/make-server-565cb7e7/register-interest", async (c) => {
  console.log('🎯 GET /register-interest iniciado (SIN ENVÍO DE EMAIL)');

  const token = cleanToken(c.req.query('token') || '');

  if (!token) {
    console.error('❌ Token no proporcionado');
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

  // ℹ️ EMAIL BLOQUEADO - NO SE ENVÍA
  console.log('❌ EMAIL BLOQUEADO: No se envía email de confirmación');

  console.log('✅ Proceso de registro de interés completado');

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
    version: "mantiene-descarga-bloquea-registerinterest"
  });
});

// Iniciar servidor
console.log('🚀 Servidor ifeel iniciado');
console.log('✅ Email de descarga: ACTIVO');
console.log('❌ Email de register-interest: BLOQUEADO');
Deno.serve(app.fetch);
