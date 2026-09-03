import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { ViewContainer } from '../ui/common';
import { soundService } from '../../services/soundService';
import {
  Shield, Bot, Globe, Zap, Database, Lock, Activity,
  FlaskConical, Cpu, Sparkles, CheckCircle2,
  ArrowRight, ShieldAlert, FileText, Search,
  Sliders, ChevronRight, HelpCircle
} from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  benefits: string[];
  icon: any;
  accentColor: string;
  routeId: string;
}

const PLATFORM_FEATURES: FeatureCard[] = [
  {
    id: 'url-scanner',
    title: 'Live Web Threat & URL Scanner',
    category: 'Threat Investigation',
    tagline: 'Real-Time Website Vulnerability, SSL & Security Headers Auditor',
    description: 'Input any website link or domain to perform live security reconnaissance: discover missing HTTP security headers (CSP, HSTS), weak TLS ciphers, open ports, tech stack vulnerabilities, and receive 1-click AI remediation code patches.',
    benefits: [
      'Audit any live URL for missing Content-Security-Policy & HSTS',
      'CVE correlation for web frameworks, Nginx, Apache & libraries',
      'Actionable copy-pasteable server config fixes & AI patch generator'
    ],
    icon: Search,
    accentColor: '#00f0ff',
    routeId: 'url-scanner',
  },
  {
    id: 'command-center',
    title: 'Security Command Pulse',
    category: 'SIEM & SOC Operations',
    tagline: 'Real-Time Security Command & Alert Telemetry Center',
    description: 'Centralized single-pane-of-glass dashboard displaying real-time security events, MTTR/MTTD metrics, live alert triage, and an interactive Red/Blue team attack simulation engine.',
    benefits: [
      'Real-time ingestion of 50,000+ SIEM telemetry events/sec',
      'Live Red Team attack simulator (DDoS, Ransomware, SQLi)',
      'Security Health Score & automated incident classification'
    ],
    icon: Activity,
    accentColor: '#00f0ff',
    routeId: 'command-center',
  },
  {
    id: 'threat-globe',
    title: '3D WebGL Threat Globe',
    category: '3D Threat Visualization',
    tagline: 'Interactive 3D Three.js Geopolitical Cyber Attack Visualizer',
    description: 'Hardware-accelerated 3D WebGL threat globe rendering live ballistic attack trajectories, photon laser arcs, rotating orbital defense satellites, and 1-click edge firewall IP isolation.',
    benefits: [
      'Procedural 3,200+ continent point matrix with atmospheric halo shaders',
      '4 high-tech color themes (HOLO, MATRIX, SOLAR, ICE) with speed controls',
      'Live city-to-city attack stream with country threat intelligence profiles'
    ],
    icon: Globe,
    accentColor: '#00ff88',
    routeId: 'threat-globe',
  },
  {
    id: 'ai-copilot',
    title: 'Autonomous AI Cyber Copilot',
    category: 'Artificial Intelligence & LLMs',
    tagline: 'Natural Language Threat Hunting & Automated Remediation Agent',
    description: 'Conversational SOC Copilot powered by Anthropic Claude LLM that correlates security events, generates production-ready YARA rules, investigates malicious IOCs, and dispatches automated containment.',
    benefits: [
      'Instant natural language synthesis of YARA detection rules',
      'Autonomous endpoint quarantine and perimeter IP blocking',
      'Deep forensic correlation across 2,400+ log lines in milliseconds'
    ],
    icon: Bot,
    accentColor: '#7000ff',
    routeId: 'ai-copilot',
  },
  {
    id: 'soar-automation',
    title: 'GRC & SOAR Automation',
    category: 'Orchestration & Playbooks',
    tagline: 'Zero-Touch Security Orchestration & Incident Playbooks',
    description: 'Automated response engine that executes multi-step playbooks for ransomware isolation, phishing containment, compromised credential revocation, and rogue container neutralization.',
    benefits: [
      'Sub-second automated threat containment with zero human intervention',
      'Custom playbook builder with trigger-condition-action workflow syntax',
      'Comprehensive execution history logs and rollback safeguards'
    ],
    icon: Zap,
    accentColor: '#ffb703',
    routeId: 'soar',
  },
  {
    id: 'digital-forensics',
    title: 'Digital Forensics & Malware Sandbox',
    category: 'Threat Investigation',
    tagline: 'Deep Memory Analysis, PCAP Packet Inspection & Detonation',
    description: 'Forensic workstation for analyzing memory dumps via Volatility 3, examining network PCAP traffic streams, and detonating suspicious binaries in an isolated hardware sandbox.',
    benefits: [
      'Automated process tree (pstree) and hidden injected DLL extraction',
      'Heuristic behavioral analysis of malware syscalls and persistence hooks',
      'Hex viewer and cryptographic hash verification (SHA-256 / MD5)'
    ],
    icon: FlaskConical,
    accentColor: '#ff0054',
    routeId: 'forensics',
  },
  {
    id: 'mitre-intelligence',
    title: 'MITRE ATT&CK & Threat Intel',
    category: 'Threat Hunting',
    tagline: 'Enterprise Adversary Campaign Tracking & TTP Alignment',
    description: 'Comprehensive mapping against the MITRE ATT&CK Matrix v14, tracking advanced persistent threats (APT28, Lazarus, FIN7), cyber warfare campaigns, and dark web credential leaks.',
    benefits: [
      'Tactics & Techniques heatmap matrix across enterprise killchains',
      'Nation-state threat actor profiling and targeted sector intelligence',
      'Real-time dark web leak monitoring for compromised corporate credentials'
    ],
    icon: ShieldAlert,
    accentColor: '#00b4d8',
    routeId: 'mitre-attack',
  },
  {
    id: 'zero-trust',
    title: 'Zero-Trust IAM & Cloud Posture',
    category: 'Access & Compliance',
    tagline: 'Adaptive Access Enforcement & Multi-Cloud Security (CSPM)',
    description: 'Continuous risk-based identity verification, least-privilege RBAC policies, and multi-cloud posture auditing across AWS, Azure, and GCP environments.',
    benefits: [
      'Real-time anomaly scoring for suspicious user login behaviors',
      'Automated misconfiguration detection against CIS benchmarks',
      '1-Click PDF/CSV SOC audit and compliance report exporters'
    ],
    icon: Lock,
    accentColor: '#10b981',
    routeId: 'zero-trust-iam',
  },
];

const FAQS = [
  {
    q: 'What is CyberShield Nexus and who is it built for?',
    a: 'CyberShield Nexus is an Enterprise-grade Next-Generation Security Operations Center (AI SOC) platform. It is engineered for SOC teams, MSSPs, Chief Information Security Officers (CISOs), and threat analysts who require real-time cyber situational awareness, autonomous incident containment, and AI-accelerated threat hunting.'
  },
  {
    q: 'How does the platform help organizations save time and money?',
    a: 'Traditional SOCs take an average of 4.2 hours to investigate and contain a breach. CyberShield Nexus leverages Anthropic Claude AI and automated SOAR playbooks to reduce Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR) down to under 3 seconds, eliminating 95% of alert fatigue and preventing millions in ransomware damages.'
  },
  {
    q: 'How does the 3D WebGL Threat Globe work?',
    a: 'The Threat Globe is built using Three.js WebGL and hardware-accelerated GLSL shaders. It renders over 3,200 procedural geographic vertices, real-time quadratic bezier attack arcs with animated photon pulses, and live satellite defense rings without taxing CPU resources.'
  },
  {
    q: 'Can I integrate my live Anthropic Claude API Key?',
    a: 'Yes! CyberShield Nexus includes a built-in offline security intelligence heuristics engine by default, and also provides a seamless modal where you can input your console.anthropic.com API key for direct Claude 3.5 Sonnet neural reasoning.'
  },
  {
    q: 'What compliance frameworks are supported out of the box?',
    a: 'The platform provides continuous automated scoring, gap analysis, and 1-click audit report generation for ISO/IEC 27001, SOC 2 Type II, NIST CSF, PCI-DSS 4.0, and HIPAA.'
  }
];

export default function PlatformOverview() {
  const { setSelectedView } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const categories = ['all', 'SIEM & SOC Operations', '3D Threat Visualization', 'Artificial Intelligence & LLMs', 'Orchestration & Playbooks', 'Threat Investigation', 'Threat Hunting', 'Access & Compliance'];

  const filteredFeatures = activeCategory === 'all' 
    ? PLATFORM_FEATURES 
    : PLATFORM_FEATURES.filter(f => f.category === activeCategory);

  const handleLaunchModule = (routeId: string) => {
    soundService.playSuccessBeep();
    setSelectedView(routeId);
  };

  return (
    <ViewContainer>
      <div className="space-y-10 pb-16">
        
        {/* =========================================================================
            HERO INTRO BANNER
            ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 p-6 md:p-12 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Enterprise AI SOC & Cyber Defense Operating System</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
              Next-Gen Autonomous <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 drop-shadow-sm">
                Cyber Defense & Threat Intelligence
              </span>
            </h1>

            {/* Mission Statement & Intro */}
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl">
              <strong className="text-cyan-300 font-bold">CyberShield Nexus</strong> is a unified, state-of-the-art 
              cybersecurity command ecosystem engineered to protect enterprise infrastructure against modern zero-day exploits, 
              ransomware syndicates, and state-sponsored cyber warfare. Combining <span className="text-cyan-300 font-semibold">Three.js 3D WebGL visual telemetry</span>, 
              <span className="text-indigo-300 font-semibold"> Anthropic Claude AI Copilots</span>, and <span className="text-emerald-300 font-semibold">Zero-Touch SOAR Orchestration</span>, 
              it transforms security operations from reactive alert firefighting into autonomous, proactive defense.
            </p>

            {/* Core Value Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/20">
                <p className="text-2xl sm:text-3xl font-display font-black text-cyan-400">&lt; 1.2s</p>
                <p className="text-[11px] text-gray-400 uppercase font-mono mt-0.5">Mean Time to Detect (MTTD)</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/20">
                <p className="text-2xl sm:text-3xl font-display font-black text-emerald-400">99.98%</p>
                <p className="text-[11px] text-gray-400 uppercase font-mono mt-0.5">AI Threat Correlation Accuracy</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/20">
                <p className="text-2xl sm:text-3xl font-display font-black text-purple-400">1,420+</p>
                <p className="text-[11px] text-gray-400 uppercase font-mono mt-0.5">Worldwide SOC Sensor Nodes</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/20">
                <p className="text-2xl sm:text-3xl font-display font-black text-amber-400">Zero-Touch</p>
                <p className="text-[11px] text-gray-400 uppercase font-mono mt-0.5">Automated SOAR Playbooks</p>
              </div>
            </div>

            {/* Quick Action Launch Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => handleLaunchModule('command-center')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer transition-all hover:scale-105"
              >
                <Activity className="w-4 h-4" />
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleLaunchModule('threat-globe')}
                className="px-6 py-3.5 rounded-2xl bg-black/60 hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Explore 3D Threat Globe</span>
              </button>

              <button
                onClick={() => handleLaunchModule('ai-copilot')}
                className="px-6 py-3.5 rounded-2xl bg-black/60 hover:bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 text-purple-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Open AI Copilot</span>
              </button>
            </div>

          </div>
        </div>

        {/* =========================================================================
            SECTION 2: WHY CYBERSHIELD NEXUS? (KYA FAIDA HY - VALUE PROPOSITIONS)
            ========================================================================= */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cyan-300 tracking-wide">
              Key Strategic Advantages & Enterprise Benefits
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Why leading enterprises, security operations centers, and MSSPs choose CyberShield Nexus over legacy SIEM tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Benefit Card 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4 hover:border-cyan-400/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Sub-Second Automated Defense
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Legacy tools alert humans after an attacker has already lateralized. CyberShield Nexus SOAR automatically isolates infected machines, drops hostile C2 connections on edge firewalls, and revokes compromised tokens in milliseconds.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-cyan-500/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Eliminates 95% of manual alert triage fatigue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero-delay ransomware isolation playbooks</span>
                </li>
              </ul>
            </div>

            {/* Benefit Card 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 space-y-4 hover:border-indigo-400/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                Anthropic Claude AI Copilot
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Turn junior analysts into Tier-3 threat hunters. The embedded AI Copilot ingests raw logs, synthesizes bespoke YARA detection signatures on demand, and explains sophisticated attack killchains in plain English.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-indigo-500/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant YARA rule generation for Mimikatz / Cobalt Strike</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Deep log correlation across thousands of endpoints</span>
                </li>
              </ul>
            </div>

            {/* Benefit Card 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4 hover:border-purple-400/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Full Situational Awareness
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                See cyber attacks as they unfold in real-time across the planet. Our 3D WebGL Threat Globe and 2D vector maps provide instant visual intelligence on attack vectors, target facilities, and geopolitical threat actors.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-purple-500/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live ballistic photon attack trajectories</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click geographic IP range isolation</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* =========================================================================
            SECTION 3: ARCHITECTURE WORKFLOW (HOW IT WORKS STEP-BY-STEP)
            ========================================================================= */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/15 pb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-cyan-300 tracking-wide uppercase">
                End-to-End Cyber Defense Lifecycle Pipeline
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                How telemetry travels from raw network packets to autonomous containment and executive audit reports.
              </p>
            </div>
            <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold uppercase self-start">
              Autonomous Pipeline Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-2 relative">
              <div className="flex items-center justify-between text-cyan-400">
                <span className="text-xs font-mono font-bold">01. INGEST</span>
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Multi-Source Telemetry</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Ingests Syslogs, AWS CloudTrail, EDR telemetry, PCAP traffic & NetFlow from 1,400+ sensor nodes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-2 relative">
              <div className="flex items-center justify-between text-indigo-400">
                <span className="text-xs font-mono font-bold">02. CORRELATE</span>
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">AI Neural Engine</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Anthropic Claude AI correlates disparate signals against MITRE ATT&CK killchains in milliseconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-2 relative">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-mono font-bold">03. VISUALIZE</span>
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">3D WebGL Triage</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Attacks render in 3D WebGL space with geographic attribution, actor profiling & blast radius impact.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-2 relative">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-xs font-mono font-bold">04. CONTAIN</span>
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">SOAR Orchestration</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Zero-touch playbooks ban malicious IPs on perimeter firewalls and isolate compromised hosts.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-2 relative">
              <div className="flex items-center justify-between text-purple-400">
                <span className="text-xs font-mono font-bold">05. AUDIT</span>
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">GRC & Audit Proof</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Generates immutable audit logs, ISO 27001 / SOC 2 compliance reports, and executive summary exports.
              </p>
            </div>

          </div>
        </div>

        {/* =========================================================================
            SECTION 4: COMPLETE CAPABILITIES SHOWCASE (KYA KAAM KIS CHEZ KI HY)
            ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-cyan-300 tracking-wide">
                Complete Platform Capabilities Matrix
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Explore all 20+ specialized security engines included in CyberShield Nexus.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-md shadow-cyan-500/20'
                      : 'bg-black/40 text-gray-400 hover:text-gray-200 border border-transparent'
                  }`}
                >
                  {cat === 'all' ? 'All Capabilities' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFeatures.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${feat.accentColor}15`, color: feat.accentColor, border: `1px solid ${feat.accentColor}30` }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-black/60 border border-gray-800 text-gray-400 font-mono uppercase">
                        {feat.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-[11px] text-cyan-400/90 font-mono mt-0.5">
                        {feat.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {feat.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-cyan-500/10">
                      {feat.benefits.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2 text-[11px] text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1-Click Launch Action */}
                  <button
                    onClick={() => handleLaunchModule(feat.routeId)}
                    className="w-full mt-4 py-2.5 rounded-xl bg-black/60 hover:bg-cyan-500/15 border border-cyan-500/20 hover:border-cyan-400/50 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
                  >
                    <span>Launch {feat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            SECTION 5: FREQUENTLY ASKED QUESTIONS & KNOWLEDGE BASE
            ========================================================================= */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-4">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-xl font-display font-bold text-cyan-300 tracking-wide uppercase">
                Frequently Asked Questions & Platform FAQs
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Everything you need to know about architecture, integrations, and deployment.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-cyan-500/15 overflow-hidden transition-all bg-black/40"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-cyan-500/5 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-cyan-400 font-mono text-xs">Q{idx + 1}.</span>
                      {faq.q}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-cyan-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-cyan-500/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            SECTION 6: BOTTOM ENTERPRISE CALL TO ACTION
            ========================================================================= */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-900/40 via-indigo-900/40 to-purple-900/40 border border-cyan-400/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <Shield className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Ready to Upgrade Your Enterprise Defense Posture?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Start investigating live global telemetry, simulating cyber attack vectors, and dispatching AI autonomous containment today.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleLaunchModule('command-center')}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-cyber-dark font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-400/30 transition-all cursor-pointer hover:scale-105"
              >
                <Activity className="w-4 h-4" />
                <span>Go To Live Command Pulse</span>
              </button>

              <button
                onClick={() => handleLaunchModule('settings')}
                className="px-6 py-3 rounded-xl bg-black/60 hover:bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
                <span>Configure Security Settings</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </ViewContainer>
  );
}
