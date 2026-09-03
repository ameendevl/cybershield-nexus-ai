import { useState, useEffect, useRef } from 'react';
import { CyberPanel } from '../ui/common';
import { Terminal, Play, Pause, Download, Search } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  source: 'FIREWALL' | 'SYSMON' | 'NGINX' | 'ACTIVE_DIRECTORY' | 'KUBERNETES';
  eventID: number;
  message: string;
  srcIP: string;
  dstIP: string;
}

const SAMPLE_SOURCES = ['FIREWALL', 'SYSMON', 'NGINX', 'ACTIVE_DIRECTORY', 'KUBERNETES'] as const;

const LOG_TEMPLATES = [
  { level: 'CRITICAL', eventID: 4625, message: 'Brute force SSH authentication failure limit exceeded', srcIP: '45.33.32.156', dstIP: '192.168.1.10' },
  { level: 'HIGH', eventID: 106, message: 'Unusual PowerShell process spawned cmd.exe with bypass flag', srcIP: '10.0.2.45', dstIP: '10.0.2.1' },
  { level: 'CRITICAL', eventID: 9001, message: 'SQL Injection payload payload detected on endpoint /api/v1/auth', srcIP: '185.220.101.5', dstIP: '10.0.1.50' },
  { level: 'WARNING', eventID: 4624, message: 'Successful logon for privileged account root from external subnet', srcIP: '192.168.1.200', dstIP: '10.0.2.10' },
  { level: 'INFO', eventID: 200, message: 'HTTP GET /dashboard 200 OK - Response 4.2ms', srcIP: '172.16.0.4', dstIP: '10.0.1.50' },
  { level: 'HIGH', eventID: 7045, message: 'New Windows Service installed: CyberShield_Persistence_Svc', srcIP: '10.0.2.10', dstIP: '10.0.2.10' },
];

export default function LiveLogStreamViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogModal, setSelectedLogModal] = useState<LogEntry | null>(null);
  const logTerminalRef = useRef<HTMLDivElement>(null);

  // Generate continuous log stream with Backend SSE Stream support
  useEffect(() => {
    if (!isStreaming) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('http://localhost:4000/api/telemetry/stream');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'CONNECTED' && data.src) {
            const levelMap: Record<string, LogEntry['level']> = {
              critical: 'CRITICAL',
              high: 'HIGH',
              medium: 'WARNING',
              low: 'INFO',
            };
            const sseLog: LogEntry = {
              id: data.id || crypto.randomUUID(),
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
              level: levelMap[data.severity] || 'HIGH',
              source: 'FIREWALL',
              eventID: 5156,
              message: `[BACKEND SSE] ${data.vector} detected from ${data.src} targeting ${data.dst} — Mitigation: ${data.action}`,
              srcIP: data.src,
              dstIP: data.dst,
            };
            setLogs((prev) => [sseLog, ...prev.slice(0, 99)]);
          }
        } catch {}
      };
    } catch {}

    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const source = SAMPLE_SOURCES[Math.floor(Math.random() * SAMPLE_SOURCES.length)];

      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        level: template.level as any,
        source: source as any,
        eventID: template.eventID,
        message: template.message,
        srcIP: template.srcIP,
        dstIP: template.dstIP,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    }, 1800);

    return () => {
      clearInterval(interval);
      if (eventSource) eventSource.close();
    };
  }, [isStreaming]);

  const handleToggleStream = () => {
    soundService.playSuccessBeep();
    setIsStreaming(!isStreaming);
  };

  const handleExportLogs = () => {
    soundService.playSuccessBeep();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SIEM_Live_Log_Stream_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = logs.filter((l) => {
    if (filterLevel !== 'ALL' && l.level !== filterLevel) return false;
    if (filterSource !== 'ALL' && l.source !== filterSource) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.message.toLowerCase().includes(q) ||
        l.srcIP.includes(q) ||
        l.dstIP.includes(q) ||
        l.eventID.toString().includes(q)
      );
    }
    return true;
  });

  return (
    <CyberPanel
      title="Real-Time SIEM Event & Syslog Stream Engine"
      icon={<Terminal className="w-4 h-4 text-cyan-400" />}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStream}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
              isStreaming
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isStreaming ? 'Streaming Live' : 'Paused'}</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="p-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:text-cyan-200 transition-all"
            title="Export Log Stream"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="p-4 space-y-3 font-mono">
        
        {/* Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-black/80 border border-cyan-500/20 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-black/80 border border-cyan-500/20 text-purple-300 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Sources</option>
              <option value="FIREWALL">Firewall</option>
              <option value="SYSMON">Sysmon</option>
              <option value="NGINX">NGINX Web</option>
              <option value="ACTIVE_DIRECTORY">Active Directory</option>
              <option value="KUBERNETES">Kubernetes</option>
            </select>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search logs, IPs, Event IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-xl bg-black/80 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Terminal Log Output */}
        <div
          ref={logTerminalRef}
          className="h-80 overflow-y-auto rounded-xl bg-black/95 border border-cyan-500/20 p-3 space-y-1.5 text-[11px] font-mono leading-relaxed"
        >
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => {
                  soundService.playSuccessBeep();
                  setSelectedLogModal(log);
                }}
                className="py-1 border-b border-cyan-500/10 flex items-start gap-2 hover:bg-cyan-500/10 cursor-pointer px-1.5 rounded transition-all"
              >
                <span className="text-gray-500 shrink-0">{log.timestamp}</span>
                
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 ${
                    log.level === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : log.level === 'HIGH'
                      ? 'bg-purple-500/20 text-purple-300'
                      : log.level === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  {log.level}
                </span>

                <span className="text-purple-400 font-bold shrink-0">[{log.source}]</span>
                <span className="text-gray-400 shrink-0">ID:{log.eventID}</span>
                <span className="text-cyan-300 font-mono shrink-0">{log.srcIP} → {log.dstIP}:</span>
                <span className="text-gray-200 truncate">{log.message}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-20">No matching log entries found.</p>
          )}
        </div>

      </div>

      {/* Log Inspection Modal */}
      {selectedLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-5 rounded-2xl bg-cyber-darker border border-cyan-500/40 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" /> Log Telemetry Inspection ({selectedLogModal.id.slice(0, 8)})
              </span>
              <button
                onClick={() => setSelectedLogModal(null)}
                className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-black/80 border border-cyan-500/20 space-y-1">
                <p className="text-gray-400">Timestamp: <span className="text-gray-200">{selectedLogModal.timestamp}</span></p>
                <p className="text-gray-400">Log Level: <span className="text-red-400 font-bold">{selectedLogModal.level}</span></p>
                <p className="text-gray-400">Event ID: <span className="text-purple-300">{selectedLogModal.eventID}</span></p>
                <p className="text-gray-400">Source: <span className="text-cyan-300">{selectedLogModal.source}</span></p>
                <p className="text-gray-400">Src IP → Dst IP: <span className="text-emerald-400">{selectedLogModal.srcIP} → {selectedLogModal.dstIP}</span></p>
              </div>

              <div className="p-3 rounded-xl bg-black/90 border border-purple-500/20 text-cyan-300 font-mono text-[11px] leading-relaxed">
                {selectedLogModal.message}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  soundService.playSuccessBeep();
                  alert(`Pivoting ${selectedLogModal.srcIP} to Threat Intelligence IOC Scanner...`);
                  setSelectedLogModal(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-bold"
              >
                Pivot to Threat Intel
              </button>
            </div>
          </div>
        </div>
      )}
    </CyberPanel>
  );
}
