import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Clock, 
  Volume2, 
  VolumeX, 
  Key, 
  HeartHandshake, 
  FileText, 
  Radio, 
  Sparkles,
  AlertTriangle,
  Trophy
} from 'lucide-react';
import { audioEngine } from '../services/speechService';
import { getStoredApiKey } from '../services/geminiService';

export default function Header({
  scenarios,
  currentScenario,
  onSelectScenario,
  onOpenApiKeyModal,
  onOpenCprModal,
  onOpenMistModal,
  onOpenHackathonModal,
  isMuted,
  onToggleMute,
  casualties
}) {
  // Live Golden Hour countdown timer
  const [secondsRemaining, setSecondsRemaining] = useState(
    currentScenario.goldenHourRemainingMinutes * 60
  );

  useEffect(() => {
    setSecondsRemaining(currentScenario.goldenHourRemainingMinutes * 60);
  }, [currentScenario]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (prev === 1) audioEngine.playEmergencyTone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = minutes < 30;
  const isCritical = minutes < 15;

  const redCount = casualties.filter(c => c.triageCode === 'RED').length;
  const apiKeySet = Boolean(getStoredApiKey());

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Incident Title */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-wider text-white uppercase flex items-center gap-2">
                GoldenHour<span className="text-red-500 font-mono">-ZERO</span>
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-600/60 text-red-300 font-semibold tracking-wide flex items-center gap-1">
                <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                MCI LEVEL 2 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span>TACTICAL EMERGENCY MEDICAL DISPATCH & TRIAGE AI</span>
            </p>
          </div>
        </div>

        {/* Central HUD: Scenario Switcher & Golden Hour Countdown */}
        <div className="flex items-center gap-4">
          {/* Scenario Selector */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
            <ShieldAlert className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
            <select
              value={currentScenario.id}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-200 outline-none cursor-pointer pr-2"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Golden Hour Countdown Clock */}
          <div className={`flex items-center px-3 py-1 rounded-lg border font-mono transition-all ${
            isCritical
              ? 'bg-red-950/70 border-red-500/80 text-red-200 shadow-lg shadow-red-950/50 animate-pulse'
              : isUrgent
              ? 'bg-amber-950/50 border-amber-500/70 text-amber-200'
              : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
          }`}>
            <Clock className={`w-4 h-4 mr-2 ${isCritical ? 'text-red-400 animate-spin' : isUrgent ? 'text-amber-400' : 'text-emerald-400'}`} />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans leading-none">
                Golden Hour Window
              </div>
              <div className="text-sm font-bold tracking-widest">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* H2S Hackathon Presentation & Live Demo */}
          <button
            onClick={onOpenHackathonModal}
            title="Open Hack2Skill Presentation & Demo Guide"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/60 text-amber-300 hover:from-amber-500/30 hover:to-red-500/30 transition shadow-sm animate-pulse"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">H2S Pitch & Demo</span>
          </button>

          {/* CPR Metronome Quick Launch */}
          <button
            onClick={onOpenCprModal}
            title="Launch AHA CPR Metronome"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-300 hover:bg-rose-900/60 transition shadow-sm"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">CPR Metronome</span>
          </button>

          {/* MIST Report Modal */}
          <button
            onClick={onOpenMistModal}
            title="Generate Emergency MIST Handover Report"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-950/60 border border-blue-600/50 text-blue-300 hover:bg-blue-900/60 transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">MIST Report</span>
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Tactical Audio' : 'Mute Tactical Audio'}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* API Key Modal */}
          <button
            onClick={onOpenApiKeyModal}
            title="Configure Gemini API Key"
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${
              apiKeySet
                ? 'bg-purple-950/50 border-purple-500/60 text-purple-300 hover:bg-purple-900/50'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${apiKeySet ? 'text-purple-400' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{apiKeySet ? 'Gemini 2.0 Live' : 'AI Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
