import { useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { ViewContainer, CyberPanel, SectionTitle } from '../ui/common';
import AlertList from '../alerts/AlertList';
import MetricCard from '../dashboard/MetricCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { ShieldAlert, Activity, Radar, Cpu, Eye, Radio } from 'lucide-react';

import LiveLogStreamViewer from './LiveLogStreamViewer';

export default function SOCOperations() {
  const { alerts, threats } = useApp();

  const stats = useMemo(() => {
    const newAlerts = alerts.filter((a) => a.status === 'new').length;
    const investigating = alerts.filter((a) => a.status === 'in_progress').length;
    const resolved = alerts.filter((a) => a.status === 'resolved').length;
    const activeThreats = threats.filter((t) => t.status === 'active').length;
    return { newAlerts, investigating, resolved, activeThreats };
  }, [alerts, threats]);

  const trendData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}:00`,
      alerts: Math.floor(Math.random() * 60) + 15,
      resolved: Math.floor(Math.random() * 50) + 10,
    }));
  }, []);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    alerts.forEach((a) => { if (a.source) counts[a.source] = (counts[a.source] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [alerts]);

  const analystWorkload = useMemo(() => {
    return [
      { name: 'Analyst 1', active: 12, resolved: 45, color: '#00f0ff' },
      { name: 'Analyst 2', active: 8, resolved: 38, color: '#00ff88' },
      { name: 'Analyst 3', active: 15, resolved: 52, color: '#ffbe0b' },
      { name: 'Analyst 4', active: 5, resolved: 28, color: '#ff006e' },
      { name: 'Tier 3', active: 3, resolved: 18, color: '#7b2cbf' },
    ];
  }, []);

  return (
    <ViewContainer>
      <SectionTitle title="SOC Operations" subtitle="Real-time security monitoring, live syslog streaming, and alert management" icon={<ShieldAlert className="w-6 h-6" />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="New Alerts" value={stats.newAlerts} icon={<Radio className="w-5 h-5" />} color="#ff0054" trend={8} subtitle="unacknowledged" />
        <MetricCard title="Investigating" value={stats.investigating} icon={<Eye className="w-5 h-5" />} color="#ffbe0b" trend={-5} subtitle="in progress" />
        <MetricCard title="Resolved Today" value={stats.resolved} icon={<Activity className="w-5 h-5" />} color="#00ff88" trend={15} subtitle="closed" />
        <MetricCard title="Active Threats" value={stats.activeThreats} icon={<Radar className="w-5 h-5" />} color="#ff6b35" trend={3} subtitle="tracking" />
      </div>

      {/* Live Log Stream Viewer */}
      <div className="mb-4">
        <LiveLogStreamViewer />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <CyberPanel title="Alert Volume (24h)" icon={<Activity className="w-4 h-4" />} className="lg:col-span-2">
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="newAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff0054" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ff0054" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#4b5563" fontSize={10} />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="alerts" stroke="#ff0054" strokeWidth={2} fill="url(#newAlerts)" />
                <Area type="monotone" dataKey="resolved" stroke="#00ff88" strokeWidth={2} fill="url(#resolvedAlerts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Alert Sources" icon={<Cpu className="w-4 h-4" />}>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" stroke="#4b5563" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#4b5563" fontSize={10} width={90} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(0,240,255,0.05)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={['#00f0ff', '#00ff88', '#ffbe0b', '#ff006e', '#ff6b35', '#7b2cbf', '#ff0054', '#ffd700'][i % 8]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CyberPanel title="Analyst Workload" icon={<Eye className="w-4 h-4" />} className="lg:col-span-1">
          <div className="p-4 space-y-3">
            {analystWorkload.map((a) => (
              <div key={a.name} className="p-3 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300 font-medium">{a.name}</span>
                  <span className="text-xs text-gray-600">{a.active + a.resolved} total</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-cyber-warning">Active: {a.active}</span>
                      <span className="text-[10px] text-cyber-success">Done: {a.resolved}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="rounded-l-full transition-all" style={{ width: `${(a.active / (a.active + a.resolved)) * 100}%`, backgroundColor: '#ffbe0b' }} />
                      <div className="rounded-r-full transition-all flex-1" style={{ backgroundColor: '#00ff8830' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CyberPanel>

        <div className="lg:col-span-2">
          <AlertList maxAlerts={50} />
        </div>
      </div>
    </ViewContainer>
  );
}
