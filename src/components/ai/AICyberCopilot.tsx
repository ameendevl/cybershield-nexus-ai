import { useState, useRef, useEffect } from 'react';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { useApp } from '../../store/AppContext';
import { Bot, Send, Sparkles, Zap } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: { label: string; actionType: string };
  codeBlock?: string;
}

const INITIAL_PROMPTS = [
  'Analyze IP 45.33.32.156 for Cobalt Strike C2 indicators',
  'Generate YARA rule for Mimikatz LSASS memory dumping',
  'Isolate infected endpoint FIN-SRV-01 (10.0.2.10)',
  'Run Volatility 3 pstree analysis on memory dump'
];

export default function AICyberCopilot() {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings Analyst. I am CyberShield Nexus Autonomous AI Copilot. How can I assist you with threat hunting, IOC triage, or automated response today?',
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    soundService.playSuccessBeep();

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      soundService.playSuccessBeep();
      let aiText = '';
      let codeBlock = undefined;
      let suggestedAction = undefined;

      const lower = q.toLowerCase();
      if (lower.includes('cobalt strike') || lower.includes('45.33.32.156')) {
        aiText = `[AI Threat Analysis] IP 45.33.32.156 is flagged as High Confidence Cobalt Strike Beacon C2. Geolocation: RU, ASN: 4134 Chinanet. 14 / 16 AV Engines detected malicious TLS certificate payload.`;
        suggestedAction = { label: 'Block IP on Perimeter Firewall & Trigger SOAR Isolation', actionType: 'block_ip' };
      } else if (lower.includes('yara') || lower.includes('mimikatz')) {
        aiText = `[AI YARA Rule Synthesizer] Generated optimized YARA signature targeting Mimikatz memory injection pattern:`;
        codeBlock = `rule CyberShield_Mimikatz_LSASS_Inject {\n  meta:\n    description = "Detects LSASS Memory dumping via Mimikatz securlsa::logonpasswords"\n    author = "Nexus AI Copilot"\n  strings:\n    $s1 = "securlsa::logonpasswords" ascii wide\n    $s2 = "wdigest.dll" ascii wide\n  condition:\n    uint16(0) == 0x5A4D and all of ($s*)\n}`;
        suggestedAction = { label: 'Deploy YARA Rule to Endpoint Agents', actionType: 'deploy_yara' };
      } else if (lower.includes('isolate') || lower.includes('fin-srv-01')) {
        aiText = `[AI Active Containment] Preparing Zero-Trust Endpoint Isolation for FIN-SRV-01 (10.0.2.10). All incoming/outgoing TCP traffic except EDR management channel will be dropped immediately.`;
        suggestedAction = { label: 'Confirm Active Endpoint Isolation', actionType: 'isolate_host' };
      } else {
        aiText = `[AI Analysis Complete] Investigated telemetry query for "${q}". Automated correlation across 2,400 SIEM logs shows 0 active critical lateral movements detected in the past 15 minutes. Infrastructure health remains STABLE.`;
      }

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        codeBlock,
        suggestedAction,
      };

      setIsThinking(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 1400);
  };

  const handleExecuteAction = (actionType: string) => {
    soundService.playAlertAlarm();
    alert(`AI Autonomous Action Dispatched: [${actionType.toUpperCase()}] executed across security infrastructure successfully.`);
  };

  return (
    <ViewContainer>
      <SectionTitle
        title="Autonomous AI Cyber Copilot & Threat Triage Agent"
        subtitle="Natural language threat hunting, automated YARA synthesis, and Active Copilot containment"
        icon={<Bot className={`w-6 h-6 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />}
      />

      <CyberPanel title="Nexus Autonomous Defense Copilot Terminal" icon={<Sparkles className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />}>
        <div className="p-4 space-y-4 font-mono text-xs">
          
          {/* Prompt Preset Badges */}
          <div className="space-y-1.5">
            <p className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Suggested AI Security Commands</p>
            <div className="flex flex-wrap gap-2">
              {INITIAL_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className={`px-3 py-1.5 rounded-xl border font-semibold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isLight
                      ? 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-800'
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Terminal Box */}
          <div className={`h-96 overflow-y-auto rounded-2xl border p-4 space-y-3 font-mono leading-relaxed ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800 shadow-inner'
              : 'bg-black/95 border-cyan-500/20 text-gray-200'
          }`}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col gap-1.5 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-center gap-2 text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  {m.sender === 'ai' ? (
                    <div className={`flex items-center gap-1.5 ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isLight ? 'bg-cyan-100 border-cyan-300 text-cyan-800' : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-400'
                      }`}>
                        <Bot className="w-3 h-3" />
                      </div>
                      <span>Nexus AI Copilot</span>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1.5 ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>
                      <span>SOC Analyst</span>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isLight ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-purple-500/20 border-purple-400/40 text-purple-400'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                  <span className={`font-mono text-[9px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>{m.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-2xl text-xs font-medium shadow-sm ${
                    m.sender === 'user'
                      ? isLight
                        ? 'bg-purple-50 border border-purple-200 text-purple-950'
                        : 'bg-purple-500/15 border border-purple-500/30 text-purple-200'
                      : isLight
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                        : 'bg-black/70 border border-cyan-500/30 text-gray-200'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {m.codeBlock && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 relative group">
                      <pre className="overflow-x-auto">{m.codeBlock}</pre>
                    </div>
                  )}

                  {m.suggestedAction && (
                    <div className={`mt-3 pt-2.5 border-t flex items-center justify-between ${
                      isLight ? 'border-slate-200' : 'border-cyan-500/20'
                    }`}>
                      <span className={`text-[10px] font-bold uppercase ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>Copilot Action Trigger</span>
                      <button
                        onClick={() => handleExecuteAction(m.suggestedAction!.actionType)}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 text-white font-bold text-[10px] uppercase flex items-center gap-1 shadow-md cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-white fill-current" />
                        <span>{m.suggestedAction.label}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className={`flex items-center gap-2 font-mono text-xs py-2 animate-pulse ${
                isLight ? 'text-cyan-800' : 'text-cyan-400'
              }`}>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Nexus AI Copilot is correlating SIEM telemetry & generating response...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI Copilot to analyze threats, synthesize YARA, or isolate hosts..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className={`flex-1 p-3 rounded-xl border text-xs focus:outline-none font-mono ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600 placeholder-slate-400 shadow-sm'
                  : 'bg-black/80 border-cyan-500/30 text-gray-200 focus:border-cyan-400 placeholder-gray-500'
              }`}
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shrink-0 hover:brightness-110 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Query AI</span>
            </button>
          </div>

        </div>
      </CyberPanel>
    </ViewContainer>
  );
}
