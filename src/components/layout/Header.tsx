import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../store/AppContext';
import { 
  RefreshCw, Bell, Search, AlertTriangle, CheckCircle, Activity, Menu, 
  LogOut, Shield, Server, Database, Cpu, X, Lock, CheckCircle2, ChevronRight,
  Sun, Moon
} from 'lucide-react';

const viewLabels: Record<string, string> = {
  'platform-intro': 'Platform Architecture & Capabilities Guide',
  'url-scanner': 'Live Web Threat & URL Security Scanner',
  'corporate-uptime': 'Corporate Domain Uptime & SSL Expiry Monitor',
  'auto-patch': '1-Click Auto-Patch & Remediation Script Engine',
  'firewall-export': 'Enterprise Firewall IoC Blocklist Exporter',
  'command-center': 'Command Center',
  'global-map': 'Global Attack Map',
  'threat-globe': '3D WebGL Threat Globe',
  'ai-copilot': 'Autonomous AI Copilot',
  'ai-assistant': 'AI Security Analyst',
  'threat-intelligence': 'Threat Intelligence',
  'mitre-attack': 'MITRE ATT&CK Matrix',
  'hunting-notebook': 'Threat Hunting Notebook',
  'threat-actors': 'Threat Actors',
  'alert-notifications': 'Corporate Webhooks & Alert Dispatcher',
  'analyst-leaderboard': 'Analyst Leaderboard',
  'soc-operations': 'SOC Operations',
  'alerts': 'Alert Center',
  'incidents': 'Incident Response',
  'detection-engine': 'Detection Engine',
  'vulnerabilities': 'Vulnerability Management',
  'assets': 'Asset Inventory',
  'forensics': 'Digital Forensics',
  'soar': 'SOAR Automation',
  'compliance-reports': 'Boardroom PDF & Audit Suite',
  'zero-trust-iam': 'Multi-Tenant Org & Team RBAC Clearance',
  'compliance': 'Compliance Center',
  'executive': 'Executive Dashboard',
  'reports': 'Reports & Analytics',
  'security-posture': 'Security Posture',
  'settings': 'Settings',
};

export default function Header() {
  const { 
    selectedView, setSelectedView, alerts, incidents, threats, assets, 
    vulnerabilities, refreshData, isLoading, toggleSidebar, currentUser, logout: appLogout, acknowledgeAlert,
    themeMode, toggleTheme
  } = useApp();

  const handleLogout = () => {
    appLogout();
  };

  const displayName = currentUser?.full_name || 'Commander Vance';
  const displayEmail = currentUser?.email || 'sec.analyst@cybershield.ai';
  const displayAvatar = currentUser?.avatar_url;

  const [now, setNow] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && a.status === 'new').length;
  const openIncidents = incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length;
  const label = viewLabels[selectedView] || 'Command Center';

  // Live Search Filtering
  const filteredSearch = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const matchedThreats = threats.filter(t => t.title.toLowerCase().includes(q) || (t.source_ip && t.source_ip.includes(q))).slice(0, 3);
    const matchedAlerts = alerts.filter(a => a.title.toLowerCase().includes(q) || (a.source && a.source.toLowerCase().includes(q))).slice(0, 3);
    const matchedAssets = assets.filter(ast => ast.name.toLowerCase().includes(q) || (ast.ip_address && ast.ip_address.includes(q))).slice(0, 3);
    const matchedVulns = vulnerabilities.filter(v => (v.cve_id && v.cve_id.toLowerCase().includes(q)) || v.title.toLowerCase().includes(q)).slice(0, 3);

    return [
      ...matchedThreats.map(t => ({ id: t.id, title: t.title, type: 'Threat', view: 'threat-intelligence', badge: t.severity })),
      ...matchedAlerts.map(a => ({ id: a.id, title: a.title, type: 'Alert', view: 'alerts', badge: a.severity })),
      ...matchedAssets.map(ast => ({ id: ast.id, title: ast.name, type: 'Asset', view: 'assets', badge: ast.type })),
      ...matchedVulns.map(v => ({ id: v.id, title: `${v.cve_id || 'CVE'}: ${v.title}`, type: 'Vulnerability', view: 'vulnerabilities', badge: v.severity })),
    ];
  }, [searchQuery, threats, alerts, assets, vulnerabilities]);

  const systemServices = [
    { name: 'SOC Telemetry Collector Engine', status: 'Operational', ping: '12ms', icon: Cpu, ok: true },
    { name: 'Perimeter NextGen Firewall Cluster', status: 'Operational', ping: '4ms', icon: Shield, ok: true },
    { name: 'SIEM SQLite Database Cluster', status: 'Healthy', ping: '2ms', icon: Database, ok: true },
    { name: 'EDR Endpoint Agent Mesh (80 Nodes)', status: 'All Connected', ping: '8ms', icon: Server, ok: true },
    { name: 'Anthropic Claude AI Analytics Engine', status: 'Active (v4.6)', ping: '45ms', icon: Activity, ok: true },
    { name: 'Web Application Firewall (WAF)', status: 'Active Filtering', ping: '3ms', icon: Lock, ok: true },
  ];

  const isLight = themeMode === 'light';

  return (
    <header className={`flex items-center justify-between gap-2 md:gap-4 px-3 md:px-5 h-16 border-b shrink-0 font-sans z-30 select-none transition-colors duration-200 ${
      isLight
        ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
        : 'bg-cyber-darker/90 border-cyan-500/15 backdrop-blur-xl text-gray-100'
    }`}>
      
      {/* Left Navigation Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Universal Sidebar Navigation Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/30 text-cyan-300 hover:text-white shadow-cyan-500/15'
          }`}
          title="Toggle Navigation Sidebar (Expand / Collapse)"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h2 className={`text-sm sm:text-base font-display font-bold tracking-wide truncate ${
          isLight ? 'text-slate-900' : 'text-cyan-300'
        }`}>
          {label}
        </h2>
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm ${
          isLight
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          LIVE SOC MESH
        </span>
      </div>

      {/* Global Interactive Search Input */}
      <div className="flex-1 max-w-md mx-2 md:mx-4 hidden sm:block relative">
        <div className="relative">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-cyan-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchModal(true);
            }}
            onFocus={() => setShowSearchModal(true)}
            placeholder="Search threats, alerts, assets, CVEs..."
            className={`w-full pl-10 pr-8 py-2 rounded-xl text-xs font-mono transition-all focus:outline-none focus:ring-1 ${
              isLight
                ? 'bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600/30'
                : 'bg-black/70 border border-cyan-500/30 text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/40 shadow-inner'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-cyan-300'}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Auto-Suggest Dropdown Results */}
        {showSearchModal && searchQuery.trim().length > 0 && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowSearchModal(false)} />
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-40 p-3 max-h-80 overflow-y-auto space-y-2 ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-cyber-darker/95 border-cyan-500/40 backdrop-blur-2xl text-gray-100'
            }`}>
              <div className={`flex items-center justify-between text-[10px] font-bold uppercase pb-1 border-b font-mono ${
                isLight ? 'text-slate-500 border-slate-200' : 'text-gray-400 border-cyan-500/15'
              }`}>
                <span>Search Telemetry Results</span>
                <span className={isLight ? 'text-cyan-700' : 'text-cyan-400'}>{filteredSearch.length} found</span>
              </div>

              {filteredSearch.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedView(item.view);
                    setShowSearchModal(false);
                    setSearchQuery('');
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    isLight
                      ? 'bg-slate-50 hover:bg-cyan-50 border-slate-200 hover:border-cyan-300'
                      : 'bg-black/50 hover:bg-cyan-500/15 border-white/5 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mr-2 uppercase font-mono ${
                      isLight ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {item.type}
                    </span>
                    <span className={`text-xs font-medium truncate ${
                      isLight ? 'text-slate-800 group-hover:text-cyan-700' : 'text-gray-200 group-hover:text-cyan-300'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400 group-hover:text-cyan-700' : 'text-gray-500 group-hover:text-cyan-400'}`} />
                </div>
              ))}

              {filteredSearch.length === 0 && (
                <p className="text-xs text-gray-500 py-3 text-center font-mono">No matching telemetry records found.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Enterprise SOC Mesh Status */}
        <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono shadow-sm ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-black/60 border-cyan-500/25 text-gray-200'
        }`}>
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold" title="SOC Telemetry Mesh Status">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SOC MESH: OPERATIONAL</span>
          </div>
          <div className={`w-px h-3.5 ${isLight ? 'bg-slate-300' : 'bg-cyan-500/20'}`} />
          <div className="flex items-center gap-1 text-red-500 font-bold" title="Active Threats Under Investigation">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{openIncidents || 12} ACTIVE</span>
          </div>
          <div className={`w-px h-3.5 ${isLight ? 'bg-slate-300' : 'bg-cyan-500/20'}`} />
          <div className={`flex items-center gap-1 font-bold ${isLight ? 'text-slate-700' : 'text-cyan-300'}`} title="Monitored Nodes Online">
            <Server className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
            <span>1,420 NODES</span>
          </div>
        </div>

        {/* Live System Clocks (Local & UTC) */}
        <div className={`hidden xl:flex items-center gap-3 px-3 py-1 rounded-xl border font-mono text-right ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-cyan-500/15'
        }`}>
          <div>
            <p className={`text-xs font-bold tracking-wider ${isLight ? 'text-slate-900' : 'text-cyan-300'}`}>
              {now.toLocaleTimeString('en-US', { hour12: false })}
            </p>
            <p className={`text-[9px] uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className={`w-px h-6 ${isLight ? 'bg-slate-300' : 'bg-cyan-500/20'}`} />
          <div>
            <p className={`text-[11px] font-bold tracking-wider ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              {now.toISOString().substring(11, 19)} <span className="text-[9px] text-gray-400">UTC</span>
            </p>
            <p className={`text-[9px] uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              ZULU TIME
            </p>
          </div>
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 shadow-cyan-500/10'
          }`}
          title={themeMode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {themeMode === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '20s' }} />
          ) : (
            <Moon className="w-4 h-4 text-cyan-700" />
          )}
        </button>

        {/* Notifications Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-black/60 border-cyan-500/20 hover:border-cyan-400/40 text-gray-400 hover:text-cyan-300 shadow-md'
            }`}
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {criticalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-ping">
                {criticalAlerts}
              </span>
            )}
          </button>

          {/* Notifications Panel Dropdown */}
          {showNotif && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowNotif(false)} />
              <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-30 overflow-hidden ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-cyber-darker/95 border-cyan-500/30 backdrop-blur-2xl text-gray-100'
              }`}>
                <div className={`px-4 py-3 border-b flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/40 border-cyan-500/15 text-cyan-300'
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Live SOC Notifications</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-500 font-bold">
                    {criticalAlerts} Critical
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 p-2">
                  {alerts.slice(0, 6).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        acknowledgeAlert(a.id);
                        setSelectedView('alerts');
                        setShowNotif(false);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isLight
                          ? 'bg-slate-50 hover:bg-cyan-50 border-slate-200 text-slate-800'
                          : 'bg-black/40 hover:bg-cyan-500/10 border-white/5 text-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          a.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-600'
                        }`}>
                          {a.severity}
                        </span>
                        <span className="text-[9px] text-gray-400">{a.source}</span>
                      </div>
                      <p className={`text-xs font-medium mt-1 truncate ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>{a.title}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-2 border-t text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-cyan-500/15'}`}>
                  <button
                    onClick={() => {
                      setSelectedView('alerts');
                      setShowNotif(false);
                    }}
                    className={`text-xs font-bold ${isLight ? 'text-cyan-700 hover:text-cyan-800' : 'text-cyan-400 hover:text-cyan-300'}`}
                  >
                    View All SOC Alerts →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Refresh Telemetry Data Button */}
        <button
          onClick={refreshData}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-black/60 border-cyan-500/20 hover:border-cyan-400/40 text-gray-400 hover:text-cyan-300 shadow-md'
          }`}
          title="Refresh SOC Telemetry Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-500' : ''}`} />
        </button>

        {/* User Profile Badge & Direct Logout */}
        <div className={`relative flex items-center gap-2 pl-2 border-l ${isLight ? 'border-slate-300' : 'border-cyan-500/20'}`}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 cursor-pointer group"
            title="Click to view user clearance profile"
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-8 h-8 rounded-full border border-cyan-400/40 object-cover shadow-sm group-hover:border-cyan-500 transition-all"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {displayName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <p className={`text-xs font-bold truncate max-w-[110px] ${isLight ? 'text-slate-900' : 'text-gray-200'}`}>
                {displayName}
              </p>
              <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-2.5 h-2.5" />
                {currentUser?.role || 'Senior SOC Analyst'}
              </p>
            </div>
          </div>

          {/* Prominent Direct Logout Icon Button */}
          <button
            onClick={handleLogout}
            title="Sign Out / Terminate SOC Session"
            className="w-8.5 h-8.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center text-red-500 hover:text-red-400 transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Profile Dropdown Menu */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowUserMenu(false)} />
              <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl z-30 p-4 space-y-3 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-cyber-darker/95 border-cyan-500/30 backdrop-blur-2xl text-gray-100'
              }`}>
                <div className={`p-3 rounded-xl border font-mono ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-cyan-500/10 border-cyan-500/20'
                }`}>
                  <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-cyan-300'}`}>{displayName}</p>
                  <p className={`text-[10px] truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{displayEmail}</p>
                  <div className="mt-2 flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5" /> LEVEL 5 DEFENSE CLEARANCE
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-500 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Terminate SOC Session (Logout)</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>

      {/* System Health Status Modal (Portaled to document.body for clean viewport centering) */}
      {showHealthModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-cyber-darker/95 border-cyan-500/40 text-gray-100'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-cyan-500/20'}`}>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500 animate-pulse" />
                <h3 className={`text-sm font-display font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-cyan-300'}`}>
                  System Health & Node Matrix
                </h3>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className={`p-1.5 rounded-lg cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {systemServices.map((svc, idx) => {
                const Icon = svc.icon;
                return (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/60 border-cyan-500/15'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isLight ? 'bg-cyan-50 text-cyan-700' : 'bg-cyan-500/10 text-cyan-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-gray-200'}`}>{svc.name}</p>
                        <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Latency: {svc.ping}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {svc.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowHealthModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30'
                }`}
              >
                Close Matrix Window
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </header>
  );
}
