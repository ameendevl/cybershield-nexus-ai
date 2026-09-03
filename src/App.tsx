import { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ErrorBoundary from './components/common/ErrorBoundary';
import CommandCenter from './components/dashboard/CommandCenter';
import GlobalAttackMap from './components/dashboard/GlobalAttackMap';
import AIAssistantPanel from './components/ai/AIAssistantPanel';
import ThreatIntelligence from './components/intelligence/ThreatIntelligence';
import SOCOperations from './components/soc/SOCOperations';
import VulnerabilityManagement from './components/vulnerability/VulnerabilityManagement';
import IncidentResponse from './components/incident/IncidentResponse';
import ForensicsWorkspace from './components/forensics/ForensicsWorkspace';
import ComplianceCenter from './components/compliance/ComplianceCenter';
import SOARAutomation from './components/soar/SOARAutomation';
import ExecutiveDashboard from './components/executive/ExecutiveDashboard';
import AssetManagement from './components/assets/AssetManagement';
import DetectionEngine from './components/detection/DetectionEngine';
import ReportsAnalytics from './components/reports/ReportsAnalytics';
import SettingsPage from './components/settings/SettingsPage';
import NetworkTopology from './components/network/NetworkTopology';
import DetectionRuleBuilder from './components/detection/DetectionRuleBuilder';
import DarkWebMonitoring from './components/darkweb/DarkWebMonitoring';
import MalwareSandbox from './components/sandbox/MalwareSandbox';
import AICyberCopilot from './components/ai/AICyberCopilot';
import MitreAttackMatrix from './components/mitre/MitreAttackMatrix';
import CloudSecurityPosture from './components/cloud/CloudSecurityPosture';
import ThreatDeceptionEngine from './components/deception/ThreatDeceptionEngine';
import ComplianceReportGenerator from './components/compliance/ComplianceReportGenerator';
import ThreatGlobeVisualizer from './components/dashboard/ThreatGlobeVisualizer';
import AlertNotificationManager from './components/alerts/AlertNotificationManager';
import SOCAnalystLeaderboard from './components/soc/SOCAnalystLeaderboard';
import ZeroTrustIAM from './components/iam/ZeroTrustIAM';
import ThreatHuntingNotebook from './components/hunting/ThreatHuntingNotebook';
import PlatformOverview from './components/intro/PlatformOverview';
import WebsiteSecurityScanner from './components/scanner/WebsiteSecurityScanner';
import CorporateUptimeMonitor from './components/monitoring/CorporateUptimeMonitor';
import AutoPatchRemediation from './components/remediation/AutoPatchRemediation';
import FirewallBlocklistExporter from './components/intelligence/FirewallBlocklistExporter';
import { Brain, X, Sparkles } from 'lucide-react';

function MainContent() {
  const { selectedView, globalAttacks, isAuthenticated, themeMode } = useApp();
  const [showFloatingAi, setShowFloatingAi] = useState(false);
  const isLight = themeMode === 'light';

  if (!isAuthenticated) {
    return (
      <ErrorBoundary fallbackTitle="Authentication Gateway Shield">
        <AuthPage />
      </ErrorBoundary>
    );
  }

  const renderView = () => {
    switch (selectedView) {
      case 'corporate-uptime':
        return <CorporateUptimeMonitor />;
      case 'auto-patch':
        return <AutoPatchRemediation />;
      case 'firewall-export':
        return <FirewallBlocklistExporter />;
      case 'url-scanner':
        return <WebsiteSecurityScanner />;
      case 'platform-intro':
        return <PlatformOverview />;
      case 'command-center':
        return <CommandCenter />;
      case 'threat-globe':
        return <ThreatGlobeVisualizer />;
      case 'global-map':
        return (
          <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isLight ? 'bg-slate-50' : 'bg-cyber-dark'}`}>
            <div className={`p-4 md:p-6 min-h-full ${isLight ? 'bg-slate-50' : 'bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark'}`}>
              <div className="max-w-[1920px] mx-auto">
                <h1 className={`text-2xl font-display font-bold tracking-wide mb-6 ${isLight ? 'text-slate-900' : 'text-cyan-400'}`}>
                  Global Cyber Attack Map
                </h1>
                <GlobalAttackMap attacks={globalAttacks} className="h-[800px]" />
              </div>
            </div>
          </div>
        );
      case 'ai-copilot':
        return <AICyberCopilot />;
      case 'ai-assistant':
        return (
          <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isLight ? 'bg-slate-50' : 'bg-cyber-dark'}`}>
            <div className={`p-4 md:p-6 min-h-full ${isLight ? 'bg-slate-50' : 'bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark'}`}>
              <div className="max-w-[1000px] mx-auto h-[calc(100vh-8rem)]">
                <AIAssistantPanel />
              </div>
            </div>
          </div>
        );
      case 'threat-intelligence':
        return <ThreatIntelligence />;
      case 'mitre-attack':
        return <MitreAttackMatrix />;
      case 'alert-notifications':
        return <AlertNotificationManager />;
      case 'analyst-leaderboard':
        return <SOCAnalystLeaderboard />;
      case 'zero-trust-iam':
        return <ZeroTrustIAM />;
      case 'hunting-notebook':
        return <ThreatHuntingNotebook />;
      case 'cloud-posture':
        return <CloudSecurityPosture />;
      case 'threat-deception':
        return <ThreatDeceptionEngine />;
      case 'compliance-reports':
        return <ComplianceReportGenerator />;
      case 'threat-actors':
        return <ThreatIntelligence />;
      case 'soc-operations':
        return <SOCOperations />;
      case 'alerts':
        return <SOCOperations />;
      case 'incidents':
        return <IncidentResponse />;
      case 'detection-engine':
        return <DetectionEngine />;
      case 'vulnerabilities':
        return <VulnerabilityManagement />;
      case 'assets':
        return <AssetManagement />;
      case 'forensics':
        return <ForensicsWorkspace />;
      case 'soar':
        return <SOARAutomation />;
      case 'compliance':
        return <ComplianceCenter />;
      case 'executive':
        return <ExecutiveDashboard />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SettingsPage />;
      case 'network-topology':
        return <NetworkTopology />;
      case 'malware-sandbox':
        return <MalwareSandbox />;
      case 'siem-rules':
        return <DetectionRuleBuilder />;
      case 'darkweb-monitor':
        return <DarkWebMonitoring />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden relative transition-colors duration-200 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-cyber-dark text-gray-100'
    }`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ErrorBoundary fallbackTitle="Security Workspace Module">
            {renderView()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Premium SOC Copilot Floating Launcher */}
      <button
        onClick={() => setShowFloatingAi(!showFloatingAi)}
        className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl border flex items-center gap-3 font-mono text-xs hover:scale-105 transition-all group backdrop-blur-xl cursor-pointer ${
          isLight
            ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-xl shadow-slate-300/50'
            : 'bg-[#050b18]/95 hover:bg-[#09152e] border-cyan-400/40 hover:border-cyan-300 text-white shadow-2xl shadow-cyan-500/25'
        }`}
        title="Open CyberShield Autonomous SOC Copilot"
      >
        <div className="relative flex items-center justify-center">
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-inner ${
            isLight ? 'bg-cyan-50 border-cyan-300 text-cyan-700' : 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
          }`}>
            <Brain className={`w-4 h-4 animate-pulse ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`} />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-wider text-[11px] ${isLight ? 'text-slate-900' : 'text-cyan-300'}`}>
              AI COPILOT
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className={`text-[9px] uppercase tracking-widest font-bold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            ONLINE &bull; READY
          </p>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Integrated SOC Copilot Panel Drawer */}
      {showFloatingAi && (
        <div className={`fixed bottom-20 right-4 sm:right-6 z-50 w-[94vw] sm:w-[500px] h-[600px] max-h-[85vh] shadow-2xl rounded-2xl overflow-hidden border flex flex-col animate-in slide-in-from-bottom duration-300 font-mono ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800 shadow-slate-400/40'
            : 'bg-[#030712]/98 border-cyan-500/40 backdrop-blur-2xl text-gray-100'
        }`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#050c1e] border-cyan-500/25'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                isLight ? 'bg-cyan-50 border-cyan-300 text-cyan-700' : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
              }`}>
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-xs font-bold tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  CYBERSHIELD AI COPILOT
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-500 font-bold">ACTIVE</span>
                </span>
                <p className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Enterprise SOC Intelligence & Heuristic Countermeasures
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFloatingAi(false)}
              className={`p-1.5 rounded-lg cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <AIAssistantPanel />
          </div>
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <ErrorBoundary fallbackTitle="CyberShield System Kernel">
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
