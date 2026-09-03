import { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { ViewContainer, CyberPanel, SectionTitle, SeverityBadge, timeAgo, SearchInput, FilterButton, EmptyState } from '../ui/common';
import MetricCard from '../dashboard/MetricCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar } from 'recharts';
import { Radar, Shield, Activity, Cpu, Zap, Play, Code, Search } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface DetectionRule {
  id: string;
  name: string;
  source: string;
  severity: string;
  status: 'active' | 'paused' | 'testing';
  triggers: number;
  accuracy: number;
  lastTriggered: string;
  mitre: string;
  description: string;
}

const mockRules: DetectionRule[] = [
  { id: 'RULE-00001', name: 'Brute Force SSH Detection', source: 'IDS', severity: 'high', status: 'active', triggers: 1247, accuracy: 94, lastTriggered: new Date(Date.now() - 300000).toISOString(), mitre: 'T1110', description: 'Detects multiple failed SSH login attempts from single source' },
  { id: 'RULE-00002', name: 'C2 Beacon Communication', source: 'NDR', severity: 'critical', status: 'active', triggers: 89, accuracy: 98, lastTriggered: new Date(Date.now() - 600000).toISOString(), mitre: 'T1071', description: 'Identifies periodic beacons to known C2 infrastructure' },
  { id: 'RULE-00003', name: 'Lateral Movement SMB', source: 'EDR', severity: 'high', status: 'active', triggers: 456, accuracy: 91, lastTriggered: new Date(Date.now() - 900000).toISOString(), mitre: 'T1021', description: 'Detects SMB lateral movement between workstations' },
  { id: 'RULE-00004', name: 'Data Exfiltration DNS', source: 'NDR', severity: 'critical', status: 'active', triggers: 34, accuracy: 96, lastTriggered: new Date(Date.now() - 1800000).toISOString(), mitre: 'T1048', description: 'DNS tunneling detection for data exfiltration' },
  { id: 'RULE-00005', name: 'PowerShell Empire', source: 'EDR', severity: 'high', status: 'active', triggers: 67, accuracy: 89, lastTriggered: new Date(Date.now() - 3600000).toISOString(), mitre: 'T1059', description: 'Detects PowerShell Empire framework usage' },
  { id: 'RULE-00006', name: 'Mimikatz Credential Dump', source: 'EDR', severity: 'critical', status: 'active', triggers: 12, accuracy: 99, lastTriggered: new Date(Date.now() - 7200000).toISOString(), mitre: 'T1003', description: 'LSASS memory access for credential dumping' },
  { id: 'RULE-00007', name: 'Ransomware File Activity', source: 'EDR', severity: 'critical', status: 'active', triggers: 8, accuracy: 97, lastTriggered: new Date(Date.now() - 14400000).toISOString(), mitre: 'T1486', description: 'Mass file modification patterns consistent with ransomware' },
  { id: 'RULE-00008', name: 'Phishing Domain Access', source: 'WAF', severity: 'medium', status: 'active', triggers: 234, accuracy: 85, lastTriggered: new Date(Date.now() - 60000).toISOString(), mitre: 'T1566', description: 'Access to known phishing domains' },
  { id: 'RULE-00009', name: 'Privilege Escalation', source: 'SIEM', severity: 'high', status: 'testing', triggers: 45, accuracy: 78, lastTriggered: new Date(Date.now() - 10800000).toISOString(), mitre: 'T1068', description: 'Detects suspicious privilege escalation attempts' },
  { id: 'RULE-00010', name: 'Cloud API Abuse', source: 'Cloud Security', severity: 'high', status: 'active', triggers: 156, accuracy: 92, lastTriggered: new Date(Date.now() - 120000).toISOString(), mitre: 'T1078', description: 'Anomalous cloud API access patterns' },
];

export default function DetectionEngine() {
  const {} = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => {
    const activeRules = mockRules.filter((r) => r.status === 'active').length;
    const totalTriggers = mockRules.reduce((acc, r) => acc + r.triggers, 0);
    const avgAccuracy = Math.round(mockRules.reduce((acc, r) => acc + r.accuracy, 0) / mockRules.length);
    const testingRules = mockRules.filter((r) => r.status === 'testing').length;
    return { activeRules, totalTriggers, avgAccuracy, testingRules };
  }, []);

  const filteredRules = useMemo(() => {
    let result = mockRules;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.mitre.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((r) => r.status === statusFilter);
    return result;
  }, [search, statusFilter]);

  const triggerTrend = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      triggers: Math.floor(Math.random() * 200) + 50,
    }));
  }, []);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    mockRules.forEach((r) => { counts[r.source] = (counts[r.source] || 0) + r.triggers; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const coverageData = [
    { category: 'Network', value: 88 },
    { category: 'Endpoint', value: 92 },
    { category: 'Cloud', value: 75 },
    { category: 'Identity', value: 82 },
    { category: 'Email', value: 90 },
    { category: 'Application', value: 70 },
  ];

  return (
    <ViewContainer>
      <SectionTitle title="Detection Engine" subtitle="Manage detection rules, monitor signal quality, and tune alerts" icon={<Radar className="w-6 h-6" />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Active Rules" value={stats.activeRules} icon={<Shield className="w-5 h-5" />} color="#00f0ff" subtitle="running" />
        <MetricCard title="Total Triggers" value={stats.totalTriggers.toLocaleString()} icon={<Zap className="w-5 h-5" />} color="#ffbe0b" subtitle="24h" />
        <MetricCard title="Avg Accuracy" value={`${stats.avgAccuracy}%`} icon={<Cpu className="w-5 h-5" />} color="#00ff88" subtitle="true positives" />
        <MetricCard title="In Testing" value={stats.testingRules} icon={<Play className="w-5 h-5" />} color="#7b2cbf" subtitle="tuning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <CyberPanel title="Detection Triggers (24h)" icon={<Activity className="w-4 h-4" />} className="lg:col-span-2">
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={triggerTrend}>
                <XAxis dataKey="hour" stroke="#4b5563" fontSize={10} interval={3} />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="triggers" stroke="#00f0ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Detection Coverage" icon={<Radar className="w-4 h-4" />}>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={coverageData}>
                <PolarGrid stroke="rgba(0,240,255,0.1)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <RechartsRadar dataKey="value" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.3} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CyberPanel title="Triggers by Source" icon={<Cpu className="w-4 h-4" />}>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#4b5563" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#4b5563" fontSize={10} width={100} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(0,240,255,0.05)' }} />
                <Bar dataKey="value" fill="#ff6b35" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Rule Performance" icon={<Cpu className="w-4 h-4" />}>
          <div className="p-4 space-y-2 max-h-56 overflow-y-auto">
            {mockRules.sort((a, b) => b.accuracy - a.accuracy).slice(0, 6).map((rule) => (
              <div key={rule.id} className="flex items-center gap-3 p-2 rounded-lg bg-cyber-darker/40 border border-cyan-500/10">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">{rule.name}</p>
                  <p className="text-[10px] text-gray-600">{rule.source}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ color: rule.accuracy > 90 ? '#00ff88' : rule.accuracy > 80 ? '#ffbe0b' : '#ff0054' }}>{rule.accuracy}%</p>
                  <p className="text-[10px] text-gray-600">{rule.triggers} triggers</p>
                </div>
              </div>
            ))}
          </div>
        </CyberPanel>
      </div>

      {/* Rules management */}
      <CyberPanel
        title="Detection Rules"
        icon={<Code className="w-4 h-4" />}
        action={<div className="w-48"><SearchInput value={search} onChange={setSearch} placeholder="Search rules..." /></div>}
      >
        <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-cyan-500/10">
          {['all', 'active', 'testing', 'paused'].map((f) => (
            <FilterButton key={f} active={statusFilter === f} onClick={() => setStatusFilter(f)}>{f}</FilterButton>
          ))}
        </div>
        <div className="max-h-[500px] overflow-y-auto divide-y divide-cyan-500/5">
          {filteredRules.length === 0 ? (
            <EmptyState message="No rules match current filters" icon={<Search className="w-8 h-8" />} />
          ) : (
            filteredRules.map((rule) => (
              <div key={rule.id} className="px-4 py-3 hover:bg-cyan-500/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${rule.status === 'active' ? 'bg-cyber-success animate-pulse' : rule.status === 'testing' ? 'bg-cyber-warning' : 'bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-300 font-medium">{rule.name}</p>
                      <span className="text-[10px] font-mono text-gray-600">{rule.id}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1.5">{rule.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <SeverityBadge severity={rule.severity} />
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{rule.source}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-secondary/15 text-cyber-secondary border border-cyber-secondary/30">MITRE {rule.mitre}</span>
                      <span className="text-[10px] text-gray-600">{rule.triggers.toLocaleString()} triggers</span>
                      <span className="text-[10px] font-bold" style={{ color: rule.accuracy > 90 ? '#00ff88' : rule.accuracy > 80 ? '#ffbe0b' : '#ff0054' }}>{rule.accuracy}% accuracy</span>
                      <span className="text-[10px] text-gray-700">· {timeAgo(rule.lastTriggered)}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold shrink-0 ${
                    rule.status === 'active' ? 'bg-cyber-success/15 text-cyber-success' :
                    rule.status === 'testing' ? 'bg-cyber-warning/15 text-cyber-warning' : 'bg-gray-700 text-gray-500'
                  }`}>{rule.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CyberPanel>
    </ViewContainer>
  );
}
