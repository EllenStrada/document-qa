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
// HELPER: Enviar email de confirmación de reunión al usuario
// ========================================================================
async function sendConfirmationEmail(contactData: { email?: string; firstName?: string; lastName?: string; company?: string; country?: string }) {
  const sendgridApiKey = Deno.env.get('SENDGRID');
  if (!sendgridApiKey) {
    console.warn('⚠️ SENDGRID no configurada, saltando email de confirmación');
    return;
  }
  if (!contactData.email) {
    console.warn('⚠️ Email no disponible, saltando confirmación');
    return;
  }

  console.log('📧 Enviando email de confirmación de reunión a:', contactData.email);

  const confirmationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#F4F7FB; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7FB; padding:30px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

                <!-- HEADER -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1A4CA4 0%, #3E63BA 100%); padding:32px 40px; border-radius:12px 12px 0 0; text-align:center;">
                    <img src="https://ifeelonline.com/wp-content/uploads/sites/2/2026/04/ifeel-logo.svg" alt="ifeel" style="max-width:130px; height:auto; margin-bottom:16px;" />
                    <h1 style="color:white; margin:0; font-size:22px; font-weight:700; letter-spacing:-0.3px;">
                      Analiza y potencia el bienestar mental en tu organización
                    </h1>
                  </td>
                </tr>

                <!-- BODY -->
                <tr>
                  <td style="background:white; padding:40px;">

                    <!-- Saludo -->
                    <p style="font-size:18px; color:#1A4CA4; font-weight:700; margin:0 0 8px 0;">
                      Hola, ${contactData.firstName || 'profesional'}
                    </p>
                    <p style="font-size:15px; color:#4B5563; line-height:1.6; margin:0 0 28px 0;">
                      Hemos recibido tu solicitud correctamente. ¡Gracias por tu interés en conocer el impacto real de la salud mental en tu empresa!
                    </p>

                    <!-- Tarjeta de confirmación -->
                    <div style="background: linear-gradient(135deg, #E7F1FE 0%, #C2DCFD 100%); border-radius:10px; padding:24px 28px; margin-bottom:28px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
                        <tr>
                          <td style="vertical-align:middle; width:36px;">
                            <div style="width:36px; height:36px; background:#FF9D89; border-radius:50%; text-align:center; line-height:38px; font-size:22px; font-weight:bold; color:white;">✓</div>
                          </td>
                          <td style="vertical-align:middle; padding-left:12px;">
                            <span style="font-size:17px; font-weight:700; color:#1A4CA4;">Tu solicitud se ha confirmado con éxito</span>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0; font-size:14px; color:#374151; line-height:1.7;">
                        Nuestro equipo de <i>ifeel Business Intelligence</i> revisará tu caso y se pondrá en contacto contigo en un plazo de <strong>24/48 horas laborables</strong> para analizar contigo los resultados y próximos pasos.
                      </p>
                    </div>

                    <!-- Próximos pasos -->
                    <p style="font-size:15px; font-weight:700; color:#1A4CA4; margin:0 0 14px 0;">¿Qué puedes esperar ahora?</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #E7F1FE; vertical-align:top;">
                          <span style="display:inline-block; width:28px; height:28px; background:#FF9D89; color:white; border-radius:50%; text-align:center; line-height:28px; font-size:13px; font-weight:bold; flex-shrink:0;">1</span>
                          <span style="font-size:14px; color:#4B5563; margin-left:10px; line-height:1.6;">Nuestro equipo revisará tu análisis de benchmarks de salud mental laboral.</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #E7F1FE; vertical-align:top;">
                          <span style="display:inline-block; width:28px; height:28px; background:#FFB8AB; color:white; border-radius:50%; text-align:center; line-height:28px; font-size:13px; font-weight:bold;">2</span>
                          <span style="font-size:14px; color:#4B5563; margin-left:10px; line-height:1.6;">Te contactaremos para agendar una breve reunión personalizada, enfocada en los resultados más relevantes para tu sector y mercado.</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; vertical-align:top;">
                          <span style="display:inline-block; width:28px; height:28px; background:#84B8FA; color:white; border-radius:50%; text-align:center; line-height:28px; font-size:13px; font-weight:bold;">3</span>
                          <span style="font-size:14px; color:#4B5563; margin-left:10px; line-height:1.6;">Juntos, convertiremos los datos en una estrategia de bienestar efectiva para tu organización.</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Separador -->
                    <div style="border-top:1px solid #E7F1FE; margin:28px 0;"></div>

                    <!-- Contacto directo -->
                    <p style="font-size:13px; color:#6B7280; line-height:1.6; margin:0;">
                      ¿Tienes alguna pregunta urgente? Escríbenos a
                      <a href="mailto:carmen@ifeelonline.com" style="color:#1A4CA4; font-weight:600; text-decoration:none;">carmen@ifeelonline.com</a> y te responderemos lo antes posible.
                    </p>

                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="background:#F4F7FB; padding:20px 40px; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #E7F1FE;">
                    <p style="font-size:12px; color:#9CA3AF; margin:0;">
                      © ${new Date().getFullYear()} ifeel · Cuidamos el bienestar de tu equipo
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: contactData.email, name: `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim() }],
          subject: 'Ya estamos trabajando en tu solicitud, pronto hablaremos sobre el bienestar de tu equipo.'
        }],
        from: {
          email: 'elena.estrada@ifeelonline.com',
          name: 'ifeel Business Intelligence'
        },
        content: [{
          type: 'text/html',
          value: confirmationHtml
        }]
      })
    });

    if (emailResponse.ok || emailResponse.status === 202) {
      console.log('✅ Email de confirmación de reunión enviado a:', contactData.email);
      console.log('📬 Status SendGrid:', emailResponse.status);
    } else {
      const errorText = await emailResponse.text();
      console.error('❌ Error SendGrid en confirmación:', emailResponse.status, errorText);
      console.error('📧 Email que intentó enviar:', contactData.email);
    }
  } catch (emailError: any) {
    console.error('❌ Excepción enviando email de confirmación:', emailError.message);
  }
}

// ========================================================================
// POST /make-server-565cb7e7/download-logs - REGISTRAR DESCARGA
// ========================================================================
app.post("/make-server-565cb7e7/download-logs", async (c) => {
  console.log('🎯 POST /download-logs iniciado - Versión Actualizada con Comparación de Benchmarks');

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

    // 4️⃣ ENVIAR EMAIL CON SENDGRID
    if (sendEmail && userEmail && userEmail.trim()) {
      try {
        const sendgridApiKey = Deno.env.get('SENDGRID');

        if (sendgridApiKey) {
          console.log(`📧 Enviando email a ${userEmail}...`);

          const emailHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #0B1941; color: white; padding: 30px 30px 10px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <img src="https://mcusercontent.com/91bbeb9ba75f6057211f2c6bf/images/15fb2efe-b427-c023-bc9e-f20681969218.png" alt="ifeel" style="max-width: 90px; height: auto; margin-bottom: 15px;">
                  <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 400; font-family: 'Lora', serif;">Análisis de Salud Mental Laboral</h1>
                </div>

                <img src="https://mcusercontent.com/91bbeb9ba75f6057211f2c6bf/images/105694d9-fee1-c0d5-2bf0-7372dfa64172.png" alt="" style="width: 100%; display: block; margin: 0; padding: 0;">

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
                email: 'elena.estrada@ifeelonline.com',
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
          console.warn('⚠️ SENDGRID no configurada');
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
// POST /make-server-565cb7e7/submit-demo-request - FLUJO COMPLETO DE DEMO
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
      console.warn('⚠️ HUBSPOT_API_KEY no configurada, enviando email igualmente');
      await sendConfirmationEmail(contactData);
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

        // SI CONTACTO EXISTE → enviar email de confirmación y redirigir a /gracias
        await sendConfirmationEmail(contactData);
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
      }

      // PASO 4: Contacto NUEVO → enviar email de confirmación y redirigir a /gracias
      console.log('✅ Contacto NUEVO creado, enviando email y redirigiendo a /gracias');
      await sendConfirmationEmail(contactData);

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
// GET /make-server-565cb7e7/register-interest - REGISTRAR INTERÉS Y ENVIAR EMAIL
// ========================================================================
app.get("/make-server-565cb7e7/register-interest", async (c) => {
  console.log('🎯 GET /register-interest iniciado');

  const token = cleanToken(c.req.query('token') || '');

  if (!token) {
    console.error('❌ Token no proporcionado');
    const transparentGif = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0));
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
    const transparentGif = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0));
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

  // Enviar email de confirmación
  const sendgridApiKey = Deno.env.get('SENDGRID');
  if (!sendgridApiKey) {
    console.warn('⚠️ SENDGRID no configurada');
  } else {
    console.log('📧 Preparando email de confirmación para:', contactData.email);

    try {
      const confirmationHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5;">
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
              <h2 style="color: #1A4CA4; margin-top: 0;">✅ Solicitud Recibida</h2>
              <p style="font-size: 16px; line-height: 1.5; color: #333;">
                Hola <strong>${contactData.firstName}</strong>,
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #333;">
                Hemos recibido tu solicitud y nuestro equipo se pondrá en contacto contigo pronto.
              </p>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Equipo de ifeel Business Intelligence
              </p>
            </div>
          </body>
        </html>
      `;

      console.log('📤 Enviando email de confirmación...');
      const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: contactData.email, name: contactData.firstName }],
            subject: '✅ Hemos registrado tu solicitud - ifeel'
          }],
          from: {
            email: 'elena.estrada@ifeelonline.com',
            name: 'ifeel Business Intelligence'
          },
          content: [{
            type: 'text/html',
            value: confirmationHtml
          }]
        })
      });

      if (emailResponse.ok || emailResponse.status === 202) {
        console.log('✅ Email de confirmación enviado exitosamente a:', contactData.email);
      } else {
        const errorText = await emailResponse.text();
        console.error('❌ Error enviando email de confirmación:', emailResponse.status, errorText);
      }
    } catch (emailError) {
      console.error('❌ Error al procesar email:', emailError.message);
    }
  }

  console.log('✅ Proceso de registro de interés completado');

  // Retornar un pixel de tracking transparente (1x1 GIF)
  const transparentGif = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0));

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
// POST /make-server-565cb7e7/send-test-email - ENVIAR EMAIL DE PRUEBA DIRECTO
// ========================================================================
app.post("/make-server-565cb7e7/send-test-email", async (c) => {
  console.log('🧪 POST /send-test-email iniciado');

  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email es requerido" }, 400);
    }

    const sendgridApiKey = Deno.env.get('SENDGRID');

    if (!sendgridApiKey) {
      return c.json({ error: "SENDGRID no configurada" }, 500);
    }

    console.log(`📧 Enviando email de prueba directo a: ${email}`);

    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: email }],
          subject: 'Prueba ifeel - Email de confirmacion'
        }],
        from: {
          email: 'elena.estrada@ifeelonline.com',
          name: 'ifeel Business Intelligence'
        },
        content: [{
          type: 'text/html',
          value: '<h1>Email de prueba funcionando</h1><p>Si recibes esto, SendGrid está OK.</p>'
        }]
      })
    });

    const status = emailResponse.status;
    const ok = emailResponse.ok || emailResponse.status === 202;

    let errorText = null;
    if (!ok) {
      errorText = await emailResponse.text();
    }

    console.log(`Status SendGrid: ${status}, OK: ${ok}`);
    if (errorText) {
      console.error(`Error SendGrid: ${errorText}`);
    }

    return c.json({
      success: ok,
      status: status,
      message: ok ? 'Email enviado correctamente' : 'Error al enviar email',
      error: errorText,
      recipient: email
    });

  } catch (error) {
    console.error('❌ Error enviando email de prueba:', error);
    return c.json({
      error: `Error: ${error.message}`
    }, 500);
  }
});

// ========================================================================
// GET /make-server-565cb7e7/health - HEALTH CHECK
// ========================================================================
app.get("/make-server-565cb7e7/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "with-demo-flow"
  });
});

// ========================================================================
// GET /make-server-565cb7e7/test-sendgrid - DIAGNÓSTICO SENDGRID
// ========================================================================
app.get("/make-server-565cb7e7/test-sendgrid", async (c) => {
  const sendgridApiKey = Deno.env.get('SENDGRID');

  const diagnostics = {
    apiKeyExists: !!sendgridApiKey,
    apiKeyLength: sendgridApiKey?.length || 0,
    apiKeyStartsWithSG: sendgridApiKey?.startsWith('SG.') || false,
    apiKeyPreview: sendgridApiKey ? `${sendgridApiKey.substring(0, 15)}...` : 'N/A',
  };

  if (!sendgridApiKey) {
    return c.json({
      error: 'SENDGRID no configurada',
      diagnostics
    }, 500);
  }

  try {
    // Test 1: Verificar API Key
    const testResponse = await fetch('https://api.sendgrid.com/v3/user/username', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${sendgridApiKey}` }
    });

    const testData = await testResponse.json();

    // Test 2: Enviar email de prueba
    const testEmail = c.req.query('email') || 'test@example.com';
    console.log(`📧 Enviando email de prueba a: ${testEmail}`);

    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: testEmail }],
          subject: 'Test desde ifeel - Verificación SendGrid'
        }],
        from: {
          email: 'elena.estrada@ifeelonline.com',
          name: 'ifeel Business Intelligence'
        },
        content: [{
          type: 'text/html',
          value: '<h1>Email de prueba</h1><p>Si recibes este email, SendGrid está configurado correctamente.</p>'
        }]
      })
    });

    const emailStatus = emailResponse.status;
    const emailOk = emailResponse.ok || emailResponse.status === 202;
    let emailError = null;

    if (!emailOk) {
      emailError = await emailResponse.text();
    }

    return c.json({
      success: true,
      diagnostics,
      apiTest: {
        status: testResponse.status,
        ok: testResponse.ok,
        result: testData
      },
      emailTest: {
        status: emailStatus,
        ok: emailOk,
        error: emailError,
        recipient: testEmail
      }
    });
  } catch (error) {
    return c.json({
      error: 'Error al probar SendGrid',
      diagnostics,
      details: error.message
    }, 500);
  }
});

// ========================================================================
// GET /make-server-565cb7e7/test-hubspot-form - DIAGNÓSTICO HUBSPOT FORMS API
// ========================================================================
app.get("/make-server-565cb7e7/test-hubspot-form", async (c) => {
  console.log('🧪 POST /test-hubspot-form iniciado');

  try {
    const formSubmissionUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

    // Datos de prueba
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

    console.log('📤 Enviando formulario de prueba a HubSpot...');
    console.log('URL:', formSubmissionUrl);
    console.log('Datos:', testFormData);

    const formResponse = await fetch(formSubmissionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

// Iniciar servidor
console.log('🚀 Servidor ifeel iniciado con flujo de demo automatizado');
Deno.serve(app.fetch);
