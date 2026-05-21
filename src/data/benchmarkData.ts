// Datos de benchmark por mercado e industria
// Última actualización: Abril 2026
// Cambio principal España: Coste SM Estado actualizado de €45.000M a ~€60.000M/año (4,2% PIB)
// Source: CES Informe 01/2024 (reemplaza Randstad 2025)

export interface BenchmarkData {
  mercado: string;
  mercadoCode: string; // 'global', 'europa', 'espana', 'francia', 'usa', 'canada', 'brasil', 'mexico', 'colombia', 'chile', 'argentina'
  absentismoGeneral: string;
  absentismoSM: string;
  costeEmpresa: string;
  costeEstado: string;
  top3Trastornos: string;
}

export interface IndustryBenchmark {
  industria: string;
  mercado: string;
  mercadoCode: string;
  absentismoGeneral: string;
  absentismoSM: string;
  costeSMEmpresa: string;
  costeSMEstado: string;
  top3TrastornosSM: string;
}

// Tabla 1: Datos agregados por mercado
export const marketBenchmarks: BenchmarkData[] = [
  {
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "3–6% (Source: OCDE, 2024, Labour Force Statistics; OMS, 2022)",
    absentismoSM: "~1,2–1,8% (≈30% del total) (Source: OMS, 2022; Lancet Psychiatry, 2024)",
    costeEmpresa: "$1 billón/año (Source: OMS, 2022, Mental Health at Work Report)",
    costeEstado: "Incluido en 4,2% PIB países OCDE (~$4,7 billones pérdida total) (Source: OCDE, 2024)",
    top3Trastornos: "1. Depresión 2. Ansiedad 3. Trastorno de adaptación/Burnout (Source: OMS, 2022)"
  },
  {
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "4,5–5,5% (Source: Eurostat, 2024, Labour Force Survey Q4 2024; Eurofound, 2024, EWCTS)",
    absentismoSM: "~1,5–2,0% (≈35% del total) (Source: EU-OSHA, 2024, OSH Pulse Survey; ESENER 2024)",
    costeEmpresa: ">€300.000M/año para empleadores (Source: EU-OSHA, 2024, Psychosocial Risks in Europe)",
    costeEstado: ">€300.000M/año para estados (del total de €600.000M+) (Source: EU-OSHA, 2024; ETUI, 2025)",
    top3Trastornos: "1. Depresión 2. Ansiedad 3. Estrés/Trastorno de adaptación (Source: EU-OSHA, 2024, ESENER Survey)"
  },
  {
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "5,94% (Source: Umivale Activa & Ivie, 2025, Absentismo y Competitividad - IT 2024)",
    absentismoSM: "~2,2–2,5% (≈30% del total; 2ª causa de baja IT) (Source: Ministerio de Inclusión, Seguridad Social y Migraciones, 2024; INSST, 2024)",
    costeEmpresa: "€14.000M/año (Source: AMAT, 2024, Análisis Coste Absentismo España)",
    costeEstado: "€92.000M/año (5,8% PIB) (Source: Umivale Activa & Ivie, 2025, Absentismo y Competitividad 2024)",
    top3Trastornos: "1. Ansiedad (>70% casos PAN/OTRATSS) 2. Depresión (duración media 167,9 días) 3. Trastorno adaptativo (Source: INSST, 2024, Condiciones de Trabajo y Salud)"
  },
  {
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "5,1% en 2024 (sector privado). Arrêts longs +58% en 5 años. 57% días de ausencia son bajas largas (>90 días) vs. 48% en 2019 (Source: WTW Barómetro Absentismo Privado 2025, 7.ª ed.)",
    absentismoSM: "36% de bajas largas por RPS en 2024 (vs. 32% en 2023) — récord histórico. 20% de todas las bajas son por trastornos psíquicos (Sources: WTW 2025; Astérès/MGEN nov. 2025; TF1 Info sept. 2025)",
    costeEmpresa: "€24.700M/año coste tangible SM (31% empleadores = €7.657M; 9% comp. = €2.223M). Coste total absentismo: €120.000M/año (Sources: Astérès/MGEN nov. 2025; Économie Matin sept. 2025)",
    costeEstado: "€24.700M/año coste tangible SM (60% Assurance Maladie = €14.820M). Grande Cause Nationale 2025: Salud Mental (Source: Astérès/MGEN nov. 2025; Acteurs de la French Care)",
    top3Trastornos: "1. RPS (burnout, estrés, depresión): 36% bajas largas 2024 2. Depresión: Francia lidera Europa con 11% (datos 2019, DREES ene. 2025) 3. Ansiedad (Sources: WTW 2025; DREES 2025 — European Health Interview Survey 2019)"
  },
  {
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "2,8–3,5% (varía por sector; healthcare: 3,8%) (Source: BLS, 2024-2025, CPS Table 47)",
    absentismoSM: "1,0–2,0% del tiempo laboral (Source: Gallup, 2022; ComPsych, 2024 — '11% de todas las bajas = SM')",
    costeEmpresa: "$3.000–5.000/empleado/año (Source: APA, 2024; Gallup, 2022 — incluye absentismo + presentismo)",
    costeEstado: "$47,6B/año solo ausencias no planificadas por depresión; $187,8B coste integral SM (Source: Gallup 2022; MMHPI 2024); Gap engagement: $9,6T global potencial perdido (EE.UU. principal contribuyente) (Source: Gallup State of Global Workplace 2025)",
    top3Trastornos: "1. Burnout (~8 de 10 al menos 'a veces') 2. Depresión 3. Ansiedad (Source: Gallup 2025; SHRM 2024; APA 2024)"
  },
  {
    mercado: "Canada",
    mercadoCode: "canada",
    absentismoGeneral: "3,5–5,0% (Source: Statistics Canada, 2024; Conference Board of Canada, 2025)",
    absentismoSM: "2,5–3,5% (Source: Manulife, 2024 — 'STD por SM: 27% del total en 2024, +10pp vs. 2014')",
    costeEmpresa: "CAD $4.000–6.000/empleado/año = USD $3.000–4.500 (Source: Conference Board of Canada, 2025; Manulife Wellness Report, 2024)",
    costeEstado: "CAD $70.000M/año total = USD $52.500M (Source: Deloitte Canada, 2019 actualizado 2025 — 'The Mental Health of Canadians'); 500.000 ausentes/semana por SM (Source: Peninsula Canada, 2025)",
    top3Trastornos: "1. Depresión 2. Ansiedad 3. Burnout (Source: Manulife Wellness Report, 2022-2024; Peninsula Canada, 2025). Contexto: 48 días perdidos/empleado incluyendo presentismo (Source: Manulife, 2024)"
  },
  {
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "5,0–7,0% (Source: Estimación estudios académicos productividad laboral)",
    absentismoSM: "2,0–3,5% (Source: INSS/G1, 2025 — '472.328 bajas SM en 2024, +68% vs 2023')",
    costeEmpresa: "$2.000–3.500/empleado/año (Source: Evans-Lacko & Knapp, 2016 — 'presentismo BR: $5.788/persona, el más alto de 8 países')",
    costeEstado: "$3,7T pérdida ENT+SM 2020-2050 (Source: PAHO/Harvard, 2025, Major Storm on the Horizon)",
    top3Trastornos: "1. Ansiedad (141.414) 2. Depresión (113.604) 3. Trastorno depresivo recurrente (52.627). Burnout: 4.880 (+493% desde 2021) (Source: INSS/Min. Previdência, 2025)"
  },
  {
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "4,3–6,5% (Source: IMSS, 2024; Informe de IT; INEGI, ENOE 2024)",
    absentismoSM: "30% de todas las bajas son por SM en 2024 (vs. 20% en 2018). >1M días laborales perdidos/año por ansiedad y depresión. IMSS: 3M consultas SM en 2023 (Sources: Instituto Adecco México 2025; Secretaría de Salud; IMSS; Milenio 2024)",
    costeEmpresa: ">100.000 millones de pesos anuales (≈USD 5.000M) en costes agregados por estrés, burnout y ausentismo (Source: Secretaría de Salud; WelbeCare 2026)",
    costeEstado: "Incluido en $7,3T LATAM 2020-2050 (Source: PAHO/Harvard, 2025). Marco regulatorio: NOM-035-STPS-2018 obligatoria desde 23 oct. 2019 (DOF 23 oct. 2018)",
    top3Trastornos: "1. Estrés laboral (75% trabajadores, tasa mundial más alta según OIT) 2. Ansiedad 3. Depresión (Sources: OIT + Secretaría de Salud México; Instituto Adecco 2025; IMSS 2024)"
  },
  {
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "5,0–7,0% (Source: DANE, 2024, Gran Encuesta Integrada de Hogares)",
    absentismoSM: "34% del ausentismo es por salud mental (Source: El Colombiano, 2025). 13% burnout frecuente, segundo lugar LATAM después de Perú 16% (Buk 2025)",
    costeEmpresa: "$1.200–2.000/empleado/año (Source: PAHO, 2025; World Bank, 2025)",
    costeEstado: "Incluido en $7,3T LATAM 2020-2050 (Source: PAHO/Harvard, 2025). Marco regulatorio: Resolución 2646/2008 (riesgo psicosocial) + Ley 2191/2022 (desconexión digital)",
    top3Trastornos: "1. Burnout (13% frecuente según Buk 2025) 2. Ansiedad 3. Depresión (Source: Buk, 2025; MinSalud Colombia, 2024; Columbia Univ./PAHO, 2022)"
  },
  {
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "4,0–5,5% (Source: INE Chile, 2024; SUSESO, 2024)",
    absentismoSM: "1,5–2,5% (Source: SUSESO, 2024; Buk, 2025 — '12% burnout frecuente, tasa más baja de LATAM')",
    costeEmpresa: "$1.200–2.200/empleado/año (Source: PAHO, 2025; ISL, 2024)",
    costeEstado: "Incluido en $7,3T LATAM 2020-2050 (Source: PAHO/Harvard, 2025). Marco regulatorio: Protocolo CEAL-SM/SUSESO vigente desde enero 2023",
    top3Trastornos: "1. Depresión 2. Burnout (12% frecuente según Buk 2025) 3. Ansiedad (Source: Buk, 2025; SUSESO, 2024; Columbia Univ./PAHO, 2022)"
  },
  {
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "3–5% según sector (Source: Min. Capital Humano - Encuesta de Indicadores Laborales (EIL), 2023 — 'Transporte: 5%, Industria/Construcción: 4%, Comercio: 3%')",
    absentismoSM: "5,2 días/trabajador ausente/año por SM (Source: Min. Capital Humano, mayo 2025); 48% del ausentismo es por enfermedad propia (EIL 2023, sin desagregar por diagnóstico)",
    costeEmpresa: "$1,5 billones ARS/año total por estrés laboral (Source: Perfil, 2025; análisis consultoras privadas)",
    costeEstado: "Incluido en $7,3T LATAM 2020-2050 (Source: PAHO/Harvard, 2025). Marco regulatorio: Guía SRT Intervención Psicosocial (nov. 2025, voluntaria) + Ley N° 26.657 + Plan Nacional SM 2021-2025",
    top3Trastornos: "1. Burnout 2. Ansiedad 3. Depresión (Source: Instituto IDEA, 2024; Mercer; Randstad — no hay ranking oficial SRT publicado)"
  },
  {
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "3,0–5,0% (Source: NBS China, 2024; Lancet/Frontiers, 2024 — '50,7% depresión HCW')",
    absentismoSM: "1,0–2,5% (Source: Frontiers in Public Health, 2024; Anhui Study — '30,7% depresión, 26,4% ansiedad HCW')",
    costeEmpresa: "$1.500–3.000/empleado/año (Source: Aon/TELUS Health, 2024, Asia MH Index China)",
    costeEstado: "1,1% PIB = ~¥195.000M (Source: Extrapolación basada en Hara & Nagata, 2025, ratio Japón)",
    top3Trastornos: "1. Depresión 2. Ansiedad 3. Insomnio (Source: Frontiers in Public Health, 2024; Aon, 2024)"
  },
  {
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "1,5–7,5% (Source: Rosstat, 2024 — '74,2% agotamiento emocional HCW')",
    absentismoSM: "0,5–3,0% (Source: PMC, 2021, Mosolova et al. — '46,5% depresión, 32,3% ansiedad HCW')",
    costeEmpresa: "$500–2.000/empleado/año (Source: Estimación basada en WHO Europe, 2024)",
    costeEstado: "Datos limitados (Source: WHO Europe, 2024)",
    top3Trastornos: "1. Depresión 2. Ansiedad 3. Burnout (Source: WHO Europe, 2024; PMC, 2021; nota: abuso de alcohol en algunos sectores)"
  },
  {
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "3,3–5,0% (Source: MHLW Survey on Working Conditions, 2024)",
    absentismoSM: "1,5–2,5% (Source: Hara & Nagata, 2025 — '¥7,6T coste total; 1,1% PIB')",
    costeEmpresa: "¥300.000–500.000/empleado/año = $2.000–3.300 (Source: Hara & Nagata, 2025)",
    costeEstado: "¥7,6T total = $50.000M (Source: Hara & Nagata, 2025 — 'presentismo: ¥7,3T; absentismo: ¥0,3T')",
    top3Trastornos: "1. Depresión 2. Trastornos adaptativos 3. Ansiedad (Source: MHLW, 2024; Evans-Lacko et al., 2016)"
  }
];

// Tabla 2: Desglose por industria
export const industryBenchmarks: IndustryBenchmark[] = [
  // Healthcare / Sanidad
  {
    industria: "Healthcare",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "6,0–8,0%",
    absentismoSM: "2,5–3,0%",
    costeSMEmpresa: "€2.800–4.000 (€/empleado/año est.)",
    costeSMEstado: "€1.500–2.500 (€/empleado/año est.)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad"
  },
  {
    industria: "Healthcare",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "5,0–6,5% (Eurofound, 2024, European Working Conditions Telephone Survey)",
    absentismoSM: "1,5–2,5% (EU-OSHA, 2024, OSH Pulse Survey; ESENER 2024)",
    costeSMEmpresa: "€1.500–2.500/empleado/año (EU-OSHA, 2024, Psychosocial Risks Report)",
    costeSMEstado: "€100.000M+ UE total (European Trade Union Institute, 2025, Cost of Psychosocial Risks in Europe)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (EU-OSHA, 2024, ESENER Survey)"
  },
  {
    industria: "Healthcare",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "8,5–10,5% (Source: Randstad Research, 2025, Informe Absentismo Laboral Q2 2025; INE, ETCL Q4 2024)",
    absentismoSM: "2,0–3,0% (Source: Ministerio de Inclusión, Seguridad Social y Migraciones, 2024, Estadísticas IT)",
    costeSMEmpresa: "€3.000/empleado/año (Source: Malakoff Humanis adaptado ES; Empreinte Humaine, 2024)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Ministerio de Sanidad, 2024, Encuesta Nacional de Salud)"
  },
  {
    industria: "Healthcare",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "2,5–3,5% (Source: DARES, 2024; AXA, 2024)",
    absentismoSM: "0,8–1,5% (Source: Estimación basada en Malakoff Humanis, 2023)",
    costeSMEmpresa: "€3.000/empleado/año (Source: Empreinte Humaine, 2024)",
    costeSMEstado: "Incluido en €15.000M total (Source: Bloomberg/Fortune, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Insomnio (Source: Empreinte Humaine, 2024)"
  },

  {
    industria: "Healthcare",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "3,8–4,3% (Source: BLS, 2025, CPS Table 47 — 'Health care & social assistance: 3,8%')",
    absentismoSM: "1,5–2,5% (Source: ComPsych, 2024 — '11% de todas las bajas = salud mental')",
    costeSMEmpresa: "$3.000–5.000/empleado/año (Source: American Psychiatric Association, 2024; Gallup, 2022)",
    costeSMEstado: "$193.200M total US (Source: APA, 2024 — '$193.2B in lost earnings'; Gallup: $47.4B absentismo)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: ComPsych, 2024; SHRM, 2024 — 'Anxiety: #1 issue')"
  },
  {
    industria: "Healthcare",
    mercado: "Canada",
    mercadoCode: "canada",
    absentismoGeneral: "6,0–8,0% (Source: Conference Board of Canada, 2025 — 'Healthcare sector highest absence rates')",
    absentismoSM: "3,0–4,5% (Source: Manulife, 2024; Peninsula Canada, 2025 — 'STD por SM en healthcare: 30-35%')",
    costeSMEmpresa: "CAD $4.500–7.000/empleado/año = USD $3.375–5.250 (Source: Conference Board of Canada, 2025)",
    costeSMEstado: "Incluido en CAD $70.000M total (Source: Deloitte Canada, 2019 actualizado 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: Manulife Wellness Report, 2022-2024; Canadian Nurses Association, 2024)"
  },

  // Technology / IT
  {
    industria: "Technology / IT",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "2,5–3,5%",
    absentismoSM: "1,0–1,5%",
    costeSMEmpresa: "€1.500–2.500",
    costeSMEstado: "€800–1.200",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },
  {
    industria: "Technology / IT",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "2,5–3,5% (Eurostat, 2024, Labour Force Survey; EU-OSHA, ESENER 2024)",
    absentismoSM: "1,0–1,8% (Eurofound, 2024, European Working Conditions Survey)",
    costeSMEmpresa: "€1.200–2.000/empleado/año (Deloitte, 2024, Mental Health and Employers Report)",
    costeSMEstado: "Incluido en estimación UE total (ETUI, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Insomnio (EU-OSHA, 2024, Digitalisation and Mental Health Report)"
  },
  {
    industria: "Technology / IT",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "3,0–3,6% (Source: Randstad Research, 2025, Informe Absentismo Q2 2025 — \"Programación y consultoría: 3,6%\")",
    absentismoSM: "0,8–1,5% (Source: Estimación basada en ETCL Q4 2024)",
    costeSMEmpresa: "€2.500–3.500/empleado/año (Source: Estimación basada en Deloitte, 2024; salarios medios IT sector)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Insomnio (Source: EU-OSHA, 2024, Digitalisation and Mental Health)"
  },
  {
    industria: "Technology / IT",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "3,0–4,0%",
    absentismoSM: "~1,2%",
    costeSMEmpresa: "€1.500–2.200",
    costeSMEstado: "€900+",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },

  {
    industria: "Technology / IT",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "2,0–2,5% (Source: BLS, 2025, CPS — 'Professional & technical: 2,4%')",
    absentismoSM: "0,8–1,5% (Source: ComPsych, 2024)",
    costeSMEmpresa: "$4.000–6.000/empleado/año (Source: Gallup, 2022; APA, 2024)",
    costeSMEstado: "Incluido en $193.200M total (Source: APA, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Insomnio (Source: SHRM, 2024; ComPsych, 2024)"
  },
  {
    industria: "Technology / IT",
    mercado: "Canada",
    mercadoCode: "canada",
    absentismoGeneral: "2,5–3,5% (Source: Statistics Canada, 2024 — 'Professional, scientific and technical services')",
    absentismoSM: "1,0–2,0% (Source: Manulife, 2024)",
    costeSMEmpresa: "CAD $4.500–7.000/empleado/año = USD $3.375–5.250 (Source: Conference Board of Canada, 2025)",
    costeSMEstado: "Incluido en CAD $70.000M total (Source: Deloitte Canada, 2019 actualizado 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Manulife Wellness Report, 2022-2024)"
  },

  // Financial Services
  {
    industria: "Financial Services",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "3,0–4,5%",
    absentismoSM: "1,2–1,8%",
    costeSMEmpresa: "€2.000–3.000",
    costeSMEstado: "€1.000–1.500",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout"
  },
  {
    industria: "Financial Services",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "3,5–4,5% (media UE)",
    absentismoSM: "~1,4–1,7%",
    costeSMEmpresa: "€2.000–2.900 (€/empleado/año est.)",
    costeSMEstado: "€1.050–1.400 (€/empleado/año est.)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión"
  },
  {
    industria: "Financial Services",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "4,0–5,0% (Source: Randstad Research, 2025, Informe Absentismo Q2 2025)",
    absentismoSM: "1,0–2,0% (Source: Estimación basada en INE, ETCL Q4 2024)",
    costeSMEmpresa: "€2.500–3.500/empleado/año (Source: Deloitte, 2024, Mental Health and Employers adaptado)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: EU-OSHA, 2024, ESENER Survey)"
  },
  {
    industria: "Financial Services",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "3,5–4,5%",
    absentismoSM: "~1,5%",
    costeSMEmpresa: "€2.000–2.800",
    costeSMEstado: "€1.000+",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },

  {
    industria: "Financial Services",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "2,0–3,0% (Source: BLS, 2025, CPS — 'Financial activities: absence rate ≈2,5%')",
    absentismoSM: "0,8–1,5% (Source: ComPsych, 2024)",
    costeSMEmpresa: "$4.000–7.000/empleado/año (Source: Gallup, 2022; APA, 2024 — costes más altos por salarios)",
    costeSMEstado: "Incluido en $193.200M total (Source: APA, 2024)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: SHRM, 2024; ComPsych, 2024)"
  },
  {
    industria: "Financial Services",
    mercado: "Canada",
    mercadoCode: "canada",
    absentismoGeneral: "2,5–3,5% (Source: Statistics Canada, 2024 — 'Finance and insurance')",
    absentismoSM: "1,0–2,0% (Source: Manulife, 2024)",
    costeSMEmpresa: "CAD $5.000–8.000/empleado/año = USD $3.750–6.000 (Source: Conference Board of Canada, 2025 — costes más altos por salarios)",
    costeSMEstado: "Incluido en CAD $70.000M total (Source: Deloitte Canada, 2019 actualizado 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: Manulife Wellness Report, 2022-2024; Canadian Financial Services Industry Survey, 2024)"
  },

  // Manufacturing / Industria
  {
    industria: "Manufacturing",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "5,0–7,0%",
    absentismoSM: "1,5–2,0%",
    costeSMEmpresa: "€1.800–2.800",
    costeSMEstado: "€1.200–1.800",
    top3TrastornosSM: "1. Depresión 2. T. adaptación 3. Ansiedad"
  },
  {
    industria: "Manufacturing",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "5,5–6,5% (media UE)",
    absentismoSM: "~1,7–1,9%",
    costeSMEmpresa: "€2.100–3.000 (€/empleado/año est.)",
    costeSMEstado: "€1.250–1.600 (€/empleado/año est.)",
    top3TrastornosSM: "1. Depresión 2. T. adaptación 3. Ansiedad"
  },
  {
    industria: "Manufacturing",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "7,2–7,4% (Source: Randstad Research, 2025, Informe Absentismo Q4 2024 + Q2 2025)",
    absentismoSM: "1,2–2,0% (Source: Estimación basada en INE, ETCL Q4 2024; Ministerio de Trabajo)",
    costeSMEmpresa: "€2.000–3.000/empleado/año (Source: Estimación basada en Randstad, 2025; coste medio IT sector)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Abuso de sustancias (Source: Ministerio de Sanidad, 2024)"
  },
  {
    industria: "Manufacturing",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "4,8–6,5% (Source: DARES, 2024; BVA/REHALTO, 2022 — 'Industrial: 4,8%')",
    absentismoSM: "1,0–1,8% (Source: Malakoff Humanis, 2023)",
    costeSMEmpresa: "€2.500–3.500/empleado/año (Source: Empreinte Humaine, 2024)",
    costeSMEstado: "Incluido en €15.000M total (Source: Bloomberg/Fortune, 2024)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Abuso de sustancias (Source: DARES, 2024)"
  },

  {
    industria: "Manufacturing",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "3,0–3,5% (Source: BLS, 2025, CPS — 'Manufacturing: ≈3%')",
    absentismoSM: "0,8–1,5% (Source: ComPsych, 2024; The Standard, 2024 — '30% moderate distress')",
    costeSMEmpresa: "$2.500–4.000/empleado/año (Source: Gallup, 2022; APA, 2024)",
    costeSMEstado: "Incluido en $193.200M total (Source: APA, 2024)",
    top3TrastornosSM: "1. Depresión 2. Abuso de sustancias 3. Ansiedad (Source: WebMD Health Services, 2025; The Standard, 2024)"
  },
  {
    industria: "Manufacturing",
    mercado: "Canada",
    mercadoCode: "canada",
    absentismoGeneral: "4,0–5,5% (Source: Statistics Canada, 2024 — 'Manufacturing sector')",
    absentismoSM: "1,5–2,5% (Source: Manulife, 2024; Conference Board of Canada, 2025)",
    costeSMEmpresa: "CAD $3.000–5.000/empleado/año = USD $2.250–3.750 (Source: Conference Board of Canada, 2025)",
    costeSMEstado: "Incluido en CAD $70.000M total (Source: Deloitte Canada, 2019 actualizado 2025)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Abuso de sustancias (Source: Manulife Wellness Report, 2022-2024; Canadian Manufacturing Survey, 2024)"
  },

  // Professional Services / Consulting
  {
    industria: "Professional Services / Consulting",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "3,0–4,0%",
    absentismoSM: "1,2–1,8%",
    costeSMEmpresa: "€2.000–3.500",
    costeSMEstado: "€900–1.500",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "3,5–4,5% (media UE)",
    absentismoSM: "~1,4–1,6%",
    costeSMEmpresa: "€2.000–3.200 (/empleado/año est.)",
    costeSMEstado: "€950–1.400 (€/empleado/año est.)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "2,8–3,6% (Source: Randstad Research, 2025, \"Actividades jurídicas y contables: 2,8%; Consultoría: 3,6%\")",
    absentismoSM: "0,7–1,2% (Source: Estimación basada en INE, ETCL Q4 2024)",
    costeSMEmpresa: "€2.500–3.500/empleado/año (Source: Deloitte, 2024; salarios medios servicios profesionales)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: EU-OSHA, 2024, ESENER Survey)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "1,4–3,0% (Source: DARES, 2024; BVA/REHALTO, 2022 — 'Cadres: 1,4%')",
    absentismoSM: "0,5–1,2% (Source: Malakoff Humanis, 2023)",
    costeSMEmpresa: "€3.000–4.000/empleado/año (Source: Empreinte Humaine, 2024)",
    costeSMEstado: "Incluido en €15.000M total (Source: Bloomberg/Fortune, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Empreinte Humaine, 2024)"
  },

  {
    industria: "Professional Services / Consulting",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "2,0–2,4% (Source: BLS, 2025, CPS — 'Professional & business services: ≈2,4%')",
    absentismoSM: "0,7–1,2% (Source: ComPsych, 2024)",
    costeSMEmpresa: "$4.000–6.000/empleado/año (Source: Gallup, 2022; APA, 2024)",
    costeSMEstado: "Incluido en $193.200M total (Source: APA, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: SHRM, 2024; ComPsych, 2024)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Canada",
    mercadoCode: "canada",
    absentismoGeneral: "2,5–3,5% (Source: Statistics Canada, 2024 — 'Professional, scientific and technical services')",
    absentismoSM: "1,0–2,0% (Source: Manulife, 2024)",
    costeSMEmpresa: "CAD $4.500–7.000/empleado/año = USD $3.375–5.250 (Source: Conference Board of Canada, 2025)",
    costeSMEstado: "Incluido en CAD $70.000M total (Source: Deloitte Canada, 2019 actualizado 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Manulife Wellness Report, 2022-2024)"
  },

  // Retail / Comercio
  {
    industria: "Retail",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "5,0–6,5%",
    absentismoSM: "1,5–2,0%",
    costeSMEmpresa: "€1.200–2.000",
    costeSMEstado: "€800–1.200",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. T. adaptación"
  },
  {
    industria: "Retail",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "5,0–6,0% (media UE)",
    absentismoSM: "~1,6–1,9%",
    costeSMEmpresa: "€1.400–2.100 (€/empleado/año est.)",
    costeSMEstado: "€900–1.150 (€/empleado/año est.)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout"
  },
  {
    industria: "Retail",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "5,5–6,5% (Source: Randstad Research, 2025, Informe Absentismo Q2 2025)",
    absentismoSM: "1,0–2,0% (Source: Estimación basada en INE, ETCL Q4 2024)",
    costeSMEmpresa: "€1.500–2.500/empleado/año (Source: Estimación basada en salarios sector retail)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: EU-OSHA, 2024, ESENER Survey)"
  },
  {
    industria: "Retail",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "4,5–5,5%",
    absentismoSM: "~1,6%",
    costeSMEmpresa: "€1.500–2.200",
    costeSMEstado: "€1.000+",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },

  {
    industria: "Retail",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "3,0–3,5% (Source: BLS, 2025, CPS — 'Retail trade: ≈3%')",
    absentismoSM: "1,0–1,8% (Source: ComPsych, 2024)",
    costeSMEmpresa: "$2.000–3.500/empleado/año (Source: Gallup, 2022; APA, 2024)",
    costeSMEstado: "Incluido en $193.200M total (Source: APA, 2024)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: SHRM, 2024; ComPsych, 2024)"
  },
  {
    industria: "Retail",
    mercado: "Canada",
    mercadoCode: "canada",
    absentismoGeneral: "4,5–6,0% (Source: Statistics Canada, 2024 — 'Retail trade sector')",
    absentismoSM: "1,5–2,5% (Source: Manulife, 2024; Conference Board of Canada, 2025)",
    costeSMEmpresa: "CAD $2.500–4.000/empleado/año = USD $1.875–3.000 (Source: Conference Board of Canada, 2025)",
    costeSMEstado: "Incluido en CAD $70.000M total (Source: Deloitte Canada, 2019 actualizado 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: Manulife Wellness Report, 2022-2024; Retail Council of Canada, 2024)"
  },

  // Energy / Utilities
  {
    industria: "Energy / Utilities",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "4,0–5,5%",
    absentismoSM: "1,2–1,8%",
    costeSMEmpresa: "€1.800–2.800",
    costeSMEstado: "€1.000��1.500",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Burnout"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "4,5–5,5% (media UE)",
    absentismoSM: "~1,5–1,7%",
    costeSMEmpresa: "€2.000–2.800 (€/empleado/año est.)",
    costeSMEstado: "€1.100–1.400 (€/empleado/año est.)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Burnout"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "4,0–5,5% (Source: Estimación basada en INE, ETCL Q4 2024)",
    absentismoSM: "0,8–1,5% (Source: Estimación basada en INE, ETCL Q4 2024)",
    costeSMEmpresa: "€2.000–3.000/empleado/año (Source: Estimación basada en salarios sector energía)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: EU-OSHA, 2024)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "4,5–5,5%",
    absentismoSM: "~1,6%",
    costeSMEmpresa: "€2.000–2.800",
    costeSMEstado: "€1.100+",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad"
  },
  {
    industria: "Energy / Utilities",
    mercado: "DACH",
    mercadoCode: "dach",
    absentismoGeneral: "5,0–5,5%",
    absentismoSM: "~1,6%",
    costeSMEmpresa: "€2.000–2.800",
    costeSMEstado: "��1.100+",
    top3TrastornosSM: "1. Depresión 2. T. adaptación 3. Ansiedad"
  },
  {
    industria: "Energy / Utilities",
    mercado: "UKI",
    mercadoCode: "uki",
    absentismoGeneral: "3,5–4,5%",
    absentismoSM: "~1,5%",
    costeSMEmpresa: "£1.800–2.500",
    costeSMEstado: "£900+",
    top3TrastornosSM: "1. Estrés 2. Depresión 3. Ansiedad"
  },
  {
    industria: "Energy / Utilities",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "2,5–3,0% (Source: BLS, 2025, CPS — 'Mining/utilities: ≈2,5%')",
    absentismoSM: "0,7–1,2% (Source: ComPsych, 2024)",
    costeSMEmpresa: "$3.000–5.000/empleado/año (Source: Gallup, 2022; APA, 2024)",
    costeSMEstado: "Incluido en $193.200M total (Source: APA, 2024)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: SHRM, 2024)"
  },

  // Education / Educación
  {
    industria: "Education",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "5,0–7,0%",
    absentismoSM: "2,0–2,5%",
    costeSMEmpresa: "€1.500–2.500",
    costeSMEstado: "€1.200–2.000",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad"
  },
  {
    industria: "Education",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "5,5–6,5% (media UE)",
    absentismoSM: "~2,0–2,2%",
    costeSMEmpresa: "€1.700–2.500 (€/empleado/año est.)",
    costeSMEstado: "€1.350–1.800 (€/empleado/año est.)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad"
  },
  {
    industria: "Education",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "5,5–7,0% (Source: Randstad Research, 2025, Informe Absentismo Q2 2025)",
    absentismoSM: "1,5–2,5% (Source: Estimación basada en INE, ETCL Q4 2024)",
    costeSMEmpresa: "€2.000–2.800/empleado/año (Source: Estimación adaptada de salarios sector educación)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Ministerio de Sanidad, 2024; EU-OSHA, 2024)"
  },
  {
    industria: "Education",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "5,5–6,5%",
    absentismoSM: "~2,0%",
    costeSMEmpresa: "€1.800–2.500",
    costeSMEstado: "€1.500+",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad"
  },

  {
    industria: "Education",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "2,8–3,6% (Source: BLS, 2025, CPS — 'Education services: 2,8%')",
    absentismoSM: "1,0–1,8% (Source: ComPsych, 2024)",
    costeSMEmpresa: "$2.500–4.000/empleado/año (Source: Gallup, 2022; APA, 2024)",
    costeSMEstado: "Incluido en $193.200M total (Source: APA, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: SHRM, 2024; ComPsych, 2024)"
  },

  // Government / Admin. Pública
  {
    industria: "Government / Public Admin.",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "5,5–7,5%",
    absentismoSM: "2,0–2,5%",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "€2.000–3.000",
    top3TrastornosSM: "1. Depresión 2. Estrés 3. Ansiedad"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "6,0–7,0% (media UE)",
    absentismoSM: "~2,1–2,3%",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "€2.200–2.800 (€/empleado/año est.)",
    top3TrastornosSM: "1. Depresión 2. Estrés 3. Ansiedad"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "4,5–8,0% (Source: Randstad Research, 2025, Informe Absentismo Q2 2025)",
    absentismoSM: "1,5–2,5% (Source: Estimación basada en INE, ETCL Q4 2024)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: EU-OSHA, 2024, ESENER Survey)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "6,0–8,0% (Source: DGAFP, 2024 — '80% aumento absentismo sector público 2014–2022')",
    absentismoSM: "1,5–2,5% (Source: DGAFP, 2024)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "€15.000M total (Source: Bloomberg/Fortune, 2024)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: Empreinte Humaine, 2024)"
  },

  {
    industria: "Government / Public Admin.",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "3,5–4,5% (Source: BLS, 2025, CPS — 'Public administration: ≈4%')",
    absentismoSM: "1,2–2,0% (Source: ComPsych, 2024)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "$47.600M solo absentismo SM (Source: Gallup, 2022 — '$47.6B lost productivity')",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: SHRM, 2024; ComPsych, 2024)"
  },

  // Hospitality / Turismo
  {
    industria: "Hospitality / Tourism",
    mercado: "Global",
    mercadoCode: "global",
    absentismoGeneral: "5,0–7,0%",
    absentismoSM: "1,8–2,5%",
    costeSMEmpresa: "€1.000–1.800",
    costeSMEstado: "€800–1.200",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Europe",
    mercadoCode: "europa",
    absentismoGeneral: "5,5–6,5% (media UE)",
    absentismoSM: "~1,9–2,1%",
    costeSMEmpresa: "€1.100–1.900 (€/empleado/año est.)",
    costeSMEstado: "€900–1.100 (€/empleado/año est.)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Spain",
    mercadoCode: "espana",
    absentismoGeneral: "5,0–6,5% (Source: Randstad Research, 2025, Informe Absentismo Q2 2025; Quirónprevención, 2024)",
    absentismoSM: "1,2–2,0% (Source: Estimación basada en INE, ETCL Q4 2024)",
    costeSMEmpresa: "€1.200–2.000/empleado/año (Source: Estimación basada en salarios sector hospitality)",
    costeSMEstado: "Incluido en ~€60.000M/año total SM (4,2% PIB) (Source: CES Informe 01/2024)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Abuso de sustancias (Source: EU-OSHA, 2024; Ministerio de Sanidad, 2024)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "France",
    mercadoCode: "francia",
    absentismoGeneral: "5,0–6,0%",
    absentismoSM: "~1,8%",
    costeSMEmpresa: "€1.200–2.000",
    costeSMEstado: "€1.000+",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "DACH",
    mercadoCode: "dach",
    absentismoGeneral: "5,5–6,0%",
    absentismoSM: "~1,8%",
    costeSMEmpresa: "€1.200–2.000",
    costeSMEstado: "€1.000+",
    top3TrastornosSM: "1. Depresión 2. Burnout 3. T. adaptación"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "UKI",
    mercadoCode: "uki",
    absentismoGeneral: "4,5–5,5%",
    absentismoSM: "~1,8%",
    costeSMEmpresa: "£1.000–1.800",
    costeSMEstado: "£800+",
    top3TrastornosSM: "1. Estrés 2. Burnout 3. Ansiedad"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "USA",
    mercadoCode: "usa",
    absentismoGeneral: "3,5–4,5% (Source: BLS, 2025, CPS — 'Leisure & hospitality: ≈4%')",
    absentismoSM: "1,5–2,5% (Source: ComPsych, 2024)",
    costeSMEmpresa: "$1.500–2.500/empleado/año (Source: Gallup, 2022; APA, 2024)",
    costeSMEstado: "Incluido en $193.200M total (Source: APA, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: SHRM, 2024; ComPsych, 2024)"
  },

  // BRASIL - 10 industrias
  {
    industria: "Healthcare",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "2,5–4,0% (Source: IBGE, 2024; RAIS/CAGED)",
    absentismoSM: "1,0–2,0% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "$2.500–4.000/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Min. Previdência Social, 2025)"
  },
  {
    industria: "Technology / IT",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "3,0–4,5% (Source: IBGE, 2024)",
    absentismoSM: "1,0–2,0% (Source: Min. Previd��ncia Social, 2025)",
    costeSMEmpresa: "$2.500–4.500/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: Min. Previdência Social, 2025)"
  },
  {
    industria: "Financial Services",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "5,0–7,0% (Source: IBGE, 2024)",
    absentismoSM: "1,5–2,5% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "$1.500–3.000/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Depresión 2. Abuso de sustancias 3. Ansiedad (Source: Min. Previdência Social, 2025)"
  },
  {
    industria: "Manufacturing",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "2,5–3,5% (Source: IBGE, 2024)",
    absentismoSM: "0,8–1,5% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "$2.500–4.000/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Buk, 2025, Estudio Burnout LATAM)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "4,0–5,5% (Source: IBGE, 2024)",
    absentismoSM: "1,0–2,0% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "$1.500–2.500/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: Min. Previdência Social, 2025)"
  },
  {
    industria: "Retail",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "3,5–5,0% (Source: IBGE, 2024)",
    absentismoSM: "0,8–1,5% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "$2.000–3.500/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: Min. Previdência Social, 2025)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "5,0–7,0% (Source: IBGE, 2024)",
    absentismoSM: "1,5–2,5% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "$1.500–2.500/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Buk, 2025)"
  },
  {
    industria: "Education",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "5,5–7,5% (Source: IBGE, 2024)",
    absentismoSM: "1,5–2,5% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: Min. Previdência Social, 2025)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "4,5–6,5% (Source: IBGE, 2024)",
    absentismoSM: "1,5–2,5% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Depresión 2. Burnout 3. Ansiedad (Source: Min. Previdência Social, 2025)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Brazil",
    mercadoCode: "brasil",
    absentismoGeneral: "4,5–6,5% (Source: IBGE, 2024)",
    absentismoSM: "1,5–2,5% (Source: Min. Previdência Social, 2025)",
    costeSMEmpresa: "$1.500–2.500/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $3,7T 2020-2050 (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Min. Previdência Social, 2025)"
  },

  // MÉXICO - 10 industrias
  {
    industria: "Healthcare",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "4,3–6,5% (Source: IMSS, 2024; Informe de IT; INEGI, ENOE 2024)",
    absentismoSM: "1,5–2,5% (Source: IMSS, 2024; NOM-035-STPS, evaluación riesgos psicosociales)",
    costeSMEmpresa: "$1.500–2.500/empleado/año (Source: Evans-Lacko et al., 2016; PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM 2020-2050 (Source: PAHO/Harvard, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: IMSS, 2024)"
  },
  {
    industria: "Technology / IT",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "2,0–3,5% (Source: INEGI, ENOE 2024)",
    absentismoSM: "0,8–1,5% (Source: IMSS, 2024)",
    costeSMEmpresa: "$1.500–3.000/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Insomnio (Source: IMSS, 2024)"
  },
  {
    industria: "Financial Services",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "2,5–4,0% (Source: INEGI, ENOE 2024)",
    absentismoSM: "0,8–1,5% (Source: IMSS, 2024)",
    costeSMEmpresa: "$1.500–3.000/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: IMSS, 2024)"
  },
  {
    industria: "Manufacturing",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "4,0–6,0% (Source: INEGI, ENOE 2024; IMSS, 2024)",
    absentismoSM: "1,0–2,0% (Source: IMSS, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Abuso de sustancias (Source: IMSS, 2024)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "2,0–3,0% (Source: INEGI, ENOE 2024)",
    absentismoSM: "0,6–1,2% (Source: IMSS, 2024)",
    costeSMEmpresa: "$1.500–3.000/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: IMSS, 2024)"
  },
  {
    industria: "Retail",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "3,5–5,0% (Source: INEGI, ENOE 2024)",
    absentismoSM: "1,0–1,8% (Source: IMSS, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Estrés postraumático (Source: IMSS, 2024)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "3,0–4,5% (Source: INEGI, ENOE 2024)",
    absentismoSM: "0,8–1,5% (Source: IMSS, 2024)",
    costeSMEmpresa: "$1.500–2.500/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: IMSS, 2024)"
  },
  {
    industria: "Education",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "4,0–6,0% (Source: INEGI, ENOE 2024; IMSS, 2024)",
    absentismoSM: "1,2–2,0% (Source: IMSS, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: IMSS, 2024)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "4,5–6,5% (Source: INEGI, ENOE 2024)",
    absentismoSM: "1,2–2,0% (Source: IMSS, 2024)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: IMSS, 2024)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Mexico",
    mercadoCode: "mexico",
    absentismoGeneral: "4,0–6,0% (Source: INEGI, ENOE 2024; IMSS, 2024)",
    absentismoSM: "1,2–2,0% (Source: IMSS, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: Estimación basada en Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: IMSS, 2024)"
  },

  // COLOMBIA - 10 industrias
  {
    industria: "Healthcare",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "5,0–7,0% (Source: DANE, 2024)",
    absentismoSM: "1,5–2,5% (Source: MinSalud Colombia, 2024)",
    costeSMEmpresa: "$1.200–2.000/empleado/año (Source: PAHO, 2025; World Bank, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: MinSalud Colombia, 2024)"
  },
  {
    industria: "Technology / IT",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "2,5–3,5% (Source: DANE, 2024)",
    absentismoSM: "0,8–1,5% (Source: MinSalud, 2024)",
    costeSMEmpresa: "$1.200–2.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: ULA Ergonomics, 2025)"
  },
  {
    industria: "Financial Services",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "3,0–4,5% (Source: DANE, 2024)",
    absentismoSM: "0,8–1,5% (Source: MinSalud, 2024)",
    costeSMEmpresa: "$1.200–2.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: MinSalud, 2024)"
  },
  {
    industria: "Manufacturing",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "4,5–6,5% (Source: DANE, 2024)",
    absentismoSM: "1,0–2,0% (Source: MinSalud, 2024)",
    costeSMEmpresa: "$1.000–1.800/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Depresión 2. Abuso de sustancias 3. Ansiedad (Source: MinSalud, 2024)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "2,0–3,5% (Source: DANE, 2024)",
    absentismoSM: "0,6–1,2% (Source: MinSalud, 2024)",
    costeSMEmpresa: "$1.200–2.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: ULA Ergonomics, 2025)"
  },
  {
    industria: "Retail",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "3,5–5,0% (Source: DANE, 2024)",
    absentismoSM: "1,0–1,8% (Source: MinSalud, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: MinSalud, 2024)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "3,0–4,5% (Source: DANE, 2024)",
    absentismoSM: "0,8–1,5% (Source: MinSalud, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: MinSalud, 2024)"
  },
  {
    industria: "Education",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "4,5–6,5% (Source: DANE, 2024)",
    absentismoSM: "1,2–2,0% (Source: MinSalud, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: MinSalud, 2024)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "5,0–7,0% (Source: DANE, 2024)",
    absentismoSM: "1,2–2,0% (Source: MinSalud, 2024)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: MinSalud, 2024)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Colombia",
    mercadoCode: "colombia",
    absentismoGeneral: "4,0–6,0% (Source: DANE, 2024)",
    absentismoSM: "1,2–2,0% (Source: MinSalud, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: MinSalud, 2024)"
  },

  // CHILE - 10 industrias
  {
    industria: "Healthcare",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "5,0–7,0% (Source: INE Chile, 2024)",
    absentismoSM: "1,5–3,0% (Source: SUSESO, 2024; Columbia Univ./PAHO, 2022)",
    costeSMEmpresa: "$1.200–2.200/empleado/año (Source: PAHO, 2025; ISL, 2024)",
    costeSMEstado: "Incluido en $7,3T LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Depresión 2. Burnout 3. Ansiedad (Source: Columbia Univ./PAHO, 2022; Buk, 2025)"
  },
  {
    industria: "Technology / IT",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "2,0–3,5% (Source: INE Chile, 2024)",
    absentismoSM: "0,8–1,5% (Source: SUSESO, 2024)",
    costeSMEmpresa: "$1.200–2.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Buk, 2025)"
  },
  {
    industria: "Financial Services",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "2,5–4,0% (Source: INE Chile, 2024)",
    absentismoSM: "0,8–1,5% (Source: SUSESO, 2024)",
    costeSMEmpresa: "$1.200–2.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: SUSESO, 2024)"
  },
  {
    industria: "Manufacturing",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "4,5–6,5% (Source: INE Chile, 2024)",
    absentismoSM: "1,0–2,0% (Source: SUSESO, 2024)",
    costeSMEmpresa: "$1.000–1.800/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Depresión 2. Abuso de sustancias 3. Ansiedad (Source: SUSESO, 2024)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "2,0–3,0% (Source: INE Chile, 2024)",
    absentismoSM: "0,6–1,2% (Source: SUSESO, 2024)",
    costeSMEmpresa: "$1.200–2.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Buk, 2025)"
  },
  {
    industria: "Retail",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "3,5–5,0% (Source: INE Chile, 2024)",
    absentismoSM: "1,0–1,8% (Source: SUSESO, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: SUSESO, 2024)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "3,0–4,5% (Source: INE Chile, 2024)",
    absentismoSM: "0,8–1,5% (Source: SUSESO, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: SUSESO, 2024)"
  },
  {
    industria: "Education",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "4,5–6,5% (Source: INE Chile, 2024)",
    absentismoSM: "1,2–2,0% (Source: SUSESO, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: Buk, 2025)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "5,0–7,0% (Source: INE Chile, 2024)",
    absentismoSM: "1,2–2,0% (Source: SUSESO, 2024)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: SUSESO, 2024)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Chile",
    mercadoCode: "chile",
    absentismoGeneral: "4,0–6,0% (Source: INE Chile, 2024)",
    absentismoSM: "1,2–2,0% (Source: SUSESO, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: Buk, 2025)"
  },

  // Argentina Industries
  {
    industria: "Healthcare",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "5,5–7,5% (Source: INDEC, 2024; EPH; SRT, 2024)",
    absentismoSM: "1,5–2,5% (Source: SRT, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: SRT, 2024)"
  },
  {
    industria: "Technology / IT",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "2,0–3,5% (Source: INDEC, 2024)",
    absentismoSM: "0,6–1,2% (Source: SRT, 2024)",
    costeSMEmpresa: "$1.000–2.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: SRT, 2024)"
  },
  {
    industria: "Financial Services",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "3,0–4,5% (Source: INDEC, 2024)",
    absentismoSM: "0,8–1,5% (Source: SRT, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: SRT, 2024)"
  },
  {
    industria: "Manufacturing",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "5,0–7,0% (Source: INDEC, 2024)",
    absentismoSM: "1,2–2,0% (Source: SRT, 2024)",
    costeSMEmpresa: "$600–1.200/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Depresión 2. Abuso de sustancias 3. Ansiedad (Source: SRT, 2024)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "2,0–3,0% (Source: INDEC, 2024)",
    absentismoSM: "0,6–1,2% (Source: SRT, 2024)",
    costeSMEmpresa: "$1.000–2.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "N/A (es el propio Estado)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: SRT, 2024)"
  },
  {
    industria: "Retail",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "4,0–5,5% (Source: INDEC, 2024)",
    absentismoSM: "1,0–1,8% (Source: SRT, 2024)",
    costeSMEmpresa: "$600–1.200/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: SRT, 2024)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "3,0–4,5% (Source: INDEC, 2024)",
    absentismoSM: "0,8–1,5% (Source: SRT, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: SRT, 2024)"
  },
  {
    industria: "Education",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "5,0–7,0% (Source: INDEC, 2024)",
    absentismoSM: "1,2–2,0% (Source: SRT, 2024)",
    costeSMEmpresa: "$600–1.200/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: SRT, 2024)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "5,5–7,5% (Source: INDEC, 2024)",
    absentismoSM: "1,5–2,5% (Source: SRT, 2024)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: SRT, 2024)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Argentina",
    mercadoCode: "argentina",
    absentismoGeneral: "4,5–6,5% (Source: INDEC, 2024)",
    absentismoSM: "1,2–2,0% (Source: SRT, 2024)",
    costeSMEmpresa: "$600–1.200/empleado/año (Source: PAHO, 2025)",
    costeSMEstado: "Incluido en LATAM (Source: PAHO, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: SRT, 2024)"
  },

  // CHINA - 10 industrias
  {
    industria: "Healthcare",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "2,0–3,5% (Source: NBS, 2024)",
    absentismoSM: "0,8–1,5% (Source: Aon/TELUS, 2024 — '46% impacto productividad')",
    costeSMEmpresa: "$2.000–4.000/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Insomnio (Source: Aon, 2024)"
  },
  {
    industria: "Technology / IT",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "2,0–3,5% (Source: NBS, 2024)",
    absentismoSM: "0,8–1,5% (Source: Aon, 2024)",
    costeSMEmpresa: "$2.000–4.000/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: Aon, 2024)"
  },
  {
    industria: "Financial Services",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "3,5–5,5% (Source: NBS, 2024; Frontiers Psychology, 2025 — '26,5% depresión, 21,1% ansiedad manufactura')",
    absentismoSM: "1,0–2,0% (Source: Frontiers Psychology, 2025, Chinese Manufacturing Study)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Insomnio (Source: Frontiers Psychology, 2025)"
  },
  {
    industria: "Manufacturing",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "1,5–3,0% (Source: NBS, 2024)",
    absentismoSM: "0,5–1,2% (Source: Aon, 2024)",
    costeSMEmpresa: "$2.000–4.000/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Aon, 2024)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "3,0–4,5% (Source: NBS, 2024)",
    absentismoSM: "0,8–1,5% (Source: Aon, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: Aon, 2024)"
  },
  {
    industria: "Retail",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "2,5–4,0% (Source: NBS, 2024)",
    absentismoSM: "0,6–1,2% (Source: Aon, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Insomnio (Source: Aon, 2024)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "3,5–5,0% (Source: NBS, 2024)",
    absentismoSM: "1,0–2,0% (Source: Aon, 2024)",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: Aon, 2024)"
  },
  {
    industria: "Education",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "2,5–4,0% (Source: NBS, 2024)",
    absentismoSM: "0,8–1,5% (Source: Aon, 2024)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Burnout (Source: Aon, 2024)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "3,5–5,5% (Source: NBS, 2024)",
    absentismoSM: "1,0–2,0% (Source: Aon, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Insomnio (Source: Aon, 2024)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "China",
    mercadoCode: "china",
    absentismoGeneral: "3,5–5,5% (Source: NBS, 2024)",
    absentismoSM: "1,0–2,0% (Source: Aon, 2024)",
    costeSMEmpresa: "$1.000–2.000/empleado/año (Source: Aon, 2024)",
    costeSMEstado: "Incluido en estimación nacional (Source: WHO, 2024)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Insomnio (Source: Aon, 2024)"
  },

  // RUSIA - 10 industrias
  {
    industria: "Healthcare",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "5,0–7,5% (Source: Rosstat, 2024; PMC, 2021 — '74,2% agotamiento emocional HCW')",
    absentismoSM: "1,5–3,0% (Source: PMC, 2021, Mosolova et al. — '46,5% depresión, 32,3% ansiedad HCW')",
    costeSMEmpresa: "$800–1.500/empleado/año (Source: Estimación basada en WHO Europe, 2024)",
    costeSMEstado: "Datos limitados (Source: WHO Europe, 2024)",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Burnout (Source: PMC, 2021; Mosolova et al.; WHO Europe)"
  },
  {
    industria: "Technology / IT",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "2,0–3,5% (Source: Rosstat, 2024)",
    absentismoSM: "0,8–1,5% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "$800–2.000/empleado/año (Source: Estimación WHO Europe)",
    costeSMEstado: "Datos limitados (Source: WHO Europe)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: WHO Europe, 2024)"
  },
  {
    industria: "Financial Services",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "2,5–4,0% (Source: Rosstat, 2024)",
    absentismoSM: "0,8–1,5% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "$800–2.000/empleado/año (Source: Estimación WHO Europe)",
    costeSMEstado: "Datos limitados",
    top3TrastornosSM: "1. Ansiedad 2. Burnout 3. Depresión (Source: WHO Europe)"
  },
  {
    industria: "Manufacturing",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "4,5–7,0% (Source: Rosstat, 2024)",
    absentismoSM: "1,0–2,0% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "$500–1.200/empleado/año (Source: Estimación WHO Europe)",
    costeSMEstado: "Datos limitados",
    top3TrastornosSM: "1. Depresión 2. Abuso de alcohol 3. Ansiedad (Source: WHO Europe; Lancet, 2023)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "1,5–3,0% (Source: Rosstat, 2024)",
    absentismoSM: "0,5–1,2% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "$800–2.000/empleado/año (Source: Estimación WHO Europe)",
    costeSMEstado: "Datos limitados",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: WHO Europe)"
  },
  {
    industria: "Retail",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "3,5–5,0% (Source: Rosstat, 2024)",
    absentismoSM: "0,8–1,5% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "$500–1.000/empleado/año (Source: Estimación WHO Europe)",
    costeSMEstado: "Datos limitados",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Abuso de alcohol (Source: WHO Europe)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "3,0–5,0% (Source: Rosstat, 2024)",
    absentismoSM: "0,6–1,2% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "$500–1.200/empleado/año (Source: Estimación WHO Europe)",
    costeSMEstado: "Datos limitados",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: WHO Europe)"
  },
  {
    industria: "Education",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "4,0–6,0% (Source: Rosstat, 2024)",
    absentismoSM: "1,0–2,0% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "$500–1.000/empleado/año (Source: Estimación WHO Europe)",
    costeSMEstado: "Datos limitados",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: WHO Europe)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "4,0–6,0% (Source: Rosstat, 2024)",
    absentismoSM: "1,0–2,0% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Datos limitados",
    top3TrastornosSM: "1. Depresión 2. Abuso de alcohol 3. Ansiedad (Source: WHO Europe)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Russia",
    mercadoCode: "rusia",
    absentismoGeneral: "4,0–6,0% (Source: Rosstat, 2024)",
    absentismoSM: "1,0–2,0% (Source: Estimación WHO Europe)",
    costeSMEmpresa: "$500–1.000/empleado/año (Source: Estimación WHO Europe)",
    costeSMEstado: "Datos limitados",
    top3TrastornosSM: "1. Depresión 2. Ansiedad 3. Burnout (Source: WHO Europe)"
  },

  // JAPÓN - 10 industrias
  {
    industria: "Healthcare",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "2,0–3,5% (Source: MHLW, 2024)",
    absentismoSM: "1,0–2,0% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "¥400.000–700.000 = $2.700–4.700/empleado/año (Source: Evans-Lacko et al., 2016 — 'Japón: $2.674 absentismo/persona')",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Insomnio (Source: Aon, 2024; MHLW, 2024)"
  },
  {
    industria: "Technology / IT",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "2,0–3,0% (Source: MHLW, 2024)",
    absentismoSM: "1,0–2,0% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "¥400.000–700.000 = $2.700–4.700/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: MHLW, 2024)"
  },
  {
    industria: "Financial Services",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "3,0–5,0% (Source: MHLW, 2024)",
    absentismoSM: "1,0–2,0% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "¥200.000–400.000 = $1.300–2.700/empleado/año (Source: Hara & Nagata, 2025)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Depresión 2. Trastornos adaptativos 3. Ansiedad (Source: MHLW, 2024)"
  },
  {
    industria: "Manufacturing",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "1,5–2,5% (Source: MHLW, 2024)",
    absentismoSM: "0,8–1,5% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "¥400.000–700.000 = $2.700–4.700/empleado/año (Source: Evans-Lacko et al., 2016)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Burnout 2. Ansiedad 3. Depresión (Source: MHLW, 2024)"
  },
  {
    industria: "Professional Services / Consulting",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "3,0–4,5% (Source: MHLW, 2024)",
    absentismoSM: "1,0–2,0% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "¥200.000–400.000 = $1.300–2.700/empleado/año (Source: Hara & Nagata, 2025)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: MHLW, 2024)"
  },
  {
    industria: "Retail",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "2,0–3,5% (Source: MHLW, 2024)",
    absentismoSM: "0,8–1,5% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "¥250.000–500.000 = $1.700–3.300/empleado/año (Source: Hara & Nagata, 2025)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: MHLW, 2024)"
  },
  {
    industria: "Energy / Utilities",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "3,0–4,5% (Source: MHLW, 2024)",
    absentismoSM: "1,0–2,0% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "¥200.000–400.000 = $1.300–2.700/empleado/año (Source: Hara & Nagata, 2025)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Burnout 2. Depresión 3. Ansiedad (Source: MHLW, 2024)"
  },
  {
    industria: "Education",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "3,0–4,5% (Source: MHLW, 2024)",
    absentismoSM: "1,0–2,0% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Depresión 2. Trastornos adaptativos 3. Burnout (Source: MHLW, 2024)"
  },
  {
    industria: "Government / Public Admin.",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "3,5–5,0% (Source: MHLW, 2024)",
    absentismoSM: "1,0–2,0% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "N/A (es el propio Estado)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Depresión 2. Trastornos adaptativos 3. Burnout (Source: MHLW, 2024)"
  },
  {
    industria: "Hospitality / Tourism",
    mercado: "Japan",
    mercadoCode: "japon",
    absentismoGeneral: "3,5–5,0% (Source: MHLW, 2024)",
    absentismoSM: "1,0–2,0% (Source: Hara & Nagata, 2025)",
    costeSMEmpresa: "¥250.000–500.000 = $1.700–3.300/empleado/año (Source: Hara & Nagata, 2025)",
    costeSMEstado: "Incluido en ¥7,6T (Source: Hara & Nagata, 2025)",
    top3TrastornosSM: "1. Ansiedad 2. Depresión 3. Burnout (Source: MHLW, 2024)"
  }
];