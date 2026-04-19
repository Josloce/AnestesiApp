import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  Stethoscope, 
  FlaskConical, 
  Droplets, 
  User, 
  ScaleIcon, 
  Calculator, 
  Zap, 
  ArrowLeft, 
  Package,
  Thermometer, 
  HeartPulse, 
  Info, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle2, 
  Activity, 
  Wind, 
  Beaker, 
  History, 
  Settings, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Target,
  ChevronDown, 
  ChevronUp,
  ShieldAlert,
  RefreshCw,
  Syringe,
  Accessibility
} from 'lucide-react';
import { SCALES, Scale } from './constants';
import { MEDICATIONS } from './medications';
import { EMERGENCY_PROTOCOLS } from './emergency';
import { SURGERY_DATABASE } from './surgeries';
import * as Calc from './calculators';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Result Card Component for Calculators
const ResultCard: React.FC<{ res: any }> = ({ res }) => (
  <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.label || res.name}</span>
      {res.interpretation && (
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
          res.color === 'green' ? 'bg-emerald-100 text-emerald-700' :
          res.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
          res.color === 'orange' ? 'bg-orange-100 text-orange-700' :
          res.color === 'red' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {res.interpretation}
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-3xl font-black text-slate-900 tracking-tight">{res.value}</span>
      <span className="text-sm font-bold text-slate-400">{res.unit}</span>
    </div>
  </div>
);

// Bromage Graphic Component
const BromageGraphic: React.FC<{ level: number }> = ({ level }) => {
  return (
    <div className="w-full h-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden relative mb-4">
      <div className="absolute inset-0 opacity-10">
        <Accessibility className="w-full h-full text-slate-900" />
      </div>
      <div className="flex gap-4 items-end h-20">
        {/* Hip */}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-8 rounded-t-lg transition-all duration-500 ${level >= 1 ? 'h-4 bg-slate-300' : 'h-16 bg-indigo-500 shadow-lg shadow-indigo-200'}`} />
          <span className="text-[8px] font-bold text-slate-400 uppercase">Cadera</span>
        </div>
        {/* Knee */}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-8 rounded-t-lg transition-all duration-500 ${level >= 2 ? 'h-4 bg-slate-300' : 'h-12 bg-indigo-400 shadow-lg shadow-indigo-100'}`} />
          <span className="text-[8px] font-bold text-slate-400 uppercase">Rodilla</span>
        </div>
        {/* Foot */}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-8 rounded-t-lg transition-all duration-500 ${level >= 3 ? 'h-4 bg-slate-300' : 'h-8 bg-indigo-300 shadow-lg shadow-indigo-50'}`} />
          <span className="text-[8px] font-bold text-slate-400 uppercase">Pie</span>
        </div>
      </div>
      <div className="absolute top-3 right-3">
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          level === 0 ? 'bg-emerald-100 text-emerald-700' :
          level === 1 ? 'bg-yellow-100 text-yellow-700' :
          level === 2 ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          Bloqueo: {level === 0 ? 'Nulo' : level === 1 ? 'Parcial' : level === 2 ? 'Casi Completo' : 'Completo'}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'pharmacology' | 'medication-detail' | 'calculators' | 'emergency' | 'scale-detail' | 'calculator-detail' | 'surgeries'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [selectedCalculator, setSelectedCalculator] = useState<Calc.CalculatorDef | null>(null);
  const [calcInputs, setCalcInputs] = useState<Record<string, any>>({});
  const [scaleAnswers, setScaleAnswers] = useState<Record<string, any>>({});
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [selectedRegimen, setSelectedRegimen] = useState<any>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [surgerySearchQuery, setSurgerySearchQuery] = useState('');
  const [emergencySearchQuery, setEmergencySearchQuery] = useState('');
  const [scaleHistory, setScaleHistory] = useState<Scale[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Calculator Inputs
  const [patientWeight, setPatientWeight] = useState('70');
  const [patientHeight, setPatientHeight] = useState('170');
  const [patientGender, setPatientGender] = useState<'male' | 'female'>('male');
  const [patientAge, setPatientAge] = useState('40');
  const [patientCreatinine, setPatientCreatinine] = useState('1.0');
  const [patientSodium, setPatientSodium] = useState('140');
  const [patientAlbumin, setPatientAlbumin] = useState('4.0');
  const [patientCalcium, setPatientCalcium] = useState('9.0');
  const [patientCl, setPatientCl] = useState('104');
  const [patientHCO3, setPatientHCO3] = useState('24');
  const [patientPaO2, setPatientPaO2] = useState('90');
  const [patientPaCO2, setPatientPaCO2] = useState('40');
  const [patientFiO2, setPatientFiO2] = useState('0.21');
  const [patientType, setPatientType] = useState<'premature' | 'neonate' | 'infant' | 'adultMale' | 'adultFemale' | 'obese'>('adultMale');

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const filteredScales = useMemo(() => {
    return SCALES.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredMedications = useMemo(() => {
    return MEDICATIONS.filter(m => 
      m.name.toLowerCase().includes(medSearchQuery.toLowerCase())
    );
  }, [medSearchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Vía Aérea': return <Wind className="w-5 h-5 text-sky-500" />;
      case 'Riesgo': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'Recuperación': return <History className="w-5 h-5 text-emerald-500" />;
      case 'Cardiovascular': return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'Neurología': return <Activity className="w-5 h-5 text-purple-500" />;
      case 'Hepático': return <Beaker className="w-5 h-5 text-orange-500" />;
      case 'Pulmonar': return <Wind className="w-5 h-5 text-blue-400" />;
      case 'General': return <Calculator className="w-5 h-5 text-slate-500" />;
      case 'Fragilidad': return <Accessibility className="w-5 h-5 text-indigo-500" />;
      case 'Pediátrico': return <User className="w-5 h-5 text-pink-500" />;
      case 'Medicamentos': return <FlaskConical className="w-5 h-5 text-indigo-500" />;
      default: return <Stethoscope className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleScaleSelect = (scale: Scale) => {
    if (currentView === 'scale-detail' && selectedScale) {
      setScaleHistory(prev => [...prev, selectedScale]);
    } else {
      setScaleHistory([]);
    }
    setSelectedScale(scale);
    setCurrentView('scale-detail');
  };

  const handleScaleBack = () => {
    if (scaleHistory.length > 0) {
      const prev = scaleHistory[scaleHistory.length - 1];
      setScaleHistory(prevHistory => prevHistory.slice(0, -1));
      setSelectedScale(prev);
    } else {
      setCurrentView('home');
      setScaleHistory([]);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const calculateScaleScore = (scale: Scale) => {
    const answers = scaleAnswers[scale.id];
    if (answers === undefined || answers === null) return 0;

    let score = 0;
    if (scale.type === 'select') {
      score = scale.options?.[answers as number]?.value || 0;
    } else if (scale.type === 'boolean-list') {
      score = Array.isArray(answers) 
        ? answers.reduce((acc: number, idx: number) => acc + (scale.options?.[idx]?.value || 0), 0) 
        : 0;
    } else if (scale.type === 'multi-select') {
      score = Object.entries(answers as Record<string, number>).reduce((acc, [sectionName, optionIndex]) => {
        const section = scale.sections?.find(s => s.name === sectionName);
        const value = section?.options[optionIndex]?.value || 0;
        return acc + value;
      }, 0);
    }

    if (scale.id === 'dasi') {
      // Consenso Internacional DASI:
      // VO2 máx (ml/kg/min) = 0.43 * DASI + 9.6
      // METs = VO2 máx / 3.5
      const vo2max = (0.43 * score) + 9.6;
      return parseFloat((vo2max / 3.5).toFixed(1));
    }

    return score;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-sky-100">
              <img 
                src="/logo.png" 
                alt="AnestesiApp Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">AnestesiApp by Jose</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Clinical Assistant</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-6 pb-32">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Welcome Section with Logo */}
              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl shadow-sky-100 border-4 border-white">
                  <img 
                    src="/logo.png" 
                    alt="AnestesiApp Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black text-slate-900">Bienvenido</h2>
                  <p className="text-slate-500 text-sm font-medium">Tu asistente clínico de anestesia</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar escala o categoría..."
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories Quick Links */}
              {/* Scales List - Grouped by Category */}
              <div className="space-y-4">
                {Array.from(new Set(filteredScales.map(s => s.category))).map(category => {
                  const isExpanded = expandedCategories.includes(category as string) || searchQuery.length > 0;
                  const categoryScales = filteredScales.filter(s => s.category === category);
                  
                  return (
                    <div key={category as string} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all">
                      <button 
                        onClick={() => toggleCategory(category as string)}
                        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            {getCategoryIcon(category as string)}
                          </div>
                          <div className="text-left">
                            <h2 className="text-base font-bold text-slate-900">
                              {category as string}
                            </h2>
                            <p className="text-xs text-slate-500">{categoryScales.length} escalas disponibles</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-100"
                          >
                            <div className="p-3 grid grid-cols-1 gap-2">
                              {categoryScales.map((scale) => (
                                <button
                                  key={scale.id}
                                  onClick={() => handleScaleSelect(scale)}
                                  className="w-full flex items-center justify-between p-4 hover:bg-indigo-50/50 rounded-2xl transition-all group"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="text-left">
                                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{scale.name}</h3>
                                      <p className="text-xs text-slate-500 line-clamp-1">{scale.description}</p>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : currentView === 'pharmacology' ? (
            <motion.div
              key="pharmacology"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Fármacos</h2>
                <p className="text-slate-500 text-sm">Dosis y farmacología detallada para anestesia.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                {/* Search Medications */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Buscar fármaco..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={medSearchQuery}
                    onChange={(e) => setMedSearchQuery(e.target.value)}
                  />
                </div>

                {/* Medication List */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Seleccionar Medicamento</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredMedications.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => {
                          setSelectedMedication(med);
                          setSelectedRegimen(med.regimens[0]);
                          setCurrentView('medication-detail');
                        }}
                        className="w-full text-left p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 shadow-sm transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{med.name}</span>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        </div>
                      </button>
                    ))}
                    {filteredMedications.length === 0 && (
                      <p className="text-center py-4 text-slate-400 text-sm">No se encontraron fármacos</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : currentView === 'medication-detail' && selectedMedication ? (
            <motion.div
              key="medication-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('pharmacology')}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedMedication.name}</h2>
                  <p className="text-slate-500 text-sm">Cálculo de dosis y farmacología</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-8">
                {/* Weight Input */}
                {selectedMedication.id !== 'sevoflurane' && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700">Peso del Paciente (kg)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={patientWeight}
                        onChange={(e) => setPatientWeight(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-2xl font-black text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="70"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kg</span>
                    </div>
                  </div>
                )}

                {/* Indications */}
                {selectedMedication.id !== 'sevoflurane' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <h5 className="text-xs font-bold text-emerald-600 uppercase mb-2">Indicaciones Principales</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMedication.indications.map((ind: string, i: number) => (
                        <li key={i} className="text-xs text-emerald-800 font-medium">{ind}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Effect Selection */}
                {selectedMedication.id !== 'sevoflurane' && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700">Efecto Deseado / Régimen</label>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedMedication.regimens.map((reg: any) => (
                        <button
                          key={reg.effect}
                          onClick={() => setSelectedRegimen(reg)}
                          className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                            selectedRegimen?.effect === reg.effect
                              ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{reg.effect}</span>
                            <span className="text-[10px] opacity-70 uppercase tracking-wider">{reg.unit}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results & Details */}
                {(selectedRegimen || selectedMedication.id === 'sevoflurane') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`${selectedMedication.id}-${selectedRegimen?.effect || 'mac'}`}
                    className="space-y-6 pt-6 border-t border-slate-100"
                  >
                    {/* Presentation & Preparation */}
                    {selectedMedication.id !== 'sevoflurane' && (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                          <h5 className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-2">
                            <Package className="w-3 h-3" /> Presentación
                          </h5>
                          <p className="text-xs text-blue-900 font-medium leading-relaxed">
                            {selectedMedication.presentation}
                          </p>
                        </div>
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                          <h5 className="text-xs font-bold text-indigo-600 uppercase mb-2 flex items-center gap-2">
                            <Droplets className="w-3 h-3" /> Preparación de Infusión
                          </h5>
                          <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                            {selectedMedication.infusionPreparation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Dose Cards */}
                    <div className="grid grid-cols-1 gap-4">
                      {selectedMedication.id === 'sevoflurane' ? (
                        <div className="bg-[#151619] rounded-3xl p-6 text-white border border-white/5 shadow-2xl space-y-6">
                          {/* Header with status light */}
                          <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                              <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Monitor de Profundidad</p>
                                <h3 className="text-lg font-black text-white tracking-tight">Sevoflurano</h3>
                              </div>
                            </div>
                            <Activity className="w-6 h-6 text-emerald-500/50" />
                          </div>

                          {/* Inputs Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <User className="w-3 h-3" /> Edad
                              </label>
                              <input 
                                type="number" 
                                value={patientAge}
                                onChange={(e) => setPatientAge(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all font-mono font-bold text-emerald-400"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <FlaskConical className="w-3 h-3" /> Técnica
                              </label>
                              <select 
                                value={calcInputs.macMode || 'pure'}
                                onChange={(e) => setCalcInputs({...calcInputs, macMode: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-2 py-3 text-[11px] focus:outline-none focus:border-emerald-500 transition-all font-bold text-emerald-400"
                              >
                                <option value="pure" className="bg-slate-900">Inhalatoria Pura</option>
                                <option value="balanced" className="bg-slate-900">Balanceada (Remi)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 col-span-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Target className="w-3 h-3" /> Fase Clínica / Objetivo
                              </label>
                              <select 
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) setCalcInputs({...calcInputs, desiredMAC: val});
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all font-bold text-white shadow-inner"
                              >
                                <option value="1.0" className="bg-slate-900">Seleccionar fase clínica...</option>
                                <option value="0.35" className="bg-slate-900 text-slate-400">Despertar (MAC Awake) - 0.35 CAM</option>
                                <option value="0.7" className="bg-slate-900">Sedación / Mantenimiento - 0.7 CAM</option>
                                <option value="1.0" className="bg-slate-900">Estándar (1.0 CAM)</option>
                                <option value="1.3" className="bg-slate-900">Plano Quirúrgico - 1.3 CAM</option>
                                <option value="1.6" className="bg-slate-900">Intubación / Inducción - 1.6 CAM</option>
                              </select>
                            </div>
                            <div className="space-y-1.5 col-span-2">
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Ajuste Fino CAM</label>
                                <span className="text-xs font-mono font-bold text-emerald-400">{(calcInputs.desiredMAC || 1.0).toFixed(1)} CAM</span>
                              </div>
                              <input 
                                type="range" 
                                min="0.3" 
                                max="2.0" 
                                step="0.1"
                                value={calcInputs.desiredMAC || 1.0}
                                onChange={(e) => setCalcInputs({...calcInputs, desiredMAC: parseFloat(e.target.value)})}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                              />
                            </div>
                            <div className={`space-y-1.5 col-span-2 transition-all duration-500 ${calcInputs.macMode === 'balanced' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Wind className="w-3 h-3" /> Flujo de Gas Fresco (FGF)
                                {calcInputs.macMode === 'balanced' && <span className="text-[8px] text-indigo-400 font-bold ml-1 tracking-tighter">(Calculo automático en Balanced)</span>}
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {[0.5, 1.0, 2.0].map(flow => (
                                  <button
                                    key={flow}
                                    onClick={() => setCalcInputs({...calcInputs, fgf: flow})}
                                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${
                                      (calcInputs.fgf || 1.0) === flow 
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                        : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                                    }`}
                                  >
                                    {flow.toFixed(1)} L/min
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {(() => {
                            const age = Number(patientAge);
                            const mode = calcInputs.macMode || 'pure';
                            const desiredMACValue = calcInputs.desiredMAC || 1.0;
                            const fgf = calcInputs.fgf || 1.0;
                            
                            // 1. Mapleson's Constant for age-related MAC reduction
                            // Literature: Br. J. Anaesth. (1996) 76: 179-185
                            // MAC_age = MAC_40 * 10^(constant * (40 - age))
                            const maplesonConstant = 0.00269;
                            
                            // 2. Reference MAC for Sevoflurane (Standard Mapleson Reference)
                            // Strict adaptation to Mapleson: MAC_40 = 1.8% for Sevoflurane
                            const mac40 = 1.8;
                            const adjustedMAC50 = mac40 * Math.pow(10, maplesonConstant * (40 - age));
                            
                            // 3. Technique Factor (Balanced Anesthesia with Opioids)
                            // User request: Balanced requires approx 0.5 CAM of Sevo
                            const techniqueFactor = mode === 'balanced' ? 0.5 : 1.0; 
                            
                            // 4. Target Alveolar Concentration (FeTarget / EtTarget)
                            // targetFe = [Age-Adjusted MAC] * [Opioid Sparing Factor] * [Clinical Stage Multiplier]
                            const targetFe = adjustedMAC50 * techniqueFactor * desiredMACValue;
                            
                            // 5. Mouth-to-Alveolus Gradient Adjustment ($F_i/F_a$ ratio)
                            // The Dial ($F_d$) must be higher than $F_e$ to overcome uptake and circuit dilution.
                            // Formula: Dial = Fe * (1 + UptakeCoefficient / FGF)
                            // At 1 L/min FGF, clinical Fi/Fe for Sevo is approx 1.3 - 1.5 in maintenance.
                            const uptakeCoefficient = 0.55; 
                            const dialMaintenance = mode === 'balanced' 
                              ? (targetFe * 1.15) 
                              : (targetFe * (1 + (uptakeCoefficient / fgf)));
                            
                            // Over-pressurization suggestion for faster reaching of target
                            const dialInduction = mode === 'balanced'
                              ? Math.min(8.0, targetFe * 1.8)
                              : Math.min(8.0, targetFe * (1.8 + (1.2 / fgf)));

                            return (
                              <div className="space-y-4 pt-4 border-t border-white/10">
                                {/* Technical Info Box */}
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-[8px] text-slate-500 font-bold uppercase">Base Mapleson</span>
                                    <span className="text-[10px] font-mono text-emerald-400">10^({maplesonConstant} * Δt)</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[8px] text-slate-500 font-bold uppercase">1.0 CAM ({age}a)</span>
                                    <span className="text-[10px] font-mono text-white">{adjustedMAC50.toFixed(2)}%</span>
                                  </div>
                                </div>

                                {mode === 'balanced' && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                                  >
                                    <div className="p-1.5 bg-indigo-500/20 rounded-lg shrink-0">
                                      <Info className="w-3.5 h-3.5 text-indigo-400" />
                                    </div>
                                    <p className="text-[10px] text-indigo-300 font-bold leading-tight">
                                      Ajuste Vaporizador: <span className="text-indigo-100 font-black">CAM_age x 0.5 x 1.15 x {(desiredMACValue).toFixed(2)}</span>
                                      <span className="block text-[8px] text-indigo-400/70 mt-0.5 font-medium uppercase italic">Fórmula optimizada para anestesia balanceada</span>
                                    </p>
                                  </motion.div>
                                )}

                                {/* Result Alveolar */}
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between">
                                  <div>
                                    <p className="text-[9px] text-emerald-500/70 font-black uppercase tracking-widest mb-1">Concentración Espirada ($F_e$ o $Et$)</p>
                                    <div className="flex items-baseline gap-1.5">
                                      <h4 className="text-4xl font-mono font-black text-white">{targetFe.toFixed(2)}</h4>
                                      <span className="text-lg font-bold text-emerald-500 font-mono">%</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Equivalencia</p>
                                    <p className="text-lg font-mono font-black text-emerald-400">
                                      {(techniqueFactor * desiredMACValue).toFixed(2)} 
                                      <span className="text-[10px] ml-1 tracking-tighter">CAM</span>
                                    </p>
                                    <p className="text-[7px] text-slate-600 font-bold italic uppercase tracking-tighter">
                                      {mode === 'balanced' ? 'Balanceada (Remi)' : 'Inhalatoria Pura'}
                                    </p>
                                  </div>
                                </div>

                                {/* Dial Recommendations */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3">Dial a Programar</p>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-mono font-black text-white">{dialMaintenance.toFixed(1)}</span>
                                      <span className="text-[10px] text-slate-500 font-bold uppercase">%</span>
                                    </div>
                                    <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500" style={{ width: `${(dialMaintenance/8)*100}%` }} />
                                    </div>
                                    <p className="text-[7px] text-slate-600 uppercase font-bold mt-2">Mantenimiento</p>
                                  </div>
                                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <p className="text-[9px] text-amber-500/70 font-black uppercase tracking-widest mb-3">Sobrecarga ($F_i$)</p>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-mono font-black text-amber-500">{dialInduction.toFixed(1)}</span>
                                      <span className="text-[10px] text-slate-500 font-bold uppercase">%</span>
                                    </div>
                                    <p className="text-[7px] text-slate-600 uppercase font-bold mt-2 italic">Ajuste recomendado</p>
                                  </div>
                                </div>

                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
                                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                  <p className="text-[9px] text-red-400 leading-tight italic">
                                    Estimación aproximada. La constante de tiempo y captación tisular afectan la latencia. Monitorice siempre el gas espirado real.
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="bg-slate-900 rounded-2xl p-6 text-white">
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Dosis Calculada ({selectedRegimen.effect})</p>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Dosis Total</p>
                              <h3 className="text-xl font-black">
                                {selectedRegimen.unit.includes('/kg') 
                                  ? `${(Number(patientWeight) * selectedRegimen.minDose).toFixed(2)} - ${(Number(patientWeight) * selectedRegimen.maxDose).toFixed(2)}`
                                  : `${selectedRegimen.minDose} - ${selectedRegimen.maxDose}`
                                }
                                <span className="text-xs ml-1 opacity-50">{selectedRegimen.unit.split('/')[0]}</span>
                              </h3>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                                {selectedRegimen.unit.includes('/kg') ? 'Dosis por kg' : 'Dosis Fija'}
                              </p>
                              <h3 className="text-xl font-black">
                                {selectedRegimen.minDose}-{selectedRegimen.maxDose}
                                <span className="text-xs ml-1 opacity-50">{selectedRegimen.unit}</span>
                              </h3>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detailed Pharmacology */}
                    {selectedMedication.id !== 'sevoflurane' && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Propiedades Farmacológicas</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Latencia</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedMedication.latency}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Duración</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedMedication.duration}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Vida Media</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedMedication.halfLife}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Metabolismo</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedMedication.metabolism}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Receptores</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedMedication.receptors}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Eliminación</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedMedication.elimination}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                            <h5 className="text-xs font-bold text-indigo-600 uppercase mb-2">Efectos por Sistema</h5>
                            <div className="space-y-2">
                              <p className="text-xs text-slate-700"><strong>CV:</strong> {selectedMedication.systemEffects.cardiovascular}</p>
                              <p className="text-xs text-slate-700"><strong>Resp:</strong> {selectedMedication.systemEffects.respiratory}</p>
                              <p className="text-xs text-slate-700"><strong>SNC:</strong> {selectedMedication.systemEffects.cns}</p>
                              {selectedMedication.systemEffects.other && <p className="text-xs text-slate-700"><strong>Otros:</strong> {selectedMedication.systemEffects.other}</p>}
                            </div>
                          </div>

                          <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100">
                            <h5 className="text-xs font-bold text-red-600 uppercase mb-2">Contraindicaciones</h5>
                            <ul className="list-disc list-inside space-y-1">
                              {selectedMedication.contraindications.map((c: string, i: number) => (
                                <li key={i} className="text-xs text-red-800">{c}</li>
                              ))}
                            </ul>
                          </div>

                          {selectedMedication.tciData && (
                            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                              <h5 className="text-xs font-bold text-sky-600 uppercase mb-2">Modo TCI (Concentraciones)</h5>
                              <div className="space-y-3">
                                {selectedMedication.tciData.map((tci: any, i: number) => (
                                  <div key={i} className="grid grid-cols-3 gap-2 items-center border-b border-sky-100/50 pb-2 last:border-0 last:pb-0">
                                    <span className="text-[10px] font-bold text-slate-600">{tci.phase}</span>
                                    <div className="flex flex-col">
                                      <span className="text-[8px] text-slate-400 uppercase font-bold">Cp</span>
                                      <span className="text-[10px] font-semibold text-slate-700">{tci.cp}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[8px] text-slate-400 uppercase font-bold">Ce</span>
                                      <span className="text-[10px] font-semibold text-slate-700">{tci.ce}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="text-[10px] text-amber-800 leading-relaxed">
                        Atención: Los cálculos son sugerencias basadas en dosis estándar. Ajuste según juicio clínico, edad y estado hemodinámico del paciente.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : currentView === 'calculators' ? (
            <motion.div
              key="calculators"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900">Calculadoras</h2>
                <p className="text-slate-500 text-sm">Calculadoras clínicas independientes por sistema.</p>
              </div>

              <div className="space-y-6">
                {Array.from(new Set(Calc.CALCULATORS.map(c => c.category))).map(category => (
                  <div key={category as string} className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{category as string}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {Calc.CALCULATORS.filter(c => c.category === category).map((calc) => (
                        <button
                          key={calc.id}
                          onClick={() => {
                            setSelectedCalculator(calc);
                            const initialInputs: Record<string, any> = {};
                            calc.inputs.forEach(input => {
                              initialInputs[input.id] = input.defaultValue;
                            });
                            setCalcInputs(initialInputs);
                            setCurrentView('calculator-detail');
                          }}
                          className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 transition-all shadow-sm group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                              <Calculator className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-bold text-slate-900">{calc.name}</h3>
                              <p className="text-xs text-slate-500 line-clamp-1">{calc.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : currentView === 'calculator-detail' && selectedCalculator ? (
            <motion.div
              key="calculator-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setCurrentView('calculators')}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCalculator.name}</h2>
                  <p className="text-sm text-slate-500">{selectedCalculator.description}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="space-y-4">
                  {selectedCalculator.inputs.map((input) => (
                    <div key={input.id} className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex justify-between">
                        {input.label}
                        {input.unit && <span className="text-[10px] text-slate-400 uppercase">{input.unit}</span>}
                      </label>
                      {input.type === 'number' ? (
                        <input 
                          type="number"
                          value={calcInputs[input.id] || ''}
                          onChange={(e) => setCalcInputs({ ...calcInputs, [input.id]: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      ) : (
                        <div className="flex gap-2">
                          {input.options?.map((opt) => (
                            <button 
                              key={opt.value}
                              onClick={() => setCalcInputs({ ...calcInputs, [input.id]: opt.value })}
                              className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${calcInputs[input.id] === opt.value ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <ResultCard res={selectedCalculator.calculate(calcInputs)} />
                </div>
              </div>
            </motion.div>
          ) : currentView === 'scale-detail' && selectedScale ? (
            <motion.div
              key="scale-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pb-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleScaleBack}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedScale.name}</h2>
                  <p className="text-sm text-slate-500">{selectedScale.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedScale.id === 'bromage' && (
                  <BromageGraphic level={scaleAnswers[selectedScale.id] ?? 0} />
                )}

                {selectedScale.type === 'select' && (
                  <div className="grid gap-3">
                    {selectedScale.options?.map((option, index) => (
                      <div
                        key={option.label}
                        onClick={() => setScaleAnswers({ ...scaleAnswers, [selectedScale.id]: index })}
                        className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          scaleAnswers[selectedScale.id] === index
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setScaleAnswers({ ...scaleAnswers, [selectedScale.id]: index });
                          }
                        }}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-slate-900">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-slate-500">{option.description}</div>
                          )}
                          {option.linkToScaleId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const linkedScale = SCALES.find(s => s.id === option.linkToScaleId);
                                if (linkedScale) handleScaleSelect(linkedScale);
                              }}
                              className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors w-fit"
                            >
                              <Zap className="w-3 h-3" />
                              Evaluar con {option.linkToScaleId.toUpperCase()}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedScale.type === 'boolean-list' && (
                  <div className="grid gap-3">
                    {selectedScale.options?.map((option, index) => {
                      const currentAnswers = scaleAnswers[selectedScale.id] || [];
                      const isSelected = currentAnswers.includes(index);
                      return (
                        <div
                          key={option.label}
                          onClick={() => {
                            const newAnswers = isSelected
                              ? currentAnswers.filter((i: number) => i !== index)
                              : [...currentAnswers, index];
                            setScaleAnswers({ ...scaleAnswers, [selectedScale.id]: newAnswers });
                          }}
                          className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              const newAnswers = isSelected
                                ? currentAnswers.filter((i: number) => i !== index)
                                : [...currentAnswers, index];
                              setScaleAnswers({ ...scaleAnswers, [selectedScale.id]: newAnswers });
                            }
                          }}
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{option.label}</div>
                            {option.description && (
                              <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                            )}
                            {option.linkToScaleId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const linkedScale = SCALES.find(s => s.id === option.linkToScaleId);
                                  if (linkedScale) handleScaleSelect(linkedScale);
                                }}
                                className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors w-fit"
                              >
                                <Zap className="w-3 h-3" />
                                Evaluar con {option.linkToScaleId.toUpperCase()}
                              </button>
                            )}
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedScale.id === 'surgical-severity' && (
                  <div className="mb-6 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar procedimiento (ej: Apendicectomía)..."
                        value={surgerySearchQuery}
                        onChange={(e) => setSurgerySearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                    {surgerySearchQuery && (
                      <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 divide-y divide-slate-100">
                        {SURGERY_DATABASE.filter(s => s.name.toLowerCase().includes(surgerySearchQuery.toLowerCase())).map(surgery => (
                          <button
                            key={surgery.name}
                            onClick={() => {
                              const severityIdx = selectedScale.sections?.[0].options.findIndex(o => o.label === surgery.severity);
                              const bleedingIdx = selectedScale.sections?.[1].options.findIndex(o => o.label === surgery.bleedingRisk);
                              
                              if (severityIdx !== -1 && bleedingIdx !== -1) {
                                setScaleAnswers({
                                  ...scaleAnswers,
                                  [selectedScale.id]: {
                                    'Severidad Quirúrgica': severityIdx,
                                    'Riesgo de Sangrado': bleedingIdx
                                  }
                                });
                              }
                              setSurgerySearchQuery('');
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white transition-colors flex justify-between items-center"
                          >
                            <span className="font-medium text-slate-700">{surgery.name}</span>
                            <span className="text-[10px] font-bold text-indigo-500 uppercase">{surgery.severity} / {surgery.bleedingRisk}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {selectedScale.type === 'multi-select' && (
                  <div className="space-y-8">
                    {selectedScale.sections?.map((section) => (
                      <div key={section.name} className="space-y-3">
                        <h3 className="font-bold text-slate-900 px-1">{section.name}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {section.options.map((option, index) => {
                            const currentAnswers = scaleAnswers[selectedScale.id] || {};
                            const isSelected = currentAnswers[section.name] === index;
                            return (
                              <div
                                key={option.label}
                                onClick={() => setScaleAnswers({
                                  ...scaleAnswers,
                                  [selectedScale.id]: { ...currentAnswers, [section.name]: index }
                                })}
                                className={`p-3 rounded-xl border-2 text-center text-sm transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                  isSelected
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-bold'
                                    : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
                                }`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    setScaleAnswers({
                                      ...scaleAnswers,
                                      [selectedScale.id]: { ...currentAnswers, [section.name]: index }
                                    });
                                  }
                                }}
                              >
                                <span>{option.label}</span>
                                {option.linkToScaleId && (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const linkedScale = SCALES.find(s => s.id === option.linkToScaleId);
                                      if (linkedScale) handleScaleSelect(linkedScale);
                                    }}
                                    className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                                  >
                                    Ver {option.linkToScaleId.toUpperCase()}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Result Section */}
                <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 font-medium">
                      {selectedScale.unit ? 'Resultado' : 'Puntaje Total'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-indigo-400">
                        {calculateScaleScore(selectedScale)}
                      </span>
                      {selectedScale.unit && (
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                          {selectedScale.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {(() => {
                    const score = calculateScaleScore(selectedScale);
                    const interpretation = selectedScale.interpretations?.find(
                      i => score >= i.min && score <= i.max
                    );
                    if (!interpretation) return null;
                    
                    return (
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          interpretation.color === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                          interpretation.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                          interpretation.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                          interpretation.color === 'red' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {interpretation.text}
                        </div>
                        {interpretation.recommendation && (
                          <p className="text-sm text-slate-300 leading-relaxed italic">
                            "{interpretation.recommendation}"
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          ) : currentView === 'surgeries' ? (
            <motion.div
              key="surgeries"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => setCurrentView('home')}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h2 className="text-2xl font-black text-slate-900">Base de Cirugías</h2>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar cirugía por nombre..."
                  value={surgerySearchQuery}
                  onChange={(e) => setSurgerySearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {SURGERY_DATABASE.filter(s => 
                  s.name.toLowerCase().includes(surgerySearchQuery.toLowerCase())
                ).map((surgery, idx) => (
                  <div 
                    key={idx}
                    className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">{surgery.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        surgery.severity === 'Menor' ? 'bg-emerald-100 text-emerald-700' :
                        surgery.severity === 'Intermedia' ? 'bg-yellow-100 text-yellow-700' :
                        surgery.severity === 'Mayor' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {surgery.severity}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pérdida Est.</p>
                        <p className="text-sm font-bold text-indigo-600">
                          {surgery.estimatedLoss}
                        </p>
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Riesgo Sangrado</p>
                        <p className={`text-sm font-bold ${
                          surgery.bleedingRisk === 'Bajo' ? 'text-emerald-600' :
                          surgery.bleedingRisk === 'Moderado' ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {surgery.bleedingRisk}
                        </p>
                      </div>
                    </div>
                    {surgery.description && (
                      <p className="mt-3 text-xs text-slate-500 leading-relaxed italic">
                        {surgery.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : currentView === 'emergency' && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => {
                    if (selectedProtocol) setSelectedProtocol(null);
                    else setCurrentView('home');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h2 className="text-2xl font-black text-slate-900">
                  {selectedProtocol ? selectedProtocol.name : 'Emergencias'}
                </h2>
              </div>

              {!selectedProtocol && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar protocolo de urgencia..."
                    value={emergencySearchQuery}
                    onChange={(e) => setEmergencySearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              )}

              {!selectedProtocol ? (
                <div className="grid grid-cols-1 gap-4">
                  {EMERGENCY_PROTOCOLS.filter(p => 
                    p.name.toLowerCase().includes(emergencySearchQuery.toLowerCase())
                  ).map((protocol) => (
                    <button
                      key={protocol.id}
                      onClick={() => setSelectedProtocol(protocol)}
                      className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors">
                          <Zap className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">{protocol.name}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed">{protocol.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-red-600 rounded-3xl text-white shadow-lg shadow-red-200">
                    <p className="text-red-100 text-sm font-medium mb-1">Protocolo Crítico</p>
                    <h3 className="text-2xl font-black">{selectedProtocol.name}</h3>
                    <p className="text-red-50 mt-2 text-sm leading-relaxed opacity-90">
                      {selectedProtocol.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Pasos de Acción</h4>
                    {selectedProtocol.steps.map((step, index) => (
                      <div 
                        key={step.id}
                        className={`p-5 rounded-2xl border ${
                          step.isCritical 
                            ? 'bg-red-50 border-red-200 ring-1 ring-red-200' 
                            : 'bg-white border-slate-100'
                        }`}
                      >
                        <div className="flex gap-4">
                          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                            step.isCritical ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <h5 className={`font-bold mb-1 ${step.isCritical ? 'text-red-900' : 'text-slate-900'}`}>
                              {step.title}
                            </h5>
                            <p className={`text-sm leading-relaxed ${step.isCritical ? 'text-red-700' : 'text-slate-500'}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedProtocol.medications && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Fármacos Críticos</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedProtocol.medications.map((med) => (
                          <div key={med.name} className="p-5 bg-slate-900 rounded-2xl text-white">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-indigo-400">{med.name}</h5>
                              <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider">
                                {med.dose}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                              {med.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                      Esta guía es un recordatorio rápido. Siga siempre los protocolos institucionales y el juicio clínico experto.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-6 py-4 z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => { setCurrentView('home'); setSelectedScale(null); }}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'home' || currentView === 'scale-detail' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ScaleIcon className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Escalas</span>
          </button>
          <button 
            onClick={() => { setCurrentView('pharmacology'); setSelectedScale(null); }}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'pharmacology' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FlaskConical className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Fármacos</span>
          </button>
          <button 
            onClick={() => { setCurrentView('calculators'); setSelectedScale(null); }}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'calculators' || currentView === 'calculator-detail' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calculator className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Calculadoras</span>
          </button>
          <button 
            onClick={() => { setCurrentView('surgeries'); setSelectedScale(null); }}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'surgeries' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Cirugías</span>
          </button>
          <button 
            onClick={() => { setCurrentView('emergency'); setSelectedScale(null); setSelectedProtocol(null); }}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'emergency' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Zap className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Urgencias</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
