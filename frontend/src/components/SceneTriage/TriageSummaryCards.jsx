import React from 'react';
import { AlertCircle, Clock, ShieldCheck, Skull, Filter } from 'lucide-react';

export default function TriageSummaryCards({
  casualties,
  selectedCategory,
  onSelectCategory
}) {
  const counts = {
    RED: casualties.filter(c => c.triageCode === 'RED').length,
    YELLOW: casualties.filter(c => c.triageCode === 'YELLOW').length,
    GREEN: casualties.filter(c => c.triageCode === 'GREEN').length,
    BLACK: casualties.filter(c => c.triageCode === 'BLACK').length,
    TOTAL: casualties.length
  };

  const categories = [
    {
      code: 'RED',
      label: 'IMMEDIATE',
      sublabel: 'Life Threatening (< 60m)',
      count: counts.RED,
      icon: AlertCircle,
      bg: 'bg-red-950/40 border-red-500/70 text-red-200',
      badgeBg: 'bg-red-500/20 text-red-400 border border-red-500/40',
      activeRing: 'ring-2 ring-red-500'
    },
    {
      code: 'YELLOW',
      label: 'DELAYED',
      sublabel: 'Serious / Non-Immediate',
      count: counts.YELLOW,
      icon: Clock,
      bg: 'bg-amber-950/40 border-amber-500/70 text-amber-200',
      badgeBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
      activeRing: 'ring-2 ring-amber-500'
    },
    {
      code: 'GREEN',
      label: 'MINOR',
      sublabel: 'Ambulatory / Stable',
      count: counts.GREEN,
      icon: ShieldCheck,
      bg: 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      activeRing: 'ring-2 ring-emerald-500'
    },
    {
      code: 'BLACK',
      label: 'EXPECTANT',
      sublabel: 'Deceased / Non-salvageable',
      count: counts.BLACK,
      icon: Skull,
      bg: 'bg-slate-900 border-slate-700 text-slate-400',
      badgeBg: 'bg-slate-800 text-slate-300 border border-slate-600',
      activeRing: 'ring-2 ring-slate-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {categories.map(cat => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.code;

        return (
          <button
            key={cat.code}
            onClick={() => onSelectCategory(isSelected ? null : cat.code)}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${cat.bg} ${
              isSelected ? cat.activeRing + ' shadow-lg scale-[1.02]' : 'hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded ${cat.badgeBg}`}>
                {cat.label}
              </span>
              <Icon className="w-4 h-4 opacity-75 group-hover:scale-110 transition-transform" />
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono">
                {cat.count}
              </span>
              <span className="text-[10px] text-slate-400 font-sans truncate">
                {cat.sublabel}
              </span>
            </div>

            {isSelected && (
              <div className="absolute top-1 right-1">
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-950 font-bold">
                  ACTIVE FILTER
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
