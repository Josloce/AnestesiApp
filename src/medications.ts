/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Regimen {
  effect: string;
  minDose: number;
  maxDose: number;
  ed50?: number;
  ed95?: number;
  unit: 'mg/kg' | 'mcg/kg' | 'mg/kg/h' | 'mcg/kg/min' | 'mcg/kg/h' | 'mg' | 'mcg' | 'mg/h' | '%';
}

export interface SystemEffects {
  cardiovascular: string;
  respiratory: string;
  cns: string;
  other?: string;
}

export interface TCIPhase {
  phase: string;
  cp: string;
  ce: string;
}

export interface Medication {
  id: string;
  name: string;
  description: string;
  mechanismOfAction: string;
  indications: string[];
  regimens: Regimen[];
  systemEffects: SystemEffects;
  contraindications: string[];
  halfLife: string;
  latency: string;
  duration: string;
  metabolism: string;
  receptors: string;
  elimination: string;
  tciData?: TCIPhase[];
  presentation: string;
  infusionPreparation: string;
}

export const MEDICATIONS: Medication[] = [
  {
    id: 'propofol',
    name: 'Propofol',
    description: 'Agente anestésico intravenoso de acción corta.',
    mechanismOfAction: 'Facilitación de la neurotransmisión inhibitoria mediada por el receptor GABA-A.',
    indications: ['Inducción y mantenimiento de la anestesia general', 'Sedación en procedimientos', 'Sedación en cuidados intensivos'],
    regimens: [
      { effect: 'Inducción', minDose: 1.5, maxDose: 2.5, ed50: 1.1, ed95: 1.5, unit: 'mg/kg' },
      { effect: 'Mantenimiento (TIVA)', minDose: 4, maxDose: 12, unit: 'mg/kg/h' },
      { effect: 'Sedación Consciente', minDose: 0.5, maxDose: 1.0, unit: 'mg/kg' },
      { effect: 'Sedación UCI (Mantenimiento)', minDose: 0.3, maxDose: 4.0, unit: 'mg/kg/h' }
    ],
    systemEffects: {
      cardiovascular: 'Disminución de la resistencia vascular sistémica y contractilidad (hipotensión).',
      respiratory: 'Depresión respiratoria profunda, apnea, disminución de reflejos de vía aérea.',
      cns: 'Hipnosis, disminución del flujo sanguíneo cerebral y consumo de O2, anticonvulsivante.',
      other: 'Efecto antiemético, dolor a la inyección.'
    },
    contraindications: ['Hipersensibilidad al propofol, huevo o soja', 'Inestabilidad hemodinámica severa'],
    halfLife: '30 - 60 min (fase inicial)',
    latency: '30 - 45 segundos',
    duration: '5 - 10 minutos',
    metabolism: 'Hepático (rápido) y extrahepático (pulmones).',
    receptors: 'GABA-A',
    elimination: 'Renal',
    tciData: [
      { phase: 'Intubación', cp: '4 - 6 mcg/mL', ce: '4 - 6 mcg/mL' },
      { phase: 'Mantenimiento', cp: '2.5 - 4 mcg/mL', ce: '2.5 - 4 mcg/mL' },
      { phase: 'Despertar', cp: '0.8 - 1.2 mcg/mL', ce: '0.8 - 1.2 mcg/mL' }
    ],
    presentation: 'Ampollas de 20ml al 1% (10mg/ml) o 2% (20mg/ml). Frascos de 50ml y 100ml.',
    infusionPreparation: 'Administrar puro (1% o 2%) o diluido en Dextrosa 5% (no menos de 2mg/ml).'
  },
  {
    id: 'fentanyl',
    name: 'Fentanilo',
    description: 'Opioide sintético potente.',
    mechanismOfAction: 'Agonista selectivo de los receptores opioides mu (µ), produciendo analgesia y sedación.',
    indications: ['Analgesia intraoperatoria', 'Coadyuvante en la inducción anestésica', 'Manejo del dolor agudo severo'],
    regimens: [
      { effect: 'Inducción / Analgesia', minDose: 1, maxDose: 5, ed50: 1, ed95: 3, unit: 'mcg/kg' },
      { effect: 'Mantenimiento (Bolus)', minDose: 1, maxDose: 3, unit: 'mcg/kg' },
      { effect: 'Sedación en UCI', minDose: 0.7, maxDose: 10, unit: 'mcg/kg/h' }
    ],
    systemEffects: {
      cardiovascular: 'Bradicardia (vagal), estabilidad hemodinámica relativa.',
      respiratory: 'Depresión respiratoria dosis-dependiente, rigidez torácica (dosis altas).',
      cns: 'Analgesia potente, sedación, miosis, euforia/disforia.',
      other: 'Prurito, náuseas, vómitos, estreñimiento.'
    },
    contraindications: ['Hipersensibilidad a opioides', 'Depresión respiratoria severa no tratada'],
    halfLife: '3 - 4 horas',
    latency: '1 - 2 minutos',
    duration: '30 - 60 minutos',
    metabolism: 'Hepático (CYP3A4).',
    receptors: 'Opioides Mu (µ)',
    elimination: 'Renal',
    presentation: 'Ampollas de 100mcg/2ml y 500mcg/10ml (50mcg/ml).',
    infusionPreparation: 'Diluir 2500mcg (50ml) en 200ml de SSN 0.9% o D5W para obtener 10mcg/ml.'
  },
  {
    id: 'lidocaine',
    name: 'Lidocaína',
    description: 'Anestésico local tipo amida y antiarrítmico clase Ib.',
    mechanismOfAction: 'Bloqueo de los canales de sodio dependientes de voltaje en la membrana neuronal.',
    indications: ['Anestesia local y regional', 'Tratamiento de arritmias ventriculares', 'Atenuación de la respuesta presora a la intubación', 'Coadyuvante analgésico'],
    regimens: [
      { effect: 'Anestesia Local / Infiltración', minDose: 3, maxDose: 5, unit: 'mg/kg' },
      { effect: 'Con Epinefrina', minDose: 5, maxDose: 7, unit: 'mg/kg' },
      { effect: 'Antiarrítmico (Bolo)', minDose: 1, maxDose: 1.5, unit: 'mg/kg' },
      { effect: 'Atenuación Respuesta Presora', minDose: 1, maxDose: 1.5, unit: 'mg/kg' },
      { effect: 'Analgesia (Infusión)', minDose: 1, maxDose: 2, unit: 'mg/kg/h' }
    ],
    systemEffects: {
      cardiovascular: 'Depresión de la automaticidad y contractilidad (dosis altas), hipotensión.',
      respiratory: 'Broncodilatación (dosis bajas), apnea (toxicidad).',
      cns: 'Analgesia, sedación; toxicidad: sabor metálico, tinnitus, convulsiones.',
      other: 'Toxicidad sistémica por anestésicos locales (LAST).'
    },
    contraindications: ['Hipersensibilidad a amidas', 'Bloqueo cardíaco de alto grado', 'Sindrome de Stokes-Adams'],
    halfLife: '1.5 - 2 horas',
    latency: '45 - 90 segundos (IV), 2-5 min (Infiltración)',
    duration: '30 - 60 minutos (IV), 1-2 horas (Infiltración)',
    metabolism: 'Hepático (CYP1A2, CYP3A4).',
    receptors: 'Canales de Na+ dependientes de voltaje',
    elimination: 'Renal',
    presentation: 'Frascos al 1% (10mg/ml) y 2% (20mg/ml) con o sin epinefrina.',
    infusionPreparation: 'Diluir 1g (50ml al 2%) en 200ml de SSN 0.9% para obtener 4mg/ml.'
  },
  {
    id: 'bupivacaine',
    name: 'Bupivacaína',
    description: 'Anestésico local tipo amida de larga duración.',
    mechanismOfAction: 'Bloqueo de la conducción nerviosa al inhibir el flujo de sodio.',
    indications: ['Anestesia epidural y subaracnoidea', 'Bloqueos de nervios periféricos', 'Infiltración local'],
    regimens: [
      { effect: 'Infiltración', minDose: 1, maxDose: 2, unit: 'mg/kg' },
      { effect: 'Bloqueo Epidural', minDose: 0.5, maxDose: 1.5, unit: 'mg/kg' },
      { effect: 'Raquídea (Dosis fija)', minDose: 5, maxDose: 15, unit: 'mg' }
    ],
    systemEffects: {
      cardiovascular: 'Cardiotoxicidad marcada (bloqueo canales Na+ cardíacos), arritmias ventriculares.',
      respiratory: 'Mínimo efecto a dosis terapéuticas.',
      cns: 'Toxicidad similar a lidocaína pero con menor margen de seguridad.',
      other: 'Larga duración de acción, bloqueo sensorial > motor.'
    },
    contraindications: ['Hipersensibilidad a amidas', 'Infección en sitio de punción', 'Coagulopatía (para bloqueos)'],
    halfLife: '2.7 - 3.5 horas',
    latency: '5 - 10 minutos',
    duration: '3 - 6 horas',
    metabolism: 'Hepático.',
    receptors: 'Canales de Na+ dependientes de voltaje',
    elimination: 'Renal',
    presentation: 'Frascos al 0.25%, 0.5% y 0.75% (isobárica o hiperbárica).',
    infusionPreparation: 'Generalmente no se usa en infusión continua IV, solo epidural.'
  },
  {
    id: 'morphine',
    name: 'Morfina',
    description: 'Opioide natural, estándar de oro para el dolor.',
    mechanismOfAction: 'Agonista de los receptores opioides mu (µ).',
    indications: ['Dolor agudo y crónico severo', 'Edema agudo de pulmón', 'Analgesia postoperatoria'],
    regimens: [
      { effect: 'Analgesia IV (Bolo)', minDose: 0.05, maxDose: 0.1, unit: 'mg/kg' },
      { effect: 'Analgesia Postop (PCA)', minDose: 0.01, maxDose: 0.03, unit: 'mg/kg/h' }
    ],
    systemEffects: {
      cardiovascular: 'Hipotensión ortostática, liberación de histamina (vasodilatación).',
      respiratory: 'Depresión respiratoria, disminución de la sensibilidad al CO2.',
      cns: 'Analgesia profunda, sedación, miosis, náuseas/vómitos (zona gatillo).',
      other: 'Espasmo del esfínter de Oddi, retención urinaria, prurito.'
    },
    contraindications: ['Hipersensibilidad a opioides', 'Asma bronquial aguda', 'Obstrucción intestinal'],
    halfLife: '2 - 3 horas',
    latency: '15 - 30 minutos (IV)',
    duration: '3 - 4 horas',
    metabolism: 'Hepático (Glucuronidación - M6G activo).',
    receptors: 'Opioides Mu (µ), Kappa (κ)',
    elimination: 'Renal (Cuidado en falla renal por M6G).',
    presentation: 'Ampollas de 10mg/1ml.',
    infusionPreparation: 'Diluir 50mg (5 amp) en 200ml de SSN 0.9% para obtener 0.25mg/ml.'
  },
  {
    id: 'rocuronium',
    name: 'Rocuronio',
    description: 'Bloqueador neuromuscular no despolarizante.',
    mechanismOfAction: 'Antagonista competitivo de los receptores nicotínicos de acetilcolina en la placa motora terminal.',
    indications: ['Facilitación de la intubación traqueal', 'Relajación muscular intraoperatoria'],
    regimens: [
      { effect: 'Intubación Estándar', minDose: 0.6, maxDose: 0.9, ed50: 0.15, ed95: 0.3, unit: 'mg/kg' },
      { effect: 'Secuencia Rápida', minDose: 0.9, maxDose: 1.2, unit: 'mg/kg' },
      { effect: 'Mantenimiento (Infusión)', minDose: 0.3, maxDose: 0.6, unit: 'mg/kg/h' }
    ],
    systemEffects: {
      cardiovascular: 'Mínimos efectos, ligera taquicardia ocasional.',
      respiratory: 'Parálisis de músculos respiratorios (apnea terapéutica).',
      cns: 'Sin efectos (no cruza barrera hematoencefálica).',
      other: 'Efecto reversible con Sugammadex o Neostigmina.'
    },
    contraindications: ['Hipersensibilidad al rocuronio o bromuros'],
    halfLife: '60 - 90 minutos',
    latency: '60 - 90 segundos',
    duration: '30 - 45 minutos',
    metabolism: 'Mínimo hepático.',
    receptors: 'Nicotínicos de Acetilcolina (Placa motora)',
    elimination: 'Biliar (70%) y Renal (30%).',
    presentation: 'Vial de 50mg/5ml (10mg/ml).',
    infusionPreparation: 'Administrar puro (10mg/ml) o diluir a 1-2mg/ml en SSN 0.9% o D5W.'
  },
  {
    id: 'succinylcholine',
    name: 'Succinilcolina',
    description: 'Bloqueador neuromuscular despolarizante.',
    mechanismOfAction: 'Mimetiza la acción de la acetilcolina, produciendo una despolarización persistente de la placa motora.',
    indications: ['Intubación de secuencia rápida', 'Relajación muscular de corta duración'],
    regimens: [
      { effect: 'Intubación Estándar', minDose: 1.0, maxDose: 1.5, unit: 'mg/kg' },
      { effect: 'Intubación (Secuencia Rápida)', minDose: 1.0, maxDose: 1.5, ed50: 0.15, ed95: 0.3, unit: 'mg/kg' }
    ],
    systemEffects: {
      cardiovascular: 'Bradicardia (especialmente en niños o segunda dosis), arritmias.',
      respiratory: 'Apnea por parálisis muscular.',
      cns: 'Aumento de la presión intracraneal (transitorio).',
      other: 'Fasciculaciones, mialgias, aumento de presión intraocular y gástrica, hiperpotasemia.'
    },
    contraindications: ['Antecedente de Hipertermia Maligna', 'Grandes quemados (>24h)', 'Denervación muscular', 'Hiperpotasemia'],
    halfLife: '2 - 4 minutos',
    latency: '30 - 60 segundos',
    duration: '5 - 10 minutos',
    metabolism: 'Pseudocolinesterasa plasmática.',
    receptors: 'Nicotínicos de Acetilcolina',
    elimination: 'Renal (metabolitos).',
    presentation: 'Vial de 100mg/2ml o 500mg/10ml (50mg/ml).',
    infusionPreparation: 'No recomendada para infusión continua por riesgo de bloqueo fase II.'
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    description: 'Benzodiacepina de acción corta.',
    mechanismOfAction: 'Potenciación del efecto inhibitorio del GABA al unirse al receptor benzodiacepínico.',
    indications: ['Premedicación anestésica', 'Sedación para procedimientos', 'Inducción anestésica'],
    regimens: [
      { effect: 'Premedicación / Ansiolisis', minDose: 0.02, maxDose: 0.04, unit: 'mg/kg' },
      { effect: 'Sedación Consciente', minDose: 0.05, maxDose: 0.1, ed50: 0.04, ed95: 0.08, unit: 'mg/kg' },
      { effect: 'Inducción', minDose: 0.1, maxDose: 0.3, unit: 'mg/kg' }
    ],
    systemEffects: {
      cardiovascular: 'Leve disminución de la resistencia vascular sistémica.',
      respiratory: 'Depresión respiratoria dosis-dependiente, sinergia con opioides.',
      cns: 'Ansiolisis, amnesia anterógrada, sedación, anticonvulsivante.',
      other: 'Efecto reversible con Flumazenilo.'
    },
    contraindications: ['Hipersensibilidad a benzodiacepinas', 'Glaucoma de ángulo estrecho'],
    halfLife: '1.5 - 2.5 horas',
    latency: '1 - 3 minutos (IV)',
    duration: '15 - 80 minutos',
    metabolism: 'Hepático (CYP3A4).',
    receptors: 'GABA-A (Sitio BZD)',
    elimination: 'Renal',
    presentation: 'Ampollas de 5mg/5ml, 15mg/3ml o 50mg/10ml.',
    infusionPreparation: 'Diluir 50mg en 100ml de SSN 0.9% para obtener 0.5mg/ml.'
  },
  {
    id: 'etomidate',
    name: 'Etomidato',
    description: 'Hipnótico no barbitúrico de acción corta.',
    mechanismOfAction: 'Modulador alostérico positivo de los receptores GABA-A.',
    indications: ['Inducción anestésica en pacientes con inestabilidad cardiovascular'],
    regimens: [
      { effect: 'Inducción', minDose: 0.2, maxDose: 0.3, ed50: 0.15, ed95: 0.25, unit: 'mg/kg' }
    ],
    systemEffects: {
      cardiovascular: 'Gran estabilidad hemodinámica (mínimo efecto en FC y PA).',
      respiratory: 'Mínima depresión respiratoria.',
      cns: 'Hipnosis, disminución de presión intracraneal y flujo sanguíneo cerebral.',
      other: 'Supresión adrenocortical (inhibición 11-beta-hidroxilasa), mioclonías, náuseas.'
    },
    contraindications: ['Hipersensibilidad al etomidato', 'Sepsis severa (relativa por supresión adrenal)'],
    halfLife: '2 - 5 horas',
    latency: '30 - 60 segundos',
    duration: '3 - 5 minutos',
    metabolism: 'Hepático y esterasas plasmáticas.',
    receptors: 'GABA-A',
    elimination: 'Renal (85%) and Biliar.',
    presentation: 'Ampollas de 20mg/10ml (2mg/ml).',
    infusionPreparation: 'No recomendada por supresión adrenal prolongada.'
  },
  {
    id: 'ketamine',
    name: 'Ketamina',
    description: 'Anestésico disociativo.',
    mechanismOfAction: 'Antagonista no competitivo de los receptores NMDA (N-metil-D-aspartato).',
    indications: ['Inducción y mantenimiento de la anestesia', 'Analgesia subanestésica', 'Sedación en pacientes con broncoespasmo'],
    regimens: [
      { effect: 'Inducción Anestésica', minDose: 1, maxDose: 2, ed50: 0.5, ed95: 1.0, unit: 'mg/kg' },
      { effect: 'Analgesia (Dosis Subanestésica)', minDose: 0.1, maxDose: 0.5, unit: 'mg/kg' },
      { effect: 'Sedación (IM)', minDose: 4, maxDose: 6, unit: 'mg/kg' },
      { effect: 'Sedación UCI (Mantenimiento)', minDose: 0.1, maxDose: 0.5, unit: 'mg/kg/h' }
    ],
    systemEffects: {
      cardiovascular: 'Estimulación simpática (aumento de FC, PA y GC).',
      respiratory: 'Mantenimiento de reflejos de vía aérea y drive respiratorio, broncodilatación.',
      cns: 'Anestesia disociativa, analgesia, aumento de flujo sanguíneo cerebral.',
      other: 'Sialorrea, reacciones de emergencia (alucinaciones), nistagmo.'
    },
    contraindications: ['Hipertensión severa no controlada', 'Eclampsia/Preeclampsia', 'Cardiopatía isquémica severa'],
    halfLife: '2 - 3 horas',
    latency: '30 - 60 segundos (IV)',
    duration: '10 - 20 minutos',
    metabolism: 'Hepático (Norketamina activa).',
    receptors: 'NMDA, Opioides, Muscarínicos',
    elimination: 'Renal',
    presentation: 'Frasco de 500mg/10ml (50mg/ml).',
    infusionPreparation: 'Diluir 500mg en 250ml de SSN 0.9% para obtener 2mg/ml.'
  },
  {
    id: 'remifentanil',
    name: 'Remifentanilo',
    description: 'Opioide de acción ultra corta.',
    mechanismOfAction: 'Agonista selectivo de receptores opioides mu (µ) con metabolismo por esterasas plasmáticas.',
    indications: ['Analgesia intraoperatoria durante la inducción y el mantenimiento', 'Analgesia en cuidados intensivos'],
    regimens: [
      { effect: 'Inducción (Bolus)', minDose: 0.5, maxDose: 1.0, unit: 'mcg/kg' },
      { effect: 'Mantenimiento (Infusión)', minDose: 0.05, maxDose: 2.0, ed50: 0.05, ed95: 0.1, unit: 'mcg/kg/min' },
      { effect: 'Mantenimiento (TIVA)', minDose: 0.1, maxDose: 0.5, unit: 'mcg/kg/min' }
    ],
    systemEffects: {
      cardiovascular: 'Bradicardia e hipotensión dosis-dependiente.',
      respiratory: 'Depresión respiratoria potente, apnea.',
      cns: 'Analgesia profunda, sedación.',
      other: 'Hiperalgesia inducida por opioides (tras suspensión brusca).'
    },
    contraindications: ['Hipersensibilidad a derivados del fentanilo', 'Uso epidural o intratecal (contiene glicina)'],
    halfLife: '3 - 10 minutos (contexto-sensible)',
    latency: '1 - 1.5 minutos',
    duration: '5 - 10 minutos',
    metabolism: 'Esterasas plasmáticas y tisulares (no hepático).',
    receptors: 'Opioides Mu (µ)',
    elimination: 'Renal (metabolitos inactivos).',
    tciData: [
      { phase: 'Intubación', cp: '4 - 8 ng/mL', ce: '4 - 8 ng/mL' },
      { phase: 'Mantenimiento', cp: '2 - 5 ng/mL', ce: '2 - 5 ng/mL' },
      { phase: 'Despertar', cp: '< 2 ng/mL', ce: '< 2 ng/mL' }
    ],
    presentation: 'Vial de 1mg, 2mg o 5mg (polvo liofilizado).',
    infusionPreparation: 'Diluir 5mg en 100ml de SSN 0.9% para obtener 50mcg/ml.'
  },
  {
    id: 'cisatracurium',
    name: 'Cisatracurio',
    description: 'Bloqueador neuromuscular no despolarizante de duración intermedia.',
    mechanismOfAction: 'Antagonista competitivo de los receptores nicotínicos de acetilcolina.',
    indications: ['Relajación muscular intraoperatoria', 'Facilitación de la ventilación mecánica en UCI'],
    regimens: [
      { effect: 'Intubación', minDose: 0.15, maxDose: 0.2, ed50: 0.05, ed95: 0.05, unit: 'mg/kg' },
      { effect: 'Mantenimiento (Infusión)', minDose: 1, maxDose: 3, unit: 'mcg/kg/min' }
    ],
    systemEffects: {
      cardiovascular: 'Gran estabilidad cardiovascular, no libera histamina.',
      respiratory: 'Apnea por parálisis muscular.',
      cns: 'Sin efectos.',
      other: 'Eliminación de Hofmann (independiente de función renal/hepática).'
    },
    contraindications: ['Hipersensibilidad al cisatracurio o bromuros'],
    halfLife: '22 - 29 minutos',
    latency: '2 - 3 minutos',
    duration: '45 - 60 minutos',
    metabolism: 'Eliminación de Hofmann.',
    receptors: 'Nicotínicos de Acetilcolina',
    elimination: 'Renal (metabolitos).',
    presentation: 'Vial de 10mg/5ml o 20mg/10ml (2mg/ml).',
    infusionPreparation: 'Administrar puro (2mg/ml) o diluir en SSN 0.9% o D5W.'
  },
  {
    id: 'vecuronium',
    name: 'Vecuronio',
    description: 'Bloqueador neuromuscular no despolarizante de duración intermedia.',
    mechanismOfAction: 'Antagonista competitivo de los receptores nicotínicos de acetilcolina.',
    indications: ['Relajación muscular intraoperatoria', 'Facilitación de la intubación traqueal'],
    regimens: [
      { effect: 'Intubación', minDose: 0.08, maxDose: 0.1, ed50: 0.04, ed95: 0.05, unit: 'mg/kg' },
      { effect: 'Mantenimiento (Bolo)', minDose: 0.01, maxDose: 0.02, unit: 'mg/kg' },
      { effect: 'Mantenimiento (Infusión)', minDose: 0.8, maxDose: 1.2, unit: 'mcg/kg/min' }
    ],
    systemEffects: {
      cardiovascular: 'Estabilidad hemodinámica, mínimo efecto vagolítico.',
      respiratory: 'Apnea por parálisis muscular.',
      cns: 'Sin efectos.',
      other: 'Metabolito 3-OH vecuronio posee 80% de actividad.'
    },
    contraindications: ['Hipersensibilidad al vecuronio o bromuros'],
    halfLife: '65 - 75 minutos',
    latency: '2 - 3 minutos',
    duration: '30 - 40 minutos',
    metabolism: 'Hepático (30-40%).',
    receptors: 'Nicotínicos de Acetilcolina',
    elimination: 'Biliar (40-50%) y Renal (30%).',
    presentation: 'Vial de 4mg o 10mg (polvo liofilizado).',
    infusionPreparation: 'Reconstituir y diluir a 0.1-0.2mg/ml en SSN 0.9% o D5W.'
  },
  {
    id: 'hydromorphone',
    name: 'Hidromorfona',
    description: 'Opioide semisintético derivado de la morfina.',
    mechanismOfAction: 'Agonista potente de los receptores opioides mu (µ).',
    indications: ['Dolor agudo moderado a severo', 'Analgesia postoperatoria'],
    regimens: [
      { effect: 'Analgesia IV (Bolo)', minDose: 0.01, maxDose: 0.02, unit: 'mg/kg' },
      { effect: 'Analgesia Postop (PCA)', minDose: 0.003, maxDose: 0.005, unit: 'mg/kg/h' }
    ],
    systemEffects: {
      cardiovascular: 'Similar a morfina pero con menor liberación de histamina.',
      respiratory: 'Depresión respiratoria dosis-dependiente.',
      cns: 'Analgesia potente (5-7 veces más que morfina), sedación.',
      other: 'Náuseas, vómitos, prurito, estreñimiento.'
    },
    contraindications: ['Hipersensibilidad a opioides', 'Depresión respiratoria severa', 'Íleo paralítico'],
    halfLife: '2 - 3 horas',
    latency: '5 - 15 minutos (IV)',
    duration: '3 - 4 horas',
    metabolism: 'Hepático (Glucuronidación).',
    receptors: 'Opioides Mu (µ)',
    elimination: 'Renal',
    presentation: 'Ampollas de 2mg/ml.',
    infusionPreparation: 'Diluir 10mg (5 amp) en 100ml de SSN 0.9% para obtener 0.1mg/ml.'
  },
  {
    id: 'magnesium_sulfate',
    name: 'Sulfato de Magnesio',
    description: 'Electrolito, anticonvulsivante y coadyuvante analgésico.',
    mechanismOfAction: 'Antagonista de los receptores NMDA y bloqueador de canales de calcio.',
    indications: ['Preeclampsia y eclampsia', 'Torsades de pointes', 'Coadyuvante analgésico', 'Broncoespasmo severo'],
    regimens: [
      { effect: 'Coadyuvante Analgésico (Bolo)', minDose: 30, maxDose: 50, unit: 'mg/kg' },
      { effect: 'Mantenimiento (Infusión)', minDose: 10, maxDose: 15, unit: 'mg/kg/h' },
      { effect: 'Preeclampsia (Bolo)', minDose: 4000, maxDose: 6000, unit: 'mg' },
      { effect: 'Torsades de Pointes', minDose: 1000, maxDose: 2000, unit: 'mg' }
    ],
    systemEffects: {
      cardiovascular: 'Vasodilatación, bradicardia, prolongación PR y QRS.',
      respiratory: 'Broncodilatación, depresión respiratoria (toxicidad).',
      cns: 'Sedación, anticonvulsivante, neuroprotección.',
      other: 'Potenciación de relajantes musculares, abolición de reflejos (toxicidad).'
    },
    contraindications: ['Bloqueo cardíaco', 'Miastenia gravis', 'Insuficiencia renal severa'],
    halfLife: '4 horas',
    latency: 'Inmediata (IV)',
    duration: '30 minutos',
    metabolism: 'No se metaboliza.',
    receptors: 'NMDA, Canales de Calcio',
    elimination: 'Renal',
    presentation: 'Ampollas al 20% (2g/10ml) o 50% (5g/10ml).',
    infusionPreparation: 'Diluir según requerimiento (ej. 4g en 100ml SSN para bolo).'
  },
  {
    id: 'dexmedetomidine',
    name: 'Dexmedetomidina',
    description: 'Agonista selectivo de los receptores alfa-2 adrenérgicos con propiedades sedantes y analgésicas.',
    mechanismOfAction: 'Agonismo selectivo de receptores alfa-2 presinápticos en el locus coeruleus, inhibiendo la liberación de noradrenalina.',
    indications: ['Sedación en cuidados intensivos', 'Sedación para procedimientos', 'Coadyuvante anestésico'],
    regimens: [
      { effect: 'Sedación en UCI', minDose: 0.2, maxDose: 0.7, unit: 'mcg/kg/h' },
      { effect: 'Sedación para Procedimientos', minDose: 0.2, maxDose: 1.0, unit: 'mcg/kg/h' },
      { effect: 'Bolo Inicial (en 10 min)', minDose: 0.5, maxDose: 1.0, unit: 'mcg/kg' }
    ],
    systemEffects: {
      cardiovascular: 'Bradicardia, hipotensión; hipertensión transitoria con bolos rápidos por activación alfa-2 periférica.',
      respiratory: 'Mínima depresión respiratoria, preserva la respuesta al CO2 y la permeabilidad de la vía aérea.',
      cns: 'Sedación "cooperativa" (fácil despertar), analgesia, ansiolisis, disminución del flujo sanguíneo cerebral.',
      other: 'Disminución del temblor postoperatorio, sequedad de boca (xerostomía).'
    },
    contraindications: ['Hipersensibilidad a la dexmedetomidina', 'Bloqueo cardiaco de segundo o tercer grado sin marcapasos', 'Inestabilidad hemodinámica severa'],
    halfLife: '2 - 2.5 horas',
    latency: '5 - 10 minutos',
    duration: '60 - 120 minutos (tras infusión prolongada)',
    metabolism: 'Hepático (Glucuronidación y CYP2A6).',
    receptors: 'Alfa-2 adrenérgicos (Selectividad 1600:1 vs Alfa-1)',
    elimination: 'Renal (95%) y Fecal (5%)',
    presentation: 'Vial de 200mcg/2ml (100mcg/ml).',
    infusionPreparation: 'Diluir 200mcg (2ml) en 48ml de SSN 0.9% para obtener 4mcg/ml.'
  },
  {
    id: 'pancuronium',
    name: 'Pancuronio',
    description: 'Bloqueador neuromuscular no despolarizante de larga duración.',
    mechanismOfAction: 'Antagonista competitivo de los receptores nicotínicos de acetilcolina.',
    indications: ['Relajación muscular prolongada intraoperatoria', 'Facilitación de la ventilación mecánica prolongada'],
    regimens: [
      { effect: 'Intubación', minDose: 0.08, maxDose: 0.12, ed50: 0.05, ed95: 0.07, unit: 'mg/kg' },
      { effect: 'Mantenimiento (Bolo)', minDose: 0.01, maxDose: 0.02, unit: 'mg/kg' }
    ],
    systemEffects: {
      cardiovascular: 'Aumento de la frecuencia cardíaca y presión arterial (efecto vagolítico y liberación de catecolaminas).',
      respiratory: 'Apnea por parálisis muscular.',
      cns: 'Sin efectos.',
      other: 'Efecto prolongado en insuficiencia renal.'
    },
    contraindications: ['Hipersensibilidad al pancuronio o bromuros', 'Taquicardia preexistente severa'],
    halfLife: '110 - 140 minutos',
    latency: '3 - 5 minutos',
    duration: '60 - 100 minutos',
    metabolism: 'Hepático (parcial).',
    receptors: 'Nicotínicos de Acetilcolina',
    elimination: 'Renal (principalmente) y Biliar.',
    presentation: 'Ampollas de 4mg/2ml (2mg/ml).',
    infusionPreparation: 'Diluir en SSN 0.9% o D5W si se requiere infusión continua.'
  },
  {
    id: 'etilefrina',
    name: 'Etilefrina',
    description: 'Simpaticomimético de acción directa con afinidad por receptores alfa-1 y beta-1.',
    mechanismOfAction: 'Agonista adrenérgico que aumenta la contractilidad cardiaca y el tono vascular.',
    indications: ['Hipotensión arterial aguda', 'Síncope vasovagal', 'Priapismo (uso intracavernoso)'],
    regimens: [
      { effect: 'Bolo IV', minDose: 1, maxDose: 2, unit: 'mg' },
      { effect: 'Infusión Continua', minDose: 1, maxDose: 10, unit: 'mg/h' }
    ],
    systemEffects: {
      cardiovascular: 'Aumento de la presión arterial (sistólica y diastólica), aumento del gasto cardiaco.',
      respiratory: 'Mínimo efecto a dosis terapéuticas.',
      cns: 'Mínimo efecto, posible cefalea o inquietud.',
      other: 'Riesgo de arritmias en pacientes susceptibles.'
    },
    contraindications: ['Hipertensión arterial', 'Tirotoxicosis', 'Feocromocitoma', 'Glaucoma de ángulo estrecho'],
    halfLife: '2 - 3 horas',
    latency: '1 - 2 minutos (IV)',
    duration: '20 - 30 minutos',
    metabolism: 'Hepático.',
    receptors: 'Alfa-1, Beta-1',
    elimination: 'Renal',
    presentation: 'Ampollas de 10mg/1ml.',
    infusionPreparation: 'Diluir 10-50mg en 100-250ml de SSN 0.9% o D5W.'
  },
  {
    id: 'efedrina',
    name: 'Efedrina',
    description: 'Simpaticomimético de acción mixta (directa e indirecta).',
    mechanismOfAction: 'Estimula directamente receptores alfa y beta, e indirectamente libera noradrenalina endógena.',
    indications: ['Hipotensión inducida por anestesia neuroaxial', 'Broncoespasmo (uso limitado actualmente)'],
    regimens: [
      { effect: 'Bolo IV', minDose: 5, maxDose: 10, unit: 'mg' },
      { effect: 'Dosis Máxima Total', minDose: 50, maxDose: 50, unit: 'mg' }
    ],
    systemEffects: {
      cardiovascular: 'Aumento de la frecuencia cardiaca, gasto cardiaco y presión arterial.',
      respiratory: 'Broncodilatación leve.',
      cns: 'Estimulación central, insomnio, ansiedad.',
      other: 'Taquifilaxia (disminución de respuesta con dosis repetidas).'
    },
    contraindications: ['Cardiopatía isquémica', 'Hipertensión severa', 'Tirotoxicosis'],
    halfLife: '3 - 6 horas',
    latency: '1 - 2 minutos (IV)',
    duration: '10 - 60 minutos',
    metabolism: 'Mínimo hepático, gran parte se excreta sin cambios.',
    receptors: 'Alfa-1, Alfa-2, Beta-1, Beta-2',
    elimination: 'Renal',
    presentation: 'Ampollas de 30mg/1ml o 50mg/1ml.',
    infusionPreparation: 'Diluir 1 ampolla en 9ml de SSN 0.9% para obtener 3mg/ml o 5mg/ml para bolos.'
  },
  {
    id: 'noradrenalina',
    name: 'Noradrenalina',
    description: 'Catecolamina endógena con potente efecto vasopresor.',
    mechanismOfAction: 'Agonista potente de receptores alfa-1 (vasoconstricción) y moderado de beta-1 (inotropismo).',
    indications: ['Choque distributivo (séptico, neurogénico)', 'Hipotensión severa refractaria'],
    regimens: [
      { effect: 'Infusión Continua', minDose: 0.05, maxDose: 1.0, unit: 'mcg/kg/min' },
      { effect: 'Dosis de Rescate (Bolo)', minDose: 5, maxDose: 10, unit: 'mcg' }
    ],
    systemEffects: {
      cardiovascular: 'Intensa vasoconstricción periférica, aumento de la RVS y presión arterial.',
      respiratory: 'Mínimo efecto.',
      cns: 'Mínimo efecto (no cruza BHE significativamente).',
      other: 'Riesgo de isquemia tisular periférica y renal a dosis altas.'
    },
    contraindications: ['Hipotensión por hipovolemia (sin reposición)', 'Trombosis vascular mesentérica o periférica'],
    halfLife: '1 - 2 minutos',
    latency: '1 - 2 minutos',
    duration: '5 - 10 minutos (tras suspender infusión)',
    metabolism: 'MAO y COMT.',
    receptors: 'Alfa-1 > Beta-1',
    elimination: 'Renal',
    presentation: 'Ampollas de 4mg/4ml (1mg/ml).',
    infusionPreparation: 'Diluir 4mg (1 amp) en 250ml de D5W o SSN (16mcg/ml) o 8mg en 50ml (160mcg/ml).'
  },
  {
    id: 'dopamina',
    name: 'Dopamina',
    description: 'Precursor metabólico de la noradrenalina con efectos dosis-dependientes.',
    mechanismOfAction: 'Estimula receptores dopaminérgicos, beta-1 y alfa-1 según la dosis administrada.',
    indications: ['Choque cardiogénico', 'Bradicardia sintomática refractaria', 'Insuficiencia cardiaca congestiva'],
    regimens: [
      { effect: 'Dosis Dopaminérgica', minDose: 0.5, maxDose: 2, unit: 'mcg/kg/min' },
      { effect: 'Dosis Beta (Inotrópica)', minDose: 2, maxDose: 10, unit: 'mcg/kg/min' },
      { effect: 'Dosis Alfa (Vasopresora)', minDose: 10, maxDose: 20, unit: 'mcg/kg/min' }
    ],
    systemEffects: {
      cardiovascular: 'Aumento de contractilidad, frecuencia cardiaca y RVS (a dosis altas).',
      respiratory: 'Mínimo efecto.',
      cns: 'Mínimo efecto.',
      other: 'Aumento del flujo sanguíneo renal y mesentérico a dosis bajas.'
    },
    contraindications: ['Feocromocitoma', 'Taquiarritmias no controladas', 'Fibrilación ventricular'],
    halfLife: '2 minutos',
    latency: '5 minutos',
    duration: '10 minutos (tras suspender infusión)',
    metabolism: 'Hepático, renal y plasmático por MAO y COMT.',
    receptors: 'D1, D2, Beta-1, Alfa-1',
    elimination: 'Renal',
    presentation: 'Ampollas de 200mg/5ml (40mg/ml).',
    infusionPreparation: 'Diluir 200mg (1 amp) en 250ml de SSN o D5W para obtener 800mcg/ml.'
  },
  {
    id: 'dobutamina',
    name: 'Dobutamina',
    description: 'Catecolamina sintética con predominio inotrópico.',
    mechanismOfAction: 'Agonista selectivo beta-1 adrenérgico con efectos mínimos beta-2 y alfa-1.',
    indications: ['Choque cardiogénico', 'Insuficiencia cardiaca aguda descompensada', 'Bajo gasto cardiaco post-CEC'],
    regimens: [
      { effect: 'Infusión Continua', minDose: 2, maxDose: 20, unit: 'mcg/kg/min' }
    ],
    systemEffects: {
      cardiovascular: 'Aumento de la contractilidad y gasto cardiaco, disminución leve de la RVS.',
      respiratory: 'Mínimo efecto.',
      cns: 'Mínimo efecto.',
      other: 'Aumento del consumo de oxígeno miocárdico.'
    },
    contraindications: ['Estenosis subaórtica hipertrófica idiopática', 'Hipersensibilidad'],
    halfLife: '2 minutos',
    latency: '1 - 2 minutos',
    duration: '10 minutos (tras suspender infusión)',
    metabolism: 'Hepático a metabolitos inactivos.',
    receptors: 'Beta-1 > Beta-2',
    elimination: 'Renal',
    presentation: 'Ampollas de 250mg/20ml (12.5mg/ml).',
    infusionPreparation: 'Diluir 250mg (1 amp) en 250ml de SSN o D5W para obtener 1000mcg/ml.'
  },
  {
    id: 'sevoflurane',
    name: 'Sevoflurano',
    description: 'Anestésico inhalado halogenado de baja solubilidad.',
    mechanismOfAction: 'Alteración de la función de canales iónicos transmembrana (GABA-A, Glicina, NMDA).',
    indications: ['Inducción y mantenimiento de la anestesia general', 'Inducción inhalatoria (especialmente en pediatría)'],
    regimens: [
      { effect: 'CAM (40 años)', minDose: 1.8, maxDose: 2.0, unit: '%' },
      { effect: 'Inducción', minDose: 4, maxDose: 8, unit: '%' }
    ],
    systemEffects: {
      cardiovascular: 'Disminución dosis-dependiente de la PA, vasodilatación coronaria.',
      respiratory: 'Depresión respiratoria, potente broncodilatador, no irritante.',
      cns: 'Disminución del consumo metabólico de O2, vasodilatador cerebral a >1 CAM.',
      other: 'Riesgo de Hipertermia Maligna, Nefrotoxicidad teórica por Compuesto A.'
    },
    contraindications: ['Hipersensibilidad a halogenados', 'Antecedente de Hipertermia Maligna'],
    halfLife: 'Excreción pulmonar rápida',
    latency: '2 - 3 minutos',
    duration: 'Dependiente de la ventilación',
    metabolism: 'Hepático (5%).',
    receptors: 'GABA-A, Glicina, NMDA',
    elimination: 'Exhalación (principalmente)',
    presentation: 'Frasco de líquido volátil de 250ml.',
    infusionPreparation: 'Administrado mediante vaporizador calibrado.'
  }
];
