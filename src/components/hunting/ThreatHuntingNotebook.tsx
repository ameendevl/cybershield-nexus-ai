import { useState } from 'react';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { Terminal, Play } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface QueryPreset {
  name: string;
  lang: 'KQL' | 'SPL' | 'LUCENE';
  query: string;
  resultSummary: string;
}

const PRESETS: QueryPreset[] = [
  { name: 'KQL: PowerShell Suspicious Encoded Execution', lang: 'KQL', query: 'SecurityEvent | where EventID == 4688 and ProcessCommandLine contains "-EncodedCommand"', resultSummary: 'Query Executed. 3 Matching Process Launches Found on Host DC01.' },
  { name: 'SPL: LSASS Memory Dump Access Violation', lang: 'SPL', query: 'index=sysmon EventCode=10 TargetImage="C:\\Windows\\System32\\lsass.exe" GrantedAccess=0x1010', resultSummary: 'Query Executed. 1 Alert Flagged on FIN-SRV-01.' },
  { name: 'Lucene: NGINX SQL Injection Payload Search', lang: 'LUCENE', query: 'source:nginx AND (request_uri:"*UNION*" OR request_uri:"*SELECT*")', resultSummary: 'Query Executed. 14 Blocked SQLi HTTP GET Requests.' },
];

export default function ThreatHuntingNotebook() {
  const [selectedPreset, setSelectedPreset] = useState<QueryPreset>(PRESETS[0]);
  const [queryInput, setQueryInput] = useState(PRESETS[0].query);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryOutput, setQueryOutput] = useState<string | null>(PRESETS[0].resultSummary);

  const handleRunQuery = () => {
    soundService.playAlertAlarm();
    setIsExecuting(true);
    setQueryOutput(null);

    setTimeout(() => {
      soundService.playSuccessBeep();
      setIsExecuting(false);
      setQueryOutput(`[Query Executed Successfully]: Match found across 14,200 indexed SIEM logs. 0 Critical lateral movements active.`);
    }, 1200);
  };

  return (
    <ViewContainer>
      <SectionTitle
        title="Jupyter-Style Threat Hunting SPL & KQL Query Notebook"
        subtitle="Execute Microsoft Sentinel KQL, Splunk SPL, and Elasticsearch Lucene threat hunting queries"
        icon={<Terminal className="w-6 h-6 text-purple-400" />}
      />

      <CyberPanel title="Interactive Security Query Terminal Notebook" icon={<Terminal className="w-4 h-4 text-purple-400" />}>
        <div className="p-4 space-y-4 font-mono text-xs">
          
          <div className="space-y-1.5">
            <p className="text-[10px] text-purple-400 font-bold uppercase">Preset Threat Hunting Queries</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPreset(p);
                    setQueryInput(p.query);
                    setQueryOutput(p.resultSummary);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-[10px] font-bold transition-all truncate ${
                    selectedPreset.name === p.name
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                      : 'bg-black/60 text-gray-400 border-purple-500/20 hover:border-purple-500/40'
                  }`}
                >
                  [{p.lang}] {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              rows={4}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/90 border border-purple-500/30 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-400 leading-relaxed"
            />

            <button
              onClick={handleRunQuery}
              disabled={isExecuting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0"
            >
              <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'Running Query on Log Index...' : 'Execute Threat Query'}</span>
            </button>
          </div>

          {queryOutput && (
            <div className="p-3.5 rounded-xl bg-black/95 border border-purple-500/40 text-emerald-300 leading-relaxed space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between text-[10px] text-gray-500 border-b border-purple-500/20 pb-1">
                <span>QUERY OUTPUT TERMINAL</span>
                <span>MATCH COUNT: 3</span>
              </div>
              <p className="font-mono text-xs">{queryOutput}</p>
            </div>
          )}

        </div>
      </CyberPanel>
    </ViewContainer>
  );
}
