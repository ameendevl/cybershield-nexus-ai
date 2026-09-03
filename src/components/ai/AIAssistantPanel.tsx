import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Sparkles, AlertTriangle, Zap, User, Cpu, Trash2, Key, Code, CheckCircle2, FileText, Search } from 'lucide-react';
import { aiService, type ThreatAnalysisResult, type LogAnalysisResult } from '../../services/aiService';
import { soundService } from '../../services/soundService';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  insights?: { label: string; value: string; color: string }[];
}

const DEFAULT_TEST_LOGS = `[2026-08-14 03:22:11] FAILED LOGIN - user: admin - IP: 45.33.32.156 - attempts: 47
[2026-08-14 03:22:15] FAILED LOGIN - user: root - IP: 45.33.32.156 - attempts: 52
[2026-08-14 03:22:45] PORT SCAN DETECTED - IP: 192.168.1.200 - ports: 22,80,443,3306
[2026-08-14 03:23:01] SQL INJECTION ATTEMPT - endpoint: /api/users - IP: 10.0.0.55
[2026-08-14 03:23:30] MALWARE HASH MATCH - file: update.exe - hash: a1b2c3d4e5f6`;

const DEFAULT_THREAT_PAYLOAD = {
  type: 'SQL Injection',
  source_ip: '192.168.1.105',
  target: 'login.php',
  payload: "' OR 1=1 --",
  timestamp: new Date().toISOString(),
};

export default function AIAssistantPanel() {
  const [activeTab, setActiveTab] = useState<'chat' | 'threat' | 'logs'>('chat');
  const [apiKeyInput, setApiKeyInput] = useState(aiService.getApiKey());
  const [hasApiKey, setHasApiKey] = useState(!!aiService.getApiKey());
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "I'm CyberShield AI — your expert Enterprise SOC Assistant powered by Claude. I can analyze threats, investigate security logs, assess vulnerabilities, and recommend immediate countermeasures.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Threat Analyzer state
  const [threatInputText, setThreatInputText] = useState(JSON.stringify(DEFAULT_THREAT_PAYLOAD, null, 2));
  const [threatAnalysis, setThreatAnalysis] = useState<ThreatAnalysisResult | null>(null);
  const [isAnalyzingThreat, setIsAnalyzingThreat] = useState(false);

  // Log Analyzer state
  const [logInputText, setLogInputText] = useState(DEFAULT_TEST_LOGS);
  const [logAnalysis, setLogAnalysis] = useState<LogAnalysisResult | null>(null);
  const [isAnalyzingLogs, setIsAnalyzingLogs] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // 1. SOC Chat Assistant
  const handleSendChat = async (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    soundService.playSuccessBeep();
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const res = await aiService.socChat(query);
      soundService.playSuccessBeep();
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: res.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          content: 'Error connecting to AI service. Please verify your clearance.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearHistory = () => {
    aiService.clearChatHistory();
    setMessages([
      {
        id: 'welcome-cleared',
        role: 'ai',
        content: 'Chat conversation history cleared. How can I assist with your SOC operations today?',
        timestamp: new Date(),
      },
    ]);
  };

  // 2. Threat Analysis
  const handleRunThreatAnalysis = async () => {
    setIsAnalyzingThreat(true);
    setThreatAnalysis(null);

    try {
      const parsedData = JSON.parse(threatInputText);
      const result = await aiService.analyzeThreat(parsedData);
      setThreatAnalysis(result);
    } catch (e: any) {
      alert('Invalid JSON input for threat analysis: ' + e.message);
    } finally {
      setIsAnalyzingThreat(false);
    }
  };

  // 3. Log Analysis
  const handleRunLogAnalysis = async () => {
    setIsAnalyzingLogs(true);
    setLogAnalysis(null);

    try {
      const result = await aiService.analyzeLogs(logInputText);
      setLogAnalysis(result);
    } catch (e: any) {
      alert('Error analyzing logs: ' + e.message);
    } finally {
      setIsAnalyzingLogs(false);
    }
  };

  const handleSaveApiKey = () => {
    aiService.setApiKey(apiKeyInput.trim());
    setHasApiKey(!!apiKeyInput.trim());
    setShowApiKeyModal(false);
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl border border-cyan-500/30 overflow-hidden font-mono shadow-2xl bg-cyber-darker/90">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-cyan-500/15 bg-gradient-to-r from-cyber-darker via-black/80 to-cyber-darker gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-300/40">
              <Brain className="w-5 h-5 text-cyber-dark" />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-cyber-darker ${hasApiKey ? 'bg-emerald-400 animate-ping' : 'bg-yellow-400'}`} />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-cyan-300 tracking-wider uppercase flex items-center gap-2">
              CyberShield AI Analyst <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">CLAUDE SONNET 4.6</span>
            </h2>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Automated Threat Intelligence & Log Forensics
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiKeyModal(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              hasApiKey
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/20'
                : 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/25'
            }`}
            title="Configure Anthropic Claude API Key"
          >
            <Key className="w-3.5 h-3.5 text-yellow-400" />
            <span>{hasApiKey ? '🟢 Live API Active' : '🔑 Add Anthropic Key'}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 hover:text-red-300 transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1.5 bg-black/60 border-b border-cyan-500/15">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'chat'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>SOC Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('threat')}
          className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'threat'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Threat Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'logs'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Log & Alert AI</span>
        </button>
      </div>

      {/* Live AI API Status Banner */}
      <div className={`px-4 py-2 text-[11px] font-mono flex items-center justify-between border-b ${
        hasApiKey
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
      }`}>
        <span className="flex items-center gap-2">
          {hasApiKey ? '🟢 Live Google Gemini 3.6 Flash & SOC AI Engine Active' : '⚡ Built-in SOC AI Engine Active'}
        </span>
        <button
          onClick={() => setShowApiKeyModal(true)}
          className="underline font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer"
        >
          {hasApiKey ? 'Update Key' : 'Enter API Key'}
        </button>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4 bg-cyber-darker">
            <h3 className="text-base font-display font-bold text-cyan-300 flex items-center gap-2">
              <Key className="w-5 h-5 text-yellow-400" /> Configure Google Gemini / Claude Key
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Paste your <code className="text-cyan-300">aistudio.google.com</code> or Anthropic API key below:
            </p>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AQ... or AIzaSy... or sk-ant-..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-cyan-500/30 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold hover:bg-cyan-500/30"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: SOC CHAT ASSISTANT */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-gray-800 border border-gray-700' : 'bg-gradient-to-br from-cyan-400 to-indigo-600'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-cyan-300" /> : <Cpu className="w-4 h-4 text-cyber-dark" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-100'
                      : 'bg-black/60 border border-cyan-500/20 text-gray-200 shadow-lg'
                  }`}>
                    {msg.content}
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3 items-center text-xs text-cyan-400 animate-pulse font-mono">
                <Brain className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>CyberShield AI is analyzing security context...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enterprise SOC Copilot Quick Action Chips */}
          <div className="px-4 py-2 bg-black/60 border-t border-cyan-500/15 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] text-cyan-400 font-bold uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> Actions:
            </span>
            {[
              'Analyze current threats',
              'Explain critical incident',
              'Generate incident report',
              'Show vulnerable nodes',
              'Recommend remediation',
            ].map((actionText, i) => (
              <button
                key={i}
                onClick={() => handleSendChat(actionText)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-300 text-[10px] text-cyan-300 font-mono whitespace-nowrap transition-all shadow-sm cursor-pointer"
              >
                {actionText}
              </button>
            ))}
          </div>

          {/* 1-Click Threat Hunting Quick Prompts */}
          <div className="px-4 pt-3 flex items-center gap-1.5 overflow-x-auto text-[10px] bg-black/40 border-t border-cyan-500/15">
            <span className="text-gray-500 font-bold uppercase shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Prompts:
            </span>
            <button
              onClick={() => handleSendChat('Generate YARA rule for detecting Ransomware payload')}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 font-mono shrink-0 transition-all"
            >
              Generate YARA Rule
            </button>
            <button
              onClick={() => handleSendChat('Analyze suspicious Cobalt Strike C2 beaconing pattern')}
              className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 font-mono shrink-0 transition-all"
            >
              Cobalt Strike Beaconing
            </button>
            <button
              onClick={() => handleSendChat('Provide emergency containment steps for SQL Injection attack')}
              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 font-mono shrink-0 transition-all"
            >
              Contain SQL Injection
            </button>
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-cyan-500/15 bg-black/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask CyberShield AI about threats, logs, or SOC actions..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/80 border border-cyan-500/20 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-cyber-dark font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: THREAT ANALYZER (JSON Format Output) */}
      {activeTab === 'threat' && (
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Code className="w-4 h-4 text-yellow-400" /> Input Threat Payload (JSON Data)
            </label>
            <textarea
              rows={6}
              value={threatInputText}
              onChange={(e) => setThreatInputText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-black/80 border border-cyan-500/20 text-xs text-yellow-300 font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={handleRunThreatAnalysis}
            disabled={isAnalyzingThreat}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/20"
          >
            {isAnalyzingThreat ? (
              <>
                <Brain className="w-4 h-4 animate-spin" />
                <span>Analyzing Threat Matrix...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Execute analyzeThreat(payload)</span>
              </>
            )}
          </button>

          {/* Structured Output Card */}
          {threatAnalysis && (
            <div className="p-5 rounded-2xl bg-black/80 border border-cyan-500/30 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase">SEVERITY LEVEL</span>
                  <p className={`text-base font-bold font-display ${
                    threatAnalysis.severity === 'CRITICAL' ? 'text-red-400' : threatAnalysis.severity === 'HIGH' ? 'text-orange-400' : 'text-yellow-400'
                  }`}>
                    {threatAnalysis.severity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase">RISK SCORE</span>
                  <p className="text-2xl font-display font-bold text-red-400">{threatAnalysis.risk_score}/100</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase">THREAT TYPE</span>
                <p className="text-xs font-bold text-cyan-300">{threatAnalysis.threat_type}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase">ANALYSIS SUMMARY</span>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">{threatAnalysis.summary}</p>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <span className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> RECOMMENDED IMMEDIATE ACTION
                </span>
                <p className="text-xs text-red-200 mt-1">{threatAnalysis.recommended_action}</p>
              </div>

              {/* JSON Code Snippet display */}
              <div className="pt-2">
                <span className="text-[10px] text-gray-500 uppercase">RAW JSON RETURN</span>
                <pre className="p-3 rounded-xl bg-cyber-darker text-[10px] text-emerald-400 overflow-x-auto mt-1 border border-cyan-500/10">
                  {JSON.stringify(threatAnalysis, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LOG & ALERT AI ANALYZER */}
      {activeTab === 'logs' && (
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Paste Raw Security Logs
            </label>
            <textarea
              rows={6}
              value={logInputText}
              onChange={(e) => setLogInputText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-black/80 border border-cyan-500/20 text-xs text-emerald-300 font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={handleRunLogAnalysis}
            disabled={isAnalyzingLogs}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            {isAnalyzingLogs ? (
              <>
                <Brain className="w-4 h-4 animate-spin" />
                <span>Analyzing Security Logs...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Execute analyzeLogs(logs)</span>
              </>
            )}
          </button>

          {/* Structured Log Output Card */}
          {logAnalysis && (
            <div className="p-5 rounded-2xl bg-black/80 border border-cyan-500/30 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase">ANOMALIES DETECTED</span>
                    <p className="text-xs font-bold text-emerald-300">{logAnalysis.anomalies_detected ? 'YES - ANOMALIES FOUND' : 'NONE'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase">OVERALL RISK</span>
                  <p className="text-sm font-display font-bold text-red-400">{logAnalysis.overall_risk}</p>
                </div>
              </div>

              {/* Detected IPs & Threats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <span className="text-[10px] text-red-400 font-bold uppercase">SUSPICIOUS IPS</span>
                  <div className="mt-1 space-y-0.5">
                    {logAnalysis.suspicious_ips.map((ip, idx) => (
                      <p key={idx} className="text-xs text-red-300 font-bold">{ip}</p>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-[10px] text-yellow-400 font-bold uppercase">TOP THREATS</span>
                  <div className="mt-1 space-y-0.5">
                    {logAnalysis.top_threats.map((t, idx) => (
                      <p key={idx} className="text-xs text-yellow-200">{t}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Immediate Actions */}
              <div>
                <span className="text-[10px] text-gray-400 uppercase">IMMEDIATE RECOMMENDED ACTIONS</span>
                <div className="mt-1.5 space-y-1">
                  {logAnalysis.immediate_actions.map((act, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Return Display */}
              <div className="pt-2">
                <span className="text-[10px] text-gray-500 uppercase">STRUCTURED JSON RESPONSE</span>
                <pre className="p-3 rounded-xl bg-cyber-darker text-[10px] text-emerald-400 overflow-x-auto mt-1 border border-cyan-500/10">
                  {JSON.stringify(logAnalysis, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
