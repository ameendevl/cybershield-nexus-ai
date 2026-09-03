import { useApp } from '../../store/AppContext';
import CyberLogo from '../common/CyberLogo';
import { soundService } from '../../services/soundService';
import {
  Gauge,
  Radar,
  Globe2,
  Map,
  Orbit,
  Bot,
  Brain,
  Terminal,
  Flame,
  ShieldAlert,
  Crosshair,
  FileCode2,
  Users,
  BellRing,
  Trophy,
  Activity,
  ShieldOff,
  HardDrive,
  SearchCheck,
  CloudLightning,
  RadioTower,
  Network,
  Binary,
  Workflow,
  EyeOff,
  FileSpreadsheet,
  KeyRound,
  Database,
  Zap,
  ScrollText,
  ShieldCheck,
  BarChart3,
  Sliders,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

const navGroups = [
  {
    label: 'OVERVIEW & RADAR',
    items: [
      { id: 'platform-intro', label: 'Platform Architecture Guide', icon: Sparkles, color: 'text-cyan-400' },
      { id: 'command-center', label: 'SOC Command Pulse', icon: Gauge, color: 'text-cyan-400' },
      { id: 'url-scanner', label: 'Live Threat & URL Scanner', icon: Radar, color: 'text-emerald-400' },
      { id: 'corporate-uptime', label: 'Domain & SSL Uptime Monitor', icon: Globe2, color: 'text-sky-400' },
      { id: 'global-map', label: 'Global Attack Map 2D', icon: Map, color: 'text-blue-400' },
      { id: 'threat-globe', label: '3D WebGL Threat Globe', icon: Orbit, color: 'text-cyan-300' },
    ],
  },
  {
    label: 'OPERATIONS & REMEDIATION',
    items: [
      { id: 'auto-patch', label: '1-Click Auto-Patch Engine', icon: Terminal, color: 'text-emerald-400' },
      { id: 'firewall-export', label: 'Firewall Blocklist Exporter', icon: Flame, color: 'text-amber-400' },
      { id: 'incidents', label: 'Incident Response & Tickets', icon: Activity, color: 'text-red-400' },
      { id: 'vulnerabilities', label: 'Vulnerability Management', icon: ShieldOff, color: 'text-amber-400' },
      { id: 'assets', label: 'Asset Inventory & Nodes', icon: HardDrive, color: 'text-cyan-400' },
      { id: 'forensics', label: 'Digital Forensics Workspace', icon: SearchCheck, color: 'text-blue-400' },
      { id: 'cloud-posture', label: 'Cloud Security (CSPM)', icon: CloudLightning, color: 'text-sky-400' },
      { id: 'network-topology', label: 'Network Topology Mesh', icon: Network, color: 'text-emerald-400' },
      { id: 'siem-rules', label: 'SIEM Rule Builder', icon: Workflow, color: 'text-cyan-400' },
    ],
  },
  {
    label: 'THREAT INTELLIGENCE',
    items: [
      { id: 'threat-intelligence', label: 'Threat Intelligence Feeds', icon: ShieldAlert, color: 'text-red-400' },
      { id: 'mitre-attack', label: 'MITRE ATT&CK Matrix', icon: Crosshair, color: 'text-blue-400' },
      { id: 'hunting-notebook', label: 'Threat Hunting Notebook', icon: FileCode2, color: 'text-teal-300' },
      { id: 'threat-actors', label: 'Threat Actor Profiles', icon: Users, color: 'text-amber-400' },
      { id: 'darkweb-monitor', label: 'Dark Web Leak Monitor', icon: EyeOff, color: 'text-red-400' },
    ],
  },
  {
    label: 'AI SECURITY',
    items: [
      { id: 'ai-copilot', label: 'Autonomous AI Copilot', icon: Bot, color: 'text-cyan-400' },
      { id: 'ai-assistant', label: 'AI Security Analyst', icon: Brain, color: 'text-blue-400' },
      { id: 'threat-deception', label: 'Threat Deception & Honeypot', icon: RadioTower, color: 'text-emerald-400' },
      { id: 'malware-sandbox', label: 'Malware Dynamic Sandbox', icon: Binary, color: 'text-cyan-300' },
    ],
  },
  {
    label: 'SYSTEM / SETTINGS',
    items: [
      { id: 'alert-notifications', label: 'Corporate Webhooks & Dispatcher', icon: BellRing, color: 'text-amber-400' },
      { id: 'analyst-leaderboard', label: 'Analyst Leaderboard', icon: Trophy, color: 'text-amber-300' },
      { id: 'compliance-reports', label: 'Boardroom PDF & Audit Suite', icon: FileSpreadsheet, color: 'text-emerald-400' },
      { id: 'zero-trust-iam', label: 'Org & Team RBAC Clearance', icon: KeyRound, color: 'text-blue-400' },
      { id: 'soc-operations', label: 'SIEM Telemetry Analytics', icon: Database, color: 'text-cyan-400' },
      { id: 'soar', label: 'GRC Automation Playbooks', icon: Zap, color: 'text-amber-300' },
      { id: 'compliance', label: 'Compliance Control Center', icon: ScrollText, color: 'text-teal-400' },
      { id: 'executive', label: 'Executive CISO Dashboard', icon: ShieldCheck, color: 'text-emerald-300' },
      { id: 'reports', label: 'Security Reports & BI', icon: BarChart3, color: 'text-blue-400' },
      { id: 'settings', label: 'System Configuration', icon: Sliders, color: 'text-gray-400' },
    ],
  },
];

export default function Sidebar() {
  const { selectedView, setSelectedView, sidebarCollapsed, toggleSidebar, logout, themeMode } = useApp();
  const isLight = themeMode === 'light';

  const handleNavClick = (id: string) => {
    soundService.playCyberClick();
    setSelectedView(id);
    if (window.innerWidth < 1024 && !sidebarCollapsed) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          flex flex-col border-r transition-all duration-300 ease-in-out
          fixed lg:relative top-0 left-0 h-full z-40 shrink-0 select-none
          ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-cyber-darker border-cyan-500/15'}
          ${sidebarCollapsed
            ? '-translate-x-full lg:translate-x-0 w-64 lg:w-20'
            : 'translate-x-0 w-64'
          }
        `}
      >
        {/* Futuristic Cyber Logo Header */}
        <div className={`flex items-center px-4 h-16 border-b shrink-0 overflow-hidden ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-cyan-500/15'
        }`}>
          <CyberLogo size="md" collapsed={sidebarCollapsed} />
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!sidebarCollapsed && (
                <p className={`px-4 mb-2 text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  {group.label}
                </p>
              )}
              {sidebarCollapsed && (
                <p className="hidden lg:block px-2 mb-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">
                  ·
                </p>
              )}
              <div className="space-y-1 px-2.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = selectedView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all group relative cursor-pointer ${
                        active
                          ? isLight
                            ? 'bg-cyan-50 text-cyan-950 font-bold border border-cyan-300 shadow-sm'
                            : 'bg-cyan-500/15 text-cyan-200 font-bold border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                          : isLight
                            ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200 font-medium'
                            : 'text-gray-300 hover:text-white hover:bg-cyan-500/5 hover:border hover:border-cyan-500/20 font-medium'
                      }`}
                    >
                      {active && (
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r ${
                          isLight ? 'bg-cyan-600' : 'bg-cyan-400 shadow-md shadow-cyan-400'
                        }`} />
                      )}

                      {/* Glass Icon Container Badge */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                          active
                            ? isLight
                              ? 'bg-cyan-100 border border-cyan-300 text-cyan-700 scale-105 shadow-sm'
                              : 'bg-gradient-to-br from-cyan-500/30 to-indigo-500/25 border border-cyan-400/60 text-cyan-300 shadow-sm shadow-cyan-500/30 scale-105'
                            : isLight
                              ? 'bg-slate-100 border border-slate-200 text-slate-500 group-hover:text-cyan-700 group-hover:bg-cyan-50 group-hover:border-cyan-200 group-hover:scale-105'
                              : 'bg-white/5 border border-white/10 text-gray-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 group-hover:scale-105'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${active ? (isLight ? 'text-cyan-700' : item.color) : ''}`} />
                      </div>

                      {/* Label Text */}
                      <span
                        className={`whitespace-nowrap font-sans text-left transition-all duration-200 truncate ${
                          sidebarCollapsed ? 'lg:hidden' : ''
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Desktop collapse toggle */}
        <button
          onClick={toggleSidebar}
          className={`hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full border items-center justify-center transition-colors z-10 cursor-pointer shadow-md ${
            isLight
              ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              : 'bg-cyber-dark border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
          }`}
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Footer with Logout Option */}
        <div className={`border-t p-3 shrink-0 space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-cyan-500/15'
        }`}>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-500 border border-red-500/30 transition-all text-xs font-mono font-bold cursor-pointer shadow-sm"
            title="Log Out of SOC Terminal"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0 text-red-500" />
            <span className={sidebarCollapsed ? 'lg:hidden' : ''}>Sign Out</span>
          </button>

          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className={`text-xs font-medium font-sans ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                SOC Mesh Online
              </span>
              <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                v2.6 PRO
              </span>
            </div>
          ) : (
            <div className="hidden lg:flex justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
