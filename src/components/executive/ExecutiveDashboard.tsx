import { useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { ViewContainer, CyberPanel, SectionTitle } from '../ui/common';
import MetricCard from '../dashboard/MetricCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, LineChart, Line } from 'recharts';
import { ShieldCheck, TrendingUp, Activity, DollarSign, Users, Clock, Target, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

import { soundService } from '../../services/soundService';
import { Download } from 'lucide-react';

export default function ExecutiveDashboard() {
  const { vulnerabilities } = useApp();

  const kpis = useMemo(() => {
    const mttr = '4.2h';
    const mttd = '12m';
    const riskScore = 72;
    const securityROI = '$2.4M';
    return { mttr, mttd, riskScore, securityROI };
  }, []);

  const handleExportBoardReport = () => {
    soundService.playSuccessBeep();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      reportTitle: 'Executive Cyber Security Posture Board Report 2026',
      generatedAt: new Date().toISOString(),
      kpis,
      complianceScore: '94.5%',
      frameworks: [
        { name: 'ISO 27001:2022', score: '94%', status: 'COMPLIANT' },
        { name: 'SOC 2 Type II', score: '98%', status: 'CERTIFIED' },
        { name: 'NIST SP 800-53', score: '91%', status: 'COMPLIANT' },
        { name: 'EU GDPR', score: '96%', status: 'AUDITED' }
      ]
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Executive_Board_Security_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const riskTrend = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      riskScore: Math.floor(Math.random() * 20) + 60,
      incidents: Math.floor(Math.random() * 15) + 5,
    }));
  }, []);

  const investmentData = [
    { category: 'SIEM & Monitoring', current: 450, previous: 380 },
    { category: 'EDR & Endpoint', current: 320, previous: 280 },
    { category: 'Threat Intel', current: 180, previous: 150 },
    { category: 'SOAR & Automation', current: 220, previous: 120 },
    { category: 'Cloud Security', current: 280, previous: 200 },
    { category: 'Training', current: 95, previous: 85 },
  ];

  const incidentTrend = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      critical: Math.floor(Math.random() * 5),
      high: Math.floor(Math.random() * 10) + 2,
      medium: Math.floor(Math.random() * 15) + 5,
    }));
  }, []);

  const teamPerformance = [
    { tier: 'Tier 1', analysts: 8, alerts: 1240, sla: 98, color: '#00f0ff' },
    { tier: 'Tier 2', analysts: 4, alerts: 380, sla: 96, color: '#00ff88' },
    { tier: 'Tier 3', analysts: 2, alerts: 85, sla: 100, color: '#ffbe0b' },
    { tier: 'Threat Hunting', analysts: 2, alerts: 45, sla: 100, color: '#7b2cbf' },
  ];

  const postureBreakdown = [
    { name: 'Prevention', value: 82, fill: '#00ff88' },
    { name: 'Detection', value: 88, fill: '#00f0ff' },
    { name: 'Response', value: 75, fill: '#ffbe0b' },
    { name: 'Recovery', value: 70, fill: '#ff6b35' },
    { name: 'Compliance', value: 90, fill: '#7b2cbf' },
  ];

  return (
    <ViewContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionTitle title="Executive Board Dashboard & Compliance" subtitle="Security posture, audit readiness, risk metrics, and leadership reports" icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />} />

        <button
          onClick={handleExportBoardReport}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Export Board Report</span>
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Risk Score" value={kpis.riskScore} icon={<Target className="w-5 h-5" />} color="#ffbe0b" trend={-5} subtitle="/ 100" />
        <MetricCard title="MTTR" value={kpis.mttr} icon={<Clock className="w-5 h-5" />} color="#00f0ff" trend={-12} subtitle="mean time" />
        <MetricCard title="MTTD" value={kpis.mttd} icon={<Activity className="w-5 h-5" />} color="#00ff88" trend={-8} subtitle="detect time" />
        <MetricCard title="Security ROI" value={kpis.securityROI} icon={<DollarSign className="w-5 h-5" />} color="#00ff88" trend={18} subtitle="annual" />
      </div>

      {/* Risk trend & posture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <CyberPanel title="Risk Score Trend (12 Months)" icon={<TrendingUp className="w-4 h-4" />} className="lg:col-span-2">
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffbe0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ffbe0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#4b5563" fontSize={10} />
                <YAxis stroke="#4b5563" fontSize={10} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="riskScore" stroke="#ffbe0b" strokeWidth={2} fill="url(#riskGrad)" />
                <Line type="monotone" dataKey="incidents" stroke="#ff0054" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Security Posture Breakdown" icon={<ShieldCheck className="w-4 h-4" />}>
          <div className="p-4 space-y-3">
            {postureBreakdown.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">{p.name}</span>
                  <span className="text-sm font-bold" style={{ color: p.fill }}>{p.value}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800/60 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.value}%`, backgroundColor: p.fill, boxShadow: `0 0 6px ${p.fill}80` }} />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-cyan-500/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300 font-medium">Overall Posture</span>
                <span className="text-lg font-display font-bold text-cyber-success">81%</span>
              </div>
            </div>
          </div>
        </CyberPanel>
      </div>

      {/* Investment & incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CyberPanel title="Security Investment ($K)" icon={<DollarSign className="w-4 h-4" />}>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investmentData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#4b5563" fontSize={10} />
                <YAxis type="category" dataKey="category" stroke="#4b5563" fontSize={9} width={110} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(0,240,255,0.05)' }} />
                <Bar dataKey="current" fill="#00f0ff" radius={[0, 4, 4, 0]} />
                <Bar dataKey="previous" fill="#4b5563" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Incident Volume (30 days)" icon={<AlertTriangle className="w-4 h-4" />}>
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidentTrend}>
                <XAxis dataKey="day" stroke="#4b5563" fontSize={10} />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="critical" stroke="#ff0054" strokeWidth={2} dot={false} name="Critical" />
                <Line type="monotone" dataKey="high" stroke="#ff6b35" strokeWidth={2} dot={false} name="High" />
                <Line type="monotone" dataKey="medium" stroke="#ffbe0b" strokeWidth={1} dot={false} name="Medium" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>
      </div>

      {/* Team performance */}
      <CyberPanel title="SOC Team Performance" icon={<Users className="w-4 h-4" />}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          {teamPerformance.map((team) => (
            <div key={team.tier} className="p-4 rounded-xl bg-cyber-darker/60 border border-cyan-500/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-display font-semibold" style={{ color: team.color }}>{team.tier}</h4>
                <div className="flex -space-x-1">
                  {Array.from({ length: Math.min(team.analysts, 4) }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-cyber-darker flex items-center justify-center text-[10px] text-gray-300">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Analysts</span>
                  <span className="text-sm text-gray-300 font-medium">{team.analysts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Alerts Handled</span>
                  <span className="text-sm text-gray-300 font-medium">{team.alerts.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">SLA Compliance</span>
                  <span className="text-sm font-bold" style={{ color: team.sla >= 98 ? '#00ff88' : '#ffbe0b' }}>{team.sla}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${team.sla}%`, backgroundColor: team.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CyberPanel>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <CyberPanel title="Key Achievements" icon={<CheckCircle className="w-4 h-4" />}>
          <div className="p-4 space-y-3">
            {[
              { label: 'Reduced MTTR by 34%', sub: 'vs last quarter' },
              { label: '99.2% uptime maintained', sub: 'all security systems' },
              { label: '1,247 automated actions', sub: 'via SOAR playbooks' },
              { label: 'Zero major breaches', sub: 'this reporting period' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-cyber-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">{item.label}</p>
                  <p className="text-[10px] text-gray-600">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </CyberPanel>

        <CyberPanel title="Risk Areas" icon={<AlertTriangle className="w-4 h-4" />}>
          <div className="p-4 space-y-3">
            {[
              { label: `${vulnerabilities.filter(v => v.severity === 'critical' && v.status === 'open').length} unpatched critical vulnerabilities`, sub: 'require immediate attention' },
              { label: 'Increasing phishing attempts', sub: '15% rise this month' },
              { label: 'Cloud misconfiguration risks', sub: '3 high-priority findings' },
              { label: 'Compliance gaps in GDPR', sub: '1 control non-compliant' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-cyber-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">{item.label}</p>
                  <p className="text-[10px] text-gray-600">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </CyberPanel>

        <CyberPanel title="Recommended Actions" icon={<ArrowRight className="w-4 h-4" />}>
          <div className="p-4 space-y-3">
            {[
              { label: 'Expedite critical patching', sub: 'Complete within 48 hours' },
              { label: 'Deploy additional EDR agents', sub: '3 servers unmonitored' },
              { label: 'Enhance phishing training', sub: 'Mandatory for all staff' },
              { label: 'Review cloud security posture', sub: 'Schedule for next sprint' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">{item.label}</p>
                  <p className="text-[10px] text-gray-600">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </CyberPanel>
      </div>
    </ViewContainer>
  );
}
