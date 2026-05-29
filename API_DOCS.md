# Company Search API

Una API FastAPI que usa Claude para buscar y completar información de empresas.

## Setup

### 1. Instalar dependencias
```bash
pip install fastapi uvicorn anthropic python-dotenv
```

### 2. Configurar API key
Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```
Luego edita `.env` y agrega tu clave de Anthropic:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 3. Ejecutar la API
```bash
python company_search_api.py
```

La API estará disponible en `http://localhost:8000`

## Endpoints

### POST /search-company
Busca y completa información de una empresa.

**Request:**
```json
{
  "nombre_compania": "Tesla",
  "numero_empleados": null,
  "region": "USA",
  "salario_medio": null
}
```

**Response:**
```json
{
  "nombre_compania": "Tesla",
  "numero_empleados": 178000,
  "region": "USA",
  "salario_medio": 105000
}
```

Los campos `null` serán completados por Claude basándose en la información disponible.

### GET /health
Verifica que la API esté corriendo.

**Response:**
```json
{
  "status": "ok"
}
```

## CORS

La API tiene CORS habilitado para todos los orígenes, permitiendo que tu frontend en Bolt se conecte sin problemas.

## Integración con Bolt

En tu frontend (Bolt), puedes hacer requests así:

```javascript
async function searchCompany(companyData) {
  const response = await fetch('http://localhost:8000/search-company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData)
  });
  return response.json();
}
```

Ejemplo de uso:
```javascript
const result = await searchCompany({
  nombre_compania: "Google",
  numero_empleados: null,
  region: null,
  salario_medio: null
});
console.log(result);
```
