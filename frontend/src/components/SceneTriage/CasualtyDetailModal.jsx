import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Wind, 
  Activity, 
  Brain, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Ambulance, 
  Building2,
  Syringe,
  Crosshair
} from 'lucide-react';
import { audioEngine } from '../../services/speechService';

export default function CasualtyDetailModal({
  casualty,
  hospitals,
  fleet,
  onClose,
  onUpdateCasualty
}) {
  const [appliedInterventions, setAppliedInterventions] = useState([]);
  const [assignedUnitId, setAssignedUnitId] = useState(casualty?.assignedUnitId || '');
  const [assignedHospitalId, setAssignedHospitalId] = useState(casualty?.assignedHospitalId || 'hosp-1');
  const [countdown, setCountdown] = useState(casualty?.goldenHourExpirySeconds || 1800);

  useEffect(() => {
    if (!casualty) return;
    setAppliedInterventions(casualty.completedInterventions || []);
    setAssignedUnitId(casualty.assignedUnitId || '');
    setAssignedHospitalId(casualty.assignedHospitalId || 'hosp-1');
    setCountdown(casualty.goldenHourExpirySeconds || 1800);
  }, [casualty]);

  useEffect(() => {
    if (!casualty) return undefined;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [casualty]);

  if (!casualty) return null;

  const toggleIntervention = (action) => {
    setAppliedInterventions(prev => {
      const exists = prev.includes(action);
      const updated = exists ? prev.filter(a => a !== action) : [...prev, action];
      if (!exists) {
        audioEngine.playRadioChime();
      }
      return updated;
    });
  };

  const minutesRemaining = Math.floor(countdown / 60);
  const secondsRemaining = countdown % 60;

  const colorStyles = {
    RED: {
      bg: 'bg-red-500/10 border-red-500/40 text-red-300',
      tag: 'bg-red-600 text-white',
      border: 'border-red-500'
    },
    YELLOW: {
      bg: 'bg-amber-500/10 border-amber-500/40 text-amber-300',
      tag: 'bg-amber-500 text-slate-950',
      border: 'border-amber-500'
    },
    GREEN: {
      bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
      tag: 'bg-emerald-600 text-white',
      border: 'border-emerald-500'
    },
    BLACK: {
      bg: 'bg-slate-800 border-slate-600 text-slate-300',
      tag: 'bg-slate-700 text-white',
      border: 'border-slate-600'
    }
  }[casualty.triageCode] || { bg: 'bg-slate-800', tag: 'bg-slate-700 text-white', border: 'border-slate-600' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className={`p-4 border-b flex items-center justify-between ${colorStyles.bg}`}>
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 text-xs font-mono font-black rounded uppercase tracking-wider ${colorStyles.tag}`}>
              START: {casualty.triageCategory}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {casualty.name}
                <span className="text-xs font-mono text-slate-400 font-normal">
                  [{casualty.gender}, {casualty.age}]
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {casualty.status}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Survival Window & Golden Hour Clock */}
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Physiological Decompensation Window
                </span>
                <span className="text-base font-bold font-mono text-red-400">
                  {String(minutesRemaining).padStart(2, '0')}m {String(secondsRemaining).padStart(2, '0')}s remaining
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Algorithm Status</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" /> ATLS / START Compliant
              </span>
            </div>
          </div>

          {/* Vitals HUD */}
          <div>
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Triage Vital Signs & Physiological Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-mono flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-blue-400" /> Respirations
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {casualty.respirations}
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-mono flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Perfusion / Pulse
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {casualty.perfusion}
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-mono flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-purple-400" /> Mental Status
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {casualty.mentalStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Injury Assessment */}
          <div>
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Identified Traumas & Critical Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {casualty.injuries.map((injury, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-medium"
                >
                  ⚠ {injury}
                </span>
              ))}
            </div>
          </div>

          {/* Actionable Field Interventions */}
          <div>
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Syringe className="w-4 h-4 text-emerald-400" />
              Required Pre-Hospital Medical Interventions (Click to Confirm)
            </h3>
            <div className="space-y-2">
              {casualty.recommendedActions.map((action, idx) => {
                const isDone = appliedInterventions.includes(action);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleIntervention(action)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                      isDone
                        ? 'bg-emerald-950/50 border-emerald-500/70 text-emerald-200'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-600 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-xs sm:text-sm">{action}</span>
                    </div>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {isDone ? 'COMPLETED' : 'PENDING'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dispatch Assignment & Destination Routing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                <Ambulance className="w-4 h-4 text-blue-400" /> Assign Transport Unit
              </label>
              <select
                value={assignedUnitId}
                onChange={(e) => setAssignedUnitId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
              >
                <option value="">-- Select Available Unit --</option>
                {fleet.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.callSign} [{unit.status}] - ETA ~{unit.etaMinutes}m
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-400" /> Destination Hospital
              </label>
              <select
                value={assignedHospitalId}
                onChange={(e) => setAssignedHospitalId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-purple-500"
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.shortName} [{h.badge}] - {h.traumaBedsAvailable} beds open ({h.driveTimeMinutes}m)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            TAG ID: {casualty.id} • TRIAGE PROTOCOL: START-MCI
          </span>
          <button
            onClick={() => {
              if (onUpdateCasualty) {
                onUpdateCasualty({
                  ...casualty,
                  assignedUnitId,
                  assignedHospitalId,
                  completedInterventions: appliedInterventions
                });
              }
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" /> Save Triage Chart
          </button>
        </div>
      </div>
    </div>
  );
}
