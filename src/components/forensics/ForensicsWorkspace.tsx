import { useState } from 'react';
import { ViewContainer, CyberPanel, SectionTitle, StatusBadge, timeAgo } from '../ui/common';
import MetricCard from '../dashboard/MetricCard';
import { FlaskConical, FileSearch, Fingerprint, Image, Database, Terminal, Clock, User, Shield, Bug, Lock } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Evidence {
  id: string;
  type: 'disk' | 'memory' | 'network' | 'log' | 'screenshot' | 'malware';
  name: string;
  hash: string;
  size: string;
  collectedBy: string;
  collectedAt: string;
}

interface ForensicsCaseData {
  id: string;
  title: string;
  status: string;
  incidentId: string;
  leadAnalyst: string;
  evidenceCount: number;
  priority: string;
  description: string;
  evidence: Evidence[];
  timeline: { time: string; event: string; source: string }[];
}

const mockCases: ForensicsCaseData[] = [
  {
    id: 'FC-001',
    title: 'Ransomware Investigation - Finance Dept',
    status: 'investigating',
    incidentId: 'INC-00001',
    leadAnalyst: 'J. Chen',
    evidenceCount: 12,
    priority: 'p1',
    description: 'Investigation of ransomware outbreak affecting finance department servers. Multiple endpoints encrypted, C2 communication detected.',
    evidence: [
      { id: 'E1', type: 'memory', name: 'DC01-memory.dmp', hash: 'a1b2c3d4e5f6', size: '4.2 GB', collectedBy: 'J. Chen', collectedAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'E2', type: 'disk', name: 'FIN-SRV-disk.img', hash: 'f6e5d4c3b2a1', size: '128 GB', collectedBy: 'M. Patel', collectedAt: new Date(Date.now() - 7200000).toISOString() },
      { id: 'E3', type: 'network', name: 'pcap-c2.pcap', hash: '1a2b3c4d5e6f', size: '340 MB', collectedBy: 'Auto-Collector', collectedAt: new Date(Date.now() - 10800000).toISOString() },
      { id: 'E4', type: 'malware', name: 'ransomware-sample.exe', hash: '9f8e7d6c5b4a', size: '2.1 MB', collectedBy: 'J. Chen', collectedAt: new Date(Date.now() - 14400000).toISOString() },
    ],
    timeline: [
      { time: new Date(Date.now() - 14400000).toISOString(), event: 'Initial compromise via phishing email', source: 'Email Gateway' },
      { time: new Date(Date.now() - 10800000).toISOString(), event: 'C2 beacon detected', source: 'NDR' },
      { time: new Date(Date.now() - 7200000).toISOString(), event: 'Lateral movement to file server', source: 'EDR' },
      { time: new Date(Date.now() - 3600000).toISOString(), event: 'Mass file encryption started', source: 'EDR' },
      { time: new Date(Date.now() - 1800000).toISOString(), event: 'Isolation of affected systems', source: 'SOAR' },
    ],
  },
  {
    id: 'FC-002',
    title: 'Data Exfiltration - Cloud Storage',
    status: 'open',
    incidentId: 'INC-00002',
    leadAnalyst: 'S. Rodriguez',
    evidenceCount: 8,
    priority: 'p2',
    description: 'Suspicious data transfer from internal database to external cloud storage. Investigation ongoing.',
    evidence: [
      { id: 'E5', type: 'log', name: 'db-access-logs.json', hash: 'b2c3d4e5f6a1', size: '45 MB', collectedBy: 'S. Rodriguez', collectedAt: new Date(Date.now() - 5400000).toISOString() },
      { id: 'E6', type: 'network', name: 'egress-pcap.pcap', hash: 'c3d4e5f6a1b2', size: '1.2 GB', collectedBy: 'Auto-Collector', collectedAt: new Date(Date.now() - 9000000).toISOString() },
    ],
    timeline: [
      { time: new Date(Date.now() - 9000000).toISOString(), event: 'Anomalous DB query volume detected', source: 'SIEM' },
      { time: new Date(Date.now() - 5400000).toISOString(), event: 'Data transfer to external S3 bucket', source: 'Cloud Security' },
    ],
  },
];

const evidenceIcons: Record<string, typeof FileSearch> = {
  disk: Database, memory: Terminal, network: Lock, log: FileSearch, screenshot: Image, malware: Bug,
};

const VOLATILITY_PRESETS = [
  { name: 'Process Tree (windows.pstree)', cmd: 'vol -f DC01-memory.dmp windows.pstree', output: 'PID: 3840 (powershell.exe) -> PID: 3912 (cmd.exe) -> PID: 4100 (net.exe user hacker /add)' },
  { name: 'Malware Memory Injection (windows.malfind)', cmd: 'vol -f DC01-memory.dmp windows.malfind', output: 'Process: lsass.exe PID: 612 Vad: 0x7ffe0000 Tag: VadS PageProtect: PAGE_EXECUTE_READWRITE (0x40) [HOOK DETECTED]' },
  { name: 'Network Sockets (windows.netscan)', cmd: 'vol -f DC01-memory.dmp windows.netscan', output: 'Offset: 0xfae2010 Proto: TCPv4 Local: 10.0.1.50:5412 Remote: 45.33.32.156:4444 State: ESTABLISHED Owner: powershell.exe (3840)' },
  { name: 'DLL Sideloading (windows.dlllist)', cmd: 'vol -f DC01-memory.dmp windows.dlllist --pid 3840', output: '0x00007ff810000 C:\\Users\\Public\\malware.dll [UNSIGNED SIDELOADED DLL]' }
];

export default function ForensicsWorkspace() {
  const [selectedCase, setSelectedCase] = useState(mockCases[0].id);
  const [volCmd, setVolCmd] = useState(VOLATILITY_PRESETS[0].cmd);
  const [volOutput, setVolOutput] = useState<string | null>(VOLATILITY_PRESETS[0].output);
  const [isRunningVol, setIsRunningVol] = useState(false);
  const current = mockCases.find((c) => c.id === selectedCase) || mockCases[0];

  const handleRunVolatility = (presetCmd?: string, presetOutput?: string) => {
    if (presetCmd) setVolCmd(presetCmd);
    soundService.playAlertAlarm();
    setIsRunningVol(true);
    setVolOutput(null);

    setTimeout(() => {
      soundService.playSuccessBeep();
      setIsRunningVol(false);
      setVolOutput(presetOutput || `Volatility 3 Engine Executed [${presetCmd || volCmd}]:\nCommand Completed Successfully. 1 Malicious Memory Hook Flagged.`);
    }, 1500);
  };

  return (
    <ViewContainer>
      <SectionTitle title="Digital Forensics & Volatility 3 Memory Workspace" subtitle="RAM memory dump analysis, process tree reconstruction, DLL injection, and artifact Timeline" icon={<FlaskConical className="w-6 h-6 text-purple-400" />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Active Cases" value={mockCases.length} icon={<FlaskConical className="w-5 h-5" />} color="#00f0ff" subtitle="investigating" />
        <MetricCard title="Evidence Items" value={mockCases.reduce((acc, c) => acc + c.evidenceCount, 0)} icon={<FileSearch className="w-5 h-5" />} color="#ffbe0b" subtitle="collected" />
        <MetricCard title="Pending Analysis" value={3} icon={<Clock className="w-5 h-5" />} color="#ff6b35" subtitle="in queue" />
        <MetricCard title="Cases Closed" value={14} icon={<Shield className="w-5 h-5" />} color="#00ff88" subtitle="this month" />
      </div>

      <CyberPanel title="Volatility 3 Memory Forensics Command Runner" icon={<Terminal className="w-4 h-4 text-purple-400" />} className="mb-4">
        <div className="p-4 space-y-3 font-mono text-xs">
          <div>
            <label className="block text-[10px] text-purple-400 font-bold uppercase mb-1.5">Preset Memory Forensics Commands</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {VOLATILITY_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setVolCmd(preset.cmd);
                    handleRunVolatility(preset.cmd, preset.output);
                  }}
                  className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-[10px] font-bold text-left truncate transition-all"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={volCmd}
                onChange={(e) => setVolCmd(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-black/80 border border-purple-500/30 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={() => handleRunVolatility()}
                disabled={isRunningVol}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Terminal className={`w-3.5 h-3.5 ${isRunningVol ? 'animate-spin' : ''}`} />
                <span>Run Volatility 3</span>
              </button>
            </div>
          </div>

          {volOutput && (
            <div className="p-3.5 rounded-xl bg-black/90 border border-purple-500/40 text-purple-300 text-[11px] leading-relaxed animate-in fade-in space-y-1">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-1 text-[10px] text-gray-400">
                <span>VOLATILITY 3 ENGINE OUTPUT</span>
                <span>STATUS: 200 OK</span>
              </div>
              <p className="font-mono text-cyan-300">{volOutput}</p>
            </div>
          )}
        </div>
      </CyberPanel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CyberPanel title="Forensics Cases" icon={<FlaskConical className="w-4 h-4" />} className="lg:col-span-1">
          <div className="divide-y divide-cyan-500/5 max-h-[600px] overflow-y-auto font-mono">
            {mockCases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c.id)}
                className={`w-full text-left px-4 py-3 hover:bg-cyan-500/5 transition-colors ${selectedCase === c.id ? 'bg-cyan-500/10' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-cyan-400">{c.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-error/15 text-cyber-error uppercase font-bold">{c.priority}</span>
                </div>
                <p className="text-sm text-gray-300 font-medium mb-1">{c.title}</p>
                <div className="flex items-center justify-between">
                  <StatusBadge status={c.status} />
                  <span className="text-[10px] text-gray-600">{c.evidenceCount} evidence</span>
                </div>
              </button>
            ))}
          </div>
        </CyberPanel>

        <div className="lg:col-span-2 space-y-4 font-mono">
          <CyberPanel title="Case Overview" icon={<FileSearch className="w-4 h-4" />}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-display font-bold text-cyan-300">{current.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{current.id} · Linked to {current.incidentId}</p>
                </div>
                <StatusBadge status={current.status} />
              </div>
              <p className="text-sm text-gray-400 mb-4">{current.description}</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                  <p className="text-[10px] text-gray-600 uppercase">Lead Analyst</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-sm text-gray-300">{current.leadAnalyst}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                  <p className="text-[10px] text-gray-600 uppercase">Priority</p>
                  <p className="text-sm text-cyber-error font-bold mt-1 uppercase">{current.priority}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                  <p className="text-[10px] text-gray-600 uppercase">Evidence Items</p>
                  <p className="text-sm text-cyan-300 font-bold mt-1">{current.evidenceCount} items</p>
                </div>
              </div>
            </div>
          </CyberPanel>

          <CyberPanel title="Evidence Collection" icon={<Fingerprint className="w-4 h-4" />}>
            <div className="divide-y divide-cyan-500/5">
              {current.evidence.map((e) => {
                const Icon = evidenceIcons[e.type] || FileSearch;
                return (
                  <div key={e.id} className="px-4 py-3 hover:bg-cyan-500/5 transition-colors flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 font-medium">{e.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-gray-600 uppercase font-mono">{e.type}</span>
                        <span className="text-[10px] text-gray-600 font-mono">{e.size}</span>
                        <span className="text-[10px] text-gray-600 font-mono">Hash: {e.hash}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-gray-500">{e.collectedBy}</p>
                      <p className="text-[10px] text-gray-700">{timeAgo(e.collectedAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CyberPanel>

          {/* Timeline */}
          <CyberPanel title="Incident Timeline" icon={<Clock className="w-4 h-4" />}>
            <div className="p-5">
              <div className="space-y-0">
                {current.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 shrink-0 mt-1" />
                      {i < current.timeline.length - 1 && <div className="w-0.5 h-12 bg-cyan-500/20" />}
                    </div>
                    <div className="pb-8">
                      <p className="text-sm text-gray-300">{event.event}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{event.source}</span>
                        <span className="text-[10px] text-gray-700">{new Date(event.time).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CyberPanel>
        </div>
      </div>
    </ViewContainer>
  );
}
