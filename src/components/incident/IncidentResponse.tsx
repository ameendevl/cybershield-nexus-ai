import { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { ViewContainer, CyberPanel, SectionTitle, SeverityBadge, StatusBadge, timeAgo, FilterButton } from '../ui/common';
import MetricCard from '../dashboard/MetricCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Activity, CheckCircle, Clock, AlertTriangle, Play, Pause, XCircle, ChevronRight, User, Plus, X } from 'lucide-react';
import { soundService } from '../../services/soundService';

const statusFlow = ['open', 'investigating', 'contained', 'eradicated', 'recovered', 'closed'];
const statusIcons: Record<string, typeof Play> = {
  open: AlertTriangle, investigating: Play, contained: Pause, eradicated: CheckCircle, recovered: Clock, closed: XCircle,
};

export default function IncidentResponse() {
  const { incidents, updateIncidentStatus } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [newType, setNewType] = useState('Malware Infection');

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundService.playSuccessBeep();
    const newInc: any = {
      id: `INC-${Date.now()}`,
      title: newTitle.trim(),
      description: `Auto-generated SOC incident ticket for ${newTitle.trim()}`,
      severity: newSeverity,
      priority: newSeverity === 'critical' ? 'P1' : 'P2',
      status: 'open',
      incident_type: newType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    incidents.unshift(newInc);
    setNewTitle('');
    setShowCreateModal(false);
  };

  const filtered = useMemo(() => {
    let result = [...incidents].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (filter !== 'all') result = result.filter((i) => i.severity === filter);
    return result;
  }, [incidents, filter]);

  const stats = useMemo(() => {
    const open = incidents.filter((i) => i.status === 'open').length;
    const investigating = incidents.filter((i) => i.status === 'investigating').length;
    const contained = incidents.filter((i) => i.status === 'contained').length;
    const closed = incidents.filter((i) => i.status === 'closed').length;
    return { open, investigating, contained, closed };
  }, [incidents]);

  const trendData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      day: `D${i + 1}`,
      opened: Math.floor(Math.random() * 8) + 1,
      closed: Math.floor(Math.random() * 6) + 1,
    }));
  }, []);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((i) => { if (i.incident_type) counts[i.incident_type] = (counts[i.incident_type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [incidents]);

  const selected = incidents.find((i) => i.id === selectedIncident);

  const timeline = useMemo(() => {
    if (!selected) return [];
    const stages = [
      { label: 'Incident Detected', time: selected.created_at, done: true },
      { label: 'Triage & Assessment', time: selected.updated_at, done: selected.status !== 'open' },
      { label: 'Investigation Started', time: selected.updated_at, done: ['investigating', 'contained', 'eradicated', 'recovered', 'closed'].includes(selected.status) },
      { label: 'Containment Applied', time: selected.updated_at, done: ['contained', 'eradicated', 'recovered', 'closed'].includes(selected.status) },
      { label: 'Eradication', time: selected.updated_at, done: ['eradicated', 'recovered', 'closed'].includes(selected.status) },
      { label: 'Recovery', time: selected.updated_at, done: ['recovered', 'closed'].includes(selected.status) },
      { label: 'Incident Closed', time: selected.resolved_at || selected.updated_at, done: selected.status === 'closed' },
    ];
    return stages;
  }, [selected]);

  return (
    <ViewContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionTitle title="Incident Response & Case Management" subtitle="Track, triage, contain, and resolve security incidents" icon={<Activity className="w-6 h-6 text-red-400" />} />
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 hover:from-red-400 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Create Incident Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Open" value={stats.open} icon={<AlertTriangle className="w-5 h-5" />} color="#ff0054" subtitle="incidents" />
        <MetricCard title="Investigating" value={stats.investigating} icon={<Play className="w-5 h-5" />} color="#ffbe0b" subtitle="active" />
        <MetricCard title="Contained" value={stats.contained} icon={<Pause className="w-5 h-5" />} color="#00f0ff" subtitle="holding" />
        <MetricCard title="Closed" value={stats.closed} icon={<CheckCircle className="w-5 h-5" />} color="#00ff88" subtitle="resolved" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CyberPanel title="Incident Trends (14 days)" icon={<Activity className="w-4 h-4" />}>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="openInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff0054" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ff0054" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="closedInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#4b5563" fontSize={10} />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="opened" stroke="#ff0054" strokeWidth={2} fill="url(#openInc)" />
                <Area type="monotone" dataKey="closed" stroke="#00ff88" strokeWidth={2} fill="url(#closedInc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Incidents by Type" icon={<AlertTriangle className="w-4 h-4" />}>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#4b5563" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#4b5563" fontSize={9} width={120} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(0,240,255,0.05)' }} />
                <Bar dataKey="value" fill="#ff6b35" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Incident list */}
        <CyberPanel title="Active Incidents" icon={<Activity className="w-4 h-4" />} className="lg:col-span-1">
          <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-cyan-500/10">
            {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
              <FilterButton key={f} active={filter === f} onClick={() => setFilter(f)} color={f === 'critical' ? '#ff0054' : f === 'high' ? '#ff6b35' : f === 'medium' ? '#ffbe0b' : '#00ff88'}>
                {f}
              </FilterButton>
            ))}
          </div>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-cyan-500/5">
            {filtered.slice(0, 20).map((inc) => (
              <button
                key={inc.id}
                onClick={() => setSelectedIncident(inc.id === selectedIncident ? null : inc.id)}
                className={`w-full text-left px-4 py-3 hover:bg-cyan-500/5 transition-colors ${selectedIncident === inc.id ? 'bg-cyan-500/10' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <SeverityBadge severity={inc.severity} />
                  <span className="text-[10px] text-gray-600 uppercase font-bold">{inc.priority}</span>
                </div>
                <p className="text-sm text-gray-300 truncate">{inc.title}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <StatusBadge status={inc.status} />
                  <span className="text-[10px] text-gray-700">{timeAgo(inc.created_at)}</span>
                </div>
              </button>
            ))}
          </div>
        </CyberPanel>

        {/* Incident detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <CyberPanel title="Incident Details & Lifecycle Control" icon={<ChevronRight className="w-4 h-4" />}>
              <div className="p-5 font-mono">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-display font-bold text-cyan-300 mb-1">{selected.title}</h3>
                    <p className="text-sm text-gray-400">{selected.description}</p>
                  </div>
                  <SeverityBadge severity={selected.severity} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Status', value: selected.status.replace(/_/g, ' ') },
                    { label: 'Priority', value: selected.priority.toUpperCase() },
                    { label: 'Type', value: selected.incident_type || 'N/A' },
                    { label: 'Created', value: timeAgo(selected.created_at) },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/60 border border-cyan-500/15">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{item.label}</p>
                      <p className="text-xs font-bold text-cyan-300 mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Status Advancement Controls */}
                <div className="p-4 rounded-xl bg-black/80 border border-cyan-500/20 mb-5 space-y-2">
                  <p className="text-[10px] text-cyan-400 font-bold uppercase">Advance Incident Lifecycle State</p>
                  <div className="flex flex-wrap gap-2">
                    {statusFlow.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          soundService.playSuccessBeep();
                          updateIncidentStatus(selected.id, st as any);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                          selected.status === st
                            ? 'bg-cyan-500 text-cyber-dark ring-2 ring-cyan-300'
                            : 'bg-black/60 border border-cyan-500/20 text-gray-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-5">
                  <h4 className="text-sm font-display font-semibold text-cyan-400 mb-3">Response Timeline</h4>
                  <div className="space-y-0">
                    {timeline.map((stage, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${stage.done ? 'bg-cyber-success border-cyber-success' : 'border-gray-700 bg-cyber-dark'}`}>
                            {stage.done && <CheckCircle className="w-2.5 h-2.5 text-cyber-dark" />}
                          </div>
                          {i < timeline.length - 1 && <div className={`w-0.5 h-8 ${stage.done ? 'bg-cyber-success/40' : 'bg-gray-800'}`} />}
                        </div>
                        <div className="pt-0.5 pb-8">
                          <p className={`text-sm ${stage.done ? 'text-gray-300' : 'text-gray-600'}`}>{stage.label}</p>
                          {stage.done && stage.time && <p className="text-[10px] text-gray-700 mt-0.5">{new Date(stage.time).toLocaleString()}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status controls */}
                <div className="pt-4 border-t border-cyan-500/10">
                  <h4 className="text-sm font-display font-semibold text-cyan-400 mb-3">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {statusFlow.map((status) => {
                      const Icon = statusIcons[status] || Play;
                      const isActive = selected.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => updateIncidentStatus(selected.id, status)}
                          disabled={isActive}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                            isActive ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-cyber-darker/60 text-gray-500 border-cyan-500/10 hover:border-cyan-500/30 hover:text-gray-300'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {status.replace(/_/g, ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assignment */}
                <div className="mt-4 pt-4 border-t border-cyan-500/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Assigned to</p>
                    <p className="text-sm text-gray-300">{selected.assigned_to ? 'Analyst Team' : 'Unassigned — auto-routing...'}</p>
                  </div>
                </div>
              </div>
            </CyberPanel>
          ) : (
            <CyberPanel title="Incident Details" icon={<ChevronRight className="w-4 h-4" />}>
              <div className="p-12 text-center text-gray-600">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Select an incident from the list to view details and manage response</p>
              </div>
            </CyberPanel>
          )}
        </div>
      </div>

      {/* Create Incident Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-cyber-darker border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Create New Incident Ticket
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Incident Title / Summary</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Cobalt Strike Beaconing Detected on Host SRV-04"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/30 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/30 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="critical">Critical (P1)</option>
                    <option value="high">High (P2)</option>
                    <option value="medium">Medium (P3)</option>
                    <option value="low">Low (P4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Incident Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/30 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Malware Infection">Malware Infection</option>
                    <option value="Ransomware Activity">Ransomware Activity</option>
                    <option value="Brute Force / Credential Stuffing">Brute Force</option>
                    <option value="Unauthorized Access">Unauthorized Access</option>
                    <option value="Data Exfiltration">Data Exfiltration</option>
                    <option value="Phishing Campaign">Phishing Campaign</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-cyber-dark bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Create Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ViewContainer>
  );
}
