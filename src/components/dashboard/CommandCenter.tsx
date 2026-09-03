import { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import GlobalAttackMap from './GlobalAttackMap';
import {
  ResponsiveContainer,
  AreaChart, Area,
  XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
} from 'recharts';
import {
  ShieldAlert, Activity, Server, Globe2,
  TrendingUp, Crosshair, Bell, Play, Zap, ShieldCheck,
  CheckCircle2, ArrowUpRight, ArrowDownRight, Orbit,
  Terminal, ChevronRight, X
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface SimStage {
  name: string;
  status: 'pending' | 'active' | 'completed';
  detail: string;
}

export default function CommandCenter() {
  const { alerts, threats, incidents, vulnerabilities, assets, globalAttacks, setSelectedView, themeMode } = useApp();
  const isLight = themeMode === 'light';

  // Timeframe filter for Threat Timeline
  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  
  // Security Posture Modal state
  const [showPostureModal, setShowPostureModal] = useState(false);

  // Red Team Simulation State
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [simStages, setSimStages] = useState<SimStage[]>([]);
  const [simLog, setSimLog] = useState<string[]>([]);

  // Telemetry timestamps
  const [lastUpdate, setLastUpdate] = useState({ threats: 3, nodes: 2, alerts: 1, escalations: 5 });

  // Periodic controlled telemetry ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(prev => ({
        threats: (prev.threats % 8) + 1,
        nodes: (prev.nodes % 5) + 1,
        alerts: (prev.alerts % 4) + 1,
        escalations: (prev.escalations % 10) + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerAttackSimulation = (type: string) => {
    soundService.playAlertAlarm();
    setActiveSimulation(type);
    setSimProgress(15);
    
    const initialStages: SimStage[] = [
      { name: 'Attack Vector Infiltration', status: 'active', detail: `Injecting synthetic ${type} payload against DMZ perimeter` },
      { name: 'SIEM Detection Engine', status: 'pending', detail: 'Waiting for EDR & Snort signature correlation' },
      { name: 'AI Autonomous Defense', status: 'pending', detail: 'Generating real-time iptables and WAF mitigation rules' },
      { name: 'Host Containment & Isolation', status: 'pending', detail: 'Quarantining affected virtual sandbox subnet' },
    ];
    setSimStages(initialStages);
    setSimLog([`[0.0s] [SIMULATION INIT] Starting ${type.toUpperCase()} Attack Vector test...`]);

    setTimeout(() => {
      soundService.playRadarBlip();
      setSimProgress(45);
      setSimStages(prev => [
        { ...prev[0], status: 'completed' },
        { ...prev[1], status: 'active', detail: 'Signature matched CVE-2024-38077 — Alert ALT-9042 raised' },
        prev[2],
        prev[3],
      ]);
      setSimLog(l => [...l, `[0.8s] [SIEM ALERT] Telemetry matched intrusion pattern on node SRV-FIN-DC01`]);
    }, 900);

    setTimeout(() => {
      soundService.playRadarBlip();
      setSimProgress(75);
      setSimStages(prev => [
        prev[0],
        { ...prev[1], status: 'completed' },
        { ...prev[2], status: 'active', detail: 'AI Copilot deployed dynamic rate-limiting & IP ban' },
        prev[3],
      ]);
      setSimLog(l => [...l, `[1.8s] [AI DEFENSE] Injected 4 WAF rules & revoked anomalous Kerberos token`]);
    }, 1800);

    setTimeout(() => {
      soundService.playSuccessBeep();
      setSimProgress(100);
      setSimStages(prev => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'completed' },
        { ...prev[3], status: 'completed', detail: 'Threat contained. 0 lateral movements allowed.' },
      ]);
      setSimLog(l => [...l, `[2.7s] [CONTAINED] Test node successfully isolated. Incident report auto-generated.`]);
      
      setTimeout(() => {
        setActiveSimulation(null);
        setSimProgress(0);
        setSimStages([]);
        setSimLog([]);
      }, 5000);
    }, 2800);
  };

  const stats = useMemo(() => {
    const totalThreats = threats.length;
    const activeAssets = assets.filter((a) => a.status === 'active').length;
    const totalAlerts = alerts.length;
    const criticalIncidents = incidents.filter((i) => i.severity === 'critical').length;
    return { totalThreats, activeAssets, totalAlerts, criticalIncidents };
  }, [alerts, threats, incidents, assets]);

  // Timeline data based on selected range
  const threatActivity = useMemo(() => {
    const counts = timeRange === '1H' ? 12 : timeRange === '6H' ? 18 : timeRange === '24H' ? 24 : 14;
    return Array.from({ length: counts }, (_, i) => {
      const label = timeRange === '1H' ? `${i * 5}m` : timeRange === '6H' ? `${i * 20}m` : timeRange === '24H' ? `${i}:00` : `Day ${i + 1}`;
      return {
        time: label,
        alerts: Math.floor(Math.random() * 60) + 25,
        mitigated: Math.floor(Math.random() * 45) + 15,
      };
    });
  }, [timeRange]);

  const attackCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    globalAttacks.forEach((a) => {
      if (a.attack_type) counts[a.attack_type] = (counts[a.attack_type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [globalAttacks]);

  // Dynamic Security Posture Score
  const securityScore = useMemo(() => {
    const vulnPenalty = vulnerabilities
      .filter((v) => v.status === 'open')
      .reduce((acc, v) => acc + (v.severity === 'critical' ? 3 : v.severity === 'high' ? 2 : 1), 0);
    const incidentPenalty = incidents.filter((i) => i.severity === 'critical').length * 5;
    const alertPenalty = alerts.filter((a) => a.severity === 'critical' && a.status === 'new').length * 2;
    return Math.max(35, Math.min(99, 100 - vulnPenalty - incidentPenalty - alertPenalty));
  }, [vulnerabilities, incidents, alerts]);

  const subScores = {
    network: 92,
    endpoint: 84,
    identity: 88,
    cloud: 79,
    response: 91,
  };

  const scoreColor = securityScore > 75 ? '#00ff88' : securityScore > 55 ? '#ffbe0b' : '#ff0054';

  const severityData = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    alerts.forEach((a) => {
      counts[a.severity as keyof typeof counts] = (counts[a.severity as keyof typeof counts] || 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return [
      { name: 'Critical', value: counts.critical, pct: Math.round((counts.critical / total) * 100), fill: '#ff0054' },
      { name: 'High', value: counts.high, pct: Math.round((counts.high / total) * 100), fill: '#ff6b35' },
      { name: 'Medium', value: counts.medium, pct: Math.round((counts.medium / total) * 100), fill: '#ffbe0b' },
      { name: 'Low', value: counts.low, pct: Math.round((counts.low / total) * 100), fill: '#00f0ff' },
    ];
  }, [alerts]);

  const recentEvents = useMemo(() => [
    { id: 'EVT-101', severity: 'CRITICAL', type: 'LSASS Credential Dump Detected', location: 'SRV-FIN-DC01 (New York)', time: '2 sec ago', status: 'Contained', ioc: '194.26.29.114' },
    { id: 'EVT-102', severity: 'HIGH', type: 'Unusual PowerShell Process Tree', location: 'HR-WS-09 (London)', time: '8 sec ago', status: 'Analyzing', ioc: '10.0.4.82' },
    { id: 'EVT-103', severity: 'MEDIUM', type: 'Abnormal DNS Query Rate Burst', location: 'EDGE-DNS-01 (Frankfurt)', time: '14 sec ago', status: 'Rate-Limited', ioc: '185.220.101.5' },
    { id: 'EVT-104', severity: 'LOW', type: 'Port Sweep 22/80/443 Scanned', location: 'DMZ-SUBNET (Tokyo)', time: '21 sec ago', status: 'Logged', ioc: '103.145.12.8' },
    { id: 'EVT-105', severity: 'HIGH', type: 'Golden Ticket Kerberos Request', location: 'AWS-IAM-ADMIN (Virginia)', time: '35 sec ago', status: 'Revoked', ioc: '54.210.12.8' },
  ], []);

  const statCards = [
    {
      label: 'TOTAL THREATS DETECTED',
      value: stats.totalThreats,
      change: '+12.4%',
      trend: 'up',
      sparkline: [40, 55, 60, 75, 85, 95, 110, 150],
      color: '#ff0054',
      bg: 'rgba(255,0,84,0.05)',
      border: 'rgba(255,0,84,0.25)',
      icon: <Crosshair className="w-5 h-5" />,
      sub: 'IoC telemetry matches',
      updated: `${lastUpdate.threats}s ago`,
    },
    {
      label: 'ACTIVE MONITORED NODES',
      value: `${stats.activeAssets + 1340}`,
      change: '99.98% SLA',
      trend: 'up',
      sparkline: [1410, 1412, 1415, 1418, 1420],
      color: '#00ff88',
      bg: 'rgba(0,255,136,0.05)',
      border: 'rgba(0,255,136,0.25)',
      icon: <Server className="w-5 h-5" />,
      sub: 'endpoints online & reporting',
      updated: `${lastUpdate.nodes}s ago`,
    },
    {
      label: 'TOTAL SIEM ALERTS',
      value: stats.totalAlerts,
      change: '8.2/sec in',
      trend: 'up',
      sparkline: [220, 240, 255, 270, 285, 300],
      color: '#00f0ff',
      bg: 'rgba(0,240,255,0.05)',
      border: 'rgba(0,240,255,0.25)',
      icon: <Bell className="w-5 h-5" />,
      sub: 'rule correlations checked',
      updated: `${lastUpdate.alerts}s ago`,
    },
    {
      label: 'CRITICAL ESCALATIONS',
      value: stats.criticalIncidents,
      change: '-35% MTTR',
      trend: 'down',
      sparkline: [12, 10, 8, 6, 4],
      color: '#ffbe0b',
      bg: 'rgba(255,190,11,0.05)',
      border: 'rgba(255,190,11,0.25)',
      icon: <ShieldAlert className="w-5 h-5" />,
      sub: 'active containment tickets',
      updated: `${lastUpdate.escalations}s ago`,
    },
  ];

  return (
    <div className={`flex-1 overflow-y-auto overflow-x-hidden cyber-grid-mesh transition-colors duration-200 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#030712] text-gray-100'
    }`}>
      <div className="p-3.5 sm:p-5 min-h-full max-w-[1920px] mx-auto space-y-4">

        {/* Command Center Title & Telemetry Header Bar */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b ${
          isLight ? 'border-slate-200' : 'border-cyan-500/15'
        }`}>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-xl sm:text-2xl font-display font-extrabold tracking-wider flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span className={isLight ? 'text-cyan-700' : 'text-cyan-400'}>CYBERSHIELD</span> SECURITY COMMAND CENTER
              </h1>
              <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                isLight
                  ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              }`}>
                MSSP ENTERPRISE SOC
              </span>
            </div>
            <p className={`text-[11px] font-mono tracking-wide mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              LIVE TELEMETRY PULSE &bull; DEFCON POSTURE: <b className="text-emerald-500">DEFCON 4 (NORMAL READINESS)</b> &bull; LATENCY: <b className={isLight ? 'text-cyan-700' : 'text-cyan-400'}>4ms</b>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <button
              onClick={() => setSelectedView('threat-globe')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border border-slate-300 text-cyan-800'
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-cyan-500/10'
              }`}
            >
              <Orbit className={`w-3.5 h-3.5 animate-spin ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} style={{ animationDuration: '25s' }} />
              <span>3D WebGL Attack Globe &rarr;</span>
            </button>
            <button
              onClick={() => setSelectedView('ai-copilot')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                isLight
                  ? 'bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-800'
                  : 'bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 text-purple-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-500" />
              <span>Launch AI Copilot</span>
            </button>
          </div>
        </div>

        {/* 4 Premium Animated Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`hud-card relative rounded-2xl p-4 overflow-hidden group select-none ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : ''
              }`}
              style={{ borderLeft: `3px solid ${card.color}` }}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                      isLight ? 'text-slate-600' : 'text-gray-400'
                    }`}>
                      {card.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {card.value}
                    </span>
                    <span
                      className="text-[11px] font-mono font-bold flex items-center gap-0.5 px-1.5 py-0.2 rounded"
                      style={{
                        backgroundColor: `${card.color}15`,
                        color: card.color,
                        border: `1px solid ${card.color}30`,
                      }}
                    >
                      {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {card.change}
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono mt-1 truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{card.sub}</p>
                </div>

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 duration-200"
                  style={{
                    backgroundColor: `${card.color}15`,
                    borderColor: `${card.color}35`,
                    color: card.color,
                    boxShadow: isLight ? undefined : `0 0 15px ${card.color}25`,
                  }}
                >
                  {card.icon}
                </div>
              </div>

              {/* Sparkline & Updated Timestamp Bar */}
              <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[9px] font-mono ${
                isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-gray-400'
              }`}>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Telemetry: <b className={isLight ? 'text-slate-700' : 'text-gray-300'}>{card.updated}</b>
                </span>
                <span className={`font-mono font-bold tracking-widest ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>&block;&marker;&block;&block;&marker;&block;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controlled Red Team Attack Simulation Testing Environment */}
        <div className={`hud-card p-4 rounded-2xl border shadow-xl font-mono text-xs ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'border-cyan-500/25 bg-[#050b18]/90 text-gray-100'
        }`}>
          <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b ${
            isLight ? 'border-slate-200' : 'border-cyan-500/15'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <p className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span>Red Team Security Testing Sandbox</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
                    ISOLATED DMZ
                  </span>
                </p>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  Trigger controlled synthetic attacks to test SOC detection latency & AI containment response
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => triggerAttackSimulation('DDoS SYN Flood')}
                disabled={!!activeSimulation}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
                  isLight
                    ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                    : 'bg-red-500/15 hover:bg-red-500/25 border-red-500/40 text-red-300'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-red-500" />
                <span>Simulate DDoS</span>
              </button>
              <button
                onClick={() => triggerAttackSimulation('Ransomware Lateral Move')}
                disabled={!!activeSimulation}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
                  isLight
                    ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700'
                    : 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-400/40 text-purple-300'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-purple-500" />
                <span>Ransomware Simulation</span>
              </button>
              <button
                onClick={() => triggerAttackSimulation('SQL Injection Breach')}
                disabled={!!activeSimulation}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-amber-500" />
                <span>SQL Injection Simulation</span>
              </button>
            </div>
          </div>

          {/* Animated 4-Stage Attack Progression Pipeline */}
          {activeSimulation && (
            <div className="mt-3.5 space-y-3 animate-in fade-in duration-300">
              <div className={`flex items-center justify-between text-[11px] font-bold ${isLight ? 'text-slate-800' : 'text-cyan-300'}`}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  ACTIVE VECTOR: <b className={isLight ? 'text-slate-900' : 'text-white'}>{activeSimulation}</b>
                </span>
                <span>PROGRESS: {simProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className={`w-full h-1.5 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-black/60 border-cyan-500/20'}`}>
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${simProgress}%` }}
                />
              </div>

              {/* 4 Pipeline Stages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10px]">
                {simStages.map((stg, i) => (
                  <div
                    key={stg.name}
                    className={`p-2.5 rounded-xl border ${
                      stg.status === 'completed'
                        ? isLight
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                          : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                        : stg.status === 'active'
                        ? isLight
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold animate-pulse'
                          : 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold animate-pulse'
                        : isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-500'
                          : 'bg-black/30 border-white/5 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>{i + 1}. {stg.name}</span>
                      {stg.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : null}
                    </div>
                    <p className={`text-[9px] truncate ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{stg.detail}</p>
                  </div>
                ))}
              </div>

              {/* Real-Time Defense Log Stream */}
              <div className={`p-2 rounded-xl border text-[10px] space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/70 border-gray-800'
              }`}>
                {simLog.map((log, i) => (
<p key={i} className="text-emerald-600 dark:text-emerald-400 font-mono">&gt; {log}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Operational Core: Global Attack Map + Security Score & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Tactical Global Attack Map HUD (2 Columns) */}
          <div className={`hud-card rounded-2xl p-4 lg:col-span-2 flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : ''
          }`}>
            <div className={`flex items-center justify-between pb-3 mb-2 border-b ${
              isLight ? 'border-slate-200' : 'border-cyan-500/15'
            }`}>
              <div className="flex items-center gap-2">
                <Globe2 className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-900' : 'text-cyan-300'
                }`}>
                  Tactical Global Cyber Attack Map
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <button
                  onClick={() => setSelectedView('global-map')}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-bold ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-cyan-800 border-slate-300'
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  Expand Full Map &rarr;
                </button>
              </div>
            </div>

            <div className={`h-72 relative rounded-xl overflow-hidden border ${
              isLight ? 'border-slate-200 bg-white' : 'border-cyan-500/20 bg-[#02050f]'
            }`}>
              <GlobalAttackMap attacks={globalAttacks.slice(0, 300)} className="h-full" compact />
            </div>

            {/* Attack Statistics Bar */}
            <div className={`mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center font-mono ${
              isLight ? 'border-slate-200' : 'border-cyan-500/10'
            }`}>
              <div className={`p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                <p className={`text-lg sm:text-xl font-display font-bold ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>{attackCategories.length}</p>
                <p className={`text-[9px] uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Attack Signatures</p>
              </div>
              <div className={`p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                <p className="text-lg sm:text-xl font-display font-bold text-red-500">{globalAttacks.length}</p>
                <p className={`text-[9px] uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Intercepted Threats</p>
              </div>
              <div className={`p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                <p className="text-lg sm:text-xl font-display font-bold text-emerald-600 dark:text-emerald-400">40</p>
                <p className={`text-[9px] uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Monitored Strategic Hubs</p>
              </div>
            </div>
          </div>

          {/* Right Column: Security Score Gauge & Threat Distribution */}
          <div className="flex flex-col gap-4">
            
            {/* Animated Circular Security Score Card */}
            <div
              onClick={() => setShowPostureModal(true)}
              className={`hud-card rounded-2xl p-4 cursor-pointer transition-all group ${
                isLight ? 'bg-white border-slate-200 hover:border-cyan-500 shadow-sm' : 'hover:border-cyan-400/60'
              }`}
              title="Click to view detailed Security Posture sub-scores"
            >
              <div className={`flex items-center justify-between pb-2 border-b ${
                isLight ? 'border-slate-200' : 'border-cyan-500/15'
              }`}>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-slate-900' : 'text-cyan-300'
                }`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Security Posture Score
                </span>
                <span className={`text-[10px] font-mono group-hover:underline flex items-center gap-1 ${
                  isLight ? 'text-cyan-700' : 'text-cyan-400'
                }`}>
                  Details <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <div className="py-3 flex items-center justify-around">
                {/* Radial Gauge */}
                <div className="relative w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="75%"
                      outerRadius="100%"
                      data={[{ name: 'score', value: securityScore, fill: scoreColor }]}
                      startAngle={90}
                      endAngle={90 - 360}
                    >
                      <RadialBar background={{ fill: isLight ? '#e2e8f0' : '#0a1020' }} dataKey="value" cornerRadius={12} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-display font-extrabold" style={{ color: scoreColor }}>
                      {securityScore}
                    </span>
                    <span className={`text-[9px] font-mono uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>OF 100</span>
                  </div>
                </div>

                {/* Sub-Score Highlights */}
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className={`flex items-center justify-between gap-3 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    <span>Network:</span>
                    <b className="text-emerald-600 dark:text-emerald-400">{subScores.network}%</b>
                  </div>
                  <div className={`flex items-center justify-between gap-3 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    <span>Endpoint:</span>
                    <b className="text-emerald-600 dark:text-emerald-400">{subScores.endpoint}%</b>
                  </div>
                  <div className={`flex items-center justify-between gap-3 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    <span>Identity:</span>
                    <b className={isLight ? 'text-cyan-800' : 'text-cyan-300'}>{subScores.identity}%</b>
                  </div>
                  <div className={`flex items-center justify-between gap-3 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    <span>Cloud Posture:</span>
                    <b className="text-amber-600 dark:text-amber-400">{subScores.cloud}%</b>
                  </div>
                  <div className={`flex items-center justify-between gap-3 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    <span>Incident MTTR:</span>
                    <b className="text-emerald-600 dark:text-emerald-400">{subScores.response}%</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Threat Severity Distribution Donut */}
            <div className={`hud-card rounded-2xl p-4 flex-1 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : ''
            }`}>
              <div className={`flex items-center justify-between pb-2 border-b ${
                isLight ? 'border-slate-200' : 'border-cyan-500/15'
              }`}>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-slate-900' : 'text-cyan-300'
                }`}>
                  <Activity className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} /> Threat Severity Ratio
                </span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Total: {alerts.length}
                </span>
              </div>

              <div className="h-36 py-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {severityData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} stroke={isLight ? '#ffffff' : 'rgba(0,0,0,0.4)'} strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: isLight ? '#ffffff' : '#040914',
                        border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(0,240,255,0.3)',
                        borderRadius: 8,
                        fontSize: 11,
                        fontFamily: 'monospace',
                        color: isLight ? '#0f172a' : '#ffffff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Interactive Legend Grid */}
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] pt-1">
                {severityData.map((s) => (
                  <div key={s.name} className={`p-1.5 rounded-lg border flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
                  }`}>
                    <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.fill }} />
                      {s.name}
                    </span>
                    <b style={{ color: s.fill }}>{s.value} ({s.pct}%)</b>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Lower Row: Threat Activity Timeline + Live SOC Event Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Threat Activity Timeline with Range Filter (2 Columns) */}
          <div className={`hud-card rounded-2xl p-4 lg:col-span-2 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : ''
          }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-cyan-500/15'
            }`}>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-900' : 'text-cyan-300'
                }`}>
                  Threat Activity & Mitigation Timeline
                </h3>
              </div>

              {/* Range Filters */}
              <div className={`flex items-center gap-1 p-1 rounded-xl border font-mono text-[10px] ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/60 border-cyan-500/20'
              }`}>
                {(['1H', '6H', '24H', '7D'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      timeRange === r
                        ? isLight
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                        : isLight
                          ? 'text-slate-600 hover:text-slate-900'
                          : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threatActivity}>
                  <defs>
                    <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff0054" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#ff0054" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mitigGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke={isLight ? '#94a3b8' : '#4b5563'} fontSize={10} fontFamily="monospace" />
                  <YAxis stroke={isLight ? '#94a3b8' : '#4b5563'} fontSize={10} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      background: isLight ? '#ffffff' : '#040914',
                      border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(0,240,255,0.3)',
                      borderRadius: 8,
                      fontSize: 11,
                      fontFamily: 'monospace',
                      color: isLight ? '#0f172a' : '#ffffff',
                    }}
                  />
                  <Area type="monotone" dataKey="alerts" name="Inbound Attacks" stroke="#ff0054" strokeWidth={2} fill="url(#alertGrad)" />
                  <Area type="monotone" dataKey="mitigated" name="Mitigated Actions" stroke="#00f0ff" strokeWidth={2} fill="url(#mitigGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={`pt-2 flex items-center justify-between text-[10px] font-mono border-t ${
              isLight ? 'border-slate-200 text-slate-500' : 'border-white/5 text-gray-400'
            }`}>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 rounded bg-[#ff0054]" /> Inbound Threats
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 rounded bg-[#00f0ff]" /> Automated Mitigations
                </span>
              </div>
              <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>Live Telemetry Ingestion: 8.2 msgs/sec</span>
            </div>
          </div>

          {/* Live Threat Activity Feed (1 Column) */}
          <div className={`hud-card rounded-2xl p-4 flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : ''
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-cyan-500/15'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-900' : 'text-cyan-300'
                }`}>
                  Live Threat Event Feed
                </h3>
              </div>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>SIEM STREAM</span>
            </div>

            {/* Event List */}
            <div className="space-y-2 my-2 max-h-64 overflow-y-auto pr-1">
              {recentEvents.slice(0, 5).map((evt) => (
                <div
                  key={evt.id}
                  className={`p-2 rounded-xl border transition-all ${
                    isLight ? 'bg-slate-50 hover:bg-cyan-50 border-slate-200' : 'bg-black/40 hover:bg-cyan-500/10 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                      evt.severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                        : evt.severity === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}>
                      {evt.severity}
                    </span>
                    <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>{evt.time}</span>
                  </div>
                  <p className={`text-xs font-medium mt-1 truncate ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
                    {evt.type}
                  </p>
                  <div className={`flex items-center justify-between text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    <span className="truncate">{evt.location}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{evt.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedView('soc-operations')}
              className={`mt-2 w-full py-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-cyan-800'
                  : 'bg-black/60 hover:bg-cyan-500/15 border-cyan-500/20 text-cyan-300'
              }`}
            >
              <span>View Full SIEM Telemetry &rarr;</span>
            </button>
          </div>

        </div>

      </div>

      {/* Security Posture Sub-Scores Breakdown Modal */}
      {showPostureModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`hud-card max-w-lg w-full rounded-2xl p-6 border shadow-2xl font-mono text-xs space-y-4 animate-in fade-in zoom-in-95 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'border-cyan-500/40 text-gray-100'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-cyan-500/20'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Enterprise Security Posture Breakdown
                </h3>
              </div>
              <button
                onClick={() => setShowPostureModal(false)}
                className={`p-1 rounded-lg cursor-pointer ${isLight ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Network Security (Perimeter & WAF)', score: subScores.network, desc: 'Firewall clusters, port inspection, DDoS shielding' },
                { title: 'Endpoint Security & EDR Agent Mesh', score: subScores.endpoint, desc: '80 monitored nodes with proactive behavioral heuristic agents' },
                { title: 'Zero Trust Identity & IAM Clearance', score: subScores.identity, desc: 'MFA passkey enforcement, role-based clearance, token rotation' },
                { title: 'Cloud Security Posture Management (CSPM)', score: subScores.cloud, desc: 'AWS/Azure compliance against CIS benchmarks and open storage' },
                { title: 'SOAR Threat Automation & MTTR', score: subScores.response, desc: 'Automated lateral movement quarantine and containment SLAs' },
              ].map((sub) => (
                <div key={sub.title} className={`p-3 rounded-xl border space-y-1.5 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-white/5'
                }`}>
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className={isLight ? 'text-slate-800' : 'text-gray-200'}>{sub.title}</span>
                    <span className={sub.score >= 85 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{sub.score}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-gray-800'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                  <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{sub.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPostureModal(false)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isLight
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm'
                    : 'bg-cyan-500 text-black hover:bg-cyan-400'
                }`}
              >
                Close Audit Inspection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
