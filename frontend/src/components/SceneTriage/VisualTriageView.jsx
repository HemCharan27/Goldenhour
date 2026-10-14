import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  Camera, 
  Upload, 
  Eye, 
  Flame, 
  Zap, 
  AlertOctagon, 
  RefreshCw, 
  Maximize2,
  Video,
  Radio,
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { analyzeSceneWithGemini } from '../../services/geminiService';
import { audioEngine } from '../../services/speechService';

export default function VisualTriageView({
  scenario,
  casualties,
  onSelectCasualty,
  selectedCasualtyId
}) {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [customImage, setCustomImage] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop webcam when unmounted or switched
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartWebcam = async () => {
    try {
      setCustomImage(null);
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Unable to access camera: ' + err.message);
      setIsWebcamActive(false);
    }
  };

  const handleStopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleStopWebcam();
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAiScan = async () => {
    setIsScanning(true);
    audioEngine.playEmergencyTone();
    try {
      const result = await analyzeSceneWithGemini({
        imageSrc: customImage || scenario.imageUrl,
        scenarioContext: scenario
      });
      setScanResult(result);
      audioEngine.playRadioChime();
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const currentImage = customImage || scenario.imageUrl;

  const getTriageColor = (code) => {
    switch (code) {
      case 'RED': return { border: 'border-red-500', bg: 'bg-red-500', glow: 'shadow-red-500/50' };
      case 'YELLOW': return { border: 'border-amber-500', bg: 'bg-amber-500', glow: 'shadow-amber-500/50' };
      case 'GREEN': return { border: 'border-emerald-500', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50' };
      case 'BLACK': return { border: 'border-slate-400', bg: 'bg-slate-700', glow: 'shadow-slate-500/50' };
      default: return { border: 'border-blue-500', bg: 'bg-blue-500', glow: 'shadow-blue-500/50' };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
      {/* Visual Header */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 font-mono">
          <Scan className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="font-bold text-white tracking-wider uppercase">
            Multimodal Computer Vision Feed
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
            {isWebcamActive ? 'LIVE CAMERA STREAM' : 'DRONE / BODYCAM HD FEED'}
          </span>
        </div>

        {/* View Controls & Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Layer Toggles */}
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-2 py-1 rounded font-mono transition text-[11px] flex items-center gap-1 ${
              showBoundingBoxes ? 'bg-red-950/80 border border-red-600 text-red-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Eye className="w-3 h-3" /> START Tags
          </button>

          <button
            onClick={() => setShowHazards(!showHazards)}
            className={`px-2 py-1 rounded font-mono transition text-[11px] flex items-center gap-1 ${
              showHazards ? 'bg-amber-950/80 border border-amber-600 text-amber-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Flame className="w-3 h-3" /> Hazards
          </button>

          {/* Webcam Button */}
          {!isWebcamActive ? (
            <button
              onClick={handleStartWebcam}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono transition flex items-center gap-1"
              title="Use Device Camera"
            >
              <Camera className="w-3 h-3" /> Cam
            </button>
          ) : (
            <button
              onClick={handleStopWebcam}
              className="px-2 py-1 rounded bg-red-600 text-white font-mono transition flex items-center gap-1"
            >
              Stop Cam
            </button>
          )}

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono transition flex items-center gap-1"
            title="Upload Incident Photo / Drone Frame"
          >
            <Upload className="w-3 h-3" /> Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* AI Trigger Scan */}
          <button
            onClick={triggerAiScan}
            disabled={isScanning}
            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold font-mono transition flex items-center gap-1.5 shadow-md shadow-red-950/50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'AI Scan'}
          </button>
        </div>
      </div>

      {/* Main Visual Display Canvas */}
      <div className="relative w-full aspect-video sm:min-h-[380px] bg-slate-950 overflow-hidden group select-none">
        {/* Background Image / Webcam stream */}
        {isWebcamActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={currentImage}
            alt="Emergency Scene"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />
        )}

        {/* Tactical HUD Overlay Elements (Scanline, Grid, Crosshair) */}
        <div className="absolute inset-0 pointer-events-none hud-scanline" />
        
        {/* Corner HUD framing */}
        <div className="absolute top-2 left-2 pointer-events-none font-mono text-[10px] text-red-500/80 bg-slate-950/60 px-2 py-0.5 rounded border border-red-500/30">
          LAT: {scenario.location.lat.toFixed(4)} N | LNG: {scenario.location.lng.toFixed(4)} W
        </div>
        <div className="absolute top-2 right-2 pointer-events-none font-mono text-[10px] text-emerald-400 bg-slate-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> REC 30FPS • AI ENGINE READY
        </div>

        {/* Scanning Animation */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-1 bg-gradient-to-r from-red-500 via-white to-red-500 shadow-lg shadow-red-500/80 animate-bounce transition-all duration-300" />
            <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center">
              <div className="bg-slate-900/90 border border-red-500/50 p-4 rounded-xl flex items-center space-x-3 text-red-400 font-mono shadow-2xl">
                <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-wider">
                    Analyzing Multimodal Visual Stream
                  </div>
                  <div className="text-xs text-slate-400">
                    Extracting bounding boxes, vitals & START triage categories...
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Casualty Bounding Boxes */}
        {showBoundingBoxes && !isWebcamActive && casualties.map(casualty => {
          const loc = casualty.locationInScene || { x: 30, y: 40, width: 20, height: 25 };
          const style = getTriageColor(casualty.triageCode);
          const isSelected = selectedCasualtyId === casualty.id;

          return (
            <div
              key={casualty.id}
              onClick={() => onSelectCasualty(casualty)}
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                width: `${loc.width}%`,
                height: `${loc.height}%`
              }}
              className={`absolute cursor-pointer border-2 transition-all rounded-lg group/box ${style.border} ${
                isSelected ? 'ring-4 ring-white shadow-2xl scale-105 z-30' : 'hover:scale-[1.02] z-20'
              }`}
            >
              {/* Corner crosshairs */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />

              {/* Triage Tag Badge */}
              <div className={`absolute -top-7 left-0 px-2 py-0.5 rounded text-[11px] font-mono font-black uppercase text-white shadow-lg flex items-center gap-1 ${style.bg}`}>
                <span>{casualty.triageCode}</span>
                <span className="text-[9px] font-normal opacity-90 hidden sm:inline">
                  [{casualty.name.split(' ')[0]}]
                </span>
              </div>

              {/* Injury Quick Pill on Hover */}
              <div className="absolute -bottom-6 left-0 right-0 opacity-0 group-hover/box:opacity-100 transition-opacity bg-slate-950/90 text-[10px] text-slate-200 font-sans p-1 rounded border border-slate-700 truncate text-center pointer-events-none">
                {casualty.injuries[0] || 'Assessing'}
              </div>
            </div>
          );
        })}

        {/* Hazard Zone Markers */}
        {showHazards && !isWebcamActive && scenario.hazards?.map((hazard, idx) => {
          const positions = [
            { x: 32, y: 72 },
            { x: 74, y: 35 },
            { x: 50, y: 25 }
          ];
          const pos = positions[idx % positions.length];

          return (
            <div
              key={hazard.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-help group/hazard"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-500/80 text-amber-400 flex items-center justify-center pulse-ring">
                  {hazard.type === 'FIRE_RISK' ? (
                    <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  ) : hazard.type === 'ELECTRICAL' ? (
                    <Zap className="w-4 h-4 text-amber-300" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-amber-400" />
                  )}
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-slate-950/95 border border-amber-500/50 text-[11px] text-slate-200 shadow-2xl opacity-0 group-hover/hazard:opacity-100 transition-opacity pointer-events-none z-40">
                  <div className="font-bold text-amber-400 font-mono uppercase flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3" /> {hazard.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {hazard.description}
                  </div>
                  <div className="text-[9px] font-mono text-amber-300/80 mt-1">
                    Exclusion Radius: {hazard.radiusMeters}m
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Sitrep Banner if scanned */}
      {scanResult && (
        <div className="p-3 bg-red-950/30 border-t border-red-500/30 text-xs font-mono text-slate-300 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-red-300 uppercase">AI Scene Assessment: </span>
            <span>{scanResult.sceneSafetyAssessment} </span>
            <span className="text-amber-400 font-semibold block mt-0.5">
              Tactical Recommendation: {scanResult.dispatchRecommendation}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
