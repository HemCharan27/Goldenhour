import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function MistReportModal({
  isOpen,
  onClose,
  scenario,
  casualties,
  hospitals
}) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const reportText = `=====================================================
GOLDENHOUR-ZERO | TACTICAL EMERGENCY MIST HANDOVER REPORT
=====================================================
INCIDENT: ${scenario.title}
LOCATION: ${scenario.location.address}
TIME OF DISPATCH: ${new Date().toLocaleString()}
TRIAGE PROTOCOL: START (Simple Triage and Rapid Treatment)
MCI STATUS: LEVEL 2 ACTIVE

-----------------------------------------------------
[M] - MECHANISM OF INJURY
-----------------------------------------------------
${scenario.sceneOverview}
HAZARDS IDENTIFIED:
${scenario.hazards.map(h => `- ${h.label} (${h.severity}): ${h.description}`).join('\n')}

-----------------------------------------------------
[I] - INJURIES SUSTAINED BY CASUALTY
-----------------------------------------------------
${casualties.map(c => `
CASUALTY ID: ${c.id} (${c.name})
TRIAGE CATEGORY: ${c.triageCategory} [${c.triageCode}]
REPORTED TRAUMA: ${c.injuries.join(', ')}
STATUS: ${c.status}
`).join('')}

-----------------------------------------------------
[S] - SIGNS & PHYSIOLOGICAL VITALS
-----------------------------------------------------
${casualties.map(c => `
${c.name} [${c.triageCode}]:
  * Respirations: ${c.respirations}
  * Perfusion/Pulse: ${c.perfusion}
  * Mental Status: ${c.mentalStatus}
`).join('')}

-----------------------------------------------------
[T] - TREATMENT ADMINISTERED / ACTIONS UNDERWAY
-----------------------------------------------------
${casualties.map(c => `
${c.name}:
  * Required Field Actions: ${c.recommendedActions.join('; ')}
  * Destination Hospital: ${
    hospitals.find(h => h.id === c.assignedHospitalId)?.shortName || 'Zuckerberg SF General'
  }
`).join('')}

=====================================================
END OF MIST HANDOVER REPORT
=====================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Emergency MIST Handover Report
              </h2>
              <p className="text-xs text-slate-400">
                Mechanism • Injuries • Signs • Treatment (ATLS Handover Format)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap text-slate-300 leading-relaxed max-h-[55vh] overflow-y-auto">
            {reportText}
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Ready for Hospital Trauma Bay Handover
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
