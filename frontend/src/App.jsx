import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TriageSummaryCards from './components/SceneTriage/TriageSummaryCards';
import VisualTriageView from './components/SceneTriage/VisualTriageView';
import CasualtyRoster from './components/SceneTriage/CasualtyRoster';
import CasualtyDetailModal from './components/SceneTriage/CasualtyDetailModal';
import TacticalMap from './components/DispatchMap/TacticalMap';
import AudioAnalysisPanel from './components/AudioTriage/AudioAnalysisPanel';
import CprMetronomeModal from './components/AudioTriage/CprMetronomeModal';
import DispatcherCopilot from './components/Copilot/DispatcherCopilot';
import MistReportModal from './components/Copilot/MistReportModal';
import ApiKeyModal from './components/Common/ApiKeyModal';
import HackathonGuideModal from './components/Common/HackathonGuideModal';

import { MOCK_SCENARIOS } from './data/mockScenarios';
import { HOSPITALS } from './data/hospitalData';
import { INITIAL_FLEET } from './data/fleetData';
import { audioEngine } from './services/speechService';
import { 
  Activity, 
  MapPin, 
  Navigation, 
  Headphones, 
  Bot, 
  Send, 
  CheckCircle2, 
  BellRing,
  Layers,
  Sparkles,
  Users,
  Eye,
  Trophy,
  Play
} from 'lucide-react';

export default function App() {
  const [currentScenario, setCurrentScenario] = useState(MOCK_SCENARIOS[0]);
  const [casualties, setCasualties] = useState(MOCK_SCENARIOS[0].casualties);
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [hospitals, setHospitals] = useState(HOSPITALS);
  
  // Modals & Selection States
  const [selectedCasualty, setSelectedCasualty] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [isCprModalOpen, setIsCprModalOpen] = useState(false);
  const [isMistModalOpen, setIsMistModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [notification, setNotification] = useState(null);

  // Active view tab: 'overview' | 'roster' | 'vision' | 'map' | 'audio' | 'copilot'
  const [activeTab, setActiveTab] = useState('overview');

  // Simulated live GPS tracking for dispatched units
  useEffect(() => {
    const interval = setInterval(() => {
      setFleet(prevFleet => {
        const hasActiveUnits = prevFleet.some(u => u.status === 'DISPATCHED' || u.status === 'EN_ROUTE');
        if (!hasActiveUnits) return prevFleet;

        return prevFleet.map(unit => {
          if (unit.status === 'DISPATCHED' || unit.status === 'EN_ROUTE') {
            const targetLat = currentScenario.location.lat;
            const targetLng = currentScenario.location.lng;
            const newLat = unit.lat + (targetLat - unit.lat) * 0.2;
            const newLng = unit.lng + (targetLng - unit.lng) * 0.2;
            const newEta = Math.max(0, unit.etaMinutes - 1);
            const isArrived = newEta === 0 || (Math.abs(newLat - targetLat) < 0.003 && Math.abs(newLng - targetLng) < 0.003);

            if (isArrived && unit.status !== 'AT_SCENE') {
              audioEngine.speakAnnouncement(`${unit.callSign} has arrived at the incident scene.`);
            }

            return {
              ...unit,
              lat: newLat,
              lng: newLng,
              etaMinutes: newEta,
              status: isArrived ? 'AT_SCENE' : 'EN_ROUTE'
            };
          }
          return unit;
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [currentScenario]);

  // Switch scenario
  const handleSelectScenario = (scenarioId) => {
    const sc = MOCK_SCENARIOS.find(s => s.id === scenarioId) || MOCK_SCENARIOS[0];
    setCurrentScenario(sc);
    setCasualties(sc.casualties);
    setSelectedCasualty(null);
    showNotification(`Switched incident to: ${sc.title}`);
    audioEngine.playEmergencyTone();
    audioEngine.speakAnnouncement(`Loaded incident: ${sc.title}`);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioEngine.setMuted(newMuted);
  };

  // Dispatch individual unit
  const handleDispatchUnit = (unitId) => {
    setFleet(prev => prev.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          status: 'DISPATCHED'
        };
      }
      return unit;
    }));
    showNotification(`Unit ${unitId} tasked and rolling with sirens!`);
  };

  // Dispatch All Available Units
  const handleDispatchAll = () => {
    audioEngine.playEmergencyTone();
    audioEngine.speakAnnouncement('Authorizing all available ALS and rescue units to scene.');
    setFleet(prev => prev.map(u => ({
      ...u,
      status: u.status === 'AVAILABLE' ? 'DISPATCHED' : u.status
    })));
    showNotification('All emergency fleet units dispatched to incident scene!');
  };

  // Update casualty chart
  const handleUpdateCasualty = (updatedCasualty) => {
    setCasualties(prev => prev.map(c => (c.id === updatedCasualty.id ? updatedCasualty : c)));
    showNotification(`Updated chart for ${updatedCasualty.name}`);
  };

  // Automated 60-Second Hackathon Demo Flow for Judges
  const runInteractiveDemoFlow = () => {
    audioEngine.playEmergencyTone();
    audioEngine.speakAnnouncement('Initiating Hack2Skill demonstration walkthrough.');
    showNotification('🏆 Running Automated Demo Flow: Step 1 - Ingesting Multi-Casualty Incident...');

    handleSelectScenario(MOCK_SCENARIOS[0].id);

    setTimeout(() => {
      showNotification('Step 2: Dispatching all ALS Units & Locking Trauma Bay...');
      handleDispatchAll();
    }, 2000);

    setTimeout(() => {
      showNotification('Step 3: Opening Critical Red Tag Casualty Chart...');
      setSelectedCasualty(MOCK_SCENARIOS[0].casualties[0]);
    }, 4000);
  };

  const filteredCasualties = selectedCategoryFilter
    ? casualties.filter(c => c.triageCode === selectedCategoryFilter)
    : casualties;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        scenarios={MOCK_SCENARIOS}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenCprModal={() => setIsCprModalOpen(true)}
        onOpenMistModal={() => setIsMistModalOpen(true)}
        onOpenHackathonModal={() => setIsHackathonModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        casualties={casualties}
      />

      {/* Main Command Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 space-y-4">
        {/* Incident Sitrep Strip & Hackathon Banner */}
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400 shrink-0">
              <MapPin className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-600/30 text-red-300 font-bold border border-red-500/40">
                  {currentScenario.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  GRID: {currentScenario.location.lat.toFixed(4)}, {currentScenario.location.lng.toFixed(4)}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 font-semibold">
                  {currentScenario.location.weather}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                {currentScenario.title} • <span className="text-slate-300 font-normal">{currentScenario.location.address}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-3xl">
                {currentScenario.sceneOverview}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={runInteractiveDemoFlow}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-amber-950/40 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Demo Flow
            </button>

            <button
              onClick={handleDispatchAll}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-red-950/50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Fleet
            </button>
          </div>
        </div>

        {/* Triage Count Categories Filter */}
        <TriageSummaryCards
          casualties={casualties}
          selectedCategory={selectedCategoryFilter}
          onSelectCategory={setSelectedCategoryFilter}
        />

        {/* Tactical Navigation Tabs */}
        <div className="flex items-center overflow-x-auto space-x-1.5 p-1 bg-slate-900/70 border border-slate-800 rounded-xl text-xs font-mono">
          {[
            { id: 'overview', label: '🛡️ Unified Command Center' },
            { id: 'roster', label: `👥 Patient Roster (${casualties.length})` },
            { id: 'vision', label: '👁️ Computer Vision Triage' },
            { id: 'map', label: '🗺️ GIS Fleet & Hospital Network' },
            { id: 'audio', label: '🎧 911 Acoustic & CPR' },
            { id: 'copilot', label: '🤖 Gemini AI Dispatch Copilot' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition shrink-0 font-medium ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab View: Unified Command Center (Default Grid) */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Multimodal Vision & Tactical Map (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <VisualTriageView
                  scenario={currentScenario}
                  casualties={filteredCasualties}
                  onSelectCasualty={(cas) => setSelectedCasualty(cas)}
                  selectedCasualtyId={selectedCasualty?.id}
                />

                <TacticalMap
                  scenario={currentScenario}
                  fleet={fleet}
                  hospitals={hospitals}
                  onDispatchUnit={handleDispatchUnit}
                />
              </div>

              {/* Right Column: 911 Audio Feed & AI Copilot (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <AudioAnalysisPanel
                  scenario={currentScenario}
                  onLaunchCpr={() => setIsCprModalOpen(true)}
                />

                <DispatcherCopilot
                  scenario={currentScenario}
                  casualties={casualties}
                  fleet={fleet}
                  hospitals={hospitals}
                  onDispatchAll={handleDispatchAll}
                  onOpenMistModal={() => setIsMistModalOpen(true)}
                />
              </div>
            </div>

            {/* Casualty Roster Board at Bottom of Overview */}
            <CasualtyRoster
              casualties={filteredCasualties}
              hospitals={hospitals}
              fleet={fleet}
              onSelectCasualty={(cas) => setSelectedCasualty(cas)}
              selectedCasualtyId={selectedCasualty?.id}
            />
          </div>
        )}

        {/* Tab View: Patient Triage Roster */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <CasualtyRoster
              casualties={filteredCasualties}
              hospitals={hospitals}
              fleet={fleet}
              onSelectCasualty={(cas) => setSelectedCasualty(cas)}
              selectedCasualtyId={selectedCasualty?.id}
            />
          </div>
        )}

        {/* Tab View: Computer Vision & Thermal Feed */}
        {activeTab === 'vision' && (
          <div className="space-y-4">
            <VisualTriageView
              scenario={currentScenario}
              casualties={filteredCasualties}
              onSelectCasualty={(cas) => setSelectedCasualty(cas)}
              selectedCasualtyId={selectedCasualty?.id}
            />
          </div>
        )}

        {/* Tab View: Tactical GIS Fleet & Hospital Map */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <TacticalMap
              scenario={currentScenario}
              fleet={fleet}
              hospitals={hospitals}
              onDispatchUnit={handleDispatchUnit}
            />
          </div>
        )}

        {/* Tab View: 911 Audio & CPR Coaching */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AudioAnalysisPanel
              scenario={currentScenario}
              onLaunchCpr={() => setIsCprModalOpen(true)}
            />
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-3 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-rose-600/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white font-mono uppercase">
                AHA Out-of-Hospital CPR Coaching
              </h3>
              <p className="text-xs text-slate-400 max-w-md font-sans">
                Guide bystanders or first responders with synchronized 110 BPM acoustic metronome clicks, 30:2 chest compression cadence, and automated AED prompts.
              </p>
              <button
                onClick={() => setIsCprModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs uppercase tracking-wider transition shadow-lg shadow-rose-950/50"
              >
                Launch CPR Metronome
              </button>
            </div>
          </div>
        )}

        {/* Tab View: AI Copilot */}
        {activeTab === 'copilot' && (
          <div className="max-w-4xl mx-auto">
            <DispatcherCopilot
              scenario={currentScenario}
              casualties={casualties}
              fleet={fleet}
              hospitals={hospitals}
              onDispatchAll={handleDispatchAll}
              onOpenMistModal={() => setIsMistModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-emerald-500/60 p-3 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs text-emerald-300 font-mono animate-bounce">
          <BellRing className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Casualty Detail Modal */}
      {selectedCasualty && (
        <CasualtyDetailModal
          casualty={selectedCasualty}
          hospitals={hospitals}
          fleet={fleet}
          onClose={() => setSelectedCasualty(null)}
          onUpdateCasualty={handleUpdateCasualty}
        />
      )}

      {/* CPR Metronome Modal */}
      <CprMetronomeModal
        isOpen={isCprModalOpen}
        onClose={() => setIsCprModalOpen(false)}
      />

      {/* MIST Handover Report Modal */}
      <MistReportModal
        isOpen={isMistModalOpen}
        onClose={() => setIsMistModalOpen(false)}
        scenario={currentScenario}
        casualties={casualties}
        hospitals={hospitals}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Hackathon Guide Modal */}
      <HackathonGuideModal
        isOpen={isHackathonModalOpen}
        onClose={() => setIsHackathonModalOpen(false)}
        onRunDemo={runInteractiveDemoFlow}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3.5 px-4 text-center text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <span>GOLDENHOUR-ZERO v1.0 • HACK2SKILL SUBMISSION</span>
        <button
          onClick={() => setIsHackathonModalOpen(true)}
          className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
        >
          <Trophy className="w-3.5 h-3.5" /> View Project Pitch & Architecture
        </button>
        <span>ATLS & START TRIAGE PROTOCOL COMPLIANT</span>
      </footer>
    </div>
  );
}
