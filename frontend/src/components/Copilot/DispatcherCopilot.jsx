import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  Radio, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Ambulance, 
  FileText 
} from 'lucide-react';
import { queryDispatcherCopilot } from '../../services/geminiService';
import { audioEngine } from '../../services/speechService';

export default function DispatcherCopilot({
  scenario,
  casualties,
  fleet,
  hospitals,
  onDispatchAll,
  onOpenMistModal
}) {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: `Tactical Copilot online for **${scenario.title}**. All 911 audio and computer vision streams calibrated. 4 casualties registered. Requesting authorization to deploy primary ALS units.`,
      timestamp: '10:42:05'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await queryDispatcherCopilot({
        message: query,
        scenario,
        casualties,
        fleet,
        hospitals
      });

      const aiMsg = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      audioEngine.playRadioChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text) => {
    const plainText = text.replace(/[*_#`]/g, '');
    audioEngine.speakAnnouncement(plainText);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl h-[460px]">
      {/* Header */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 font-mono">
          <Bot className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white tracking-wider uppercase">
            AI Multimodal Dispatcher Copilot
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          GEMINI MULTIMODAL REASONING
        </div>
      </div>

      {/* Quick Action Pills */}
      <div className="p-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center overflow-x-auto gap-2 text-xs">
        <button
          onClick={() => {
            onDispatchAll();
            handleSendMessage('Authorize all priority emergency fleet dispatches');
          }}
          className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-red-300 font-mono font-medium shrink-0 flex items-center gap-1 transition"
        >
          <Ambulance className="w-3.5 h-3.5 text-red-400" />
          Dispatch All ALS
        </button>

        <button
          onClick={() => handleSendMessage('Which hospitals have open Level 1 Trauma Bays and ORs?')}
          className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/50 text-purple-300 font-mono font-medium shrink-0 flex items-center gap-1 transition"
        >
          <Building2 className="w-3.5 h-3.5 text-purple-400" />
          Trauma Beds
        </button>

        <button
          onClick={() => handleSendMessage('Review START Triage algorithm criteria for Mass Casualty Incidents')}
          className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/50 text-blue-300 font-mono font-medium shrink-0 flex items-center gap-1 transition"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
          START Protocol
        </button>

        <button
          onClick={onOpenMistModal}
          className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-mono font-medium shrink-0 flex items-center gap-1 transition"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          MIST Report
        </button>
      </div>

      {/* Message Stream */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-950/50 text-xs">
        {messages.map(m => {
          const isAi = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center space-x-1.5 mb-1 px-1">
                <span className="font-mono text-[10px] text-slate-500">
                  {isAi ? 'DISPATCH COPILOT' : 'DISPATCHER'}
                </span>
                <span className="text-[9px] text-slate-600 font-mono">
                  {m.timestamp}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[90%] whitespace-pre-line leading-relaxed ${
                  isAi
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-blue-600 text-white shadow-md'
                }`}
              >
                {m.text}

                {isAi && (
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-end">
                    <button
                      onClick={() => handleSpeak(m.text)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition"
                      title="Read Announcement Aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 font-mono text-xs p-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Copilot analyzing multimodal telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask Copilot (e.g., 'Status of Patient Alpha', 'Direct units to Hospital')..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
