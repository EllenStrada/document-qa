import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as jwt from "npm:jsonwebtoken";
import * as jose from "npm:jose";

const app = new Hono();

// Crear cliente de Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// JWT Secret
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'ifeel-secret-key-change-in-production';

// HubSpot Configuration
const HUBSPOT_PORTAL_ID = Deno.env.get('HUBSPOT_PORTAL_ID') || '24884594';
const HUBSPOT_FORM_GUID = Deno.env.get('HUBSPOT_FORM_GUID') || '88cd58b0-1586-437c-8b29-0a8fa5f56a74';
const HUBSPOT_MEETING_LINK = Deno.env.get('HUBSPOT_MEETING_LINK') || 'https://ifeelonline.com/info-request/';

// Middleware
app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));
app.use("*", logger(console.log));

console.log('🔑 Configuración del servidor:');
console.log('- SUPABASE_URL:', Deno.env.get('SUPABASE_URL') ? '✅ Configurada' : '❌ No configurada');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? '✅ Configurada' : '❌ No configurada');
console.log('- SENDGRID_API_KEY:', Deno.env.get('SENDGRID_API_KEY') ? '✅ Configurada' : '❌ No configurada');
console.log('- HUBSPOT_API_KEY:', Deno.env.get('HUBSPOT_API_KEY') ? '✅ Configurada' : '❌ No configurada');
console.log('- HUBSPOT_PORTAL_ID:', HUBSPOT_PORTAL_ID);
console.log('- HUBSPOT_FORM_GUID:', HUBSPOT_FORM_GUID);

// ========================================================================
// POST /download-logs - REGISTRAR DESCARGA
// ========================================================================
app.post("/download-logs", async (c) => {
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

        demoToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '30d' });
        console.log('🔑 Token JWT generado');
      } catch (tokenError) {
        console.error('⚠️ Error generando token:', tokenError.message);
      }
    }

    // 3️⃣ CREAR/ACTUALIZAR CONTACTO EN HUBSPOT
    if (userEmail && userEmail.trim()) {
      try {
        const hubspotApiKey = Deno.env.get('HUBSPOT_API_KEY');

        console.log('🔵 Intentando procesar HubSpot...');
        console.log('🔵 HubSpot API Key presente: ' + (hubspotApiKey ? 'SÍ' : 'NO'));

        if (hubspotApiKey) {
          console.log('🔵 Procesando contacto en HubSpot para:', userEmail);
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
            console.log(`✅ Contacto NUEVO creado en HubSpot (ID: ${result.id})`);
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

            const formFields = [
              { name: 'email', value: userEmail },
              { name: 'firstname', value: userName.split(' ')[0] || userName },
              { name: 'lastname', value: userName.split(' ').slice(1).join(' ') || '' },
            ];

            if (userCompany) {
              formFields.push({ name: 'company', value: userCompany });
            }

            // Campos del análisis
            if (details?.mercado) formFields.push({ name: 'country', value: details.mercado });
            if (details?.industria) formFields.push({ name: 'industry', value: details.industria });
            if (details?.absentismoGeneral !== undefined) formFields.push({ name: 'absentismo_general', value: String(details.absentismoGeneral) });
            if (details?.absentismoSM !== undefined) formFields.push({ name: 'absentismo_salud_mental', value: String(details.absentismoSM) });

            // Benchmarks
            if (details?.benchmarkMercadoGeneral) formFields.push({ name: 'benchmark_mercado_general', value: details.benchmarkMercadoGeneral });
            if (details?.benchmarkMercadoSM) formFields.push({ name: 'benchmark_mercado_sm', value: details.benchmarkMercadoSM });
            if (details?.benchmarkIndustriaGeneral) formFields.push({ name: 'benchmark_industria_general', value: details.benchmarkIndustriaGeneral });
            if (details?.benchmarkIndustriaSM) formFields.push({ name: 'benchmark_industria_sm', value: details.benchmarkIndustriaSM });

            const formData = {
              fields: formFields,
              context: {
                pageUri: 'https://maker-retina-03986578.figma.site/',
                pageName: 'Descarga Análisis Benchmark Salud Mental'
              }
            };

            const formResponse = await fetch(formSubmissionUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            });

            if (formResponse.ok) {
              const formResult = await formResponse.json();
              console.log('✅ Formulario enviado a HubSpot Forms API:', formResult);
            } else {
              const errorText = await formResponse.text();
              console.error('❌ Error enviando formulario - Status:', formResponse.status);
              console.error('❌ Error enviando formulario - Response:', errorText);
            }
          } catch (formError) {
            console.error('❌ Error en submission de formulario:', formError.message);
            console.error('❌ Stack trace:', formError.stack);
          }
        } else {
          console.warn('⚠️ HUBSPOT_API_KEY no configurada - HubSpot NO procesado');
        }
      } catch (hubspotError) {
        console.error('⚠️ Error HubSpot (no crítico):', hubspotError.message);
        console.error('⚠️ Stack trace:', hubspotError.stack);
      }
    } else {
      console.log('ℹ️ HubSpot no será procesado - userEmail:', userEmail);
    }

    // 4️⃣ ENVIAR EMAIL CON SENDGRID - ✅ MANTENER ESTE EMAIL
    if (sendEmail && userEmail && userEmail.trim()) {
      try {
        const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');

        console.log(`📧 Intentando enviar email a ${userEmail}...`);
        console.log(`📧 SendGrid API Key presente: ${sendgridApiKey ? 'SÍ' : 'NO'}`);

        if (sendgridApiKey) {
          console.log(`📧 Preparando email para ${userEmail}...`);

          // Translate Spanish market/industry names to English for email
          const marketTranslations: Record<string, string> = {
            'Global': 'Global',
            'Europa': 'Europe',
            'España': 'Spain',
            'Francia': 'France',
            'DACH': 'DACH',
            'UKI': 'UKI',
            'USA': 'USA',
            'Brasil': 'Brazil',
            'México': 'Mexico'
          };

          const industryTranslations: Record<string, string> = {
            'Tecnología / IT': 'Technology / IT',
            'Tecnología/IT': 'Technology / IT',
            'Banca/Finanzas': 'Banking / Finance',
            'Salud/Farmacéutico': 'Healthcare / Pharmaceutical',
            'Retail/Comercio': 'Retail / Commerce',
            'Manufactura': 'Manufacturing',
            'Educación': 'Education',
            'Transporte/Logística': 'Transportation / Logistics',
            'Consultoría/Servicios': 'Consulting / Services',
            'Energía': 'Energy',
            'Telecomunicaciones': 'Telecommunications',
            'Hostelería/Turismo': 'Hospitality / Tourism',
            'Medios/Entretenimiento': 'Media / Entertainment',
            'Inmobiliario/Construcción': 'Real Estate / Construction',
            'Agricultura': 'Agriculture',
            'Otros': 'Other'
          };

          const marketEnglish = marketTranslations[details?.mercado] || details?.mercado || 'N/A';
          const industryEnglish = industryTranslations[details?.industria] || details?.industria || 'N/A';

          // Translate benchmark text from Spanish to English
          const translateBenchmark = (text: string): string => {
            if (!text) return 'N/A';
            return text
              .replace(/Fuente:/g, 'Source:')
              .replace(/Fuentes:/g, 'Sources:')
              .replace(/del total/g, 'of total')
              .replace(/≈/g, '≈')
              .replace(/año/g, 'year')
              .replace(/para empleadores/g, 'for employers')
              .replace(/para estados/g, 'for states')
              .replace(/pérdida total/g, 'total loss')
              .replace(/países/g, 'countries');
          };

          const benchmarkMercadoGeneralEN = translateBenchmark(details?.benchmarkMercadoGeneral);
          const benchmarkMercadoSMEN = translateBenchmark(details?.benchmarkMercadoSM);
          const benchmarkIndustriaGeneralEN = translateBenchmark(details?.benchmarkIndustriaGeneral);
          const benchmarkIndustriaSMEN = translateBenchmark(details?.benchmarkIndustriaSM);

          const emailHtml = `
            <!DOCTYPE html>
            <html>
              <head><meta charset="utf-8"></head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0;">
                <!-- Header -->
                <div style="background: #1B4291; color: white; padding: 40px 30px; text-align: center;">
                  <img src="https://ifeelonline.com/wp-content/uploads/sites/2/2025/03/logo-ifeel-negative-1.png" alt="ifeel" style="max-width: 150px; height: auto; margin: 0 auto; display: block;">
                </div>

                <!-- Body -->
                <div style="background: #F8F9FA; padding: 30px;">
                  <!-- Greeting -->
                  <p style="color: #1B4291; font-size: 16px; margin: 0 0 15px 0;">Thank you, ${userName}!</p>

                  <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 25px 0;">
                    Discover the data that will help you better understand wellbeing in your organization
                  </p>

                  <!-- Your Data Section -->
                  <div style="background: white; padding: 20px; margin: 0 0 20px 0; border-radius: 4px;">
                    <h3 style="font-weight: 700; font-size: 14px; color: #1B4291; margin: 0 0 10px 0;">Your Data</h3>
                    <div style="border-bottom: 1px solid #E0E0E0; margin-bottom: 15px;"></div>

                    <p style="margin: 8px 0; font-size: 13px; color: #333;">
                      <span style="color: #FF7F6A; margin-right: 5px;">■</span>
                      <strong>Market:</strong> ${marketEnglish}
                    </p>
                    <div style="border-bottom: 1px solid #F0F0F0; margin: 8px 0;"></div>

                    <p style="margin: 8px 0; font-size: 13px; color: #333;">
                      <span style="color: #FF7F6A; margin-right: 5px;">■</span>
                      <strong>Industry:</strong> ${industryEnglish}
                    </p>
                    <div style="border-bottom: 1px solid #F0F0F0; margin: 8px 0;"></div>

                    <p style="margin: 8px 0; font-size: 13px; color: #333;">
                      <span style="color: #FF7F6A; margin-right: 5px;">■</span>
                      <strong>General Absenteeism:</strong> ${details?.absentismoGeneral}%
                    </p>
                    <div style="border-bottom: 1px solid #F0F0F0; margin: 8px 0;"></div>

                    <p style="margin: 8px 0; font-size: 13px; color: #333;">
                      <span style="color: #FF7F6A; margin-right: 5px;">■</span>
                      <strong>Mental Health Absenteeism:</strong> ${details?.absentismoSM}%
                    </p>
                  </div>

                  <!-- Benchmark Comparison Section -->
                  <div style="background: white; padding: 20px; margin: 0 0 20px 0; border-radius: 4px;">
                    <h3 style="font-weight: 700; font-size: 14px; color: #1B4291; margin: 0 0 10px 0;">Comparison against your sector benchmarks</h3>
                    <div style="border-bottom: 1px solid #E0E0E0; margin-bottom: 15px;"></div>

                    <!-- General Absenteeism Subsection -->
                    <h4 style="font-weight: 700; font-size: 13px; color: #1B4291; margin: 0 0 10px 0;">General Absenteeism</h4>

                    <p style="margin: 8px 0; font-size: 12px; color: #333;">
                      <strong>Your company:</strong><br>
                      <span style="font-weight: bold; color: #1B4291;">${details?.absentismoGeneral}%</span>
                    </p>

                    <p style="margin: 8px 0; font-size: 12px; color: #333;">
                      <strong>Market Benchmark:</strong><br>
                      <span style="color: #1B4291;">${benchmarkMercadoGeneralEN}</span>
                    </p>

                    <p style="margin: 8px 0 15px 0; font-size: 12px; color: #333;">
                      <strong>Industry Benchmark:</strong><br>
                      <span style="color: #1B4291;">${benchmarkIndustriaGeneralEN}</span>
                    </p>

                    <div style="border-bottom: 1px solid #F0F0F0; margin: 15px 0;"></div>

                    <!-- Mental Health Absenteeism Subsection -->
                    <h4 style="font-weight: 700; font-size: 13px; color: #1B4291; margin: 0 0 10px 0;">Mental Health Absenteeism</h4>

                    <p style="margin: 8px 0; font-size: 12px; color: #333;">
                      <strong>Your company:</strong><br>
                      <span style="font-weight: bold; color: #FF7F6A;">${details?.absentismoSM}%</span>
                    </p>

                    <p style="margin: 8px 0; font-size: 12px; color: #333;">
                      <strong>Market Benchmark:</strong><br>
                      <span style="color: #FF7F6A;">${benchmarkMercadoSMEN}</span>
                    </p>

                    <p style="margin: 8px 0; font-size: 12px; color: #333;">
                      <strong>Industry Benchmark:</strong><br>
                      <span style="color: #FF7F6A;">${benchmarkIndustriaSMEN}</span>
                    </p>
                  </div>

                  <!-- Footer -->
                  <p style="color: #999; font-size: 11px; margin: 30px 0 0 0; text-align: center;">© ${new Date().getFullYear()} ifeel</p>
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
                subject: `Your workplace mental health benchmark analysis is ready 🧠`
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
            console.log(`✅ Email enviado exitosamente a ${userEmail}`);
          } else {
            const errorText = await emailResponse.text();
            console.error('❌ Error SendGrid - Status:', emailResponse.status);
            console.error('❌ Error SendGrid - Response:', errorText);
          }
        } else {
          console.warn('⚠️ SENDGRID_API_KEY no está configurada - Email NO enviado');
        }
      } catch (emailError) {
        console.error('⚠️ Error enviando email (no crítico):', emailError.message);
        console.error('⚠️ Stack trace:', emailError.stack);
      }
    } else {
      console.log('ℹ️ Email no será enviado - sendEmail:', sendEmail, 'userEmail:', userEmail);
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
// POST /submit-demo-request - FLUJO COMPLETO DE DEMO
// ========================================================================
app.post("/submit-demo-request", async (c) => {
  console.log('🚀 POST /submit-demo-request iniciado');

  try {
    const body = await c.req.json();
    const { token } = body;

    if (!token) {
      return c.json({ error: "Token es requerido" }, 400);
    }

    // PASO 1: Validar token
    let contactData;
    let downloadId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      contactData = {
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        company: decoded.company,
        country: decoded.country,
      };
      downloadId = decoded.downloadId;
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
          console.log('✅ Datos de descarga recuperados');
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
        redirect: HUBSPOT_MEETING_LINK,
        skipped: true
      });
    }

    const hubspotBaseUrl = 'https://api.hubapi.com';

    // PASO 2: Verificar si el contacto ya existe
    let contactExists = false;
    let contactId = null;

    try {
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

        // SI CONTACTO EXISTE → NO REDIRIGIR
        return c.json({
          success: true,
          message: "Contacto ya existe en HubSpot",
          redirect: null,
          contactExists: true,
          contactId: contactId
        });
      }
    } catch (searchError) {
      console.warn('⚠️ Error buscando contacto:', searchError.message);
    }

    // PASO 3: Crear contacto NUEVO y enviar a HubSpot Forms API
    if (!contactExists) {
      try {
        console.log('📝 Enviando a HubSpot Forms API...');

        const formSubmissionUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

        const formFields = [
          { name: 'email', value: contactData.email },
          { name: 'firstname', value: contactData.firstName },
          { name: 'lastname', value: contactData.lastName },
        ];

        if (contactData.company) formFields.push({ name: 'company', value: contactData.company });
        if (downloadDetails.mercado) formFields.push({ name: 'country', value: downloadDetails.mercado });
        if (downloadDetails.industria) formFields.push({ name: 'industry', value: downloadDetails.industria });
        if (downloadDetails.absentismoGeneral !== undefined) formFields.push({ name: 'absentismo_general', value: String(downloadDetails.absentismoGeneral) });
        if (downloadDetails.absentismoSM !== undefined) formFields.push({ name: 'absentismo_salud_mental', value: String(downloadDetails.absentismoSM) });

        const formData = {
          fields: formFields,
          context: {
            pageUri: 'https://maker-retina-03986578.figma.site/',
            pageName: 'Descarga Análisis Benchmark Salud Mental'
          }
        };

        const formResponse = await fetch(formSubmissionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (formResponse.ok) {
          console.log('✅ Formulario enviado a HubSpot Forms API');
        } else {
          const errorText = await formResponse.text();
          console.error('❌ Error enviando formulario:', errorText);
        }
      } catch (formError) {
        console.error('❌ Error en submission de formulario:', formError.message);
      }

      console.log('✅ Contacto NUEVO creado, redirigiendo a info-request');

      return c.json({
        success: true,
        message: "Nuevo contacto creado en HubSpot",
        redirect: HUBSPOT_MEETING_LINK,
        contactExists: false,
        submitted: true
      });
    }

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
// GET /register-interest - REGISTRAR INTERÉS (SIN EMAIL) ❌
// ========================================================================
app.get("/register-interest", async (c) => {
  console.log('🎯 GET /register-interest iniciado (SIN ENVÍO DE EMAIL)');

  const token = c.req.query('token');

  if (!token) {
    console.warn('⚠️ No token provided, redirecting directly to meeting link');
    return c.redirect(HUBSPOT_MEETING_LINK);
  }

  let contactData;
  let downloadId;
  try {
    const decoded = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    contactData = decoded.payload;
    downloadId = contactData.downloadId;
    console.log('✅ Token válido para:', contactData.email);
  } catch (jwtError) {
    console.error('❌ Error decodificando token:', jwtError.message);
    console.warn('⚠️ Token invalid, redirecting directly to meeting link');
    return c.redirect(HUBSPOT_MEETING_LINK);
  }

  // Registrar el interés en Supabase
  try {
    const interestKey = `interest_${downloadId}_${Date.now()}`;
    await supabase
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

    console.log('✅ Interés registrado');
  } catch (dbError) {
    console.warn('⚠️ Error en base de datos:', dbError.message);
  }

  // ℹ️ EMAIL BLOQUEADO - NO SE ENVÍA
  console.log('❌ EMAIL BLOQUEADO: No se envía email de confirmación en /register-interest');

  // Retornar respuesta JSON de éxito
  return c.json({
    success: true,
    message: 'Interest registered (email blocked)'
  });
});

// ========================================================================
// GET /test-sendgrid - TEST EMAIL SENDGRID
// ========================================================================
app.get("/test-sendgrid", async (c) => {
  console.log('📧 Test SendGrid iniciado');

  const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');

  if (!sendgridApiKey) {
    return c.json({
      success: false,
      error: 'SENDGRID_API_KEY no configurada',
      configured: false
    }, 500);
  }

  try {
    // Test con email simple
    const testEmail = {
      personalizations: [{
        to: [{ email: 'test@example.com', name: 'Test User' }],
        subject: 'Test Email from ifeel - ' + new Date().toISOString()
      }],
      from: {
        email: 'business.intelligence@ifeelonline.com',
        name: 'ifeel Business Intelligence'
      },
      content: [{
        type: 'text/html',
        value: '<h1>Test Email</h1><p>This is a test email from the ifeel platform.</p>'
      }]
    };

    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testEmail)
    });

    const responseText = await emailResponse.text();

    return c.json({
      success: emailResponse.ok || emailResponse.status === 202,
      status: emailResponse.status,
      statusText: emailResponse.statusText,
      configured: true,
      apiKeyPreview: sendgridApiKey.substring(0, 15) + '...',
      response: responseText || 'Email sent successfully',
      message: (emailResponse.ok || emailResponse.status === 202)
        ? '✅ SendGrid está configurado y funcionando correctamente'
        : '❌ SendGrid configurado pero hay un error en el envío'
    });
  } catch (error) {
    console.error('❌ Error testing SendGrid:', error);
    return c.json({
      success: false,
      error: error.message,
      configured: true
    }, 500);
  }
});

// ========================================================================
// GET /test-hubspot-form - DIAGNÓSTICO HUBSPOT
// ========================================================================
app.get("/test-hubspot-form", async (c) => {
  console.log('🧪 GET /test-hubspot-form iniciado');

  try {
    const formSubmissionUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

    const testFormData = {
      fields: [
        { name: 'email', value: 'test@example.com' },
        { name: 'firstname', value: 'Test' },
        { name: 'lastname', value: 'Usuario' },
        { name: 'company', value: 'Test Company' },
      ],
      context: {
        pageUri: 'https://maker-retina-03986578.figma.site/test',
        pageName: 'Test Form Submission'
      }
    };

    const formResponse = await fetch(formSubmissionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testFormData)
    });

    const responseText = await formResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return c.json({
      success: formResponse.ok,
      status: formResponse.status,
      statusText: formResponse.statusText,
      portalId: HUBSPOT_PORTAL_ID,
      formGuid: HUBSPOT_FORM_GUID,
      response: responseData,
      message: formResponse.ok
        ? '✅ Formulario de prueba enviado correctamente a HubSpot'
        : '❌ Error al enviar formulario de prueba'
    });

  } catch (error) {
    console.error('❌ Error en test de HubSpot Form:', error);
    return c.json({
      success: false,
      error: `Error: ${error.message}`,
      portalId: HUBSPOT_PORTAL_ID,
      formGuid: HUBSPOT_FORM_GUID
    }, 500);
  }
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "mantiene-descarga-bloquea-registerinterest"
  });
});

console.log('🚀 Servidor ifeel iniciado');
console.log('✅ Email de descarga: ACTIVO');
console.log('❌ Email de register-interest: BLOQUEADO');
Deno.serve(app.fetch);
