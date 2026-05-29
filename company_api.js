const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/search-company', async (req, res) => {
  try {
    const { nombre_compania, numero_empleados, region, salario_medio } = req.body;

    const camposConocidos = [];
    if (nombre_compania) camposConocidos.push(`Nombre: ${nombre_compania}`);
    if (numero_empleados) camposConocidos.push(`Número de empleados: ${numero_empleados}`);
    if (region) camposConocidos.push(`Región: ${region}`);
    if (salario_medio) camposConocidos.push(`Salario medio: $${salario_medio}`);

    const camposConocidosText = camposConocidos.length > 0 ? camposConocidos.join('\n') : 'Ninguno';
    const camposFaltantes = [];
    if (!nombre_compania) camposFaltantes.push('nombre_compania');
    if (!numero_empleados) camposFaltantes.push('numero_empleados');
    if (!region) camposFaltantes.push('region');
    if (!salario_medio) camposFaltantes.push('salario_medio');
    const camposFaltantesText = camposFaltantes.length > 0 ? camposFaltantes.join(', ') : 'Ninguno';

    const prompt = `Eres un experto en investigación de empresas.

Información conocida sobre la empresa:
${camposConocidosText}

Campos que falta completar: ${camposFaltantesText}

Basándote en la información disponible, busca y completa los datos faltantes.
Responde SOLO con un JSON válido (sin markdown, sin explicaciones) con estos campos:
- nombre_compania: string
- numero_empleados: número entero
- region: string
- salario_medio: número decimal (en USD)

Ejemplo de respuesta:
{"nombre_compania": "Google", "numero_empleados": 190234, "region": "North America", "salario_medio": 120000}`;

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 500,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const responseText = response.content[0].text.trim();
    try {
      const result = JSON.parse(responseText);
      res.json(result);
    } catch {
      res.json({
        nombre_compania: nombre_compania || responseText,
        numero_empleados: numero_empleados || null,
        region: region || null,
        salario_medio: salario_medio || null
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  const apiName = process.env.API_NAME || 'Company Search API';
  console.log(`🚀 ${apiName} corriendo en http://localhost:${PORT}`);
  console.log(`📝 POST /search-company - Buscar y completar datos de empresa`);
  console.log(`❤️  GET /health - Verificar que la API está activa`);
});
