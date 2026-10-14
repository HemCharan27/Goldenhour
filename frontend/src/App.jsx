import React, { useState } from 'react';
import Header from './components/Header';
import TriageSummaryCards from './components/SceneTriage/TriageSummaryCards';
import VisualTriageView from './components/SceneTriage/VisualTriageView';
import CasualtyDetailModal from './components/SceneTriage/CasualtyDetailModal';
import TacticalMap from './components/DispatchMap/TacticalMap';
import AudioAnalysisPanel from './components/AudioTriage/AudioAnalysisPanel';
import CprMetronomeModal from './components/AudioTriage/CprMetronomeModal';
import DispatcherCopilot from './components/Copilot/DispatcherCopilot';
import MistReportModal from './components/Copilot/MistReportModal';
import ApiKeyModal from './components/Common/ApiKeyModal';

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
  Sparkles
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
  const [isMuted, setIsMuted] = useState(false);
  const [notification, setNotification] = useState(null);

  // Active view tab on smaller viewports
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'vision' | 'map' | 'audio' | 'copilot'

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
    }, 4000);
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
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        casualties={casualties}
      />

      {/* Main Command Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 space-y-4">
        {/* Incident Sitrep Strip */}
        <div className="bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
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
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {currentScenario.title} • <span className="text-slate-300 font-normal">{currentScenario.location.address}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-3xl">
                {currentScenario.sceneOverview}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDispatchAll}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-red-950/50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Full Fleet
            </button>
          </div>
        </div>

        {/* Triage Count Categories Filter */}
        <TriageSummaryCards
          casualties={casualties}
          selectedCategory={selectedCategoryFilter}
          onSelectCategory={setSelectedCategoryFilter}
        />

        {/* Responsive Layout Grid: Left Column (Vision + Map) | Right Column (Audio + Copilot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Multimodal Vision & Tactical Map (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Multimodal Vision Feed */}
            <VisualTriageView
              scenario={currentScenario}
              casualties={filteredCasualties}
              onSelectCasualty={(cas) => setSelectedCasualty(cas)}
              selectedCasualtyId={selectedCasualty?.id}
            />

            {/* Tactical GIS Map */}
            <TacticalMap
              scenario={currentScenario}
              fleet={fleet}
              hospitals={hospitals}
              onDispatchUnit={handleDispatchUnit}
            />
          </div>

          {/* Right Column: 911 Audio Feed & AI Copilot (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 911 Acoustic & Speech Analysis */}
            <AudioAnalysisPanel
              scenario={currentScenario}
              onLaunchCpr={() => setIsCprModalOpen(true)}
            />

            {/* AI Multimodal Dispatcher Copilot */}
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
      </main>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-emerald-500/60 p-3 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs text-emerald-300 font-mono animate-bounce">
          <BellRing className="w-4 h-4 text-emerald-400" />
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 px-4 text-center text-xs font-mono text-slate-500">
        GOLDENHOUR-ZERO v1.0 • MILITARY & TACTICAL EMS TRIAGE ENGINE • ATLS & START PROTOCOL CERTIFIED
      </footer>
    </div>
  );
}
