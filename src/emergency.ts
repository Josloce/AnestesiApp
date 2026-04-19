export interface EmergencyStep {
  id: string;
  title: string;
  description: string;
  isCritical?: boolean;
}

export interface EmergencyMedication {
  name: string;
  dose: string;
  notes: string;
}

export interface EmergencyProtocol {
  id: string;
  name: string;
  description: string;
  steps: EmergencyStep[];
  medications?: EmergencyMedication[];
}

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: 'anaphylaxis',
    name: 'Anafilaxia Intraoperatoria',
    description: 'Reacción alérgica sistémica grave de inicio rápido.',
    steps: [
      { id: '1', title: 'Suspender Agente Sospechoso', description: 'Cesar administración de fármacos, látex o coloides.', isCritical: true },
      { id: '2', title: 'Vía Aérea y Oxígeno', description: 'FiO2 100%. Intubar si hay angioedema o estridor.', isCritical: true },
      { id: '3', title: 'Adrenalina (Epinefrina)', description: 'IV: 10-20 mcg (0.1-0.2 ml de 1:10,000) si hipotensión leve. 100-500 mcg si colapso.', isCritical: true },
      { id: '4', title: 'Fluidos IV', description: 'Bolo rápido de cristaloides (20-30 ml/kg).', isCritical: true },
      { id: '5', title: 'Posición', description: 'Elevar extremidades inferiores si la hemodinamia lo permite.' }
    ],
    medications: [
      { name: 'Adrenalina', dose: '10-500 mcg IV', notes: 'Titular según respuesta. Considerar infusión 0.05-0.1 mcg/kg/min.' },
      { name: 'Hidrocortisona', dose: '200 mg IV', notes: 'Previene reacciones tardías (bifásicas).' },
      { name: 'Difenhidramina', dose: '25-50 mg IV', notes: 'Antihistamínico H1.' }
    ]
  },
  {
    id: 'mh',
    name: 'Hipertermia Maligna',
    description: 'Crisis farmacogenética desencadenada por halogenados o succinilcolina.',
    steps: [
      { id: '1', title: 'Pedir Ayuda y Dantroleno', description: 'Activar protocolo de HM inmediatamente.', isCritical: true },
      { id: '2', title: 'Suspender Desencadenantes', description: 'Cerrar vaporizadores, cambiar cal sodada si es posible, hiperventilar con O2 100% (10 L/min).', isCritical: true },
      { id: '3', title: 'Dantroleno', description: 'Dosis inicial: 2.5 mg/kg IV rápido. Repetir hasta control de síntomas.', isCritical: true },
      { id: '4', title: 'Enfriamiento', description: 'Lavar cavidades con suero frío, manta térmica fría, hielo en axilas/ingles.', isCritical: true },
      { id: '5', title: 'Tratar Hiperpotasemia', description: 'Insulina/Glucosa, Calcio, Bicarbonato si es necesario.' }
    ],
    medications: [
      { name: 'Dantroleno', dose: '2.5 mg/kg IV', notes: 'Cada vial de 20mg se diluye en 60ml de agua destilada.' },
      { name: 'Bicarbonato', dose: '1-2 mEq/kg', notes: 'Tratar acidosis metabólica severa.' }
    ]
  },
  {
    id: 'last',
    name: 'Toxicidad por Anestésicos Locales (LAST)',
    description: 'Toxicidad sistémica por inyección intravascular accidental o absorción masiva.',
    steps: [
      { id: '1', title: 'Vía Aérea', description: 'O2 100%. Evitar hipercapnia y acidosis (empeoran toxicidad).', isCritical: true },
      { id: '2', title: 'Control de Convulsiones', description: 'Benzodiacepinas (Midazolam 1-2 mg). Evitar Propofol si hay inestabilidad CV.', isCritical: true },
      { id: '3', title: 'Emulsión Lipídica 20%', description: 'Bolo 1.5 ml/kg en 1 min. Seguido de infusión 0.25 ml/kg/min.', isCritical: true },
      { id: '4', title: 'Soporte Vital Avanzado', description: 'RCP de alta calidad. Evitar Vasopresina. Dosis bajas de Adrenalina (<1 mcg/kg).', isCritical: true }
    ],
    medications: [
      { name: 'Lípidos 20%', dose: '1.5 ml/kg bolo', notes: 'Continuar infusión por al menos 10 min tras estabilidad.' },
      { name: 'Amiodarona', dose: 'Dosis estándar', notes: 'Antiarrítmico de elección. Evitar Lidocaína.' }
    ]
  },
  {
    id: 'cardiac-arrest',
    name: 'Paro Cardiaco Intraoperatorio',
    description: 'Protocolo de RCP avanzada en el quirófano.',
    steps: [
      { id: '1', title: 'Pedir Ayuda y Desfibrilador', description: 'Activar código azul. Iniciar compresiones torácicas.', isCritical: true },
      { id: '2', title: 'Vía Aérea y Oxígeno', description: 'FiO2 100%. Verificar tubo endotraqueal y capnografía.', isCritical: true },
      { id: '3', title: 'Ritmo Desfibrilable?', description: 'FV/TVSP: Choque 200J. Asistolia/AESP: Adrenalina 1mg cada 3-5 min.', isCritical: true },
      { id: '4', title: 'Causas Reversibles (6H/6T)', description: 'Hipovolemia, Hipoxia, H+, Hipo/HiperK, Hipotermia, Hipoglucemia. Tensión (neumotórax), Taponamiento, Tóxicos, Trombo (pulmón/corazón).', isCritical: true }
    ],
    medications: [
      { name: 'Adrenalina', dose: '1 mg IV', notes: 'Cada 3-5 minutos en ritmos no desfibrilables.' },
      { name: 'Amiodarona', dose: '300 mg IV', notes: 'En FV/TVSP tras el 3er choque. 150mg tras el 5to.' }
    ]
  },
  {
    id: 'difficult-airway',
    name: 'Vía Aérea Difícil (No Anticipada)',
    description: 'Algoritmo de manejo ante falla en la ventilación o intubación.',
    steps: [
      { id: '1', title: 'Optimizar Ventilación', description: 'Posición, cánula orofaríngea, ventilación a dos manos.', isCritical: true },
      { id: '2', title: 'Dispositivo Supraglótico (DSG)', description: 'Insertar máscara laríngea si falla la ventilación con mascarilla facial.', isCritical: true },
      { id: '3', title: 'Despertar al Paciente', description: 'Si la ventilación es posible pero la intubación falló, considerar despertar.', isCritical: true },
      { id: '4', title: 'Acceso Infraglótico', description: 'Situación "No Intubo, No Ventilo": Cricotiroidotomía de emergencia.', isCritical: true }
    ],
    medications: [
      { name: 'Sugammadex', dose: '16 mg/kg IV', notes: 'Reversión inmediata de Rocuronio en caso de rescate.' }
    ]
  },
  {
    id: 'laryngospasm',
    name: 'Laringoespasmo',
    description: 'Cierre involuntario de las cuerdas vocales que impide la ventilación.',
    steps: [
      { id: '1', title: 'Pedir Ayuda', description: 'Declarar emergencia, suspender estímulo quirúrgico.', isCritical: true },
      { id: '2', title: 'Oxígeno 100%', description: 'Ventilación con presión positiva continua (CPAP) con mascarilla facial.', isCritical: true },
      { id: '3', title: 'Maniobra de Larson', description: 'Presión firme en la muesca laringoespasmo (detrás del lóbulo de la oreja).', isCritical: true },
      { id: '4', title: 'Profundizar Anestesia', description: 'Bolo de Propofol (0.5 - 1 mg/kg) si hay acceso IV.' },
      { id: '5', title: 'Relajación Muscular', description: 'Succinilcolina (0.1 - 0.5 mg/kg IV o 2-4 mg/kg IM) si persiste.', isCritical: true },
      { id: '6', title: 'Intubación', description: 'Si no se resuelve o hay hipoxia severa persistente.' }
    ],
    medications: [
      { name: 'Propofol', dose: '0.5 - 1 mg/kg IV', notes: 'Para profundizar plano anestésico.' },
      { name: 'Succinilcolina', dose: '0.1 - 0.5 mg/kg IV', notes: 'Dosis baja para romper el espasmo sin parálisis total prolongada.' }
    ]
  },
  {
    id: 'bronchospasm',
    name: 'Broncoespasmo Agudo',
    description: 'Aumento súbito de la resistencia de la vía aérea con sibilancias y aumento de presiones.',
    steps: [
      { id: '1', title: 'FiO2 100% y Profundizar Anestesia', description: 'Aumentar halogenado o dar bolo de Propofol/Ketamina.', isCritical: true },
      { id: '2', title: 'Beta-2 Agonistas', description: 'Salbutamol 8-10 puffs por el tubo endotraqueal.', isCritical: true },
      { id: '3', title: 'Descartar Causas Mecánicas', description: 'Verificar posición del tubo, acodamientos o secreciones.', isCritical: true },
      { id: '4', title: 'Adrenalina', description: 'En casos refractarios: 10-20 mcg IV. Considerar infusión.', isCritical: true }
    ],
    medications: [
      { name: 'Salbutamol', dose: '8-10 puffs', notes: 'Repetir cada 15-30 min si es necesario.' },
      { name: 'Hidrocortisona', dose: '200 mg IV', notes: 'Efecto tardío, pero útil para prevenir recurrencia.' },
      { name: 'Ketamina', dose: '0.5-1 mg/kg IV', notes: 'Potente broncodilatador.' }
    ]
  },
  {
    id: 'air-embolism',
    name: 'Embolia Gaseosa Venosa',
    description: 'Entrada de aire al sistema venoso, común en neurocirugía o cirugía laparoscópica.',
    steps: [
      { id: '1', title: 'Avisar al Cirujano', description: 'Inundar el campo quirúrgico con suero salino. Cera ósea si aplica.', isCritical: true },
      { id: '2', title: 'Posición de Durant', description: 'Trendelenburg y decúbito lateral izquierdo.', isCritical: true },
      { id: '3', title: 'FiO2 100% y Suspender N2O', description: 'El N2O aumenta el tamaño de las burbujas.', isCritical: true },
      { id: '4', title: 'Aspiración por CVC', description: 'Si hay un catéter venoso central, intentar aspirar el aire de la aurícula derecha.', isCritical: true }
    ],
    medications: [
      { name: 'Fluidos IV', dose: 'Bolo rápido', notes: 'Aumentar la presión venosa central para prevenir más entrada de aire.' }
    ]
  },
  {
    id: 'tension-pneumothorax',
    name: 'Neumotórax a Tensión',
    description: 'Colapso pulmonar con compromiso hemodinámico por aire a presión en el espacio pleural.',
    steps: [
      { id: '1', title: 'Descompresión Inmediata', description: 'Aguja en 2do espacio intercostal, línea medioclavicular.', isCritical: true },
      { id: '2', title: 'FiO2 100%', description: 'Asegurar oxigenación máxima.', isCritical: true },
      { id: '3', title: 'Tubo de Tórax', description: 'Colocación definitiva tras la descompresión con aguja.', isCritical: true },
      { id: '4', title: 'Soporte Hemodinámico', description: 'Fluidos y vasopresores si persiste el choque tras descompresión.', isCritical: true }
    ],
    medications: [
      { name: 'Lidocaína 1%', dose: 'Local', notes: 'Para la inserción del tubo de tórax si el paciente está despierto.' }
    ]
  },
  {
    id: 'massive-hemorrhage',
    name: 'Hemorragia Masiva',
    description: 'Protocolo de transfusión masiva ante sangrado incontrolado.',
    steps: [
      { id: '1', title: 'Activar Protocolo de Transfusión Masiva', description: 'Pedir hemoderivados (1:1:1): Glóbulos rojos, Plasma, Plaquetas.', isCritical: true },
      { id: '2', title: 'Control de Hemostasia', description: 'Presión directa, torniquetes, ácido tranexámico.', isCritical: true },
      { id: '3', title: 'Evitar Tríada de la Muerte', description: 'Mantener normotermia, corregir acidosis y tratar hipocalcemia.', isCritical: true },
      { id: '4', title: 'Monitorización Coagulación', description: 'Pruebas viscoelásticas (ROTEM/TEG) o convencionales (TP/TPT/Fib).', isCritical: true }
    ],
    medications: [
      { name: 'Ácido Tranexámico', dose: '1 g IV bolo', notes: 'Seguido de infusión de 1g en 8h.' },
      { name: 'Cloruro de Calcio', dose: '1 g IV', notes: 'Mantener Ca iónico > 1.1 mmol/L.' },
      { name: 'Fibrinógeno', dose: '2-4 g IV', notes: 'Si el nivel es < 150-200 mg/dL.' }
    ]
  }
];
