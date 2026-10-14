import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Volume2, 
  AlertTriangle, 
  Sparkles, 
  Mic, 
  Radio, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { audioEngine } from '../../services/speechService';

export default function AudioAnalysisPanel({
  scenario,
  onLaunchCpr
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioFeed = scenario.audioFeed || {
    caller: '911 Emergency Caller',
    duration: '01:30',
    transcript: 'Emergency reported at scene.',
    acousticEvents: []
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      audioEngine.playRadioChime();
      audioEngine.speakAnnouncement(audioFeed.transcript);
    } else {
      setIsPlaying(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
      {/* Panel Header */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 font-mono">
          <Headphones className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-white tracking-wider uppercase">
            911 Acoustic & Speech Analysis Stream
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
            {audioFeed.caller}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleTogglePlay}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              isPlaying
                ? 'bg-red-600 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Stop Audio
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play 911 Call
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio Waveform Canvas */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-purple-300">
            <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-red-400' : 'text-slate-500'}`} />
            ACOUSTIC WAVEFORM (TELEMETRY FREQ 16kHz)
          </span>
          <span>{audioFeed.duration}</span>
        </div>

        {/* Dynamic Simulated Waveform Bars */}
        <div className="h-14 flex items-center justify-between gap-1 px-1 bg-slate-900/60 rounded-xl border border-slate-800">
          {Array.from({ length: 42 }).map((_, i) => {
            const heightMultiplier = isPlaying ? Math.sin((i + Date.now() / 200)) * 40 + 50 : 20;
            const barHeight = Math.max(15, Math.min(95, heightMultiplier + (i % 7) * 8));

            return (
              <div
                key={i}
                style={{ height: `${barHeight}%` }}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  isPlaying
                    ? i % 4 === 0
                      ? 'bg-red-500 shadow-sm shadow-red-500'
                      : 'bg-purple-500'
                    : 'bg-slate-700/60'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Acoustic Events Detected */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/50">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Acoustic Biomarkers & Sound Event Classification
        </span>
        <div className="flex flex-wrap gap-2">
          {audioFeed.acousticEvents?.map((evt, idx) => (
            <div
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-purple-500/30 flex items-center space-x-2 text-xs"
            >
              <span className="font-semibold text-slate-200">{evt.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/50 text-purple-300 font-bold">
                {Math.round(evt.confidence * 100)}%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                @{evt.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Transcript & Urgent Tokens */}
      <div className="p-4 space-y-3 bg-slate-950/40 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            Speech-To-Text Transcription (Live)
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            CONFIDENCE: 98.4%
          </span>
        </div>

        <blockquote className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans italic border-l-4 border-l-red-500">
          "{audioFeed.transcript}"
        </blockquote>

        {/* Pre-Arrival Instructions (PAI) Trigger */}
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-red-300 font-mono uppercase block">
              Dispatcher Pre-Arrival Instructions (PAI)
            </span>
            <span className="text-slate-300 text-[11px]">
              Direct caller: Keep victim warm, do not move neck/c-spine, apply direct pressure to hemorrhage.
            </span>
          </div>
          <button
            onClick={onLaunchCpr}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold shrink-0 shadow"
          >
            Guide CPR
          </button>
        </div>
      </div>
    </div>
  );
}
