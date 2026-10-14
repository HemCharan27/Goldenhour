import React from 'react';
import { 
  Users, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Ambulance, 
  Building2, 
  FileText, 
  ChevronRight,
  Heart,
  Wind,
  Brain,
  AlertCircle
} from 'lucide-react';

export default function CasualtyRoster({
  casualties,
  hospitals,
  fleet,
  onSelectCasualty,
  selectedCasualtyId
}) {
  const getBadgeStyle = (code) => {
    switch (code) {
      case 'RED':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'YELLOW':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'GREEN':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'BLACK':
        return 'bg-slate-700/40 text-slate-300 border-slate-600';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <Users className="w-4 h-4 text-red-400" />
          <span className="font-bold text-white tracking-wider uppercase">
            MCI Patient Triage Roster & Acuity Tracking
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
            {casualties.length} CASUALTIES REGISTERED
          </span>
        </div>
      </div>

      {/* Roster Table / Card Grid */}
      <div className="divide-y divide-slate-800/80">
        {casualties.map(casualty => {
          const isSelected = selectedCasualtyId === casualty.id;
          const assignedUnit = fleet.find(u => u.id === casualty.assignedUnitId);
          const assignedHosp = hospitals.find(h => h.id === casualty.assignedHospitalId);
          const minutesRemaining = Math.max(0, Math.floor((casualty.goldenHourExpirySeconds || 1800) / 60));

          return (
            <div
              key={casualty.id}
              onClick={() => onSelectCasualty(casualty)}
              className={`p-3.5 sm:p-4 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-slate-800/90 border-l-4 border-l-red-500'
                  : 'hover:bg-slate-800/50 bg-slate-900/40'
              }`}
            >
              {/* Left Column: ID, Name, Acuity Badge & Trauma */}
              <div className="space-y-1.5 min-w-[240px]">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getBadgeStyle(casualty.triageCode)}`}>
                    {casualty.triageCode}: {casualty.triageCategory}
                  </span>
                  <span className="font-mono text-xs text-slate-400 font-semibold">
                    {casualty.id}
                  </span>
                </div>

                <div className="font-bold text-sm text-white flex items-center gap-2">
                  {casualty.name}
                  <span className="text-xs font-normal text-slate-400 font-mono">
                    [{casualty.gender}, {casualty.age}]
                  </span>
                </div>

                <div className="text-xs text-red-300/90 flex flex-wrap gap-1.5">
                  {casualty.injuries.map((inj, idx) => (
                    <span key={idx} className="bg-red-950/40 border border-red-500/30 px-1.5 py-0.5 rounded text-[10px] font-medium">
                      • {inj}
                    </span>
                  ))}
                </div>
              </div>

              {/* Middle Column: Vitals Quick Glance */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 min-w-[280px]">
                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Wind className="w-3 h-3 text-blue-400" /> Resp
                  </span>
                  <span className="font-bold text-slate-200 truncate block">
                    {casualty.respirations.split(',')[0]}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> Pulse
                  </span>
                  <span className="font-bold text-slate-200 truncate block">
                    {casualty.perfusion.split(',')[0]}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Brain className="w-3 h-3 text-purple-400" /> Mental
                  </span>
                  <span className="font-bold text-slate-200 truncate block">
                    {casualty.mentalStatus.split('(')[1]?.replace(')', '') || 'GCS Assess'}
                  </span>
                </div>
              </div>

              {/* Right Column: Golden Hour Window & Action Button */}
              <div className="flex items-center justify-between md:justify-end gap-3 min-w-[200px]">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Golden Hour Window
                  </span>
                  <span className={`text-xs font-mono font-bold ${
                    minutesRemaining < 20 ? 'text-red-400' : 'text-amber-300'
                  }`}>
                    {minutesRemaining > 0 ? `~${minutesRemaining} min remaining` : 'Non-salvageable'}
                  </span>
                  {assignedHosp && (
                    <span className="text-[10px] text-purple-300 font-mono block truncate max-w-[140px]">
                      🏥 {assignedHosp.shortName}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCasualty(casualty);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 transition shadow shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Chart</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
