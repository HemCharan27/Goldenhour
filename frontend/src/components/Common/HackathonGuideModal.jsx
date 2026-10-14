import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Sparkles, 
  Activity, 
  Navigation, 
  Headphones, 
  ShieldCheck, 
  Play, 
  ExternalLink,
  Cpu,
  Layers,
  HeartPulse,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function HackathonGuideModal({
  isOpen,
  onClose,
  onRunDemo
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/50 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-red-950/80 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  GoldenHour-Zero • Hack2Skill Presentation
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  H2S SUBMISSION
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                AI Multimodal Emergency Scene Triage & Autonomous Dispatch Command
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Quick Pitch Hero */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> The 60-Minute "Golden Hour" Crisis
              </span>
              <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                50% PREVENTABLE TRAUMA DEATHS
              </span>
            </div>
            <p className="text-slate-300 font-sans">
              In severe mass-casualty incidents (MCIs), the first 60 minutes determine patient survival. Human dispatchers and field responders are overwhelmed by chaos, leading to delayed triage, misallocated ambulances, and ER saturation. <strong>GoldenHour-Zero</strong> unites <strong>Google Gemini Multimodal AI</strong>, <strong>Acoustic Event Detection</strong>, <strong>START Triage algorithms</strong>, and <strong>Tactical GIS Dispatch</strong> to automate life-saving decisions in seconds.
            </p>
          </div>

          {/* Core Technical Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase">
                <Cpu className="w-4 h-4" /> 1. Multimodal Scene Vision
              </div>
              <p className="text-[11px] text-slate-400">
                Ingests drone footage, bodycam video, or phone photos. Uses Gemini Vision to localize casualties via bounding boxes, classify hazard exclusion radiuses (fires, HAZMAT, electrical), and detect entrapment.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs uppercase">
                <Headphones className="w-4 h-4" /> 2. 911 Acoustic Biomarkers
              </div>
              <p className="text-[11px] text-slate-400">
                Analyzes background telemetry from emergency phone calls. Automatically flags acoustic biomarkers for caller panic, metal collision impacts, combustion crackles, and respiratory stridor.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs uppercase">
                <HeartPulse className="w-4 h-4" /> 3. START / SALT Clinical Engine
              </div>
              <p className="text-[11px] text-slate-400">
                Automates the Simple Triage & Rapid Treatment algorithm (Red/Yellow/Green/Black tags), manages individual Golden Hour countdown timers, and provides an interactive AHA 110 BPM CPR Metronome.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase">
                <Navigation className="w-4 h-4" /> 4. Tactical GIS & Fleet Automation
              </div>
              <p className="text-[11px] text-slate-400">
                Calculates real-time ETA, animates ambulance and rescue units en-route to the scene, and reserves Level 1 trauma bays and operating suites to prevent critical hospital delays.
              </p>
            </div>
          </div>

          {/* What to Demo to Judges */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
            <span className="font-mono text-amber-300 font-bold uppercase tracking-wider block">
              🎯 Recommended 60-Second Hackathon Demo Flow:
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 font-sans">
              <li><strong>Switch Incidents</strong> using the top dropdown (Highway 101 Pileup, Industrial Chlorine Blast, or Subway Arrest).</li>
              <li><strong>Run AI Scan</strong> on the vision feed to see dynamic casualty tags and fire hazard perimeter radiuses.</li>
              <li><strong>Click on Patient Alpha (Red Tag)</strong> to examine the START decision tree, vitals HUD, and apply a CAT Tourniquet.</li>
              <li><strong>Hit "Dispatch Full Fleet"</strong> to watch the tactical ambulances and rescue units animate en-route on the GIS map.</li>
              <li><strong>Launch CPR Metronome</strong> to hear and see the AHA 110 BPM chest compression audio guide.</li>
              <li><strong>Export MIST Handover Report</strong> to view the standardized trauma handover document ready for trauma surgeons.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            READY FOR H2S EVALUATION
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium text-xs transition"
            >
              Explore Manually
            </button>

            <button
              onClick={() => {
                onClose();
                if (onRunDemo) onRunDemo();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-mono font-bold text-xs transition shadow-lg flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Live Demo Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
