import { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { ViewContainer, CyberPanel, SectionTitle } from '../ui/common';
import MetricCard from '../dashboard/MetricCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Download, Calendar, FileText, TrendingUp, Filter, Eye } from 'lucide-react';
import { getSeverityColor } from '../../utils/mockData';
import { exportAlertsReport } from '../../utils/exportUtils';
import { soundService } from '../../services/soundService';

type ReportType = 'threat' | 'incident' | 'vulnerability' | 'compliance' | 'executive';

const reportTypes: { id: ReportType; label: string; description: string; icon: typeof FileText }[] = [
  { id: 'threat', label: 'Threat Intelligence Report', description: 'Threat landscape, IOCs, and actor analysis', icon: FileText },
  { id: 'incident', label: 'Incident Response Report', description: 'Incident summary, response times, outcomes', icon: FileText },
  { id: 'vulnerability', label: 'Vulnerability Assessment', description: 'Open vulnerabilities, CVSS trends, remediation', icon: FileText },
  { id: 'compliance', label: 'Compliance Audit Report', description: 'Framework status and control assessments', icon: FileText },
  { id: 'executive', label: 'Executive Security Summary', description: 'Board-level security posture overview', icon: FileText },
];

export default function ReportsAnalytics() {
  const { alerts, threats, incidents, vulnerabilities, assets } = useApp();
  const [selectedReport, setSelectedReport] = useState<ReportType>('threat');
  const [timeRange, setTimeRange] = useState('30d');

  const alertTrend = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30;
    return Array.from({ length: days }, (_, i) => ({
      day: `D${i + 1}`,
      alerts: Math.floor(Math.random() * 80) + 20,
      threats: Math.floor(Math.random() * 25) + 5,
      incidents: Math.floor(Math.random() * 10) + 1,
    }));
  }, [timeRange]);

  const severityDist = useMemo(() => {
    const counts: Record<string, number> = {};
    alerts.forEach((a) => { counts[a.severity] = (counts[a.severity] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: getSeverityColor(name) }));
  }, [alerts]);

  const assetRiskData = useMemo(() => {
    const types: Record<string, { total: number; risk: number }> = {};
    assets.forEach((a) => {
      if (!types[a.type]) types[a.type] = { total: 0, risk: 0 };
      types[a.type].total++;
      if (a.criticality === 'critical' || a.criticality === 'high') types[a.type].risk++;
    });
    return Object.entries(types).map(([name, v]) => ({ name, total: v.total, risk: v.risk }));
  }, [assets]);

  const vulnTrend = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      open: Math.floor(Math.random() * 50) + 30,
      patched: Math.floor(Math.random() * 40) + 20,
    }));
  }, []);

  const responseMetrics = [
    { name: 'MTTD', value: 12, unit: 'min', target: 15, color: '#00ff88' },
    { name: 'MTTR', value: 4.2, unit: 'hrs', target: 6, color: '#00f0ff' },
    { name: 'SLA Met', value: 98, unit: '%', target: 95, color: '#00ff88' },
    { name: 'Auto-Resolved', value: 42, unit: '%', target: 30, color: '#7b2cbf' },
  ];

  return (
    <ViewContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionTitle title="Reports & Analytics" subtitle="Generate, view, and export security reports and trend analysis" icon={<BarChart3 className="w-6 h-6" />} />
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => { exportAlertsReport(alerts); soundService.playSuccessBeep(); }}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Total Alerts" value={alerts.length} icon={<TrendingUp className="w-5 h-5" />} color="#00f0ff" subtitle={timeRange} />
        <MetricCard title="Active Threats" value={threats.filter((t) => t.status === 'active').length} icon={<TrendingUp className="w-5 h-5" />} color="#ff0054" subtitle="tracked" />
        <MetricCard title="Incidents" value={incidents.length} icon={<TrendingUp className="w-5 h-5" />} color="#ffbe0b" subtitle="period" />
        <MetricCard title="Open Vulns" value={vulnerabilities.filter((v) => v.status === 'open').length} icon={<TrendingUp className="w-5 h-5" />} color="#ff6b35" subtitle="unpatched" />
      </div>

      {/* Report selector */}
      <CyberPanel title="Report Templates" icon={<FileText className="w-4 h-4" />} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
          {reportTypes.map((rt) => {
            const Icon = rt.icon;
            const active = selectedReport === rt.id;
            return (
              <button
                key={rt.id}
                onClick={() => setSelectedReport(rt.id)}
                className={`text-left p-4 rounded-xl border transition-all ${active ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-cyber-darker/40 border-cyan-500/10 hover:border-cyan-500/30'}`}
              >
                <Icon className={`w-6 h-6 mb-2 ${active ? 'text-cyan-400' : 'text-gray-600'}`} />
                <p className={`text-sm font-medium mb-1 ${active ? 'text-cyan-300' : 'text-gray-400'}`}>{rt.label}</p>
                <p className="text-[10px] text-gray-600">{rt.description}</p>
              </button>
            );
          })}
        </div>
      </CyberPanel>

      {/* Time range & export */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider border transition-all ${
                timeRange === range ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' : 'text-gray-600 border-cyan-500/10 hover:text-gray-400'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-300 hover:bg-cyan-500/20 transition-all">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* Report content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <CyberPanel title={`Trend Analysis (${timeRange})`} icon={<TrendingUp className="w-4 h-4" />} className="lg:col-span-2">
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={alertTrend}>
                <defs>
                  <linearGradient id="repAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff0054" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ff0054" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="repThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#4b5563" fontSize={10} interval={Math.floor(alertTrend.length / 10)} />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="alerts" stroke="#ff0054" strokeWidth={2} fill="url(#repAlerts)" />
                <Area type="monotone" dataKey="threats" stroke="#00f0ff" strokeWidth={2} fill="url(#repThreats)" />
                <Area type="monotone" dataKey="incidents" stroke="#ffbe0b" strokeWidth={1} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Severity Distribution" icon={<Filter className="w-4 h-4" />}>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityDist} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                  {severityDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CyberPanel title="Response Metrics" icon={<TrendingUp className="w-4 h-4" />}>
          <div className="p-4 grid grid-cols-2 gap-3">
            {responseMetrics.map((m) => (
              <div key={m.name} className="p-4 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                <p className="text-xs text-gray-600 uppercase tracking-wider">{m.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-display font-bold" style={{ color: m.color }}>{m.value}</span>
                  <span className="text-xs text-gray-600">{m.unit}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Eye className="w-3 h-3 text-gray-700" />
                  <span className="text-[10px] text-gray-700">Target: {m.target}{m.unit}</span>
                  {m.value <= m.target ? <span className="text-[10px] text-cyber-success ml-1">✓ Met</span> : <span className="text-[10px] text-cyber-warning ml-1">⚠ Over</span>}
                </div>
              </div>
            ))}
          </div>
        </CyberPanel>

        <CyberPanel title="Vulnerability Trends" icon={<BarChart3 className="w-4 h-4" />}>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vulnTrend}>
                <XAxis dataKey="month" stroke="#4b5563" fontSize={10} />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="open" stroke="#ff0054" strokeWidth={2} dot={false} name="Open" />
                <Line type="monotone" dataKey="patched" stroke="#00ff88" strokeWidth={2} dot={false} name="Patched" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>
      </div>

      <CyberPanel title="Asset Risk Distribution" icon={<BarChart3 className="w-4 h-4" />} className="mb-4">
        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetRiskData}>
              <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
              <YAxis stroke="#4b5563" fontSize={10} />
              <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(0,240,255,0.05)' }} />
              <Bar dataKey="total" fill="#00f0ff" radius={[4, 4, 0, 0]} name="Total Assets" />
              <Bar dataKey="risk" fill="#ff0054" radius={[4, 4, 0, 0]} name="High Risk" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CyberPanel>
    </ViewContainer>
  );
}
