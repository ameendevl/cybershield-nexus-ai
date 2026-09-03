import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../store/AppContext';
import { 
  RefreshCw, Bell, Search, AlertTriangle, CheckCircle, Activity, Menu, 
  LogOut, Shield, Server, Database, Cpu, X, Lock, CheckCircle2, ChevronRight,
  Sun, Moon, CornerDownLeft, Command
} from 'lucide-react';

const NAV_MODULES = [
  { id: 'command-center', title: 'SOC Command Center & Live Pulse', category: 'Overview', keywords: 'command center dashboard metrics red team overview pulse' },
  { id: 'url-scanner', title: 'Live Web Threat & URL Scanner', category: 'Reconnaissance', keywords: 'url scanner website security headers ssl tech stack ports audit recon' },
  { id: 'corporate-uptime', title: 'Corporate Domain & SSL Monitor', category: 'Monitoring', keywords: 'uptime domain ssl cert expiry latency sla ping endpoints tls' },
  { id: 'threat-globe', title: '3D WebGL Threat Globe', category: 'Visualization', keywords: '3d threat globe threejs earth world arcs attack map globe orbital' },
  { id: 'global-map', title: 'Global Attack Map 2D', category: 'Visualization', keywords: 'global attack map 2d map geography telemetry live attacks' },
  { id: 'auto-patch', title: '1-Click Auto-Patch Engine', category: 'Remediation', keywords: 'auto patch remediation cve bash powershell docker nginx fix script' },
  { id: 'firewall-export', title: 'Firewall Blocklist Exporter', category: 'Perimeter', keywords: 'firewall blocklist export cisco fortinet palo alto aws waf ioc rules' },
  { id: 'ai-copilot', title: 'Autonomous AI Cyber Copilot', category: 'AI Intelligence', keywords: 'ai copilot bot triage chat yara threat hunting assistant autonomous' },
  { id: 'ai-assistant', title: 'AI Security Analyst', category: 'AI Intelligence', keywords: 'ai assistant analyst advisor prompts natural language' },
  { id: 'soc-operations', title: 'SOC Operations & Workflow', category: 'Operations', keywords: 'soc operations analysts triage escalation runbooks queue shift' },
  { id: 'alerts', title: 'Alert Center & Live Feed', category: 'Alerts', keywords: 'alerts center notifications critical triage warnings high medium' },
  { id: 'incidents', title: 'Incident Response & Containment', category: 'Incidents', keywords: 'incidents response tickets containment forensics playbook rca' },
  { id: 'detection-engine', title: 'Detection Engine & Rules', category: 'Detection', keywords: 'detection engine sigma yara rules correlation behavior anomaly' },
  { id: 'mitre-attack', title: 'MITRE ATT&CK Matrix', category: 'Threat Intel', keywords: 'mitre attack matrix tactics techniques ttp apt reconnaissance' },
  { id: 'threat-intelligence', title: 'Threat Intelligence Feeds', category: 'Threat Intel', keywords: 'threat intelligence feeds apt actors stix indicators iocs malware' },
  { id: 'hunting-notebook', title: 'Threat Hunting Notebook', category: 'Investigation', keywords: 'hunting notebook queries kql splunk investigation hypotheses' },
  { id: 'vulnerabilities', title: 'Vulnerability Management', category: 'Vulnerabilities', keywords: 'vulnerability cve cvss scanning patches exploits severity' },
  { id: 'assets', title: 'Asset & Node Inventory', category: 'Infrastructure', keywords: 'assets hardware servers nodes endpoints cloud ip mac os' },
  { id: 'forensics', title: 'Digital Forensics Workspace', category: 'Investigation', keywords: 'digital forensics memory disk pcap analysis timeline artifacts' },
  { id: 'soar', title: 'SOAR Automation Playbooks', category: 'Automation', keywords: 'soar automation playbooks orchestrator triggers actions webhooks' },
  { id: 'zero-trust-iam', title: 'Zero-Trust IAM & RBAC', category: 'Identity', keywords: 'zero trust iam identity access rbac clearance users roles permissions' },
  { id: 'compliance', title: 'Compliance Center (SOC2/ISO)', category: 'Governance', keywords: 'compliance soc2 iso27001 hipaa pci gdpr audit frameworks controls' },
  { id: 'compliance-reports', title: 'Boardroom PDF & Audit Suite', category: 'Governance', keywords: 'compliance reports pdf export executive board audit presentation' },
  { id: 'executive', title: 'Executive Risk Dashboard', category: 'Executive', keywords: 'executive risk posture ciso board metrics financial exposure' },
  { id: 'reports', title: 'Reports & Analytics Hub', category: 'Reports', keywords: 'reports analytics export metrics trends graphs export csv pdf' },
  { id: 'platform-intro', title: 'Platform Architecture & Guide', category: 'Docs', keywords: 'platform intro architecture guide tour documentation system' },
  { id: 'settings', title: 'System & Security Settings', category: 'Configuration', keywords: 'settings preferences api keys config dark mode theme profile' },
];

const viewLabels: Record<string, string> = {
  'platform-intro': 'Platform Architecture Guide',
  'url-scanner': 'Live Web Threat & URL Scanner',
  'corporate-uptime': 'Corporate Domain & SSL Monitor',
  'auto-patch': '1-Click Auto-Patch Engine',
  'firewall-export': 'Firewall Blocklist Exporter',
  'command-center': 'SOC Command Center',
  'global-map': 'Global Attack Map',
  'threat-globe': '3D WebGL Threat Globe',
  'ai-copilot': 'Autonomous AI Copilot',
  'ai-assistant': 'AI Security Analyst',
  'threat-intelligence': 'Threat Intelligence',
  'mitre-attack': 'MITRE ATT&CK Matrix',
  'hunting-notebook': 'Threat Hunting Notebook',
  'threat-actors': 'Threat Actors',
  'alert-notifications': 'Alert Dispatcher',
  'analyst-leaderboard': 'Analyst Leaderboard',
  'soc-operations': 'SOC Operations',
  'alerts': 'Alert Center',
  'incidents': 'Incident Response',
  'detection-engine': 'Detection Engine',
  'vulnerabilities': 'Vulnerability Management',
  'assets': 'Asset Inventory',
  'forensics': 'Digital Forensics',
  'soar': 'SOAR Automation',
  'compliance-reports': 'Audit & PDF Suite',
  'zero-trust-iam': 'Zero-Trust IAM',
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

  const isLight = themeMode === 'light';
  const displayName = currentUser?.full_name || 'Commander Vance';
  const displayEmail = currentUser?.email || 'sec.analyst@cybershield.ai';
  const displayAvatar = currentUser?.avatar_url;

  const [now, setNow] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K or "/" to focus Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setShowSearchModal(true);
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape') {
        setShowSearchModal(false);
        setMobileSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && a.status === 'new').length;
  const openIncidents = incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length;
  const currentViewTitle = viewLabels[selectedView] || 'SOC Command Center';

  // Comprehensive Search Matching: Navigation Pages, Threat Telemetry, CVEs, Assets, Alerts
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    // 1. Matched Navigation Pages & Tools
    const matchedPages = NAV_MODULES.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.category.toLowerCase().includes(q) || 
      m.keywords.toLowerCase().includes(q)
    ).map(m => ({
      id: `page-${m.id}`,
      title: m.title,
      subtitle: `${m.category} Module`,
      type: 'Module',
      view: m.id,
      badge: 'PAGE',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    }));

    // 2. Matched Active Threats
    const matchedThreats = threats.filter(t => 
      t.title.toLowerCase().includes(q) || 
      (t.source_ip && t.source_ip.includes(q))
    ).slice(0, 4).map(t => ({
      id: `threat-${t.id}`,
      title: t.title,
      subtitle: `Threat Source: ${t.source_ip || 'Global Feed'}`,
      type: 'Threat',
      view: 'threat-intelligence',
      badge: t.severity.toUpperCase(),
      badgeColor: t.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    }));

    // 3. Matched CVEs & Vulnerabilities
    const matchedVulns = vulnerabilities.filter(v => 
      (v.cve_id && v.cve_id.toLowerCase().includes(q)) || 
      v.title.toLowerCase().includes(q)
    ).slice(0, 4).map(v => ({
      id: `vuln-${v.id}`,
      title: `${v.cve_id || 'CVE'}: ${v.title}`,
      subtitle: `CVSS Score: ${v.cvss_score || '9.8'} • Remediation Available`,
      type: 'CVE',
      view: 'vulnerabilities',
      badge: v.severity.toUpperCase(),
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    }));

    // 4. Matched Alerts
    const matchedAlerts = alerts.filter(a => 
      a.title.toLowerCase().includes(q) || 
      (a.source && a.source.toLowerCase().includes(q))
    ).slice(0, 3).map(a => ({
      id: `alert-${a.id}`,
      title: a.title,
      subtitle: `Alert Origin: ${a.source}`,
      type: 'Alert',
      view: 'alerts',
      badge: a.severity.toUpperCase(),
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    }));

    // 5. Matched Assets / Nodes
    const matchedAssets = assets.filter(ast => 
      ast.name.toLowerCase().includes(q) || 
      (ast.ip_address && ast.ip_address.includes(q))
    ).slice(0, 3).map(ast => ({
      id: `asset-${ast.id}`,
      title: ast.name,
      subtitle: `IP: ${ast.ip_address || '10.0.0.x'} • Node Type: ${ast.type}`,
      type: 'Asset',
      view: 'assets',
      badge: ast.type.toUpperCase(),
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    }));

    return [...matchedPages, ...matchedThreats, ...matchedVulns, ...matchedAlerts, ...matchedAssets];
  }, [searchQuery, threats, vulnerabilities, alerts, assets]);

  // Keyboard navigation for search results
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < searchResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0 && searchResults[selectedIndex]) {
        const item = searchResults[selectedIndex];
        setSelectedView(item.view);
        setShowSearchModal(false);
        setMobileSearchOpen(false);
        setSearchQuery('');
      }
    }
  };

  const handleSelectSearchResult = (view: string) => {
    setSelectedView(view);
    setShowSearchModal(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
  };

  const systemServices = [
    { name: 'SOC Telemetry Collector Engine', status: 'Operational', ping: '12ms', icon: Cpu },
    { name: 'Perimeter NextGen Firewall Cluster', status: 'Operational', ping: '4ms', icon: Shield },
    { name: 'SIEM Database & Correlation Mesh', status: 'Healthy', ping: '2ms', icon: Database },
    { name: 'EDR Endpoint Agent Mesh (80 Nodes)', status: 'All Connected', ping: '8ms', icon: Server },
    { name: 'Anthropic Claude AI Analytics Engine', status: 'Active (v4.6)', ping: '45ms', icon: Activity },
    { name: 'Web Application Firewall (WAF)', status: 'Active Filtering', ping: '3ms', icon: Lock },
  ];

  return (
    <header className={`relative flex items-center justify-between gap-2 md:gap-4 px-3 sm:px-5 h-16 border-b shrink-0 font-sans z-30 select-none transition-colors duration-200 ${
      isLight
        ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
        : 'bg-cyber-darker/95 border-cyan-500/20 backdrop-blur-xl text-gray-100'
    }`}>

      {/* ======================================================== */}
      {/* 1. LEFT SECTION: Sidebar Toggle, Title, & Breadcrumb     */}
      {/* ======================================================== */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink-0">
        <button
          onClick={toggleSidebar}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/30 text-cyan-300 hover:text-white shadow-cyan-500/10'
          }`}
          title="Toggle Navigation Sidebar (Expand / Collapse)"
        >
          <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-widest hidden md:inline-block ${
              isLight ? 'text-cyan-800' : 'text-cyan-400'
            }`}>
              CYBERSHIELD NEXUS
            </span>
            <span className="hidden md:inline-block text-gray-400 text-xs">/</span>
            <h1 className={`text-sm sm:text-base font-display font-bold tracking-wide truncate ${
              isLight ? 'text-slate-900' : 'text-cyan-300'
            }`}>
              {currentViewTitle}
            </h1>
          </div>
        </div>

        {/* Live Clickable SOC Status Pill */}
        <button
          onClick={() => setShowHealthModal(true)}
          className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm transition-all cursor-pointer ${
            isLight
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
              : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
          }`}
          title="Click to view System Health & Diagnostics Matrix"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>SOC MESH 99.9%</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. CENTER SECTION: Big, Prominent, Enterprise Search Bar */}
      {/* ======================================================== */}
      <div className="flex-1 max-w-xl xl:max-w-2xl mx-1 sm:mx-3 md:mx-6 hidden sm:block relative">
        <div className="relative flex items-center">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
            isLight ? 'text-slate-400' : 'text-cyan-400'
          }`} />
          
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchModal(true);
              setSelectedIndex(0);
            }}
            onFocus={() => setShowSearchModal(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search pages, tools, threats, CVEs, alerts, IPs, and rules..."
            className={`w-full h-11 pl-10 pr-24 rounded-xl text-xs sm:text-[13px] font-sans font-medium transition-all focus:outline-none shadow-sm ${
              isLight
                ? 'bg-slate-100/90 border border-slate-300/80 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20'
                : 'bg-black/60 border border-cyan-500/30 text-gray-100 placeholder-gray-500 focus:bg-black/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 shadow-inner'
            }`}
          />

          {/* Right Action Icons in Search Box */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className={`p-1 rounded-md transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-cyan-300'
                }`}
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className={`hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold tracking-tight select-none ${
                isLight ? 'bg-white border-slate-300 text-slate-500' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
              }`}>
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            )}
          </div>
        </div>

        {/* Global Live Search Results Dropdown */}
        {showSearchModal && searchQuery.trim().length > 0 && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowSearchModal(false)} />
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-40 p-3 max-h-96 overflow-y-auto space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150 ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-cyber-darker/95 border-cyan-500/40 backdrop-blur-2xl text-gray-100 shadow-cyan-950/40'
            }`}>
              <div className={`flex items-center justify-between text-[10px] font-bold uppercase pb-2 border-b font-mono ${
                isLight ? 'text-slate-500 border-slate-200' : 'text-gray-400 border-cyan-500/15'
              }`}>
                <span>Telemetry Search Index</span>
                <span className={isLight ? 'text-cyan-700 font-semibold' : 'text-cyan-400 font-semibold'}>
                  {searchResults.length} {searchResults.length === 1 ? 'Match' : 'Matches'} Found
                </span>
              </div>

              <div className="space-y-1 pt-1">
                {searchResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item.view)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? isLight
                            ? 'bg-cyan-50 border-cyan-300 text-cyan-950 shadow-sm'
                            : 'bg-cyan-500/20 border-cyan-400/50 text-white shadow-cyan-500/10'
                          : isLight
                            ? 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                            : 'bg-black/40 hover:bg-cyan-500/10 border-white/5 text-gray-200'
                      }`}
                    >
                      <div className="min-w-0 flex-1 flex items-center gap-2.5">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                          item.badgeColor || (isLight ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-500/20 text-cyan-300')
                        }`}>
                          {item.badge}
                        </span>

                        <div className="truncate">
                          <p className={`text-xs font-bold truncate ${
                            isSelected ? (isLight ? 'text-cyan-900' : 'text-cyan-300') : (isLight ? 'text-slate-800' : 'text-gray-100')
                          }`}>
                            {item.title}
                          </p>
                          <p className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isSelected && (
                          <span className={`hidden sm:inline-flex items-center gap-0.5 text-[9px] font-mono font-bold uppercase mr-1 ${
                            isLight ? 'text-cyan-700' : 'text-cyan-400'
                          }`}>
                            <span>Enter</span>
                            <CornerDownLeft className="w-2.5 h-2.5" />
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 ${
                          isSelected ? (isLight ? 'text-cyan-700' : 'text-cyan-400') : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {searchResults.length === 0 && (
                <div className="py-6 text-center space-y-1">
                  <p className="text-xs text-gray-400 font-mono">No telemetry, page, or threat matching "{searchQuery}"</p>
                  <p className="text-[11px] text-gray-500">Try searching for "scanner", "patch", "cve", "uptime", "firewall", or "globe"</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. RIGHT SECTION: Controls, Theme Toggle, Profile, Clocks */}
      {/* ======================================================== */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => {
            setMobileSearchOpen(!mobileSearchOpen);
            setTimeout(() => mobileInputRef.current?.focus(), 100);
          }}
          className={`sm:hidden w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-black/60 border-cyan-500/20 text-gray-300 hover:text-cyan-300'
          }`}
          title="Open Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Live System Clocks (Local & UTC Zulu) */}
        <div className={`hidden 2xl:flex items-center gap-2.5 px-3 py-1 rounded-xl border font-mono text-right text-[11px] ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-cyan-500/15'
        }`}>
          <div>
            <p className={`font-bold tracking-wider leading-none ${isLight ? 'text-slate-900' : 'text-cyan-300'}`}>
              {now.toLocaleTimeString('en-US', { hour12: false })}
            </p>
            <p className={`text-[8.5px] uppercase tracking-widest mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              LOCAL TIME
            </p>
          </div>
          <div className={`w-px h-5 ${isLight ? 'bg-slate-300' : 'bg-cyan-500/20'}`} />
          <div>
            <p className={`font-bold tracking-wider leading-none ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              {now.toISOString().substring(11, 19)}
            </p>
            <p className={`text-[8.5px] uppercase tracking-widest mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              ZULU (UTC)
            </p>
          </div>
        </div>

        {/* Active Threats Counter Pill */}
        <div 
          onClick={() => setSelectedView('alerts')}
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all shadow-sm ${
            isLight
              ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
              : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/25 text-red-400'
          }`}
          title="Click to view Active Incidents & Alerts"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>{openIncidents || 12} THREATS</span>
        </div>

        {/* Theme Switcher Button (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 shadow-cyan-500/10'
          }`}
          title={themeMode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {themeMode === 'dark' ? (
            <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 animate-spin" style={{ animationDuration: '20s' }} />
          ) : (
            <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-700" />
          )}
        </button>

        {/* Notifications Dropdown Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-black/60 border-cyan-500/20 hover:border-cyan-400/40 text-gray-400 hover:text-cyan-300 shadow-md'
            }`}
            title="Real-time SOC Notifications"
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {criticalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center shadow-lg animate-pulse">
                {criticalAlerts}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotif && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowNotif(false)} />
              <div className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-cyber-darker/95 border-cyan-500/30 backdrop-blur-2xl text-gray-100 shadow-cyan-950/40'
              }`}>
                <div className={`px-4 py-3 border-b flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/40 border-cyan-500/15 text-cyan-300'
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider font-display flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Real-time SOC Alerts</span>
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-500 font-bold font-mono">
                    {criticalAlerts} Critical
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1 p-2">
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
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-mono ${
                          a.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-600'
                        }`}>
                          {a.severity}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">{a.source}</span>
                      </div>
                      <p className={`text-xs font-medium mt-1 truncate ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>{a.title}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-2.5 border-t text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-cyan-500/15'}`}>
                  <button
                    onClick={() => {
                      setSelectedView('alerts');
                      setShowNotif(false);
                    }}
                    className={`text-xs font-bold cursor-pointer ${isLight ? 'text-cyan-700 hover:text-cyan-800' : 'text-cyan-400 hover:text-cyan-300'}`}
                  >
                    Open Alert Management Center →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Telemetry Refresh Button */}
        <button
          onClick={refreshData}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-black/60 border-cyan-500/20 hover:border-cyan-400/40 text-gray-400 hover:text-cyan-300 shadow-md'
          }`}
          title="Refresh Telemetry Stream"
        >
          <RefreshCw className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isLoading ? 'animate-spin text-cyan-500' : ''}`} />
        </button>

        {/* User Profile Avatar & Dropdown Menu */}
        <div className={`relative flex items-center gap-2 pl-2 border-l ${isLight ? 'border-slate-300' : 'border-cyan-500/20'}`}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 cursor-pointer group"
            title="User Clearance & Profile"
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-cyan-400/40 object-cover shadow-sm group-hover:border-cyan-500 transition-all"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {displayName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="hidden xl:block text-left">
              <p className={`text-xs font-bold truncate max-w-[120px] ${isLight ? 'text-slate-900' : 'text-gray-200'}`}>
                {displayName}
              </p>
              <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-2.5 h-2.5" />
                {currentUser?.role || 'Senior SOC Analyst'}
              </p>
            </div>
          </div>

          {/* Quick Sign Out Action */}
          <button
            onClick={appLogout}
            title="Sign Out / Terminate SOC Session"
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-red-500/15 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center text-red-500 hover:text-red-400 transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* User Profile Dropdown */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowUserMenu(false)} />
              <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl z-30 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-cyber-darker/95 border-cyan-500/30 backdrop-blur-2xl text-gray-100 shadow-cyan-950/40'
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
                    appLogout();
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

      {/* ======================================================== */}
      {/* 4. MOBILE SEARCH BAR OVERLAY (Full-Width Responsive)    */}
      {/* ======================================================== */}
      {mobileSearchOpen && (
        <div className={`sm:hidden absolute inset-0 z-40 px-3 flex items-center gap-2 ${
          isLight ? 'bg-white' : 'bg-cyber-darker'
        }`}>
          <Search className="w-4 h-4 text-cyan-500 shrink-0" />
          <input
            ref={mobileInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchModal(true);
            }}
            placeholder="Search pages, tools, CVEs..."
            className={`flex-1 h-10 px-3 rounded-xl text-xs font-sans focus:outline-none ${
              isLight ? 'bg-slate-100 text-slate-900' : 'bg-black/70 text-gray-100 border border-cyan-500/30'
            }`}
          />
          <button
            onClick={() => {
              setMobileSearchOpen(false);
              setShowSearchModal(false);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SYSTEM HEALTH MODAL (Portaled to document.body)       */}
      {/* ======================================================== */}
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
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
