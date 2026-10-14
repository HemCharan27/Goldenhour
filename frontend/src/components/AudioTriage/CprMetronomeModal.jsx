import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Zap, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { audioEngine } from '../../services/speechService';

export default function CprMetronomeModal({ isOpen, onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [beatPulse, setBeatPulse] = useState(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(1);

  useEffect(() => {
    if (isRunning) {
      audioEngine.startCprMetronome(bpm, () => {
        setBeatPulse(true);
        setTimeout(() => setBeatPulse(false), 90);

        setCompressionCount(prev => {
          const next = prev + 1;
          if (next >= 30) {
            audioEngine.speakAnnouncement('Deliver two rescue breaths');
            setCycleCount(c => c + 1);
            return 0;
          }
          return next;
        });
      });
    } else {
      audioEngine.stopMetronome();
    }

    return () => {
      audioEngine.stopMetronome();
    };
  }, [isRunning, bpm]);

  if (!isOpen) return null;

  const handleToggle = () => {
    setIsRunning(prev => !prev);
  };

  const handleClose = () => {
    setIsRunning(false);
    audioEngine.stopMetronome();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-rose-500/50 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-rose-600 text-white">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                AHA Pre-Arrival CPR Metronome & Coaching
              </h2>
              <p className="text-xs text-rose-300">
                100 - 120 Compressions Per Minute Cadence
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metronome Visualizer */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-950/70 border-b border-slate-800 space-y-4">
          <div className="relative">
            {/* Visual Beat Indicator */}
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-transform duration-75 ${
              beatPulse
                ? 'scale-110 bg-rose-600/30 border-rose-500 shadow-xl shadow-rose-600/50'
                : 'scale-100 bg-slate-900 border-slate-700'
            }`}>
              <Heart className={`w-16 h-16 transition-colors duration-75 ${
                beatPulse ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
              }`} />
            </div>

            {/* Ripple ring on beat */}
            {beatPulse && (
              <div className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping" />
            )}
          </div>

          {/* Counters */}
          <div className="text-center space-y-1">
            <div className="text-4xl font-black font-mono text-white tracking-widest">
              {compressionCount} <span className="text-xs text-slate-400 font-sans font-normal">/ 30 compressions</span>
            </div>
            <div className="text-xs font-mono text-rose-400 font-semibold uppercase">
              Cycle {cycleCount} • 30:2 Resuscitation Ratio
            </div>
          </div>

          {/* BPM Selector */}
          <div className="flex items-center space-x-3 pt-2">
            {[100, 110, 120].map(val => (
              <button
                key={val}
                onClick={() => setBpm(val)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  bpm === val
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {val} BPM
              </button>
            ))}
          </div>

          {/* Start/Stop Button */}
          <button
            onClick={handleToggle}
            className={`w-full max-w-xs py-3 rounded-xl font-bold font-mono text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition ${
              isRunning
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 fill-current" /> Stop Metronome
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Start Rhythm Guide
              </>
            )}
          </button>
        </div>

        {/* BLS Instructions Guide */}
        <div className="p-4 bg-slate-900 space-y-2 text-xs">
          <span className="font-mono text-slate-400 uppercase tracking-wider block font-bold">
            Emergency Pre-Arrival Verbal Guidance:
          </span>
          <ul className="space-y-1.5 text-slate-300 font-sans">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Hand Placement:</strong> Place heel of hand in center of bare chest, interlock fingers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Depth & Recoil:</strong> Compress at least 2 inches (5 cm) deep. Allow chest to fully rise.</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>AED Priority:</strong> As soon as AED arrives, apply pads immediately. Follow AED voice prompts.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
