/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalculatorResult {
  label: string;
  value: string;
  unit: string;
  interpretation?: string;
  color?: 'green' | 'yellow' | 'orange' | 'red' | 'blue';
}

export interface CalculatorInput {
  id: string;
  label: string;
  unit: string;
  type: 'number' | 'select';
  options?: { label: string; value: any }[];
  defaultValue?: any;
}

export interface CalculatorDef {
  id: string;
  name: string;
  category: 'Antropometría' | 'Líquidos y Renal' | 'Respiratorio' | 'Cardiovascular' | 'Medicamentos' | 'Otros';
  description: string;
  inputs: CalculatorInput[];
  calculate: (inputs: Record<string, any>) => CalculatorResult;
}

export const calculateBMI = (weight: number, heightCm: number): CalculatorResult => {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  
  let interpretation = '';
  let color: any = 'blue';
  if (bmi < 18.5) { interpretation = 'Bajo peso'; color = 'yellow'; }
  else if (bmi < 25) { interpretation = 'Normal'; color = 'green'; }
  else if (bmi < 30) { interpretation = 'Sobrepeso'; color = 'yellow'; }
  else if (bmi < 35) { interpretation = 'Obesidad Clase I'; color = 'orange'; }
  else if (bmi < 40) { interpretation = 'Obesidad Clase II'; color = 'red'; }
  else { interpretation = 'Obesidad Clase III (Mórbida)'; color = 'red'; }

  return {
    label: 'IMC',
    value: bmi.toFixed(1),
    unit: 'kg/m²',
    interpretation,
    color
  };
};

export const calculateIdealWeight = (heightCm: number, gender: 'male' | 'female'): CalculatorResult => {
  const heightIn = heightCm / 2.54;
  const inchesOver5ft = Math.max(0, heightIn - 60);
  
  let weightKg = 0;
  if (gender === 'male') {
    weightKg = 50 + (2.3 * inchesOver5ft);
  } else {
    weightKg = 45.5 + (2.3 * inchesOver5ft);
  }

  return {
    label: 'Peso Ideal (Devine)',
    value: weightKg.toFixed(1),
    unit: 'kg'
  };
};

export const calculateAdjustedWeight = (actualWeight: number, idealWeight: number): CalculatorResult => {
  const adjustedWeight = idealWeight + 0.4 * (actualWeight - idealWeight);
  return {
    label: 'Peso Ajustado',
    value: adjustedWeight.toFixed(1),
    unit: 'kg'
  };
};

export const calculateBSA = (weight: number, heightCm: number): CalculatorResult => {
  const bsa = Math.sqrt((heightCm * weight) / 3600);
  return {
    label: 'Superficie Corporal (Mosteller)',
    value: bsa.toFixed(2),
    unit: 'm²'
  };
};

export const calculateWaterDeficit = (weight: number, currentNa: number, targetNa: number, gender: 'male' | 'female'): CalculatorResult => {
  const totalBodyWaterFactor = gender === 'male' ? 0.6 : 0.5;
  const deficit = totalBodyWaterFactor * weight * ((currentNa / targetNa) - 1);
  return {
    label: 'Déficit de Agua Libre',
    value: Math.max(0, deficit).toFixed(2),
    unit: 'L'
  };
};

export const calculateMaintenanceFluids = (weight: number): CalculatorResult => {
  let rate = 0;
  if (weight <= 10) {
    rate = weight * 4;
  } else if (weight <= 20) {
    rate = 40 + (weight - 10) * 2;
  } else {
    rate = 60 + (weight - 20) * 1;
  }
  
  return {
    label: 'Líquidos de Mantenimiento (4-2-1)',
    value: rate.toFixed(0),
    unit: 'ml/h'
  };
};

export const calculateEBV = (weight: number, patientType: string): CalculatorResult => {
  const factors: Record<string, number> = {
    premature: 95,
    neonate: 85,
    infant: 80,
    adultMale: 75,
    adultFemale: 65,
    obese: 60
  };
  
  const ebv = weight * (factors[patientType] || 70);
  return {
    label: 'Volumen Sanguíneo Estimado',
    value: ebv.toFixed(0),
    unit: 'ml'
  };
};

export const calculateCrCl = (age: number, weight: number, creatinine: number, gender: 'male' | 'female'): CalculatorResult => {
  let crcl = ((140 - age) * weight) / (72 * creatinine);
  if (gender === 'female') crcl *= 0.85;
  
  return {
    label: 'Aclaramiento de Creatinina (Cockcroft-Gault)',
    value: crcl.toFixed(1),
    unit: 'ml/min',
    interpretation: crcl < 60 ? 'Disfunción renal' : 'Normal',
    color: crcl < 60 ? 'orange' : 'green'
  };
};

export const calculateMDRD = (age: number, creatinine: number, gender: 'male' | 'female'): CalculatorResult => {
  let gfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
  if (gender === 'female') gfr *= 0.742;
  
  const kdigo = getKDIGOCategory(gfr);
  
  return {
    label: 'TFG (MDRD)',
    value: gfr.toFixed(1),
    unit: 'ml/min/1.73m²',
    interpretation: kdigo.interpretation,
    color: kdigo.color
  };
};

export const calculateCKDEPI = (age: number, creatinine: number, gender: 'male' | 'female'): CalculatorResult => {
  const kappa = gender === 'female' ? 0.7 : 0.9;
  const alpha = gender === 'female' ? -0.241 : -0.302;
  const genderFactor = gender === 'female' ? 1.012 : 1.0;
  
  const gfr = 142 * 
    Math.pow(Math.min(creatinine / kappa, 1), alpha) * 
    Math.pow(Math.max(creatinine / kappa, 1), -1.200) * 
    Math.pow(0.9938, age) * 
    genderFactor;
    
  const kdigo = getKDIGOCategory(gfr);
    
  return {
    label: 'TFG (CKD-EPI 2021)',
    value: gfr.toFixed(1),
    unit: 'ml/min/1.73m²',
    interpretation: kdigo.interpretation,
    color: kdigo.color
  };
};

const getKDIGOCategory = (gfr: number): { interpretation: string; color: 'green' | 'yellow' | 'orange' | 'red' } => {
  if (gfr >= 90) return { interpretation: 'G1: Normal o alto (≥90)', color: 'green' };
  if (gfr >= 60) return { interpretation: 'G2: Ligeramente disminuido (60-89)', color: 'yellow' };
  if (gfr >= 45) return { interpretation: 'G3a: Ligera a moderadamente disminuido (45-59)', color: 'orange' };
  if (gfr >= 30) return { interpretation: 'G3b: Moderada a severamente disminuido (30-44)', color: 'orange' };
  if (gfr >= 15) return { interpretation: 'G4: Severamente disminuido (15-29)', color: 'red' };
  return { interpretation: 'G5: Fallo renal (<15)', color: 'red' };
};

export const calculatePaO2FiO2 = (pao2: number, fio2: number): CalculatorResult => {
  const ratio = pao2 / fio2;
  let interpretation = '';
  let color: any = 'blue';
  if (ratio < 100) { interpretation = 'SDRA Grave'; color = 'red'; }
  else if (ratio < 200) { interpretation = 'SDRA Moderado'; color = 'orange'; }
  else if (ratio < 300) { interpretation = 'SDRA Leve'; color = 'yellow'; }
  else { interpretation = 'Normal'; color = 'green'; }

  return {
    label: 'Índice de Kirby (PaO2/FiO2)',
    value: ratio.toFixed(0),
    unit: 'mmHg',
    interpretation,
    color
  };
};

export const calculateAaGradient = (pao2: number, paco2: number, fio2: number, age: number): CalculatorResult => {
  const paO2_alveolar = (fio2 * 713) - (paco2 / 0.8);
  const gradient = paO2_alveolar - pao2;
  const expectedGradient = (age / 4) + 4;

  return {
    label: 'Gradiente Alvéolo-Arterial (A-a)',
    value: gradient.toFixed(1),
    unit: 'mmHg',
    interpretation: gradient > expectedGradient ? 'Anormal' : 'Normal para la edad',
    color: gradient > expectedGradient ? 'orange' : 'green'
  };
};

export const calculateCorrectedCalcium = (calcium: number, albumin: number): CalculatorResult => {
  const corrected = calcium + 0.8 * (4.0 - albumin);
  return {
    label: 'Calcio Corregido',
    value: corrected.toFixed(1),
    unit: 'mg/dL'
  };
};

export const calculateAnionGap = (na: number, cl: number, hco3: number): CalculatorResult => {
  const gap = na - (cl + hco3);
  return {
    label: 'Anion Gap',
    value: gap.toFixed(1),
    unit: 'mEq/L',
    interpretation: gap > 12 ? 'Elevado' : 'Normal',
    color: gap > 12 ? 'orange' : 'green'
  };
};

export const calculateFENa = (uNa: number, pNa: number, uCr: number, pCr: number): CalculatorResult => {
  const fena = (uNa * pCr) / (pNa * uCr) * 100;
  let interpretation = '';
  let color: any = 'blue';
  if (fena < 1) { interpretation = 'Prerrenal'; color = 'yellow'; }
  else if (fena > 2) { interpretation = 'NTA (Necrosis Tubular Aguda)'; color = 'red'; }
  else { interpretation = 'Indeterminado'; color = 'orange'; }

  return {
    label: 'FENa',
    value: fena.toFixed(2),
    unit: '%',
    interpretation,
    color
  };
};

export const calculateOsmolality = (na: number, glucose: number, bun: number): CalculatorResult => {
  const osm = (2 * na) + (glucose / 18) + (bun / 2.8);
  return {
    label: 'Osmolaridad Plasmática',
    value: osm.toFixed(1),
    unit: 'mOsm/kg',
    interpretation: osm > 295 ? 'Hiperosmolar' : osm < 275 ? 'Hipoosmolar' : 'Normal',
    color: (osm > 295 || osm < 275) ? 'orange' : 'green'
  };
};

export const calculateMAP = (sbp: number, dbp: number): CalculatorResult => {
  const map = (sbp + 2 * dbp) / 3;
  return {
    label: 'PAM',
    value: map.toFixed(0),
    unit: 'mmHg',
    interpretation: map < 65 ? 'Hipotensión' : 'Normal',
    color: map < 65 ? 'red' : 'green'
  };
};

export const calculateCPP = (map: number, icp: number): CalculatorResult => {
  const cpp = map - icp;
  let interpretation = '';
  let color: any = 'blue';
  if (cpp < 50) { interpretation = 'Isquemia cerebral crítica'; color = 'red'; }
  else if (cpp < 60) { interpretation = 'Baja (Riesgo de isquemia)'; color = 'orange'; }
  else if (cpp <= 70) { interpretation = 'Normal / Objetivo'; color = 'green'; }
  else { interpretation = 'Normal / Alta'; color = 'green'; }

  return {
    label: 'Presión de Perfusión Cerebral (PPC)',
    value: cpp.toFixed(0),
    unit: 'mmHg',
    interpretation,
    color
  };
};

export const calculateShockIndex = (hr: number, sbp: number): CalculatorResult => {
  const si = hr / sbp;
  return {
    label: 'Índice de Choque',
    value: si.toFixed(2),
    unit: 'lat/min / mmHg',
    interpretation: si > 0.9 ? 'Choque probable' : 'Normal',
    color: si > 0.9 ? 'red' : 'green'
  };
};

export const calculateCaO2 = (hb: number, sao2: number, pao2: number): CalculatorResult => {
  const cao2 = (hb * 1.34 * (sao2 / 100)) + (pao2 * 0.003);
  return {
    label: 'CaO2',
    value: cao2.toFixed(1),
    unit: 'ml/dL'
  };
};

export const calculateBicarbonateDeficit = (weight: number, targetHCO3: number, currentHCO3: number): CalculatorResult => {
  const deficit = 0.4 * weight * (targetHCO3 - currentHCO3);
  return {
    label: 'Déficit de Bicarbonato',
    value: Math.max(0, deficit).toFixed(1),
    unit: 'mEq'
  };
};

export const calculateABL = (weight: number, patientType: string, hbi: number, hbf: number): CalculatorResult => {
  const factors: Record<string, number> = {
    premature: 95,
    neonate: 85,
    infant: 80,
    adultMale: 75,
    adultFemale: 65,
    obese: 60
  };
  
  const ebv = weight * (factors[patientType] || 70);
  const abl = (ebv * (hbi - hbf)) / hbi;
  
  return {
    label: 'Pérdida Sanguínea Permisible (ABL)',
    value: Math.max(0, abl).toFixed(0),
    unit: 'ml',
    interpretation: `EBV: ${ebv.toFixed(0)} ml. Basado en Hb/Hct inicial de ${hbi} y objetivo de ${hbf}.`,
    color: abl > 0 ? 'blue' : 'red'
  };
};

export const calculatePPOFEV1 = (preopFEV1: number, segmentsRemoved: number): CalculatorResult => {
  const ppoFEV1 = preopFEV1 * (1 - (segmentsRemoved / 19));
  return {
    label: 'ppoFEV1 (Post-Lobectomía)',
    value: ppoFEV1.toFixed(2),
    unit: 'L',
    interpretation: ppoFEV1 < 0.8 ? 'Riesgo alto (ppoFEV1 < 0.8L)' : 'Riesgo aceptable',
    color: ppoFEV1 < 0.8 ? 'red' : 'green'
  };
};

export const calculatePPOLungVolume = (preopVolume: number, segmentsRemoved: number, label: string): CalculatorResult => {
  const ppoVolume = preopVolume * (1 - (segmentsRemoved / 19));
  return {
    label: `ppo${label} (Post-Lobectomía)`,
    value: ppoVolume.toFixed(2),
    unit: 'L',
    interpretation: `Volumen estimado tras remover ${segmentsRemoved} segmentos de 19 totales.`,
    color: 'blue'
  };
};

export const calculateParkland = (weight: number, tbsa: number): CalculatorResult => {
  const totalFluids = 4 * weight * tbsa;
  return {
    label: 'Fórmula de Parkland (24h)',
    value: totalFluids.toFixed(0),
    unit: 'ml',
    interpretation: `8h: ${(totalFluids/2).toFixed(0)}ml, 16h: ${(totalFluids/2).toFixed(0)}ml`,
    color: 'blue'
  };
};

export const calculateQTc = (hr: number, qt: number): CalculatorResult => {
  const rr = 60 / hr;
  const qtc = qt / Math.sqrt(rr);
  return {
    label: 'QT Corregido (Bazett)',
    value: qtc.toFixed(0),
    unit: 'ms',
    interpretation: qtc > 440 ? 'Prolongado' : 'Normal',
    color: qtc > 440 ? 'red' : 'green'
  };
};

export const calculateETTSize = (age: number): CalculatorResult => {
  const uncuffed = (age / 4) + 4;
  const cuffed = (age / 4) + 3.5;
  return {
    label: 'Tubo Endotraqueal (Pediátrico)',
    value: `${uncuffed.toFixed(1)} / ${cuffed.toFixed(1)}`,
    unit: 'mm ID',
    interpretation: `Sin manguito: ${uncuffed.toFixed(1)}, Con manguito: ${cuffed.toFixed(1)}`,
    color: 'blue'
  };
};

export const calculateCorrectedSodium = (na: number, glucose: number): CalculatorResult => {
  const corrected = na + 0.016 * (glucose - 100);
  return {
    label: 'Sodio Corregido (Hiperglucemia)',
    value: corrected.toFixed(1),
    unit: 'mEq/L',
    interpretation: 'Sodio real estimado en presencia de hiperglucemia.',
    color: 'blue'
  };
};

export const calculateAlveolarGas = (fio2: number, paco2: number, patm: number = 760, ph2o: number = 47): CalculatorResult => {
  const pao2 = (fio2 * (patm - ph2o)) - (paco2 / 0.8);
  return {
    label: 'Presión Alveolar de Oxígeno (PAO2)',
    value: pao2.toFixed(1),
    unit: 'mmHg',
    interpretation: 'Presión teórica de O2 en el alvéolo.',
    color: 'blue'
  };
};

export const calculateOxygenationIndex = (map: number, fio2: number, pao2: number): CalculatorResult => {
  const oi = (map * fio2 * 100) / pao2;
  let interpretation = '';
  let color: any = 'blue';
  if (oi > 40) { interpretation = 'Mortalidad muy alta (>80%)'; color = 'red'; }
  else if (oi > 25) { interpretation = 'Falla respiratoria severa'; color = 'orange'; }
  else if (oi > 15) { interpretation = 'Falla respiratoria moderada'; color = 'yellow'; }
  else { interpretation = 'Normal / Leve'; color = 'green'; }

  return {
    label: 'Índice de Oxigenación (OI)',
    value: oi.toFixed(1),
    unit: '',
    interpretation,
    color
  };
};

export const calculateDeadSpace = (paco2: number, peco2: number): CalculatorResult => {
  const vd_vt = (paco2 - peco2) / paco2;
  return {
    label: 'Espacio Muerto (Bohr/Enghoff)',
    value: vd_vt.toFixed(2),
    unit: 'Vd/Vt',
    interpretation: vd_vt > 0.3 ? 'Aumentado' : 'Normal',
    color: vd_vt > 0.3 ? 'orange' : 'green'
  };
};

export const calculateFickCO = (vo2: number, hb: number, sao2: number, svo2: number, pao2: number = 90, pvo2: number = 40): CalculatorResult => {
  const cao2 = (hb * 1.34 * (sao2 / 100)) + (pao2 * 0.003);
  const cvo2 = (hb * 1.34 * (svo2 / 100)) + (pvo2 * 0.003);
  const diff = cao2 - cvo2;
  
  if (diff <= 0) {
    return {
      label: 'Gasto Cardíaco (Fick)',
      value: '---',
      unit: 'L/min',
      interpretation: 'Error: Diferencia arteriovenosa inválida (CaO2 <= CvO2)',
      color: 'red'
    };
  }

  const co = vo2 / (diff * 10);
  
  return {
    label: 'Gasto Cardíaco (Fick)',
    value: co.toFixed(2),
    unit: 'L/min',
    interpretation: co < 4 ? 'Bajo' : co > 8 ? 'Alto' : 'Normal',
    color: co < 4 ? 'orange' : co > 8 ? 'yellow' : 'green'
  };
};

export const calculateMAC = (age: number, mode: 'pure' | 'balanced', desiredMAC: number = 1): CalculatorResult => {
  // Reference MAC for Sevoflurane at 40 years old is 1.8%
  const mac40 = 1.8;
  const name = 'Sevoflurano';

  // Mapleson's formula: MAC_age = MAC_40 * 10^(0.00269 * (40 - age))
  const adjustedMAC = mac40 * Math.pow(10, 0.00269 * (40 - age));
  
  // Reduction factor for balanced anesthesia with Remifentanil (approx 50% reduction)
  const reductionFactor = mode === 'balanced' ? 0.5 : 1.0;
  
  const finalValue = adjustedMAC * reductionFactor * desiredMAC;

  return {
    label: `CAM Corregida (${name})`,
    value: finalValue.toFixed(2),
    unit: '%',
    interpretation: `${mode === 'balanced' ? 'Anestesia Balanceada (con Remifentanilo): ' : 'Anestesia Inhalada Pura: '} A los ${age} años, 1 CAM es ≈ ${(adjustedMAC * reductionFactor).toFixed(2)}%. Calculado para ${desiredMAC} CAM.`,
    color: 'blue'
  };
};

export const CALCULATORS: CalculatorDef[] = [
  {
    id: 'corrected-sodium',
    name: 'Sodio Corregido (Glucosa)',
    category: 'Líquidos y Renal',
    description: 'Corrige el sodio plasmático en presencia de hiperglucemia.',
    inputs: [
      { id: 'na', label: 'Sodio Medido', unit: 'mEq/L', type: 'number', defaultValue: 140 },
      { id: 'glucose', label: 'Glucosa', unit: 'mg/dL', type: 'number', defaultValue: 200 }
    ],
    calculate: (vals) => calculateCorrectedSodium(Number(vals.na), Number(vals.glucose))
  },
  {
    id: 'alveolar-gas',
    name: 'Ecuación del Gas Alveolar',
    category: 'Respiratorio',
    description: 'Calcula la presión alveolar de oxígeno (PAO2).',
    inputs: [
      { id: 'fio2', label: 'FiO2', unit: 'fracción', type: 'number', defaultValue: 0.21 },
      { id: 'paco2', label: 'PaCO2', unit: 'mmHg', type: 'number', defaultValue: 40 }
    ],
    calculate: (vals) => calculateAlveolarGas(Number(vals.fio2), Number(vals.paco2))
  },
  {
    id: 'oxygenation-index',
    name: 'Índice de Oxigenación (OI)',
    category: 'Respiratorio',
    description: 'Utilizado principalmente en pediatría para evaluar severidad de falla respiratoria.',
    inputs: [
      { id: 'map', label: 'Presión Media Vía Aérea', unit: 'cmH2O', type: 'number', defaultValue: 15 },
      { id: 'fio2', label: 'FiO2', unit: 'fracción', type: 'number', defaultValue: 0.6 },
      { id: 'pao2', label: 'PaO2', unit: 'mmHg', type: 'number', defaultValue: 80 }
    ],
    calculate: (vals) => calculateOxygenationIndex(Number(vals.map), Number(vals.fio2), Number(vals.pao2))
  },
  {
    id: 'dead-space',
    name: 'Espacio Muerto (Vd/Vt)',
    category: 'Respiratorio',
    description: 'Fracción del volumen corriente que no participa en el intercambio gaseoso.',
    inputs: [
      { id: 'paco2', label: 'PaCO2', unit: 'mmHg', type: 'number', defaultValue: 40 },
      { id: 'peco2', label: 'PeCO2 (Espirado)', unit: 'mmHg', type: 'number', defaultValue: 30 }
    ],
    calculate: (vals) => calculateDeadSpace(Number(vals.paco2), Number(vals.peco2))
  },
  {
    id: 'bmi',
    name: 'Índice de Masa Corporal (IMC)',
    category: 'Antropometría',
    description: 'Calcula el IMC y clasifica el estado nutricional.',
    inputs: [
      { id: 'weight', label: 'Peso', unit: 'kg', type: 'number', defaultValue: 70 },
      { id: 'height', label: 'Talla', unit: 'cm', type: 'number', defaultValue: 170 }
    ],
    calculate: (vals) => calculateBMI(Number(vals.weight), Number(vals.height))
  },
  {
    id: 'ideal-weight',
    name: 'Peso Ideal y Ajustado',
    category: 'Antropometría',
    description: 'Calcula el peso ideal (Devine) y el peso ajustado para obesos.',
    inputs: [
      { id: 'height', label: 'Talla', unit: 'cm', type: 'number', defaultValue: 170 },
      { id: 'weight', label: 'Peso Actual', unit: 'kg', type: 'number', defaultValue: 70 },
      { id: 'gender', label: 'Género', unit: '', type: 'select', options: [{label: 'Masculino', value: 'male'}, {label: 'Femenino', value: 'female'}], defaultValue: 'male' }
    ],
    calculate: (vals) => {
      const ideal = calculateIdealWeight(Number(vals.height), vals.gender as any);
      const adjusted = calculateAdjustedWeight(Number(vals.weight), Number(ideal.value));
      return {
        label: 'Peso Ideal / Ajustado',
        value: `${ideal.value} / ${adjusted.value}`,
        unit: 'kg',
        interpretation: `Ideal: ${ideal.value} kg, Ajustado: ${adjusted.value} kg`
      };
    }
  },
  {
    id: 'bsa',
    name: 'Superficie Corporal (BSA)',
    category: 'Antropometría',
    description: 'Calcula el área de superficie corporal usando la fórmula de Mosteller.',
    inputs: [
      { id: 'weight', label: 'Peso', unit: 'kg', type: 'number', defaultValue: 70 },
      { id: 'height', label: 'Talla', unit: 'cm', type: 'number', defaultValue: 170 }
    ],
    calculate: (vals) => calculateBSA(Number(vals.weight), Number(vals.height))
  },
  {
    id: 'crcl',
    name: 'Cockcroft-Gault (CrCl)',
    category: 'Líquidos y Renal',
    description: 'Estimación del aclaramiento de creatinina.',
    inputs: [
      { id: 'age', label: 'Edad', unit: 'años', type: 'number', defaultValue: 40 },
      { id: 'weight', label: 'Peso', unit: 'kg', type: 'number', defaultValue: 70 },
      { id: 'creatinine', label: 'Creatinina', unit: 'mg/dL', type: 'number', defaultValue: 1.0 },
      { id: 'gender', label: 'Género', unit: '', type: 'select', options: [{label: 'Masculino', value: 'male'}, {label: 'Femenino', value: 'female'}], defaultValue: 'male' }
    ],
    calculate: (vals) => calculateCrCl(Number(vals.age), Number(vals.weight), Number(vals.creatinine), vals.gender as any)
  },
  {
    id: 'mdrd',
    name: 'TFG por MDRD',
    category: 'Líquidos y Renal',
    description: 'Tasa de Filtración Glomerular mediante fórmula MDRD-4.',
    inputs: [
      { id: 'age', label: 'Edad', unit: 'años', type: 'number', defaultValue: 40 },
      { id: 'creatinine', label: 'Creatinina', unit: 'mg/dL', type: 'number', defaultValue: 1.0 },
      { id: 'gender', label: 'Género', unit: '', type: 'select', options: [{label: 'Masculino', value: 'male'}, {label: 'Femenino', value: 'female'}], defaultValue: 'male' }
    ],
    calculate: (vals) => calculateMDRD(Number(vals.age), Number(vals.creatinine), vals.gender as any)
  },
  {
    id: 'ckdepi',
    name: 'TFG por CKD-EPI (2021)',
    category: 'Líquidos y Renal',
    description: 'TFG mediante fórmula CKD-EPI 2021 (sin factor de raza).',
    inputs: [
      { id: 'age', label: 'Edad', unit: 'años', type: 'number', defaultValue: 40 },
      { id: 'creatinine', label: 'Creatinina', unit: 'mg/dL', type: 'number', defaultValue: 1.0 },
      { id: 'gender', label: 'Género', unit: '', type: 'select', options: [{label: 'Masculino', value: 'male'}, {label: 'Femenino', value: 'female'}], defaultValue: 'male' }
    ],
    calculate: (vals) => calculateCKDEPI(Number(vals.age), Number(vals.creatinine), vals.gender as any)
  },
  {
    id: 'parkland',
    name: 'Fórmula de Parkland',
    category: 'Líquidos y Renal',
    description: 'Reanimación hídrica en pacientes quemados.',
    inputs: [
      { id: 'weight', label: 'Peso', unit: 'kg', type: 'number', defaultValue: 70 },
      { id: 'tbsa', label: '% SCQ', unit: '%', type: 'number', defaultValue: 20 }
    ],
    calculate: (vals) => calculateParkland(Number(vals.weight), Number(vals.tbsa))
  },
  {
    id: 'qtc',
    name: 'QT Corregido (Bazett)',
    category: 'Cardiovascular',
    description: 'Calcula el QTc a partir del QT y la frecuencia cardiaca.',
    inputs: [
      { id: 'hr', label: 'FC', unit: 'lpm', type: 'number', defaultValue: 80 },
      { id: 'qt', label: 'QT', unit: 'ms', type: 'number', defaultValue: 400 }
    ],
    calculate: (vals) => calculateQTc(Number(vals.hr), Number(vals.qt))
  },
  {
    id: 'ett-size',
    name: 'Tubo Endotraqueal (Ped)',
    category: 'Otros',
    description: 'Estimación del tamaño del TET en pediatría (>1 año).',
    inputs: [
      { id: 'age', label: 'Edad', unit: 'años', type: 'number', defaultValue: 5 }
    ],
    calculate: (vals) => calculateETTSize(Number(vals.age))
  },
  {
    id: 'fena',
    name: 'FENa',
    category: 'Líquidos y Renal',
    description: 'Excreción fraccional de sodio para diferenciar falla renal prerrenal de NTA.',
    inputs: [
      { id: 'uNa', label: 'Sodio Urinario', unit: 'mEq/L', type: 'number', defaultValue: 20 },
      { id: 'pNa', label: 'Sodio Plasmático', unit: 'mEq/L', type: 'number', defaultValue: 140 },
      { id: 'uCr', label: 'Creatinina Urinaria', unit: 'mg/dL', type: 'number', defaultValue: 100 },
      { id: 'pCr', label: 'Creatinina Plasmática', unit: 'mg/dL', type: 'number', defaultValue: 1.0 }
    ],
    calculate: (vals) => calculateFENa(Number(vals.uNa), Number(vals.pNa), Number(vals.uCr), Number(vals.pCr))
  },
  {
    id: 'kirby',
    name: 'Índice de Kirby (PaO2/FiO2)',
    category: 'Respiratorio',
    description: 'Evaluación del intercambio gaseoso y severidad del SDRA.',
    inputs: [
      { id: 'pao2', label: 'PaO2', unit: 'mmHg', type: 'number', defaultValue: 90 },
      { id: 'fio2', label: 'FiO2', unit: 'fracción', type: 'number', defaultValue: 0.21 }
    ],
    calculate: (vals) => calculatePaO2FiO2(Number(vals.pao2), Number(vals.fio2))
  },
  {
    id: 'map',
    name: 'Presión Arterial Media (PAM)',
    category: 'Cardiovascular',
    description: 'Calcula la PAM a partir de la presión sistólica y diastólica.',
    inputs: [
      { id: 'sbp', label: 'TAS', unit: 'mmHg', type: 'number', defaultValue: 120 },
      { id: 'dbp', label: 'TAD', unit: 'mmHg', type: 'number', defaultValue: 80 }
    ],
    calculate: (vals) => calculateMAP(Number(vals.sbp), Number(vals.dbp))
  },
  {
    id: 'shock-index',
    name: 'Índice de Choque',
    category: 'Cardiovascular',
    description: 'Relación entre frecuencia cardiaca y presión sistólica.',
    inputs: [
      { id: 'hr', label: 'FC', unit: 'lpm', type: 'number', defaultValue: 80 },
      { id: 'sbp', label: 'TAS', unit: 'mmHg', type: 'number', defaultValue: 120 }
    ],
    calculate: (vals) => calculateShockIndex(Number(vals.hr), Number(vals.sbp))
  },
  {
    id: 'cpp',
    name: 'Presión de Perfusión Cerebral (PPC)',
    category: 'Cardiovascular',
    description: 'Calcula la PPC a partir de la PAM y la PIC.',
    inputs: [
      { id: 'sbp', label: 'TAS', unit: 'mmHg', type: 'number', defaultValue: 120 },
      { id: 'dbp', label: 'TAD', unit: 'mmHg', type: 'number', defaultValue: 80 },
      { id: 'icp', label: 'PIC (Presión Intracraneal)', unit: 'mmHg', type: 'number', defaultValue: 10 }
    ],
    calculate: (vals) => {
      const map = (Number(vals.sbp) + 2 * Number(vals.dbp)) / 3;
      return calculateCPP(map, Number(vals.icp));
    }
  },
  {
    id: 'anion-gap',
    name: 'Anion Gap',
    category: 'Otros',
    description: 'Cálculo de la brecha aniónica para estudio de acidosis metabólica.',
    inputs: [
      { id: 'na', label: 'Sodio', unit: 'mEq/L', type: 'number', defaultValue: 140 },
      { id: 'cl', label: 'Cloro', unit: 'mEq/L', type: 'number', defaultValue: 104 },
      { id: 'hco3', label: 'Bicarbonato', unit: 'mEq/L', type: 'number', defaultValue: 24 }
    ],
    calculate: (vals) => calculateAnionGap(Number(vals.na), Number(vals.cl), Number(vals.hco3))
  },
  {
    id: 'fick-co',
    name: 'Gasto Cardíaco (Fick)',
    category: 'Cardiovascular',
    description: 'Calcula el gasto cardíaco basado en el principio de Fick.',
    inputs: [
      { id: 'vo2', label: 'VO2 (Consumo O2)', unit: 'ml/min', type: 'number', defaultValue: 250 },
      { id: 'hb', label: 'Hemoglobina', unit: 'g/dL', type: 'number', defaultValue: 13 },
      { id: 'sao2', label: 'SaO2', unit: '%', type: 'number', defaultValue: 98 },
      { id: 'svo2', label: 'SvO2 (Venosa Mixta)', unit: '%', type: 'number', defaultValue: 75 },
      { id: 'pao2', label: 'PaO2', unit: 'mmHg', type: 'number', defaultValue: 90 },
      { id: 'pvo2', label: 'PvO2', unit: 'mmHg', type: 'number', defaultValue: 40 }
    ],
    calculate: (vals) => calculateFickCO(
      Number(vals.vo2), 
      Number(vals.hb), 
      Number(vals.sao2), 
      Number(vals.svo2), 
      Number(vals.pao2), 
      Number(vals.pvo2)
    )
  },
  {
    id: 'abl',
    name: 'Pérdida Sanguínea Permisible (ABL)',
    category: 'Líquidos y Renal',
    description: 'Calcula el volumen de sangre que un paciente puede perder antes de alcanzar un nivel crítico de Hb/Hct.',
    inputs: [
      { id: 'weight', label: 'Peso', unit: 'kg', type: 'number', defaultValue: 70 },
      { id: 'patientType', label: 'Tipo de Paciente', unit: '', type: 'select', 
        options: [
          {label: 'Adulto Hombre (75 ml/kg)', value: 'adultMale'}, 
          {label: 'Adulto Mujer (65 ml/kg)', value: 'adultFemale'},
          {label: 'Obeso (60 ml/kg)', value: 'obese'},
          {label: 'Lactante (80 ml/kg)', value: 'infant'},
          {label: 'Neonato (85 ml/kg)', value: 'neonate'},
          {label: 'Prematuro (95 ml/kg)', value: 'premature'}
        ], 
        defaultValue: 'adultMale' 
      },
      { id: 'hbi', label: 'Hb/Hct Inicial', unit: 'g/dL o %', type: 'number', defaultValue: 14 },
      { id: 'hbf', label: 'Hb/Hct Objetivo', unit: 'g/dL o %', type: 'number', defaultValue: 10 }
    ],
    calculate: (vals) => calculateABL(Number(vals.weight), vals.patientType, Number(vals.hbi), Number(vals.hbf))
  },
  {
    id: 'ppo-lung-function',
    name: 'Función Pulmonar Post-Lobectomía',
    category: 'Respiratorio',
    description: 'Predice el VEF1 y volúmenes pulmonares postoperatorios tras resección pulmonar.',
    inputs: [
      { id: 'preopFEV1', label: 'VEF1 Preop', unit: 'L', type: 'number', defaultValue: 3.0 },
      { id: 'preopTLC', label: 'CPT (TLC) Preop', unit: 'L', type: 'number', defaultValue: 6.0 },
      { id: 'segmentsRemoved', label: 'Segmentos a remover', unit: 'de 19', type: 'number', defaultValue: 5 }
    ],
    calculate: (vals) => {
      const fev1 = calculatePPOFEV1(Number(vals.preopFEV1), Number(vals.segmentsRemoved));
      const tlc = calculatePPOLungVolume(Number(vals.preopTLC), Number(vals.segmentsRemoved), 'CPT (TLC)');
      return {
        label: 'Función Pulmonar ppo',
        value: `${fev1.value} / ${tlc.value}`,
        unit: 'L',
        interpretation: `ppoVEF1: ${fev1.value} L (${fev1.interpretation}), ppoCPT: ${tlc.value} L`,
        color: fev1.color
      };
    }
  },
  {
    id: 'mac-calculator',
    name: 'Cálculo de CAM (Sevoflurano)',
    category: 'Medicamentos',
    description: 'Calcula la Concentración Alveolar Mínima (CAM) ajustada por edad y tipo de técnica.',
    inputs: [
      { id: 'age', label: 'Edad', unit: 'años', type: 'number', defaultValue: 40 },
      { id: 'mode', label: 'Técnica', unit: '', type: 'select', 
        options: [
          {label: 'Pura (Sólo Inhalado)', value: 'pure'}, 
          {label: 'Balanceada (con Remifentanilo)', value: 'balanced'}
        ], 
        defaultValue: 'pure' 
      },
      { id: 'desiredMAC', label: 'Fracción CAM deseada', unit: 'CAM', type: 'number', defaultValue: 1.0 }
    ],
    calculate: (vals) => calculateMAC(Number(vals.age), vals.mode as any, Number(vals.desiredMAC))
  }
];
