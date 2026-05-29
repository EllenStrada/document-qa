from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("ANTHROPIC_API_KEY")
client = Anthropic(api_key=api_key)

class CompanyData(BaseModel):
    nombre_compania: str | None = None
    numero_empleados: int | None = None
    region: str | None = None
    salario_medio: float | None = None

@app.post("/search-company")
async def search_company(data: CompanyData):
    campos_conocidos = []
    campos_faltantes = []

    if data.nombre_compania:
        campos_conocidos.append(f"Nombre: {data.nombre_compania}")
    else:
        campos_faltantes.append("nombre_compania")

    if data.numero_empleados:
        campos_conocidos.append(f"Número de empleados: {data.numero_empleados}")
    else:
        campos_faltantes.append("numero_empleados")

    if data.region:
        campos_conocidos.append(f"Región: {data.region}")
    else:
        campos_faltantes.append("region")

    if data.salario_medio:
        campos_conocidos.append(f"Salario medio: ${data.salario_medio}")
    else:
        campos_faltantes.append("salario_medio")

    conocidos_text = "\n".join(campos_conocidos) if campos_conocidos else "Ninguno"
    faltantes_text = ", ".join(campos_faltantes) if campos_faltantes else "Ninguno"

    prompt = f"""Eres un experto en investigación de empresas.

Información conocida sobre la empresa:
{conocidos_text}

Campos que falta completar: {faltantes_text}

Basándote en la información disponible, busca y completa los datos faltantes.
Responde SOLO con un JSON válido (sin markdown, sin explicaciones) con estos campos:
- nombre_compania: string
- numero_empleados: número entero
- region: string
- salario_medio: número decimal (en USD)

Ejemplo de respuesta:
{{"nombre_compania": "Google", "numero_empleados": 190234, "region": "North America", "salario_medio": 120000}}"""

    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=500,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    response_text = response.content[0].text.strip()
    try:
        result = json.loads(response_text)
        return result
    except json.JSONDecodeError:
        return {
            "nombre_compania": data.nombre_compania or response_text,
            "numero_empleados": data.numero_empleados,
            "region": data.region,
            "salario_medio": data.salario_medio
        }

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
