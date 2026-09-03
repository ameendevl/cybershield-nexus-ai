import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../store/AppContext';
import {
  RefreshCw, Bell, Search, AlertTriangle, CheckCircle, Activity, Menu,
  LogOut, Shield, Server, Database, Cpu, X, Lock, CheckCircle2, ChevronRight,
  Sun, Moon, CornerDownLeft, Command
} from 'lucide-react';

const NAV_MODULES = [
  { id: 'command-center', title: 'SOC Command Center', category: 'Overview', keywords: 'command center dashboard metrics red team overview pulse' },
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
  'platform-intro': 'Platform Guide',
  'url-scanner': 'URL Scanner',
  'corporate-uptime': 'SSL Monitor',
  'auto-patch': 'Auto-Patch Engine',
  'firewall-export': 'Firewall Exporter',
  'command-center': 'SOC Command Center',
  'global-map': 'Global Attack Map',
  'threat-globe': '3D Threat Globe',
  'ai-copilot': 'AI Copilot',
  'ai-assistant': 'AI Analyst',
  'threat-intelligence': 'Threat Intelligence',
  'mitre-attack': 'MITRE ATT&CK',
  'hunting-notebook': 'Threat Hunting',
  'threat-actors': 'Threat Actors',
  'alert-notifications': 'Alert Dispatcher',
  'analyst-leaderboard': 'Leaderboard',
  'soc-operations': 'SOC Operations',
  'alerts': 'Alert Center',
  'incidents': 'Incident Response',
  'detection-engine': 'Detection Engine',
  'vulnerabilities': 'Vulnerability Mgmt',
  'assets': 'Asset Inventory',
  'forensics': 'Digital Forensics',
  'soar': 'SOAR Automation',
  'compliance-reports': 'Audit Suite',
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const modalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Keyboard Shortcut: Ctrl+K or / to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
        setTimeout(() => modalInputRef.current?.focus(), 50);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setShowSearchModal(true);
        setTimeout(() => modalInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setShowSearchModal(false);
        setShowSearchModal(false);
        setShowNotif(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && a.status === 'new').length;
  const openIncidents = incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length;
  const currentViewTitle = viewLabels[selectedView] || 'SOC Command Center';

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];

    const matchedPages = NAV_MODULES.filter(
      (m) => m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.keywords.toLowerCase().includes(q)
    ).map((m) => ({
      id: `page-${m.id}`,
      title: m.title,
      subtitle: `${m.category} Module`,
      view: m.id,
      badge: 'PAGE',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    }));

    const matchedThreats = threats
      .filter((t) => t.title.toLowerCase().includes(q) || (t.source_ip && t.source_ip.includes(q)))
      .slice(0, 3)
      .map((t) => ({
        id: `threat-${t.id}`,
        title: t.title,
        subtitle: `Source: ${t.source_ip || 'Global Feed'}`,
        view: 'threat-intelligence',
        badge: t.severity.toUpperCase(),
        badgeColor: t.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      }));

    const matchedVulns = vulnerabilities
      .filter((v) => (v.cve_id && v.cve_id.toLowerCase().includes(q)) || v.title.toLowerCase().includes(q))
      .slice(0, 3)
      .map((v) => ({
        id: `vuln-${v.id}`,
        title: `${v.cve_id || 'CVE'}: ${v.title}`,
        subtitle: `CVSS ${v.cvss_score || '9.8'} • ${v.severity}`,
        view: 'vulnerabilities',
        badge: 'CVE',
        badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      }));

    const matchedAlerts = alerts
      .filter((a) => a.title.toLowerCase().includes(q) || (a.source && a.source.toLowerCase().includes(q)))
      .slice(0, 3)
      .map((a) => ({
        id: `alert-${a.id}`,
        title: a.title,
        subtitle: `Alert: ${a.source}`,
        view: 'alerts',
        badge: a.severity.toUpperCase(),
        badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
      }));

    const matchedAssets = assets
      .filter((ast) => ast.name.toLowerCase().includes(q) || (ast.ip_address && ast.ip_address.includes(q)))
      .slice(0, 2)
      .map((ast) => ({
        id: `asset-${ast.id}`,
        title: ast.name,
        subtitle: `IP: ${ast.ip_address || '—'} • ${ast.type}`,
        view: 'assets',
        badge: 'ASSET',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      }));

    return [...matchedPages, ...matchedThreats, ...matchedVulns, ...matchedAlerts, ...matchedAssets];
  }, [searchQuery, threats, vulnerabilities, alerts, assets]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p + 1 < searchResults.length ? p + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p - 1 >= 0 ? p - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectResult(searchResults[selectedIndex].view);
      }
    }
  };

  const handleSelectResult = (view: string) => {
    setSelectedView(view);
    setShowSearchModal(false);
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
    <>
      {/* ============================================================ */}
      {/* GLOBAL SEARCH MODAL (Ctrl+K)                                 */}
      {/* ============================================================ */}
      {showSearchModal && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#080f1d] border-cyan-500/40'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b ${isLight ? 'border-slate-200' : 'border-cyan-500/20'}`}>
              <Search className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-cyan-400'}`} />
              <input
                ref={modalInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search pages, tools, threats, CVEs, assets, IPs..."
                className={`flex-1 bg-transparent text-sm focus:outline-none ${isLight ? 'text-slate-900 placeholder-slate-400' : 'text-gray-100 placeholder-gray-500'}`}
                autoComplete="off"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-200">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className={`hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-500' : 'bg-white/5 border-white/10 text-gray-400'
              }`}>
                Esc
              </kbd>
            </div>

            {/* Results */}
            {searchQuery.trim() ? (
              <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                {searchResults.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className={`text-sm ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>No results for "{searchQuery}"</p>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-400' : 'text-gray-600'}`}>Try: scanner, patch, mitre, cve, firewall, forensics</p>
                  </div>
                ) : (
                  <>
                    <p className={`px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </p>
                    {searchResults.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item.view)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                            isSelected
                              ? isLight
                                ? 'bg-cyan-50 border-cyan-200 text-cyan-950'
                                : 'bg-cyan-500/15 border-cyan-400/40 text-white'
                              : isLight
                                ? 'bg-transparent border-transparent hover:bg-slate-50 text-slate-700'
                                : 'bg-transparent border-transparent hover:bg-white/5 text-gray-300'
                          }`}
                        >
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold truncate ${isSelected ? (isLight ? 'text-cyan-900' : 'text-cyan-300') : ''}`}>
                              {item.title}
                            </p>
                            <p className={`text-[10px] truncate ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>{item.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isSelected && (
                              <span className={`hidden sm:flex items-center gap-0.5 text-[9px] font-mono ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>
                                Enter <CornerDownLeft className="w-2.5 h-2.5" />
                              </span>
                            )}
                            <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? (isLight ? 'text-cyan-500' : 'text-cyan-400') : 'text-gray-500'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            ) : (
              <div className={`px-4 py-5 text-center ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                <Search className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Start typing to search across all 27+ SOC modules, threats, CVEs & assets</p>
              </div>
            )}

            {/* Footer */}
            <div className={`px-4 py-2 border-t flex items-center gap-3 text-[10px] font-mono ${
              isLight ? 'border-slate-100 text-slate-400 bg-slate-50' : 'border-white/5 text-gray-600 bg-white/2'
            }`}>
              <span className="flex items-center gap-1"><Command className="w-3 h-3" />K to open</span>
              <span>↑↓ navigate</span>
              <span>Enter to jump</span>
              <span>Esc to close</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================ */}
      {/* MAIN HEADER BAR                                              */}
      {/* ============================================================ */}
      <header className={`relative flex items-center gap-2 px-3 sm:px-4 h-14 border-b shrink-0 z-30 select-none transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#080f1d]/95 border-cyan-500/20 backdrop-blur-xl text-gray-100'
      }`}>

        {/* ── LEFT: Sidebar toggle + Breadcrumb ─────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/25 text-cyan-400'
            }`}
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Page Title Breadcrumb */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`hidden lg:block text-[9px] font-mono uppercase font-bold tracking-widest shrink-0 ${
              isLight ? 'text-cyan-700' : 'text-cyan-500'
            }`}>
              CYBERSHIELD
            </span>
            <span className="hidden lg:block text-gray-400 text-xs shrink-0">/</span>
            <h1 className={`text-sm font-bold tracking-wide truncate max-w-[140px] sm:max-w-[200px] ${
              isLight ? 'text-slate-900' : 'text-cyan-300'
            }`}>
              {currentViewTitle}
            </h1>
          </div>

          {/* SOC Status Pill */}
          <button
            onClick={() => setShowHealthModal(true)}
            className={`hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              isLight
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25'
            }`}
            title="System Health Matrix"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            SOC 99.9%
          </button>
        </div>

        {/* ── CENTER: Search Bar ────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 min-w-0">
          <button
            onClick={() => {
              setShowSearchModal(true);
              setTimeout(() => modalInputRef.current?.focus(), 50);
            }}
            className={`w-full max-w-md h-9 flex items-center gap-2.5 px-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-400 hover:border-slate-400'
                : 'bg-black/40 hover:bg-black/60 border-cyan-500/20 hover:border-cyan-500/40 text-gray-500'
            }`}
          >
            <Search className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-400' : 'text-cyan-500'}`} />
            <span className="flex-1 truncate">Search pages, threats, CVEs...</span>
            <span className={`hidden sm:flex items-center gap-0.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
              isLight ? 'bg-white border-slate-300 text-slate-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'
            }`}>
              <Command className="w-2.5 h-2.5" />K
            </span>
          </button>
        </div>

        {/* ── RIGHT: Action Controls ───────────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

          {/* UTC Clock — only on 2xl+ */}
          <div className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[10px] ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-black/30 border-cyan-500/15 text-gray-400'
          }`}>
            <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-cyan-300'}`}>
              {now.toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className="text-gray-500">|</span>
            <span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              {now.toISOString().substring(11, 19)}Z
            </span>
          </div>

          {/* Threats Counter */}
          <button
            onClick={() => setSelectedView('alerts')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-all ${
              isLight
                ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400'
            }`}
            title="View Active Threats"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span>{openIncidents || 12}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20 text-cyan-400'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight
              ? <Moon className="w-3.5 h-3.5" />
              : <Sun className="w-3.5 h-3.5 text-amber-300" style={{ animationDuration: '20s' }} />
            }
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
              className={`relative w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                  : 'bg-black/40 border-cyan-500/15 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-300'
              }`}
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {criticalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
                  {criticalAlerts}
                </span>
              )}
            </button>

            {showNotif && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowNotif(false)} />
                <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#080f1d] border-cyan-500/30 backdrop-blur-2xl'
                }`}>
                  <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-cyan-500/15'
                  }`}>
                    <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-cyan-300'}`}>
                      <Bell className="w-3 h-3" /> SOC Alerts
                    </h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 font-bold font-mono">
                      {criticalAlerts} CRITICAL
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                    {alerts.slice(0, 5).map((a) => (
                      <div
                        key={a.id}
                        onClick={() => { acknowledgeAlert(a.id); setSelectedView('alerts'); setShowNotif(false); }}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isLight
                            ? 'bg-slate-50 hover:bg-cyan-50 border-slate-200'
                            : 'bg-black/40 hover:bg-cyan-500/8 border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${
                            a.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                          }`}>{a.severity}</span>
                          <span className={`text-[9px] font-mono ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>{a.source}</span>
                        </div>
                        <p className={`text-xs font-medium mt-1 truncate ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>{a.title}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`p-2 border-t text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-cyan-500/10'}`}>
                    <button
                      onClick={() => { setSelectedView('alerts'); setShowNotif(false); }}
                      className={`text-xs font-bold cursor-pointer ${isLight ? 'text-cyan-700 hover:text-cyan-800' : 'text-cyan-400 hover:text-cyan-300'}`}
                    >
                      Open Alert Center →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={refreshData}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                : 'bg-black/40 border-cyan-500/15 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-300'
            }`}
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-500' : ''}`} />
          </button>

          {/* Divider */}
          <div className={`h-6 w-px ${isLight ? 'bg-slate-300' : 'bg-cyan-500/20'}`} />

          {/* User Avatar + Dropdown */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
              className="flex items-center gap-2 cursor-pointer group"
              title="User Profile"
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-8 h-8 rounded-full border border-cyan-400/40 object-cover group-hover:border-cyan-400 transition-all"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {displayName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="hidden xl:block text-left">
                <p className={`text-xs font-bold truncate max-w-[100px] ${isLight ? 'text-slate-900' : 'text-gray-200'}`}>
                  {displayName.split(' ')[0]}
                </p>
                <p className="text-[9px] text-emerald-500 flex items-center gap-1 font-semibold">
                  <CheckCircle className="w-2 h-2" />
                  {currentUser?.role?.split(' ').slice(0, 2).join(' ') || 'Analyst'}
                </p>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={appLogout}
              title="Sign Out"
              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/25 flex items-center justify-center text-red-500 hover:text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowUserMenu(false)} />
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-xl z-30 p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#080f1d] border-cyan-500/30 backdrop-blur-2xl'
                }`}>
                  <div className={`p-3 rounded-lg border font-mono ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-cyan-500/8 border-cyan-500/20'
                  }`}>
                    <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-cyan-300'}`}>{displayName}</p>
                    <p className={`text-[10px] truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{displayEmail}</p>
                    <div className="mt-2 flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-wider">
                      <Shield className="w-3 h-3" /> LEVEL 5 DEFENSE CLEARANCE
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowUserMenu(false); appLogout(); }}
                    className="w-full py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-500 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Terminate SOC Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* SYSTEM HEALTH MODAL                                          */}
      {/* ============================================================ */}
      {showHealthModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-5 rounded-2xl border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#080f1d] border-cyan-500/40 text-gray-100'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-cyan-500/20'}`}>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500 animate-pulse" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-cyan-300'}`}>
                  System Health & Node Matrix
                </h3>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className={`p-1.5 rounded-lg cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {systemServices.map((svc, idx) => {
                const Icon = svc.icon;
                return (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-cyan-500/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isLight ? 'bg-cyan-50 text-cyan-700' : 'bg-cyan-500/10 text-cyan-400'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-gray-200'}`}>{svc.name}</p>
                        <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Latency: {svc.ping}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center gap-1 font-mono shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {svc.status}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-1 text-right">
              <button
                onClick={() => setShowHealthModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/25'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
