/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScaleOption {
  label: string;
  value: number;
  description?: string;
  linkToScaleId?: string;
  imageHint?: string;
}

export interface Interpretation {
  min: number;
  max: number;
  text: string;
  recommendation?: string;
  color?: 'green' | 'yellow' | 'orange' | 'red' | 'blue';
}

export interface Scale {
  id: string;
  name: string;
  category: 'Vía Aérea' | 'Riesgo' | 'Recuperación' | 'Cardiovascular' | 'Neurología' | 'Hepático' | 'Pulmonar' | 'General' | 'Fragilidad' | 'Pediátrico';
  description: string;
  options?: ScaleOption[];
  sections?: { name: string; options: ScaleOption[] }[];
  type: 'select' | 'boolean-list' | 'multi-select' | 'custom';
  interpretations?: Interpretation[];
  unit?: string;
}

export const SCALES: Scale[] = [
  {
    id: 'asa',
    name: 'Estado Físico ASA',
    category: 'Riesgo',
    description: 'Sistema de clasificación del estado físico de la Sociedad Americana de Anestesiólogos.',
    type: 'select',
    options: [
      { label: 'ASA I', value: 1, description: 'Paciente sano normal.' },
      { label: 'ASA II', value: 2, description: 'Paciente con enfermedad sistémica leve.' },
      { label: 'ASA III', value: 3, description: 'Paciente con enfermedad sistémica grave.' },
      { label: 'ASA IV', value: 4, description: 'Paciente con enfermedad sistémica grave que es una amenaza constante para la vida.' },
      { label: 'ASA V', value: 5, description: 'Paciente moribundo que no se espera que sobreviva sin la operación.' },
      { label: 'ASA VI', value: 6, description: 'Paciente declarado con muerte cerebral cuyos órganos se están removiendo para donación.' },
    ],
    interpretations: [
      { min: 1, max: 1, text: 'Riesgo mínimo (Mortalidad ~0.1%). Paciente sano.', recommendation: 'Proceder con plan anestésico estándar.', color: 'green' },
      { min: 2, max: 2, text: 'Riesgo leve (Mortalidad ~0.2%). Enfermedad sistémica controlada.', recommendation: 'Optimización preoperatoria de patologías de base.', color: 'yellow' },
      { min: 3, max: 3, text: 'Riesgo moderado (Mortalidad ~1.8%). Limitación funcional.', recommendation: 'Evaluación detallada por especialistas y optimización.', color: 'orange' },
      { min: 4, max: 4, text: 'Riesgo alto (Mortalidad ~7.8%). Amenaza vital constante.', recommendation: 'Considerar cuidados intensivos postoperatorios y monitoreo invasivo.', color: 'red' },
      { min: 5, max: 5, text: 'Riesgo extremo (Mortalidad ~9.4%). Supervivencia incierta.', recommendation: 'Cirugía de salvamento. Consentimiento informado de alto riesgo.', color: 'red' },
    ]
  },
  {
    id: 'mallampati',
    name: 'Mallampati',
    category: 'Vía Aérea',
    description: 'Predicción de la facilidad de intubación endotraqueal.',
    type: 'select',
    options: [
      { label: 'Clase I', value: 1, description: 'Paladar blando, fauces, úvula, pilares visibles.' },
      { label: 'Clase II', value: 2, description: 'Paladar blando, fauces, úvula visibles.' },
      { label: 'Clase III', value: 3, description: 'Paladar blando, base de la úvula visibles.' },
      { label: 'Clase IV', value: 4, description: 'Sólo paladar duro visible.' },
    ],
    interpretations: [
      { min: 1, max: 2, text: 'Vía aérea probablemente fácil.', recommendation: 'Laringoscopia convencional.', color: 'green' },
      { min: 3, max: 3, text: 'Vía aérea potencialmente difícil.', recommendation: 'Tener videolaringoscopio disponible.', color: 'orange' },
      { min: 4, max: 4, text: 'Vía aérea probablemente difícil.', recommendation: 'Carro de vía aérea difícil presente. Considerar intubación con paciente despierto.', color: 'red' },
    ]
  },
  {
    id: 'gcs',
    name: 'Escala de Coma de Glasgow (GCS)',
    category: 'Neurología',
    description: 'Evaluación del nivel de conciencia.',
    type: 'multi-select',
    sections: [
      {
        name: 'Respuesta Ocular',
        options: [
          { label: 'Espontánea', value: 4 },
          { label: 'A la orden verbal', value: 3 },
          { label: 'Al dolor', value: 2 },
          { label: 'Sin respuesta', value: 1 },
        ]
      },
      {
        name: 'Respuesta Verbal',
        options: [
          { label: 'Orientado', value: 5 },
          { label: 'Desorientado/Confuso', value: 4 },
          { label: 'Palabras inapropiadas', value: 3 },
          { label: 'Sonidos incomprensibles', value: 2 },
          { label: 'Sin respuesta', value: 1 },
        ]
      },
      {
        name: 'Respuesta Motora',
        options: [
          { label: 'Obedece órdenes', value: 6 },
          { label: 'Localiza el dolor', value: 5 },
          { label: 'Retirada al dolor', value: 4 },
          { label: 'Flexión anormal (decorticación)', value: 3 },
          { label: 'Extensión anormal (descerebración)', value: 2 },
          { label: 'Sin respuesta', value: 1 },
        ]
      }
    ],
    interpretations: [
      { min: 13, max: 15, text: 'Trauma craneal leve.', recommendation: 'Observación y monitoreo neurológico.', color: 'green' },
      { min: 9, max: 12, text: 'Trauma craneal moderado.', recommendation: 'TC de cráneo y evaluación por neurocirugía.', color: 'orange' },
      { min: 3, max: 8, text: 'Trauma craneal grave. Considerar intubación.', recommendation: 'Protección de vía aérea inmediata y manejo de presión intracraneal.', color: 'red' },
    ]
  },
  {
    id: 'bromage',
    name: 'Escala de Bromage',
    category: 'Recuperación',
    description: 'Evaluación del bloqueo motor en anestesia regional.',
    type: 'select',
    options: [
      { label: 'Bromage 0', value: 0, description: 'Sin bloqueo motor (mueve pies, rodillas y cadera).', imageHint: 'full-movement' },
      { label: 'Bromage 1', value: 1, description: 'Bloqueo parcial (incapaz de levantar pierna extendida, mueve rodilla y pie).', imageHint: 'partial-hip' },
      { label: 'Bromage 2', value: 2, description: 'Bloqueo casi completo (incapaz de doblar rodilla, mueve pie).', imageHint: 'partial-knee' },
      { label: 'Bromage 3', value: 3, description: 'Bloqueo completo (incapaz de mover pie).', imageHint: 'no-movement' },
    ],
    interpretations: [
      { min: 0, max: 0, text: 'Sin bloqueo motor.', recommendation: 'Apto para deambulación o alta de recuperación.', color: 'green' },
      { min: 1, max: 2, text: 'Bloqueo motor parcial.', recommendation: 'Continuar observación en recuperación.', color: 'orange' },
      { min: 3, max: 3, text: 'Bloqueo motor completo.', recommendation: 'Vigilancia estrecha de niveles de bloqueo y hemodinamia.', color: 'red' },
    ]
  },
  {
    id: 'rass',
    name: 'Escala RASS',
    category: 'Neurología',
    description: 'Evaluación de la agitación y sedación.',
    type: 'select',
    options: [
      { label: '+4 Combativo', value: 4 },
      { label: '+3 Muy agitado', value: 3 },
      { label: '+2 Agitado', value: 2 },
      { label: '+1 Ansioso', value: 1 },
      { label: '0 Alerta y tranquilo', value: 0 },
      { label: '-1 Somnoliento', value: -1 },
      { label: '-2 Sedación ligera', value: -2 },
      { label: '-3 Sedación moderada', value: -3 },
      { label: '-4 Sedación profunda', value: -4 },
      { label: '-5 Sedación muy profunda', value: -5 },
    ],
    interpretations: [
      { min: 1, max: 4, text: 'Paciente agitado.', recommendation: 'Evaluar causas (dolor, hipoxia, delirio) y considerar sedación.', color: 'orange' },
      { min: 0, max: 0, text: 'Paciente alerta y tranquilo.', recommendation: 'Mantener nivel actual de vigilancia.', color: 'green' },
      { min: -5, max: -1, text: 'Paciente sedado.', recommendation: 'Ajustar infusión de sedantes según objetivo clínico.', color: 'blue' },
    ]
  },
  {
    id: 'child-pugh',
    name: 'Puntuación de Child-Pugh',
    category: 'Hepático',
    description: 'Evaluación del pronóstico de la enfermedad hepática crónica.',
    type: 'multi-select',
    sections: [
      {
        name: 'Encefalopatía',
        options: [
          { label: 'Ninguna', value: 1 },
          { label: 'Grado 1-2', value: 2 },
          { label: 'Grado 3-4', value: 3 },
        ]
      },
      {
        name: 'Ascitis',
        options: [
          { label: 'Ausente', value: 1 },
          { label: 'Leve', value: 2 },
          { label: 'Moderada/Tensa', value: 3 },
        ]
      },
      {
        name: 'Bilirrubina (mg/dL)',
        options: [
          { label: '< 2', value: 1 },
          { label: '2 - 3', value: 2 },
          { label: '> 3', value: 3 },
        ]
      },
      {
        name: 'Albúmina (g/dL)',
        options: [
          { label: '> 3.5', value: 1 },
          { label: '2.8 - 3.5', value: 2 },
          { label: '< 2.8', value: 3 },
        ]
      },
      {
        name: 'INR',
        options: [
          { label: '< 1.7', value: 1 },
          { label: '1.7 - 2.3', value: 2 },
          { label: '> 2.3', value: 3 },
        ]
      }
    ],
    interpretations: [
      { min: 5, max: 6, text: 'Clase A (Mortalidad perioperatoria ~10%). Enfermedad bien compensada.', recommendation: 'Buen pronóstico quirúrgico. Continuar manejo médico.', color: 'green' },
      { min: 7, max: 9, text: 'Clase B (Mortalidad perioperatoria ~30%). Compromiso funcional significativo.', recommendation: 'Riesgo quirúrgico moderado. Optimizar función hepática.', color: 'orange' },
      { min: 10, max: 15, text: 'Clase C (Mortalidad perioperatoria ~75-80%). Enfermedad descompensada.', recommendation: 'Alto riesgo quirúrgico. Considerar solo procedimientos de emergencia.', color: 'red' },
    ]
  },
  {
    id: 'nyha',
    name: 'Clasificación NYHA',
    category: 'Cardiovascular',
    description: 'Clasificación de la insuficiencia cardiaca.',
    type: 'select',
    options: [
      { label: 'Clase I', value: 1, description: 'Sin limitación de la actividad física.' },
      { label: 'Clase II', value: 2, description: 'Ligera limitación de la actividad física.' },
      { label: 'Clase III', value: 3, description: 'Marcada limitación de la actividad física.' },
      { label: 'Clase IV', value: 4, description: 'Incapacidad para realizar cualquier actividad física sin molestias.' },
    ],
    interpretations: [
      { min: 1, max: 1, text: 'Sin síntomas en actividad ordinaria.', recommendation: 'Continuar tratamiento actual.', color: 'green' },
      { min: 2, max: 2, text: 'Síntomas con actividad física moderada.', recommendation: 'Ajustar medicación y monitoreo durante esfuerzo.', color: 'yellow' },
      { min: 3, max: 3, text: 'Síntomas con actividad física mínima.', recommendation: 'Evaluación cardiológica urgente. Riesgo quirúrgico elevado.', color: 'orange' },
      { min: 4, max: 4, text: 'Síntomas en reposo.', recommendation: 'Descompensación aguda. Estabilización inmediata requerida.', color: 'red' },
    ]
  },
  {
    id: 'mets',
    name: 'Capacidad Funcional (METS)',
    category: 'Cardiovascular',
    description: 'Equivalentes metabólicos de tarea.',
    type: 'select',
    options: [
      { label: '> 10 METS', value: 10, description: 'Deportes extenuantes (natación, tenis).' },
      { label: '7 - 10 METS', value: 7, description: 'Trabajo pesado en casa, trotar.' },
      { label: '4 - 6 METS', value: 4, description: 'Subir dos pisos por escalera sin parar.' },
      { label: '< 4 METS', value: 1, description: 'Actividades de la vida diaria (vestirse, comer).' },
    ],
    interpretations: [
      { min: 10, max: 10, text: 'Excelente capacidad funcional.', recommendation: 'Bajo riesgo de eventos cardiacos perioperatorios.', color: 'green' },
      { min: 4, max: 9, text: 'Buena capacidad funcional.', recommendation: 'Capacidad funcional aceptable para cirugía mayor.', color: 'yellow' },
      { min: 1, max: 3, text: 'Pobre capacidad funcional. Riesgo aumentado.', recommendation: 'Considerar pruebas de esfuerzo o ecocardiograma preoperatorio.', color: 'red' },
    ]
  },
  {
    id: 'ariscat',
    name: 'Puntuación ARISCAT',
    category: 'Pulmonar',
    description: 'Riesgo de complicaciones pulmonares postoperatorias.',
    type: 'multi-select',
    sections: [
      {
        name: 'Edad',
        options: [
          { label: '≤ 50 años', value: 0 },
          { label: '51 - 80 años', value: 3 },
          { label: '> 80 años', value: 16 },
        ]
      },
      {
        name: 'Saturación O2 preoperatoria',
        options: [
          { label: '≥ 96%', value: 0 },
          { label: '91 - 95%', value: 8 },
          { label: '≤ 90%', value: 24 },
        ]
      },
      {
        name: 'Infección respiratoria (último mes)',
        options: [
          { label: 'No', value: 0 },
          { label: 'Sí', value: 17 },
        ]
      },
      {
        name: 'Anemia preoperatoria (Hb ≤ 10 g/dL)',
        options: [
          { label: 'No', value: 0 },
          { label: 'Sí', value: 11 },
        ]
      },
      {
        name: 'Sitio quirúrgico',
        options: [
          { label: 'Periférico', value: 0 },
          { label: 'Abdominal superior', value: 15 },
          { label: 'Intratorácico', value: 24 },
        ]
      },
      {
        name: 'Duración de la cirugía',
        options: [
          { label: '< 2 horas', value: 0 },
          { label: '2 - 3 horas', value: 16 },
          { label: '> 3 horas', value: 23 },
        ]
      },
      {
        name: 'Procedimiento de emergencia',
        options: [
          { label: 'No', value: 0 },
          { label: 'Sí', value: 8 },
        ]
      }
    ],
    interpretations: [
      { min: 0, max: 25, text: 'Riesgo bajo (< 1.6% de complicaciones pulmonares).', recommendation: 'Manejo estándar. Fisioterapia respiratoria básica.', color: 'green' },
      { min: 26, max: 44, text: 'Riesgo intermedio (~13.3% de complicaciones pulmonares).', recommendation: 'Fisioterapia respiratoria intensiva y espirometría de incentivo.', color: 'orange' },
      { min: 45, max: 100, text: 'Riesgo alto (~42.1% de complicaciones pulmonares).', recommendation: 'Considerar CPAP postoperatorio y monitoreo en cuidados intermedios.', color: 'red' },
    ]
  },
  {
    id: 'apfel',
    name: 'Puntuación de Apfel (NVPO)',
    category: 'Riesgo',
    description: 'Riesgo de náuseas y vómitos postoperatorios.',
    type: 'boolean-list',
    options: [
      { label: 'Sexo femenino', value: 1 },
      { label: 'No fumador', value: 1 },
      { label: 'Historia de PONV o cinetosis', value: 1 },
      { label: 'Uso de opioides postoperatorios', value: 1 },
    ],
    interpretations: [
      { min: 0, max: 1, text: 'Riesgo bajo (10-20%).', recommendation: 'Profilaxis básica si hay otros factores de riesgo.', color: 'green' },
      { min: 2, max: 2, text: 'Riesgo moderado (40%).', recommendation: 'Profilaxis con un antiemético (ej. Dexametasona).', color: 'yellow' },
      { min: 3, max: 3, text: 'Riesgo alto (60%).', recommendation: 'Profilaxis combinada con dos antieméticos.', color: 'orange' },
      { min: 4, max: 4, text: 'Riesgo muy alto (80%).', recommendation: 'Profilaxis triple y considerar evitar anestesia general con gases.', color: 'red' },
    ]
  },
  {
    id: 'aldrete',
    name: 'Puntuación de Aldrete',
    category: 'Recuperación',
    description: 'Evaluación de la recuperación post-anestésica.',
    type: 'multi-select',
    sections: [
      {
        name: 'Actividad',
        options: [
          { label: 'Mueve 4 extremidades', value: 2 },
          { label: 'Mueve 2 extremidades', value: 1 },
          { label: 'Incapaz de mover extremidades', value: 0 },
        ]
      },
      {
        name: 'Respiración',
        options: [
          { label: 'Capaz de respirar profundo y toser', value: 2 },
          { label: 'Disnea o respiración limitada', value: 1 },
          { label: 'Apnea', value: 0 },
        ]
      },
      {
        name: 'Circulación (PA)',
        options: [
          { label: 'PA ± 20% del nivel preanestésico', value: 2 },
          { label: 'PA ± 20-50% del nivel preanestésico', value: 1 },
          { label: 'PA ± 50% del nivel preanestésico', value: 0 },
        ]
      },
      {
        name: 'Conciencia',
        options: [
          { label: 'Lúcido, orientado y responde', value: 2 },
          { label: 'Despierta al llamado', value: 1 },
          { label: 'No responde', value: 0 },
        ]
      },
      {
        name: 'Saturación de Oxígeno',
        options: [
          { label: 'SatO2 > 92% aire ambiente', value: 2 },
          { label: 'Necesita O2 para SatO2 > 90%', value: 1 },
          { label: 'SatO2 < 90% con O2', value: 0 },
        ]
      }
    ],
    interpretations: [
      { min: 9, max: 10, text: 'Apto para el alta de recuperación.', recommendation: 'Traslado a sala general con criterios de estabilidad.', color: 'green' },
      { min: 0, max: 8, text: 'Permanecer en recuperación.', recommendation: 'Continuar vigilancia y manejo de parámetros alterados.', color: 'red' },
    ]
  },
  {
    id: 'stopbang',
    name: 'STOP-BANG',
    category: 'Vía Aérea',
    description: 'Tamizaje de apnea obstructiva del sueño.',
    type: 'boolean-list',
    options: [
      { label: 'Snoring (Ronquido fuerte)', value: 1 },
      { label: 'Tired (Cansancio diurno)', value: 1 },
      { label: 'Observed (Apneas observadas)', value: 1 },
      { label: 'Pressure (Hipertensión arterial)', value: 1 },
      { label: 'BMI (IMC > 35 kg/m2)', value: 1 },
      { label: 'Age (Edad > 50 años)', value: 1 },
      { label: 'Neck (Circunferencia cuello > 40cm)', value: 1 },
      { label: 'Gender (Género masculino)', value: 1 },
    ],
    interpretations: [
      { min: 0, max: 2, text: 'Riesgo bajo de AOS.', recommendation: 'Manejo anestésico estándar.', color: 'green' },
      { min: 3, max: 4, text: 'Riesgo intermedio de AOS.', recommendation: 'Considerar CPAP si el paciente ya lo usa. Monitoreo postoperatorio extendido.', color: 'orange' },
      { min: 5, max: 8, text: 'Riesgo alto de AOS.', recommendation: 'Alta sospecha de vía aérea difícil. Evitar opioides si es posible. Monitoreo continuo postoperatorio.', color: 'red' },
    ]
  },
  {
    id: 'obese',
    name: 'OBESE (Ventilación Difícil)',
    category: 'Vía Aérea',
    description: 'Predicción de ventilación difícil con mascarilla facial.',
    type: 'boolean-list',
    options: [
      { label: 'Obese (BMI > 26 kg/m2)', value: 1 },
      { label: 'Beard (Barba)', value: 1 },
      { label: 'Elderly (Edad > 55 años)', value: 1 },
      { label: 'Snoring (Ronquido)', value: 1 },
      { label: 'Edentulous (Edéntulo)', value: 1 },
    ],
    interpretations: [
      { min: 0, max: 1, text: 'Ventilación probablemente fácil.', recommendation: 'Técnica de ventilación estándar.', color: 'green' },
      { min: 2, max: 5, text: 'Riesgo de ventilación difícil con mascarilla.', recommendation: 'Tener cánula de Guedel a mano y considerar ventilación a dos manos.', color: 'red' },
    ]
  },
  {
    id: 'gupta',
    name: 'Riesgo Cardiaco de Gupta',
    category: 'Cardiovascular',
    description: 'Índice de riesgo cardiaco perioperatorio (MICA).',
    type: 'multi-select',
    sections: [
      {
        name: 'Tipo de Procedimiento',
        options: [
          { label: 'Anorrectal / Mama / Piel', value: 1 },
          { label: 'Colecistectomía / Hernia', value: 2 },
          { label: 'Abdominal / Vascular / Torácica', value: 3 },
        ]
      },
      {
        name: 'Estado Funcional',
        options: [
          { label: 'Independiente', value: 0 },
          { label: 'Parcialmente dependiente', value: 1 },
          { label: 'Totalmente dependiente', value: 2 },
        ]
      },
      {
        name: 'ASA Class',
        options: [
          { label: 'ASA I', value: 1 },
          { label: 'ASA II', value: 2 },
          { label: 'ASA III', value: 3 },
          { label: 'ASA IV', value: 4 },
          { label: 'ASA V', value: 5 },
        ]
      }
    ],
    interpretations: [
      { min: 0, max: 3, text: 'Riesgo cardiaco bajo.', recommendation: 'Proceder con plan quirúrgico. Monitoreo estándar.', color: 'green' },
      { min: 4, max: 6, text: 'Riesgo cardiaco moderado.', recommendation: 'Considerar Beta-bloqueadores si están indicados y monitoreo ECG continuo.', color: 'orange' },
      { min: 7, max: 10, text: 'Riesgo cardiaco alto.', recommendation: 'Evaluación cardiológica formal y optimización antes de cirugía electiva.', color: 'red' },
    ]
  },
  {
    id: 'nsqip',
    name: 'Riesgo Quirúrgico NSQIP',
    category: 'Riesgo',
    description: 'Calculadora de riesgo quirúrgico basada en el ACS NSQIP.',
    type: 'boolean-list',
    options: [
      { label: 'Edad > 65 años', value: 1 },
      { label: 'ASA Clase III, IV o V', value: 1 },
      { label: 'Estado funcional dependiente', value: 1, description: 'Utilice la escala DASI para una evaluación objetiva.', linkToScaleId: 'dasi' },
      { label: 'Procedimiento de emergencia', value: 1 },
      { label: 'Uso de esteroides crónicos', value: 1 },
      { label: 'Ascitis', value: 1 },
      { label: 'Sepsis sistémica (48h previas)', value: 1 },
      { label: 'Dependiente de ventilador', value: 1 },
      { label: 'Cáncer diseminado', value: 1 },
      { label: 'Diabetes mellitus', value: 1 },
      { label: 'Hipertensión arterial', value: 1 },
      { label: 'Insuficiencia cardiaca congestiva', value: 1 },
      { label: 'Disnea (en reposo o esfuerzo)', value: 1 },
      { label: 'Fumador activo (último año)', value: 1 },
      { label: 'EPOC grave', value: 1 },
      { label: 'Diálisis crónica', value: 1 },
      { label: 'Falla renal aguda', value: 1 },
    ],
    interpretations: [
      { 
        min: 0, 
        max: 2, 
        text: 'Riesgo quirúrgico bajo (Mortalidad < 0.5%, Complicaciones < 2%).', 
        recommendation: 'Manejo perioperatorio estándar. Optimización de rutina. Deambulación temprana y profilaxis básica. Bajo riesgo de eventos adversos mayores.', 
        color: 'green' 
      },
      { 
        min: 3, 
        max: 5, 
        text: 'Riesgo quirúrgico moderado (Mortalidad 1-2%, Complicaciones 5-10%).', 
        recommendation: 'Vigilancia postoperatoria estrecha. Optimización de comorbilidades (Diabetes, HTA). Considerar monitoreo invasivo básico. Profilaxis tromboembólica mecánica y farmacológica. Evaluación de función pulmonar si hay tabaquismo.', 
        color: 'yellow' 
      },
      { 
        min: 6, 
        max: 8, 
        text: 'Riesgo quirúrgico alto (Mortalidad 3-5%, Complicaciones 15-20%).', 
        recommendation: 'Considerar cuidados intensivos postoperatorios (UCI/UTI). Evaluación detallada por especialistas (Cardiología/Neumología). Optimización preoperatoria dirigida. Considerar alternativas menos invasivas si es posible. Monitoreo hemodinámico avanzado intraoperatorio.', 
        color: 'orange' 
      },
      { 
        min: 9, 
        max: 17, 
        text: 'Riesgo quirúrgico muy alto (Mortalidad > 5%, Complicaciones > 25%).', 
        recommendation: 'Optimización preoperatoria agresiva en unidad de cuidados críticos. Discusión detallada de riesgos/beneficios con el paciente y familiares (consentimiento informado reforzado). Evaluación multidisciplinaria obligatoria. Planificación de soporte ventilatorio y vasopresor postoperatorio. Considerar futilidad o manejo paliativo según contexto clínico.', 
        color: 'red' 
      },
    ]
  },
  {
    id: 'sort',
    name: 'Riesgo Quirúrgico SORT',
    category: 'Riesgo',
    description: 'Predicción de mortalidad a 30 días en cirugía no cardiaca.',
    type: 'multi-select',
    sections: [
      {
        name: 'Estado Físico ASA',
        options: [
          { label: 'ASA I o II', value: 0 },
          { label: 'ASA III', value: 1 },
          { label: 'ASA IV', value: 2 },
          { label: 'ASA V', value: 4 },
        ]
      },
      {
        name: 'Urgencia de la Cirugía',
        options: [
          { label: 'Electiva / Programada', value: 0 },
          { label: 'Urgente / Inmediata', value: 1 },
        ]
      },
      {
        name: 'Especialidad Quirúrgica',
        options: [
          { label: 'Otras especialidades', value: 0 },
          { label: 'Torácica / GI / Vascular', value: 1 },
        ]
      },
      {
        name: 'Severidad de la Cirugía',
        options: [
          { label: 'Menor', value: 0, linkToScaleId: 'surgical-severity' },
          { label: 'Intermedia', value: 1, linkToScaleId: 'surgical-severity' },
          { label: 'Mayor', value: 2, linkToScaleId: 'surgical-severity' },
          { label: 'Compleja (Xmajor)', value: 3, linkToScaleId: 'surgical-severity' },
        ]
      },
      {
        name: 'Cáncer',
        options: [
          { label: 'No', value: 0 },
          { label: 'Sí (Malignidad activa)', value: 1 },
        ]
      },
      {
        name: 'Edad',
        options: [
          { label: '< 65 años', value: 0 },
          { label: '65 - 79 años', value: 1 },
          { label: '≥ 80 años', value: 2 },
        ]
      }
    ],
    interpretations: [
      { min: 0, max: 2, text: 'Riesgo bajo de mortalidad (< 1%).', recommendation: 'Manejo perioperatorio estándar.', color: 'green' },
      { min: 3, max: 5, text: 'Riesgo moderado (1 - 5%).', recommendation: 'Optimización de comorbilidades y vigilancia estrecha.', color: 'yellow' },
      { min: 6, max: 8, text: 'Riesgo alto (5 - 10%).', recommendation: 'Considerar cuidados intensivos postoperatorios.', color: 'orange' },
      { min: 9, max: 12, text: 'Riesgo muy alto (> 10%).', recommendation: 'Discusión multidisciplinaria y consentimiento informado detallado.', color: 'red' },
    ]
  },
  {
    id: 'cormack',
    name: 'Cormack-Lehane',
    category: 'Vía Aérea',
    description: 'Grado de visualización laríngea durante la laringoscopia directa.',
    type: 'select',
    options: [
      { label: 'Grado I', value: 1, description: 'Visión completa de la glotis (cuerdas vocales visibles).' },
      { label: 'Grado II', value: 2, description: 'Visión parcial de la glotis (comisura posterior visible).' },
      { label: 'Grado III', value: 3, description: 'Sólo se ve la epiglotis.' },
      { label: 'Grado IV', value: 4, description: 'No se ve ninguna estructura laríngea.' },
    ],
    interpretations: [
      { min: 1, max: 1, text: 'Intubación fácil.', recommendation: 'Laringoscopia convencional.', color: 'green' },
      { min: 2, max: 2, text: 'Intubación potencialmente difícil.', recommendation: 'Considerar uso de guía o estilete.', color: 'yellow' },
      { min: 3, max: 4, text: 'Intubación difícil.', recommendation: 'Videolaringoscopia o técnicas avanzadas de vía aérea.', color: 'red' },
    ]
  },
  {
    id: 'rcri',
    name: 'Índice de Riesgo Cardiaco Revisado (RCRI)',
    category: 'Cardiovascular',
    description: 'Índice de Riesgo Cardiaco Revisado para cirugía no cardiaca.',
    type: 'boolean-list',
    options: [
      { label: 'Cirugía de alto riesgo (Intraperitoneal, intratorácica o suprainguinal)', value: 1 },
      { label: 'Historia de cardiopatía isquémica', value: 1 },
      { label: 'Historia de insuficiencia cardiaca congestiva', value: 1 },
      { label: 'Historia de enfermedad cerebrovascular', value: 1 },
      { label: 'Tratamiento preoperatorio con insulina', value: 1 },
      { label: 'Creatinina sérica preoperatoria > 2.0 mg/dL', value: 1 },
    ],
    interpretations: [
      { min: 0, max: 0, text: 'Clase I (Riesgo 0.4%).', recommendation: 'Bajo riesgo. No requiere estudios adicionales usualmente.', color: 'green' },
      { min: 1, max: 1, text: 'Clase II (Riesgo 0.9%).', recommendation: 'Riesgo bajo-moderado. Monitoreo ECG básico.', color: 'yellow' },
      { min: 2, max: 2, text: 'Clase III (Riesgo 6.6%).', recommendation: 'Riesgo moderado. Considerar optimización médica.', color: 'orange' },
      { min: 3, max: 6, text: 'Clase IV (Riesgo >11%).', recommendation: 'Riesgo alto. Evaluación cardiológica y posible aplazamiento de cirugía electiva.', color: 'red' },
    ]
  },
  {
    id: 'el-ganzouri',
    name: 'Índice de Riesgo de El-Ganzouri',
    category: 'Vía Aérea',
    description: 'Predicción de intubación difícil basada en 7 parámetros.',
    type: 'multi-select',
    sections: [
      {
        name: 'Apertura Bucal',
        options: [
          { label: '≥ 4 cm', value: 0 },
          { label: '< 4 cm', value: 1 },
        ]
      },
      {
        name: 'Distancia Tiromentoniana',
        options: [
          { label: '> 6.5 cm', value: 0 },
          { label: '6.0 - 6.5 cm', value: 1 },
          { label: '< 6.0 cm', value: 2 },
        ]
      },
      {
        name: 'Mallampati',
        options: [
          { label: 'Clase I', value: 0 },
          { label: 'Clase II', value: 1 },
          { label: 'Clase III', value: 2 },
        ]
      },
      {
        name: 'Movilidad del Cuello',
        options: [
          { label: '> 90°', value: 0 },
          { label: '90° (± 10°)', value: 1 },
          { label: '< 80°', value: 2 },
        ]
      },
      {
        name: 'Protrusión Mandibular',
        options: [
          { label: 'Puede protruir incisivos', value: 0 },
          { label: 'No puede protruir incisivos', value: 1 },
        ]
      },
      {
        name: 'Peso Corporal',
        options: [
          { label: '< 90 kg', value: 0 },
          { label: '90 - 110 kg', value: 1 },
          { label: '> 110 kg', value: 2 },
        ]
      },
      {
        name: 'Historia de Intubación Difícil',
        options: [
          { label: 'Ninguna', value: 0 },
          { label: 'Dudosa', value: 1 },
          { label: 'Conocida', value: 2 },
        ]
      }
    ],
    interpretations: [
      { min: 0, max: 3, text: 'Intubación probablemente fácil.', recommendation: 'Manejo de vía aérea estándar.', color: 'green' },
      { min: 4, max: 7, text: 'Riesgo de intubación difícil.', recommendation: 'Tener videolaringoscopio y estilete listos.', color: 'orange' },
      { min: 8, max: 12, text: 'Alta probabilidad de intubación difícil.', recommendation: 'Considerar intubación con paciente despierto o presencia de experto en vía aérea.', color: 'red' },
    ]
  },
  {
    id: 'patil-aldreti',
    name: 'Patil-Aldreti',
    category: 'Vía Aérea',
    description: 'Distancia tiromentoniana.',
    type: 'select',
    options: [
      { label: 'Clase 1 (> 6.5 cm)', value: 0, description: 'Laringoscopia e intubación probablemente fácil.' },
      { label: 'Clase 2 (6.0 - 6.5 cm)', value: 1, description: 'Laringoscopia e intubación difícil pero posible.' },
      { label: 'Clase 3 (< 6.0 cm)', value: 2, description: 'Laringoscopia e intubación muy difícil o imposible.' },
    ],
    interpretations: [
      { min: 0, max: 0, text: 'Probablemente fácil.', recommendation: 'Laringoscopia estándar.', color: 'green' },
      { min: 1, max: 1, text: 'Potencialmente difícil.', recommendation: 'Preparar dispositivos de ayuda (guía, estilete).', color: 'orange' },
      { min: 2, max: 2, text: 'Probablemente difícil.', recommendation: 'Tener videolaringoscopio disponible.', color: 'red' },
    ]
  },
  {
    id: 'ulbt',
    name: 'Test de Mordida del Labio Superior (ULBT)',
    category: 'Vía Aérea',
    description: 'Prueba de mordida del labio superior.',
    type: 'select',
    options: [
      { label: 'Clase 1', value: 1, description: 'Incisivos inferiores muerden labio superior por encima de la línea bermellón.' },
      { label: 'Clase 2', value: 2, description: 'Incisivos inferiores muerden labio superior por debajo de la línea bermellón.' },
      { label: 'Clase 3', value: 3, description: 'Incisivos inferiores no pueden morder el labio superior.' },
    ],
    interpretations: [
      { min: 1, max: 1, text: 'Bajo riesgo de intubación difícil.', recommendation: 'Manejo estándar.', color: 'green' },
      { min: 2, max: 2, text: 'Riesgo moderado.', recommendation: 'Considerar ayuda técnica adicional.', color: 'orange' },
      { min: 3, max: 3, text: 'Alto riesgo de intubación difícil.', recommendation: 'Preparar para vía aérea difícil.', color: 'red' },
    ]
  },
  {
    id: 'caprini',
    name: 'Puntuación de Caprini (Riesgo ETEV)',
    category: 'Riesgo',
    description: 'Evaluación del riesgo de tromboembolismo venoso.',
    type: 'boolean-list',
    options: [
      { label: 'Edad 41-60 años', value: 1 },
      { label: 'Cirugía menor planificada', value: 1 },
      { label: 'Cirugía mayor (> 45 min)', value: 2 },
      { label: 'Cirugía laparoscópica (> 45 min)', value: 2 },
      { label: 'Historia de cáncer', value: 2 },
      { label: 'Encamado (> 72 horas)', value: 2 },
      { label: 'Inmovilización con yeso', value: 2 },
      { label: 'Edad 61-74 años', value: 2 },
      { label: 'Edad ≥ 75 años', value: 3 },
      { label: 'Historia de DVT/PE', value: 3 },
      { label: 'Historia familiar de DVT/PE', value: 3 },
      { label: 'Factor V Leiden positivo', value: 3 },
    ],
    interpretations: [
      { min: 0, max: 1, text: 'Riesgo bajo (< 1% de TVP).', recommendation: 'Deambulación temprana. No requiere profilaxis farmacológica usualmente.', color: 'green' },
      { min: 2, max: 2, text: 'Riesgo moderado (~1-2% de TVP).', recommendation: 'Considerar medias de compresión o HBPM según cirugía.', color: 'yellow' },
      { min: 3, max: 4, text: 'Riesgo alto (~3-5% de TVP).', recommendation: 'Profilaxis farmacológica con HBPM indicada.', color: 'orange' },
      { min: 5, max: 20, text: 'Riesgo muy alto (> 6% de TVP).', recommendation: 'Profilaxis farmacológica y mecánica combinada.', color: 'red' },
    ]
  },
  {
    id: 'dasi',
    name: 'Índice de Actividad de Duke (DASI)',
    category: 'General',
    description: 'Cuestionario para estimar la capacidad funcional y el consumo máximo de oxígeno (VO2 máx).',
    type: 'boolean-list',
    unit: 'METs',
    options: [
      { label: '¿Puede cuidarse solo (comer, vestirse, bañarse, usar el baño)?', value: 2.75 },
      { label: '¿Puede caminar en interiores, como alrededor de su casa?', value: 1.75 },
      { label: '¿Puede caminar una o dos cuadras en terreno llano?', value: 3.25 },
      { label: '¿Puede subir un tramo de escaleras o caminar cuesta arriba?', value: 5.50 },
      { label: '¿Puede correr una distancia corta?', value: 8.00 },
      { label: '¿Puede hacer trabajos ligeros en la casa (quitar el polvo, lavar platos)?', value: 2.70 },
      { label: '¿Puede hacer trabajos moderados en la casa (aspirar, barrer, cargar compras)?', value: 3.50 },
      { label: '¿Puede hacer trabajos pesados en la casa (fregar suelos, mover muebles pesados)?', value: 8.00 },
      { label: '¿Puede hacer trabajos de jardinería (rastrillar hojas, podar, usar cortacésped)?', value: 4.50 },
      { label: '¿Puede tener relaciones sexuales?', value: 5.25 },
      { label: '¿Puede participar en actividades recreativas moderadas (golf, bolos, baile, tenis dobles)?', value: 6.00 },
      { label: '¿Puede participar en deportes recreativos extenuantes (natación, tenis individual, fútbol, esquí)?', value: 7.50 },
    ],
    interpretations: [
      { min: 7.0, max: 20, text: 'Excelente capacidad funcional (> 7 METS).', recommendation: 'Bajo riesgo cardiaco perioperatorio. Consenso internacional: VO2 máx estimado > 24.5 ml/kg/min.', color: 'green' },
      { min: 4.0, max: 6.9, text: 'Capacidad funcional moderada (4-7 METS).', recommendation: 'Riesgo cardiaco aceptable. Consenso internacional: VO2 máx estimado 14-24.5 ml/kg/min.', color: 'yellow' },
      { min: 0, max: 3.9, text: 'Pobre capacidad funcional (< 4 METS).', recommendation: 'Riesgo cardiaco elevado. Consenso internacional: VO2 máx estimado < 14 ml/kg/min. Considerar optimización.', color: 'red' },
    ]
  },
  {
    id: 'surgical-severity',
    name: 'Severidad y Riesgo de Sangrado',
    category: 'General',
    description: 'Clasificación de la severidad del procedimiento quirúrgico y su riesgo de sangrado asociado.',
    type: 'multi-select',
    sections: [
      {
        name: 'Severidad Quirúrgica',
        options: [
          { label: 'Menor', value: 1, description: 'Procedimientos superficiales, biopsias, cirugía menor de piel.' },
          { label: 'Intermedia', value: 2, description: 'Colecistectomía, hernias, amigdalectomía, artroscopia.' },
          { label: 'Mayor', value: 3, description: 'Reemplazos articulares, resecciones intestinales, histerectomía.' },
          { label: 'Compleja', value: 4, description: 'Neurocirugía, cirugía cardiaca, esofagectomía, trasplantes.' },
        ]
      },
      {
        name: 'Riesgo de Sangrado',
        options: [
          { label: 'Bajo', value: 1, description: 'Pérdida hemática esperada < 500 ml.' },
          { label: 'Moderado', value: 2, description: 'Pérdida hemática esperada 500 - 1500 ml.' },
          { label: 'Alto', value: 3, description: 'Pérdida hemática esperada > 1500 ml o riesgo de sangrado en sitio crítico.' },
        ]
      }
    ],
    interpretations: [
      { min: 2, max: 3, text: 'Riesgo Quirúrgico Bajo.', recommendation: 'Manejo estándar. Monitorización básica. Hemoglobina preoperatoria de rutina.', color: 'green' },
      { min: 4, max: 5, text: 'Riesgo Quirúrgico Moderado.', recommendation: 'Considerar reserva de hemoderivados. Monitorización invasiva básica (Línea arterial).', color: 'yellow' },
      { min: 6, max: 7, text: 'Riesgo Quirúrgico Alto.', recommendation: 'Reserva obligatoria de hemoderivados. Monitorización invasiva avanzada. Considerar UCI postoperatoria.', color: 'red' },
    ]
  },
  {
    id: 'apgar',
    name: 'Puntuación de Apgar',
    category: 'General',
    description: 'Evaluación rápida del recién nacido al minuto y a los 5 minutos.',
    type: 'multi-select',
    sections: [
      {
        name: 'Frecuencia Cardiaca',
        options: [
          { label: 'Ausente', value: 0 },
          { label: '< 100 lpm', value: 1 },
          { label: '≥ 100 lpm', value: 2 },
        ]
      },
      {
        name: 'Esfuerzo Respiratorio',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Lento, irregular', value: 1 },
          { label: 'Llanto fuerte', value: 2 },
        ]
      },
      {
        name: 'Tono Muscular',
        options: [
          { label: 'Flácido', value: 0 },
          { label: 'Cierta flexión', value: 1 },
          { label: 'Movimiento activo', value: 2 },
        ]
      },
      {
        name: 'Irritabilidad Refleja',
        options: [
          { label: 'Sin respuesta', value: 0 },
          { label: 'Mueca', value: 1 },
          { label: 'Llanto, tos o estornudo', value: 2 },
        ]
      },
      {
        name: 'Color',
        options: [
          { label: 'Azul, pálido', value: 0 },
          { label: 'Cuerpo rosado, extremidades azules', value: 1 },
          { label: 'Totalmente rosado', value: 2 },
        ]
      }
    ],
    interpretations: [
      { min: 7, max: 10, text: 'Recién nacido en buenas condiciones.', recommendation: 'Cuidados de rutina del recién nacido.', color: 'green' },
      { min: 4, max: 6, text: 'Depresión moderada.', recommendation: 'Estimulación, oxígeno y posible ventilación a presión positiva.', color: 'orange' },
      { min: 0, max: 3, text: 'Depresión grave. Requiere reanimación inmediata.', recommendation: 'Reanimación neonatal avanzada (RCP neonatal).', color: 'red' },
    ]
  },
  {
    id: 'ramsay',
    name: 'Escala de Ramsay',
    category: 'Neurología',
    description: 'Evaluación del nivel de sedación.',
    type: 'select',
    options: [
      { label: 'Nivel 1', value: 1, description: 'Despierto, ansioso, agitado o ambos.' },
      { label: 'Nivel 2', value: 2, description: 'Despierto, cooperador, orientado y tranquilo.' },
      { label: 'Nivel 3', value: 3, description: 'Dormido, con respuesta a órdenes verbales.' },
      { label: 'Nivel 4', value: 4, description: 'Dormido, con respuesta rápida a la percusión glabelar o estímulo auditivo fuerte.' },
      { label: 'Nivel 5', value: 5, description: 'Dormido, con respuesta lenta a la percusión glabelar o estímulo auditivo fuerte.' },
      { label: 'Nivel 6', value: 6, description: 'Dormido, sin respuesta.' },
    ],
    interpretations: [
      { min: 1, max: 1, text: 'Sedación insuficiente / Agitación.', recommendation: 'Evaluar analgesia y aumentar sedación si es necesario.', color: 'orange' },
      { min: 2, max: 3, text: 'Sedación ideal.', recommendation: 'Mantener nivel actual de sedación.', color: 'green' },
      { min: 4, max: 6, text: 'Sedación profunda.', recommendation: 'Considerar disminuir dosis de sedantes si no es el objetivo.', color: 'blue' },
    ]
  },
  {
    id: 'cha2ds2vasc',
    name: 'Puntuación CHA2DS2-VASc',
    category: 'Cardiovascular',
    description: 'Riesgo de accidente cerebrovascular en pacientes con fibrilación auricular.',
    type: 'boolean-list',
    options: [
      { label: 'Insuficiencia cardiaca congestiva / Disfunción VI', value: 1 },
      { label: 'Hipertensión (o en tratamiento antihipertensivo)', value: 1 },
      { label: 'Edad ≥ 75 años', value: 2 },
      { label: 'Diabetes mellitus', value: 1 },
      { label: 'Ictus / AIT / Tromboembolismo previo', value: 2 },
      { label: 'Enfermedad vascular (IAM previo, EVP, placa aórtica)', value: 1 },
      { label: 'Edad 65 - 74 años', value: 1 },
      { label: 'Categoría de sexo (femenino)', value: 1 },
    ],
    interpretations: [
      { min: 0, max: 0, text: 'Riesgo bajo (0% anual).', recommendation: 'No se recomienda tratamiento antitrombótico.', color: 'green' },
      { min: 1, max: 1, text: 'Riesgo bajo-moderado (1.3% anual).', recommendation: 'Considerar anticoagulación oral (preferible) o antiagregación en hombres.', color: 'yellow' },
      { min: 2, max: 9, text: 'Riesgo moderado-alto (> 2.2% anual).', recommendation: 'Se recomienda anticoagulación oral crónica.', color: 'red' },
    ]
  },
  {
    id: 'hasbled',
    name: 'Puntuación HAS-BLED',
    category: 'Cardiovascular',
    description: 'Riesgo de sangrado mayor en pacientes con fibrilación auricular.',
    type: 'boolean-list',
    options: [
      { label: 'Hipertensión (PAS > 160 mmHg)', value: 1 },
      { label: 'Función renal anormal (Creatinina > 2.26 mg/dL o diálisis)', value: 1 },
      { label: 'Función hepática anormal (Cirrosis o Bilirrubina > 2x, AST/ALT > 3x)', value: 1 },
      { label: 'Ictus (Stroke) previo', value: 1 },
      { label: 'Sangrado previo o predisposición al sangrado', value: 1 },
      { label: 'INR lábil (tiempo en rango terapéutico < 60%)', value: 1 },
      { label: 'Edad > 65 años', value: 1 },
      { label: 'Fármacos (Antiagregantes, AINEs)', value: 1 },
      { label: 'Consumo de Alcohol (≥ 8 bebidas/semana)', value: 1 },
    ],
    interpretations: [
      { min: 0, max: 2, text: 'Riesgo de sangrado bajo.', recommendation: 'Anticoagulación con precaución estándar.', color: 'green' },
      { min: 3, max: 9, text: 'Riesgo de sangrado alto.', recommendation: 'Precaución extrema. Revisión frecuente del paciente y corrección de factores reversibles.', color: 'red' },
    ]
  },
  {
    id: 'frail',
    name: 'Escala FRAIL',
    category: 'Fragilidad',
    description: 'Cuestionario de tamizaje rápido para fragilidad en el anciano.',
    type: 'boolean-list',
    options: [
      { label: 'Fatiga (¿Se siente cansado la mayor parte del tiempo?)', value: 1 },
      { label: 'Resistencia (¿Es incapaz de subir un tramo de escaleras solo?)', value: 1 },
      { label: 'Ambular (¿Es incapaz de caminar una manzana/cuadra solo?)', value: 1 },
      { label: 'Illness (¿Tiene más de 5 enfermedades crónicas?)', value: 1 },
      { label: 'Loss of weight (¿Ha perdido más del 5% de su peso en 6 meses?)', value: 1 },
    ],
    interpretations: [
      { min: 0, max: 0, text: 'Robusto (No frágil).', recommendation: 'Manejo perioperatorio estándar.', color: 'green' },
      { min: 1, max: 2, text: 'Pre-frágil.', recommendation: 'Optimización nutricional y física preoperatoria.', color: 'yellow' },
      { min: 3, max: 5, text: 'Frágil.', recommendation: 'Alto riesgo de complicaciones, delirio y estancia prolongada. Evaluación geriátrica integral.', color: 'red' },
    ]
  },
  {
    id: 'cfs',
    name: 'Escala de Fragilidad Clínica (CFS)',
    category: 'Fragilidad',
    description: 'Escala clínica de fragilidad basada en el juicio clínico y la funcionalidad.',
    type: 'select',
    options: [
      { label: '1. Muy en forma', value: 1, description: 'Activo, enérgico, motivado. Hace ejercicio regularmente.' },
      { label: '2. Sano', value: 2, description: 'Sin enfermedad activa, pero menos en forma que el grupo 1.' },
      { label: '3. Bien, con enfermedad controlada', value: 3, description: 'Síntomas controlados, pero no hace ejercicio regularmente.' },
      { label: '4. Vulnerable', value: 4, description: 'No depende de otros para ayuda diaria, pero los síntomas limitan actividades.' },
      { label: '5. Fragilidad leve', value: 5, description: 'Necesita ayuda con actividades instrumentales (finanzas, transporte, limpieza).' },
      { label: '6. Fragilidad moderada', value: 6, description: 'Necesita ayuda con actividades instrumentales y básicas (bañarse, vestirse).' },
      { label: '7. Fragilidad severa', value: 7, description: 'Completamente dependiente para el cuidado personal.' },
      { label: '8. Fragilidad muy severa', value: 8, description: 'Completamente dependiente, acercándose al final de la vida.' },
      { label: '9. Enfermedad terminal', value: 9, description: 'Expectativa de vida < 6 meses.' },
    ],
    interpretations: [
      { min: 1, max: 3, text: 'No frágil.', recommendation: 'Bajo riesgo de fragilidad.', color: 'green' },
      { min: 4, max: 4, text: 'Vulnerable.', recommendation: 'Vigilancia estrecha y optimización preoperatoria.', color: 'yellow' },
      { min: 5, max: 6, text: 'Fragilidad leve a moderada.', recommendation: 'Riesgo aumentado de eventos adversos. Plan de cuidados geriátricos.', color: 'orange' },
      { min: 7, max: 9, text: 'Fragilidad severa / Terminal.', recommendation: 'Riesgo muy alto. Considerar futilidad o cuidados paliativos según cirugía.', color: 'red' },
    ]
  },
  {
    id: 'silverman',
    name: 'Escala de Silverman-Anderson',
    category: 'Pediátrico',
    description: 'Evaluación de la dificultad respiratoria en el recién nacido.',
    type: 'multi-select',
    sections: [
      {
        name: 'Movimientos Toraco-abdominales',
        options: [
          { label: 'Rítmicos y regulares', value: 0 },
          { label: 'Tórax inmóvil, abdomen se mueve', value: 1 },
          { label: 'Disociación toraco-abdominal', value: 2 },
        ]
      },
      {
        name: 'Tiraje Intercostal',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Marcado', value: 2 },
        ]
      },
      {
        name: 'Retracción Xifoidea',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Marcada', value: 2 },
        ]
      },
      {
        name: 'Aleteo Nasal',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Marcado', value: 2 },
        ]
      },
      {
        name: 'Quejido Espiratorio',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Audible con estetoscopio', value: 1 },
          { label: 'Audible a distancia', value: 2 },
        ]
      }
    ],
    interpretations: [
      { min: 0, max: 0, text: 'Sin dificultad respiratoria.', recommendation: 'Cuidados normales del recién nacido.', color: 'green' },
      { min: 1, max: 3, text: 'Dificultad respiratoria leve.', recommendation: 'Observación y posible oxígeno suplementario.', color: 'yellow' },
      { min: 4, max: 6, text: 'Dificultad respiratoria moderada.', recommendation: 'Considerar CPAP y vigilancia estrecha.', color: 'orange' },
      { min: 7, max: 10, text: 'Dificultad respiratoria severa.', recommendation: 'Asistencia ventilatoria inmediata.', color: 'red' },
    ]
  },
  {
    id: 'capurro',
    name: 'Test de Capurro',
    category: 'Pediátrico',
    description: 'Estimación de la edad gestacional en el recién nacido.',
    type: 'multi-select',
    sections: [
      {
        name: 'Forma de la Oreja (Pabellón)',
        options: [
          { label: 'Aplanada, sin incurvación', value: 0 },
          { label: 'Borde superior parcialmente incurvado', value: 8 },
          { label: 'Borde superior totalmente incurvado', value: 16 },
          { label: 'Toda la oreja incurvada', value: 24 },
        ]
      },
      {
        name: 'Tamaño de la Glándula Mamaria',
        options: [
          { label: 'No palpable', value: 0 },
          { label: 'Palpable menor de 5 mm', value: 5 },
          { label: 'Palpable entre 5 y 10 mm', value: 10 },
          { label: 'Palpable mayor de 10 mm', value: 15 },
        ]
      },
      {
        name: 'Formación del Pezón',
        options: [
          { label: 'Apenas visible, sin areola', value: 0 },
          { label: 'Diámetro menor de 7.5 mm, areola lisa', value: 5 },
          { label: 'Diámetro mayor de 7.5 mm, areola punteada, borde no levantado', value: 10 },
          { label: 'Diámetro mayor de 7.5 mm, areola punteada, borde levantado', value: 15 },
        ]
      },
      {
        name: 'Textura de la Piel',
        options: [
          { label: 'Muy fina, gelatinosa', value: 0 },
          { label: 'Fina, lisa', value: 5 },
          { label: 'Más gruesa, discreta descamación superficial', value: 10 },
          { label: 'Gruesa, grietas superficiales, descamación de manos y pies', value: 15 },
          { label: 'Gruesa, grietas profundas apergaminadas', value: 20 },
        ]
      },
      {
        name: 'Pliegues Plantares',
        options: [
          { label: 'Sin pliegues', value: 0 },
          { label: 'Marcas mal definidas en la mitad anterior', value: 5 },
          { label: 'Marcas bien definidas en la mitad anterior, surcos en tercio anterior', value: 10 },
          { label: 'Surcos en la mitad anterior', value: 15 },
          { label: 'Surcos en más de la mitad anterior', value: 20 },
        ]
      }
    ],
    interpretations: [
      { min: 0, max: 100, text: 'Edad Gestacional = (Puntaje + 204) / 7', recommendation: 'Cálculo estimado de semanas de gestación.', color: 'blue' },
    ]
  }
];
