import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { soundService } from '../../services/soundService';
import {
  Shield, Bot, Globe, Zap, Database, Activity,
  Cpu, Sparkles, CheckCircle2,
  ArrowRight, ShieldAlert, FileText, Search,
  Sliders, ChevronRight, HelpCircle, Globe2, Map, Orbit,
  Terminal, Flame, ShieldOff, HardDrive, SearchCheck,
  CloudLightning, RadioTower, Network, Binary, Workflow,
  EyeOff, KeyRound, ScrollText, ShieldCheck, BarChart3,
  BellRing, Trophy, FileCode2, Users, Crosshair, Gauge,
  FileSpreadsheet, Radar, Brain, Star, TrendingUp,
  Server, Clock, Award, ChevronDown,
} from 'lucide-react';

/* ─────────────────────────────── DATA ──────────────────────────────── */

const ALL_MODULES = [
  /* ── OVERVIEW & RADAR ───────────────────────────────────────────────── */
  {
    id: 'command-center',
    title: 'SOC Command Pulse',
    category: 'SIEM & SOC Operations',
    categoryColor: '#00f0ff',
    icon: Gauge,
    accentColor: '#00f0ff',
    tagline: 'Real-Time Security Command & Alert Telemetry Center',
    description:
      'Centralized single-pane-of-glass dashboard that aggregates live security events from 1,400+ SOC sensor nodes. Displays MTTR/MTTD metrics, live alert triage queues, security posture scores, and includes an interactive Red/Blue team attack simulation engine for testing SOC readiness.',
    benefits: [
      'Real-time ingestion of 50,000+ SIEM telemetry events per second',
      'Live Red Team attack simulator — DDoS, Ransomware, SQL Injection',
      'Dynamic Security Health Score with sub-component breakdown',
      'Threat activity timeline with 1H / 6H / 24H / 7D range filters',
      'Live SOC event feed with IOC attribution per event',
    ],
    useCases: 'SOC Analysts, Security Managers, Tier-1 & Tier-2 Responders',
    routeId: 'command-center',
  },
  {
    id: 'url-scanner',
    title: 'Live Web Threat & URL Scanner',
    category: 'Threat Investigation',
    categoryColor: '#00ff88',
    icon: Radar,
    accentColor: '#00ff88',
    tagline: 'Real-Time Website Vulnerability, SSL & Security Headers Auditor',
    description:
      'Input any website URL or domain to perform immediate live security reconnaissance. Discovers missing HTTP security headers (CSP, HSTS, X-Frame-Options), weak TLS ciphers, open ports, outdated software versions with CVE correlation, and generates AI-powered 1-click remediation code patches.',
    benefits: [
      'Audit live URLs for missing Content-Security-Policy & HSTS headers',
      'CVE database correlation for web frameworks, Nginx, Apache & libraries',
      'TLS/SSL grading with cipher suite enumeration (A+ to F)',
      'Copy-pasteable server config fixes & AI patch code generator',
      'WHOIS, DNS record, and subdomain takeover risk assessment',
    ],
    useCases: 'Web Security Engineers, Bug Bounty Hunters, DevSecOps Teams',
    routeId: 'url-scanner',
  },
  {
    id: 'corporate-uptime',
    title: 'Domain & SSL Uptime Monitor',
    category: 'Infrastructure Monitoring',
    categoryColor: '#38bdf8',
    icon: Globe2,
    accentColor: '#38bdf8',
    tagline: 'Enterprise-Grade Multi-Domain SSL Expiry & Availability Monitoring',
    description:
      'Continuously monitors your enterprise domains, certificates, and endpoints for outages, SSL certificate expiration, and performance degradation. Sends automated multi-channel alerts (Slack, PagerDuty, email) before certificates expire, preventing revenue-impacting HTTPS failures.',
    benefits: [
      'Real-time uptime checks every 60 seconds from global probe points',
      'SSL certificate expiry countdown with 30/14/7-day advance warnings',
      'Response time latency tracking with P95 / P99 percentile charts',
      'Multi-region availability monitoring for CDN and geo-distributed apps',
      'Automatic incident tickets raised on status degradation',
    ],
    useCases: 'IT Operations, SRE Teams, Network Administrators',
    routeId: 'corporate-uptime',
  },
  {
    id: 'global-map',
    title: 'Global Attack Map 2D',
    category: 'Threat Visualization',
    categoryColor: '#818cf8',
    icon: Map,
    accentColor: '#818cf8',
    tagline: 'Live Geopolitical Cyber Attack Trajectory Heatmap',
    description:
      'Interactive 2D vector world map rendering live cyber attack trajectories with source and destination attribution. Color-coded by attack type and severity. Click any city node to pull country-specific threat intelligence, active IOCs, and historical attack patterns.',
    benefits: [
      'Live attack arcs from 180+ source countries with victim correlation',
      'Filter by attack type: DDoS, APT, Ransomware, Phishing, Brute Force',
      '1-Click city node drilldown for country-level threat profile',
      'Attack volume heatmap overlay with geographic density scoring',
      'Export attack telemetry as JSON or GeoJSON for SIEM integration',
    ],
    useCases: 'Threat Intelligence Analysts, C-Suite Executives, SOC Leads',
    routeId: 'global-map',
  },
  {
    id: 'threat-globe',
    title: '3D WebGL Threat Globe',
    category: '3D Threat Visualization',
    categoryColor: '#67e8f9',
    icon: Orbit,
    accentColor: '#67e8f9',
    tagline: 'Hardware-Accelerated Interactive 3D Cyber Attack Geosphere',
    description:
      'Hardware-accelerated 3D WebGL threat globe built in Three.js, rendering live ballistic attack trajectories as photon laser arcs. Features rotating orbital defense satellites, atmospheric halo shaders, and 4 premium color themes. Click any arc to isolate source IPs on perimeter firewalls.',
    benefits: [
      'Procedural 3,200+ continent point matrix with atmospheric glow',
      '4 high-tech themes: HOLO (cyan), MATRIX (green), SOLAR (gold), ICE (blue)',
      'Animated photon pulse attack arcs with quadratic bezier trajectories',
      '1-Click geographic IP range isolation directly from the globe',
      'Rotation speed and detail density controls for presentation mode',
    ],
    useCases: 'Executive Briefings, SOC War Rooms, Live Security Dashboards',
    routeId: 'threat-globe',
  },

  /* ── OPERATIONS & REMEDIATION ────────────────────────────────────────── */
  {
    id: 'auto-patch',
    title: '1-Click Auto-Patch Engine',
    category: 'Vulnerability Remediation',
    categoryColor: '#34d399',
    icon: Terminal,
    accentColor: '#34d399',
    tagline: 'Zero-Touch Automated CVE Patching & Configuration Hardening',
    description:
      'Scans your asset inventory for known CVEs and software misconfigurations, then deploys vendor-signed patches and hardening scripts in one click. Integrates with WSUS, apt/yum, Chocolatey, and Ansible playbooks. Full audit trail for compliance reporting.',
    benefits: [
      'One-click mass patch deployment across Windows, Linux & macOS fleets',
      'Automated rollback capability if patch causes service degradation',
      'Pre-patch snapshot creation for safe restore points',
      'Integration with WSUS, apt, yum, Chocolatey, and Ansible',
      'Real-time patch compliance percentage dashboard with SLA tracking',
    ],
    useCases: 'IT Administrators, Vulnerability Management Teams, CISO',
    routeId: 'auto-patch',
  },
  {
    id: 'firewall-export',
    title: 'Firewall Blocklist Exporter',
    category: 'Network Defense',
    categoryColor: '#fb923c',
    icon: Flame,
    accentColor: '#fb923c',
    tagline: 'Export Threat Intelligence as Firewall-Ready IP Blocklists',
    description:
      'Aggregates malicious IP addresses from global threat intelligence feeds, dark web leaks, and your own SOC detections, then exports them in formats compatible with pfSense, Cisco ASA, iptables, Palo Alto, and Fortinet. Keeps perimeter defenses automatically updated.',
    benefits: [
      'Export blocklists in pfSense, iptables, Cisco ASA, and YARA formats',
      'Auto-refreshed from 40+ global threat intelligence feed sources',
      'Custom whitelist rules to prevent false-positive blocking of partners',
      'Scheduled export via REST API for automated firewall rule ingestion',
      'Historical blocklist versioning with diff viewer for audit trails',
    ],
    useCases: 'Network Engineers, Firewall Administrators, SOC Tier-2',
    routeId: 'firewall-export',
  },
  {
    id: 'incidents',
    title: 'Incident Response & Tickets',
    category: 'Incident Management',
    categoryColor: '#f87171',
    icon: Activity,
    accentColor: '#f87171',
    tagline: 'Enterprise SOAR-Integrated Incident Lifecycle Management',
    description:
      'Full incident lifecycle management platform covering detection, triage, investigation, containment, and post-incident review. Auto-generates IR tickets from SIEM alerts, assigns severity, routes to the correct analyst, and tracks MTTR/MTTD KPIs against SLA targets.',
    benefits: [
      'Auto-ticket creation from SIEM alert correlation events',
      'Severity-based analyst routing with escalation chains',
      'Full incident timeline: detection → containment → remediation → closure',
      'MTTR & MTTD KPI dashboards with SLA breach alerting',
      'Post-incident review templates and root cause analysis (RCA) export',
    ],
    useCases: 'Incident Response Team, SOC Manager, CISO, GRC Auditors',
    routeId: 'incidents',
  },
  {
    id: 'vulnerabilities',
    title: 'Vulnerability Management',
    category: 'Risk & Compliance',
    categoryColor: '#fbbf24',
    icon: ShieldOff,
    accentColor: '#fbbf24',
    tagline: 'Continuous CVE Discovery, CVSS Scoring & Remediation Tracking',
    description:
      'Enterprise vulnerability lifecycle management platform with continuous scanning, CVSS v3.1 scoring, exploit prediction (EPSS), and prioritized remediation queues. Integrates with Nessus, Qualys, and OpenVAS for comprehensive infrastructure coverage.',
    benefits: [
      'CVSS v3.1 and EPSS exploit prediction scoring for prioritization',
      'Integration with Nessus, Qualys, Rapid7, and OpenVAS scanners',
      'Asset-grouped vulnerability view for efficient remediation planning',
      'SLA-tracked remediation workflows with analyst assignment',
      'Compliance gap reporting for PCI-DSS, SOC2, ISO 27001 requirements',
    ],
    useCases: 'Security Engineers, Compliance Officers, DevSecOps',
    routeId: 'vulnerabilities',
  },
  {
    id: 'assets',
    title: 'Asset Inventory & Nodes',
    category: 'Asset Management',
    categoryColor: '#22d3ee',
    icon: HardDrive,
    accentColor: '#22d3ee',
    tagline: 'Real-Time Enterprise Asset Discovery, Classification & Risk Scoring',
    description:
      'Automated asset discovery and inventory management across on-premise, cloud, and OT/ICS environments. Each asset is classified (server, endpoint, IoT, cloud resource), risk-scored based on vulnerabilities and exposure, and continuously monitored for configuration drift.',
    benefits: [
      'Automated discovery of unmanaged shadow IT and rogue devices',
      'Asset classification: servers, endpoints, IoT, cloud, OT/ICS',
      'Real-time risk score per asset based on CVE exposure and criticality',
      'Software inventory with EOL detection and unsupported version flags',
      'Network segmentation view showing inter-asset communication flows',
    ],
    useCases: 'IT Asset Managers, Security Teams, Network Administrators',
    routeId: 'assets',
  },
  {
    id: 'forensics',
    title: 'Digital Forensics Workspace',
    category: 'Threat Investigation',
    categoryColor: '#60a5fa',
    icon: SearchCheck,
    accentColor: '#60a5fa',
    tagline: 'Memory Forensics, PCAP Analysis & Malware Detonation Suite',
    description:
      'Professional digital forensics workstation for post-compromise investigations. Analyze memory dumps with Volatility 3, inspect network PCAP streams for exfiltration, detonate malware in isolated sandbox environments, and produce court-admissible forensic reports.',
    benefits: [
      'Volatility 3 memory analysis: pstree, malfind, dlllist, netstat',
      'PCAP network traffic inspection with protocol dissection and IOC extraction',
      'Isolated malware detonation with behavioral heuristic analysis',
      'Cryptographic hash verification (SHA-256, MD5, SHA-1)',
      'Chain-of-custody evidence preservation for legal proceedings',
    ],
    useCases: 'Digital Forensics Investigators, Incident Responders, Legal Teams',
    routeId: 'forensics',
  },
  {
    id: 'cloud-posture',
    title: 'Cloud Security Posture (CSPM)',
    category: 'Cloud Security',
    categoryColor: '#38bdf8',
    icon: CloudLightning,
    accentColor: '#38bdf8',
    tagline: 'Multi-Cloud Misconfiguration Detection & CIS Benchmark Compliance',
    description:
      'Continuously audits your AWS, Azure, and GCP environments against CIS Benchmarks and NIST CSF controls. Detects public S3 buckets, overly permissive IAM roles, unencrypted databases, and open security groups. Provides 1-click Terraform/CloudFormation remediation templates.',
    benefits: [
      'Multi-cloud coverage: AWS, Azure, GCP, Oracle Cloud, and Alibaba Cloud',
      'CIS Benchmarks Level 1 & 2 automated compliance scoring',
      'Real-time drift detection for security group and IAM policy changes',
      '1-Click Terraform & CloudFormation remediation template generation',
      'Cloud resource inventory with risk exposure blast radius mapping',
    ],
    useCases: 'Cloud Security Engineers, DevSecOps, Platform Engineering',
    routeId: 'cloud-posture',
  },
  {
    id: 'network-topology',
    title: 'Network Topology Mesh',
    category: 'Network Security',
    categoryColor: '#34d399',
    icon: Network,
    accentColor: '#34d399',
    tagline: 'Interactive Real-Time Network Device Graph & Segmentation Audit',
    description:
      'Renders your live network topology as an interactive force-directed graph. Shows device relationships, communication flows, VLAN segmentation, and firewall zones. Detects anomalous lateral movement paths and unauthorized cross-segment connections in real time.',
    benefits: [
      'Force-directed interactive node graph with VLAN and subnet overlays',
      'Real-time anomalous lateral movement path detection and highlighting',
      'Traffic flow analysis between critical network segments',
      'Rogue device detection and unauthorized communication alerting',
      'Export topology snapshots as SVG/PNG for audit documentation',
    ],
    useCases: 'Network Architects, SOC Analysts, Security Operations',
    routeId: 'network-topology',
  },
  {
    id: 'siem-rules',
    title: 'SIEM Detection Rule Builder',
    category: 'Detection Engineering',
    categoryColor: '#22d3ee',
    icon: Workflow,
    accentColor: '#22d3ee',
    tagline: 'Visual YARA, Sigma & KQL Detection Rule Authoring Studio',
    description:
      'Drag-and-drop SIEM detection rule builder that generates YARA, Sigma, and KQL queries from high-level threat logic. Includes a library of 500+ MITRE ATT&CK-aligned rule templates, live syntax validation, and 1-click deployment to Splunk, Elastic, or Microsoft Sentinel.',
    benefits: [
      'Visual rule builder with YARA, Sigma, and KQL output formats',
      '500+ pre-built MITRE ATT&CK-aligned detection rule templates',
      'Live syntax validation and false-positive simulation testing',
      '1-Click deployment to Splunk, Elastic, Sentinel, and QRadar',
      'Version-controlled rule library with rollback and audit trail',
    ],
    useCases: 'Detection Engineers, Threat Hunters, SIEM Administrators',
    routeId: 'siem-rules',
  },

  /* ── THREAT INTELLIGENCE ─────────────────────────────────────────────── */
  {
    id: 'threat-intelligence',
    title: 'Threat Intelligence Feeds',
    category: 'Threat Intelligence',
    categoryColor: '#f87171',
    icon: ShieldAlert,
    accentColor: '#f87171',
    tagline: 'Curated Global IOC Feeds, Threat Actor Tracking & Campaign Analysis',
    description:
      'Aggregates, deduplicates, and enriches threat intelligence from 40+ premium and open-source feeds including VirusTotal, AlienVault OTX, Shodan, and government CERT advisories. Provides real-time IOC lookup, feed health scoring, and STIX/TAXII export.',
    benefits: [
      'Aggregation from 40+ feeds including VirusTotal, OTX, and Shodan',
      'Real-time IOC lookup (IP, domain, hash, URL) with context enrichment',
      'STIX/TAXII 2.1 compliant export for sharing with trusted partners',
      'Threat actor campaign tracking with TTP correlation per actor',
      'Feed health monitoring with false positive rate scoring per source',
    ],
    useCases: 'Threat Intelligence Analysts, SOC Tier-3, Threat Hunters',
    routeId: 'threat-intelligence',
  },
  {
    id: 'mitre-attack',
    title: 'MITRE ATT&CK Matrix',
    category: 'Threat Hunting',
    categoryColor: '#60a5fa',
    icon: Crosshair,
    accentColor: '#60a5fa',
    tagline: 'Enterprise Adversary Killchain Mapping & TTP Heatmap Navigator',
    description:
      'Interactive MITRE ATT&CK v14 Enterprise Matrix with heatmap overlay showing your detected techniques vs. adversary coverage gaps. Map threats to specific APT groups (APT28, Lazarus, FIN7), generate navigator layers, and export to ATT&CK Navigator JSON.',
    benefits: [
      'Full ATT&CK v14 Enterprise Matrix with 196 techniques and sub-techniques',
      'Heatmap overlay: detected vs. gap coverage with analyst coverage scoring',
      'APT group TTP profiling: APT28, Lazarus, Cobalt Group, FIN7',
      'Navigator layer export for red/blue team exercise documentation',
      'Auto-highlight techniques observed in your recent SIEM detections',
    ],
    useCases: 'Threat Hunters, Red/Blue Teams, Security Architects',
    routeId: 'mitre-attack',
  },
  {
    id: 'hunting-notebook',
    title: 'Threat Hunting Notebook',
    category: 'Threat Hunting',
    categoryColor: '#2dd4bf',
    icon: FileCode2,
    accentColor: '#2dd4bf',
    tagline: 'Interactive Jupyter-Style Threat Hunting Query & Investigation Lab',
    description:
      'Collaborative threat hunting workspace with a Jupyter-style notebook interface. Build and execute KQL, SPL (Splunk), and SQL hunting queries against your SIEM data lake. Save playbooks, annotate findings, and share investigations across the SOC team.',
    benefits: [
      'Jupyter-style notebook interface with markdown and code cell blocks',
      'KQL, SPL (Splunk), SQL query execution against connected SIEM data',
      'Pre-built hunt hypothesis library covering 80+ threat scenarios',
      'Collaborative sharing with version history and analyst annotations',
      'IOC pivot integration: click any result to auto-search threat feeds',
    ],
    useCases: 'Threat Hunters, Tier-3 SOC Analysts, Red Team Operators',
    routeId: 'hunting-notebook',
  },
  {
    id: 'threat-actors',
    title: 'Threat Actor Profiles',
    category: 'Threat Intelligence',
    categoryColor: '#fb923c',
    icon: Users,
    accentColor: '#fb923c',
    tagline: 'Nation-State & Criminal Group Dossiers, Campaigns & Targeting Patterns',
    description:
      'Comprehensive intelligence dossiers on 200+ known threat actors including nation-state APT groups, ransomware syndicates, hacktivists, and insider threat profiles. Includes TTP mapping, targeted sectors, known tools, infrastructure IOCs, and attribution confidence scores.',
    benefits: [
      '200+ actor profiles: APT28, Lazarus, Cl0p, LockBit, Cozy Bear, etc.',
      'Full TTP mapping per actor to MITRE ATT&CK techniques',
      'Targeted sector analysis (finance, healthcare, critical infrastructure)',
      'Known malware toolsets: Mimikatz, Cobalt Strike, BloodHound, etc.',
      'Attribution confidence scoring and geopolitical context analysis',
    ],
    useCases: 'CTI Analysts, Risk Officers, Executive Threat Briefings',
    routeId: 'threat-actors',
  },
  {
    id: 'darkweb-monitor',
    title: 'Dark Web Leak Monitor',
    category: 'Brand & Data Protection',
    categoryColor: '#f87171',
    icon: EyeOff,
    accentColor: '#f87171',
    tagline: 'Continuous Dark Web Monitoring for Credential & Data Leaks',
    description:
      'Monitors Tor hidden services, paste sites, dark web forums, and ransomware data leak sites for your corporate credentials, customer PII, source code, and confidential documents. Sends instant alerts with context when your organization is found in a data breach.',
    benefits: [
      'Continuous monitoring of 500+ dark web markets, forums, and paste sites',
      'Credential leak detection: email/password combos, API keys, tokens',
      'Ransomware group leak site monitoring for corporate data mentions',
      'Source code and confidential document fingerprint matching',
      'Automated breach notification with severity and context analysis',
    ],
    useCases: 'Brand Protection Teams, CISO, Legal & Compliance Officers',
    routeId: 'darkweb-monitor',
  },

  /* ── AI SECURITY ─────────────────────────────────────────────────────── */
  {
    id: 'ai-copilot',
    title: 'Autonomous AI Cyber Copilot',
    category: 'Artificial Intelligence',
    categoryColor: '#a78bfa',
    icon: Bot,
    accentColor: '#a78bfa',
    tagline: 'Anthropic Claude LLM-Powered SOC Copilot with Autonomous Response',
    description:
      'Conversational AI SOC Copilot powered by Anthropic Claude 3.5 Sonnet. Ingests raw security logs, synthesizes YARA detection rules on demand, explains attack killchains in plain English, and dispatches automated containment actions. Reduces Tier-1 analyst workload by 80%.',
    benefits: [
      'Natural language threat analysis: "Explain this log entry" → full report',
      'Instant YARA rule generation for any malware family or TTPs described',
      'Autonomous endpoint quarantine and perimeter IP blocking',
      'Deep forensic log correlation across 2,400+ log lines in milliseconds',
      'Configurable with your own Anthropic API key for full LLM access',
    ],
    useCases: 'All SOC Tiers, Incident Responders, Security Managers',
    routeId: 'ai-copilot',
  },
  {
    id: 'ai-assistant',
    title: 'AI Security Analyst',
    category: 'Artificial Intelligence',
    categoryColor: '#60a5fa',
    icon: Brain,
    accentColor: '#60a5fa',
    tagline: 'Conversational AI Assistant for Security Q&A and Alert Triage',
    description:
      'Embedded AI security analyst that answers complex cybersecurity questions, helps triage alerts with contextual reasoning, explains CVE vulnerabilities in plain language, and generates security policies and procedures on demand. Works offline with built-in heuristics.',
    benefits: [
      'Contextual alert triage with risk reasoning and recommended actions',
      'CVE explanation in plain English with business impact assessment',
      'Security policy and procedure generation from templates',
      'Works with built-in heuristics, no API key required for basic use',
      'Persistent conversation history with session context retention',
    ],
    useCases: 'Junior Analysts, Security Awareness Teams, GRC Professionals',
    routeId: 'ai-assistant',
  },
  {
    id: 'threat-deception',
    title: 'Threat Deception & Honeypot',
    category: 'Active Defense',
    categoryColor: '#34d399',
    icon: RadioTower,
    accentColor: '#34d399',
    tagline: 'AI-Managed Deception Grid with High-Interaction Honeypots & Canary Tokens',
    description:
      'Deploys a network of virtual honeypot systems, honey credentials, canary files, and fake network shares designed to detect and profile attackers who have already breached your perimeter. Attackers revealing their TTPs while interacting with deception assets, providing zero false-positives.',
    benefits: [
      'High-interaction honeypot deployment across network segments',
      'Canary tokens in documents, S3 buckets, and credential stores',
      'Real-time attacker profiling as they interact with deception assets',
      'Zero false-positive alerting: any honeypot touch = confirmed breach',
      'Lateral movement detection through fake admin share interactions',
    ],
    useCases: 'Advanced SOC Teams, Threat Hunters, Security Architects',
    routeId: 'threat-deception',
  },
  {
    id: 'malware-sandbox',
    title: 'Malware Dynamic Sandbox',
    category: 'Malware Analysis',
    categoryColor: '#22d3ee',
    icon: Binary,
    accentColor: '#22d3ee',
    tagline: 'Isolated Behavioral Malware Detonation & Heuristic Analysis Engine',
    description:
      'Safe isolated sandbox environment for detonating suspicious executables, Office documents, PDFs, and scripts. Captures syscall sequences, network C2 callbacks, registry persistence, process injection, and file drops. Generates comprehensive IOC reports for SIEM ingestion.',
    benefits: [
      'Safe detonation of EXE, DLL, Office docs, PDFs, scripts, and APKs',
      'Syscall trace, API hooking, and memory injection detection',
      'C2 callback extraction with domain and IP IOC capture',
      'Registry persistence, scheduled tasks, and startup modification tracking',
      'Automated YARA signature generation from behavioral artifacts',
    ],
    useCases: 'Malware Analysts, Incident Responders, Threat Intelligence Teams',
    routeId: 'malware-sandbox',
  },

  /* ── SYSTEM / SETTINGS ───────────────────────────────────────────────── */
  {
    id: 'alert-notifications',
    title: 'Corporate Webhooks & Dispatcher',
    category: 'Alerting & Integration',
    categoryColor: '#fbbf24',
    icon: BellRing,
    accentColor: '#fbbf24',
    tagline: 'Enterprise Alert Routing to Slack, Teams, PagerDuty & ITSM Systems',
    description:
      'Centralized notification and alerting dispatch system that routes security alerts to the right person via the right channel. Configures webhooks to Slack, Microsoft Teams, PagerDuty, ServiceNow, Jira, and email with severity-based routing rules and on-call scheduling.',
    benefits: [
      'Webhook integrations: Slack, Teams, PagerDuty, ServiceNow, Jira',
      'Severity-based routing rules with custom escalation matrices',
      'On-call schedule integration with timezone-aware rotation',
      'Alert fatigue reduction with deduplication and suppression windows',
      'Delivery receipt tracking and failed notification retry logic',
    ],
    useCases: 'SOC Managers, DevOps On-Call, IT Operations',
    routeId: 'alert-notifications',
  },
  {
    id: 'analyst-leaderboard',
    title: 'Analyst Performance Leaderboard',
    category: 'SOC Gamification',
    categoryColor: '#fbbf24',
    icon: Trophy,
    accentColor: '#fbbf24',
    tagline: 'Gamified SOC Analyst KPI Tracking & Performance Excellence Scoring',
    description:
      'Gamified analyst performance dashboard that scores and ranks SOC analysts based on alerts resolved, MTTR, detection quality, and hunting playbooks executed. Drives healthy competition, identifies high performers for promotion, and surfaces training opportunities for underperformers.',
    benefits: [
      'Real-time analyst ranking by alerts closed, MTTR, and accuracy rate',
      'Achievement badges: "Zero-Day Hunter", "MTTR Champion", "IR Expert"',
      'Weekly/monthly performance trends with manager export capability',
      'Training gap identification for analysts scoring below baseline',
      'Team-level KPI rollup for management security program reporting',
    ],
    useCases: 'SOC Managers, Security Program Leaders, HR & Training Teams',
    routeId: 'analyst-leaderboard',
  },
  {
    id: 'compliance-reports',
    title: 'Boardroom PDF & Audit Suite',
    category: 'GRC & Compliance',
    categoryColor: '#34d399',
    icon: FileSpreadsheet,
    accentColor: '#34d399',
    tagline: 'Executive-Ready Compliance Reports & Automated Audit Evidence Export',
    description:
      'One-click generation of board-ready compliance reports, SOC 2 Type II evidence packages, ISO 27001 audit bundles, and CISO security posture summaries. Supports PDF, DOCX, and XLSX formats with customizable executive branding and appendix sections.',
    benefits: [
      'One-click report generation: ISO 27001, SOC 2, PCI-DSS, HIPAA, NIST',
      'Branded PDF/DOCX reports with executive summary and risk heat maps',
      'Automated evidence collection from SIEM, SOAR, and scanning modules',
      'Board-level KPI dashboard with YoY security posture trend charts',
      'Scheduled automated report delivery to stakeholder email distribution lists',
    ],
    useCases: 'CISO, Compliance Officers, Internal Audit, Board of Directors',
    routeId: 'compliance-reports',
  },
  {
    id: 'zero-trust-iam',
    title: 'Zero-Trust IAM & RBAC Clearance',
    category: 'Identity & Access Management',
    categoryColor: '#60a5fa',
    icon: KeyRound,
    accentColor: '#60a5fa',
    tagline: 'Adaptive Identity Verification, Least-Privilege RBAC & Anomaly Scoring',
    description:
      'Continuous identity verification platform implementing zero-trust principles. Evaluates every access request against user behavior baseline, device health, network location, and resource sensitivity. Automatically elevates MFA requirements and restricts access on anomaly detection.',
    benefits: [
      'Continuous risk-based identity scoring for every access request',
      'RBAC policy enforcement with least-privilege auto-recommendation',
      'Behavioral anomaly detection: impossible travel, off-hours access',
      'Privileged Account Management (PAM) with session recording',
      'SCIM provisioning integration with Azure AD, Okta, and Google Workspace',
    ],
    useCases: 'IAM Engineers, Security Architects, IT Administrators',
    routeId: 'zero-trust-iam',
  },
  {
    id: 'soc-operations',
    title: 'SIEM Telemetry Analytics',
    category: 'SIEM Analytics',
    categoryColor: '#22d3ee',
    icon: Database,
    accentColor: '#22d3ee',
    tagline: 'Real-Time Syslog Stream, Event Correlation & SIEM Dashboard Analytics',
    description:
      'Real-time SIEM analytics platform with live syslog streaming, event correlation dashboards, and interactive query interfaces. Visualizes log ingestion rates, correlation rule hit counts, top event sources, and anomaly detection insights across your entire infrastructure.',
    benefits: [
      'Live syslog stream with real-time filtering by severity and source',
      'Event correlation engine with 300+ pre-built correlation rules',
      'Top event sources dashboard with outlier anomaly detection',
      'Log ingestion rate monitoring with backpressure alerting',
      'Custom KQL/SPL query interface for ad-hoc investigation',
    ],
    useCases: 'SIEM Engineers, SOC Analysts, Log Management Administrators',
    routeId: 'soc-operations',
  },
  {
    id: 'soar',
    title: 'GRC Automation Playbooks',
    category: 'Orchestration & Automation',
    categoryColor: '#fbbf24',
    icon: Zap,
    accentColor: '#fbbf24',
    tagline: 'Zero-Touch Security Orchestration & Automated Response Workflows',
    description:
      'Automated response engine that executes multi-step security playbooks for ransomware isolation, phishing containment, compromised credential revocation, and rogue container neutralization. Visual no-code playbook builder with trigger → condition → action workflow syntax.',
    benefits: [
      'Sub-second automated threat containment with zero human intervention',
      'Visual no-code playbook builder with trigger-condition-action syntax',
      'Library of 50+ pre-built playbooks for common attack scenarios',
      'Comprehensive execution audit logs with rollback and dry-run mode',
      'API integration with ServiceNow, Jira, and custom REST endpoints',
    ],
    useCases: 'SOAR Engineers, SOC Managers, Automation Teams',
    routeId: 'soar',
  },
  {
    id: 'compliance',
    title: 'Compliance Control Center',
    category: 'GRC & Compliance',
    categoryColor: '#2dd4bf',
    icon: ScrollText,
    accentColor: '#2dd4bf',
    tagline: 'Continuous Compliance Scoring, Gap Analysis & Control Evidence Mapping',
    description:
      'Continuous compliance monitoring platform that automatically maps security controls to regulatory frameworks, scores compliance posture, identifies control gaps, and assigns remediation tasks to owners. Supports automated evidence collection for audit readiness.',
    benefits: [
      'Continuous scoring against ISO 27001, SOC 2, PCI-DSS 4.0, HIPAA, NIST',
      'Automated control evidence collection from integrated security tools',
      'Gap analysis with prioritized remediation task assignments',
      'Risk register with treatment plans and control owner tracking',
      'Audit-ready evidence packages exportable to auditor portals',
    ],
    useCases: 'GRC Analysts, Compliance Officers, Internal & External Auditors',
    routeId: 'compliance',
  },
  {
    id: 'executive',
    title: 'Executive CISO Dashboard',
    category: 'Executive Reporting',
    categoryColor: '#34d399',
    icon: ShieldCheck,
    accentColor: '#34d399',
    tagline: 'Board-Level Security Posture, Risk KPIs & Business Impact Reporting',
    description:
      'Executive-grade security dashboard designed for CISOs and board members with zero technical jargon. Translates cyber risk into business impact: cost avoidance, regulatory exposure, and ROI on security investments. Features drill-down from KPI to incident detail.',
    benefits: [
      'Business language risk reporting: revenue exposure, regulatory fines',
      'Security program ROI calculation with cost-per-incident metrics',
      'Peer industry benchmarking for security maturity comparison',
      'Quarterly trend analysis with YoY security improvement tracking',
      'Customizable KPI tiles for board-specific metric priorities',
    ],
    useCases: 'CISO, CFO, Board of Directors, Risk Committee',
    routeId: 'executive',
  },
  {
    id: 'reports',
    title: 'Security Reports & BI',
    category: 'Analytics & Business Intelligence',
    categoryColor: '#60a5fa',
    icon: BarChart3,
    accentColor: '#60a5fa',
    tagline: 'Advanced Security Business Intelligence, Trend Analysis & Custom Reports',
    description:
      'Powerful security analytics and business intelligence platform with pre-built report templates, custom dashboard builder, scheduled report distribution, and interactive data exploration. Covers threat trends, vulnerability aging, analyst performance, and compliance posture over time.',
    benefits: [
      'Pre-built report gallery: threat trends, vulnerability aging, SLA performance',
      'Custom dashboard builder with drag-and-drop widget configuration',
      'Scheduled report delivery via email, Slack, or webhook',
      'Threat trend forecasting using ML-based time-series models',
      'Data export to CSV, XLSX, PDF, or BI tools (Tableau, Power BI)',
    ],
    useCases: 'Security Analysts, SOC Managers, Business Stakeholders',
    routeId: 'reports',
  },
  {
    id: 'settings',
    title: 'System Configuration',
    category: 'Platform Administration',
    categoryColor: '#9ca3af',
    icon: Sliders,
    accentColor: '#9ca3af',
    tagline: 'Platform Preferences, API Integrations & Security Configuration Management',
    description:
      'Central configuration hub for the CyberShield platform covering API key management, notification preferences, theme settings, user profile, integration connections, audit log settings, and data retention policies. Supports SSO configuration with SAML 2.0 and OAuth 2.0.',
    benefits: [
      'Anthropic API key management for full AI Copilot LLM access',
      'Theme configuration: Dark Mode, Light Mode, and custom color palettes',
      'SAML 2.0 and OAuth 2.0 SSO configuration for enterprise identity providers',
      'API token management for external SIEM and SOAR integrations',
      'Data retention policy configuration for compliance requirements',
    ],
    useCases: 'Platform Administrators, CISO, IT Operations',
    routeId: 'settings',
  },
];

const FAQS = [
  {
    q: 'What is CyberShield Nexus and who is it built for?',
    a: 'CyberShield Nexus is an Enterprise-grade Next-Generation Security Operations Center (AI SOC) platform. It is engineered for SOC teams, MSSPs, Chief Information Security Officers (CISOs), and threat analysts who require real-time cyber situational awareness, autonomous incident containment, and AI-accelerated threat hunting. It consolidates 30+ specialized security tools into a single unified platform.',
  },
  {
    q: 'How does the AI Copilot work, and do I need an API key?',
    a: 'The AI Copilot operates in two modes: (1) Built-in offline heuristics engine that requires no API key and provides contextual security reasoning based on pre-trained cybersecurity knowledge, and (2) Full Anthropic Claude 3.5 Sonnet neural reasoning when you provide your own API key from console.anthropic.com. With a full API key, the Copilot can generate production-ready YARA rules, explain complex attack killchains, and dispatch autonomous containment actions.',
  },
  {
    q: 'How does the platform help organizations save time and reduce MTTR?',
    a: 'Traditional SOCs take an average of 4.2 hours to investigate and contain a breach. CyberShield Nexus reduces Mean Time to Detect (MTTD) to under 1.2 seconds through continuous SIEM correlation, and Mean Time to Respond (MTTR) to under 3 seconds via automated SOAR playbooks. This eliminates 95% of alert fatigue and can prevent millions in ransomware damages and regulatory fines.',
  },
  {
    q: 'What compliance frameworks are supported out of the box?',
    a: 'The platform provides continuous automated scoring, gap analysis, and 1-click audit report generation for: ISO/IEC 27001:2022, SOC 2 Type II, NIST Cybersecurity Framework (CSF) 2.0, PCI-DSS 4.0, HIPAA Security Rule, GDPR Article 32 Technical Measures, CIS Controls v8, and CMMC Level 2. Reports are exportable as branded PDF, DOCX, or XLSX formats.',
  },
  {
    q: 'How does the 3D WebGL Threat Globe work technically?',
    a: 'The Threat Globe is built using Three.js WebGL with hardware-accelerated GLSL shaders. It renders over 3,200 procedural geographic vertices representing the Earth\'s landmass, real-time quadratic bezier attack arcs with animated photon pulses, rotating orbital defense satellite rings, and atmospheric glow halos — all without taxing CPU resources. Four premium visual themes are included: HOLO (cyan), MATRIX (green), SOLAR (gold), and ICE (blue).',
  },
  {
    q: 'Can CyberShield integrate with my existing SIEM (Splunk, Elastic, Sentinel)?',
    a: 'Yes. CyberShield Nexus provides native bi-directional integrations with Splunk Enterprise Security, Elastic SIEM (ELK Stack), Microsoft Sentinel, QRadar, and ArcSight. The platform can ingest logs via Syslog, REST API, STIX/TAXII 2.1, and AWS Kinesis. It can also export detection rules in Splunk SPL, Elastic KQL, and Microsoft Sentinel Analytics Rule formats.',
  },
  {
    q: 'How is access and authentication managed for enterprise teams?',
    a: 'The platform supports enterprise SSO via SAML 2.0 and OAuth 2.0, integrating with Azure AD, Okta, Google Workspace, and Ping Identity. Role-based access control (RBAC) is managed through the Zero-Trust IAM module with least-privilege enforcement. User sessions are protected by configurable MFA, session timeout policies, and anomalous login behavioral detection.',
  },
];

const STATS = [
  { value: '< 1.2s', label: 'Mean Time to Detect', color: '#00f0ff', icon: Clock },
  { value: '99.98%', label: 'AI Detection Accuracy', color: '#00ff88', icon: Star },
  { value: '1,420+', label: 'Worldwide SOC Sensors', color: '#a78bfa', icon: Server },
  { value: '30+', label: 'Security Modules', color: '#fbbf24', icon: Shield },
  { value: '50K+', label: 'Events / Second', color: '#f87171', icon: Activity },
  { value: 'Zero-Touch', label: 'SOAR Playbooks', color: '#34d399', icon: Zap },
];



/* ─────────────────────────────── COMPONENT ──────────────────────────────── */

export default function PlatformOverview() {
  const { setSelectedView, themeMode } = useApp();
  const isLight = themeMode === 'light';

  const [activeCategory, setActiveCategory] = useState('All Modules');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLaunchModule = (routeId: string) => {
    soundService.playSuccessBeep();
    setSelectedView(routeId);
  };

  // Filter modules
  const filteredModules = ALL_MODULES.filter((m) => {
    const matchCat = activeCategory === 'All Modules' || m.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Get unique categories from actual data
  const usedCategories = ['All Modules', ...Array.from(new Set(ALL_MODULES.map((m) => m.category))).sort()];

  return (
    <div
      className={`flex-1 overflow-y-auto overflow-x-hidden ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#030712] text-gray-100'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 pb-20">

        {/* ══════════════════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════════════════ */}
        <div className={`relative rounded-3xl overflow-hidden p-8 md:p-14 shadow-2xl border ${
          isLight
            ? 'bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-700 border-cyan-400/40'
            : 'bg-gradient-to-br from-[#030d1f] via-[#050f24] to-[#040a1a] border-cyan-500/25'
        }`}>
          {/* Ambient background glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-300/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-[130px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 border border-white/30 text-white text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Enterprise AI-Powered Cybersecurity Operating System</span>
              <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 text-[9px] border border-emerald-300/30">
                v2.6 PRO
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-none mb-6">
              CyberShield{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-indigo-200">
                Nexus
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-100 tracking-wide">
                AI SOC Platform — Complete Guide
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-base md:text-xl text-blue-100/90 leading-relaxed max-w-4xl mb-8">
              <strong className="text-cyan-200">CyberShield Nexus</strong> is a unified next-generation
              cybersecurity command ecosystem with <strong className="text-white">30+ specialized security modules</strong>.
              From real-time threat detection and AI-powered autonomous response to compliance reporting and executive dashboards —
              every tool your SOC team needs in one platform.
            </p>

            {/* Key stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="p-3.5 rounded-2xl bg-white/15 border border-white/25 flex flex-col items-center text-center hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <Icon className="w-4 h-4 mb-1.5 text-white/80" />
                    <p className="text-lg sm:text-xl font-black font-mono text-white">
                      {s.value}
                    </p>
                    <p className="text-[9px] text-blue-100/70 uppercase font-mono tracking-wider leading-tight mt-0.5">
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleLaunchModule('command-center')}
                className="px-6 py-3.5 rounded-2xl bg-white text-indigo-700 hover:bg-blue-50 font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl cursor-pointer transition-all hover:scale-105"
              >
                <Activity className="w-4 h-4" />
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLaunchModule('threat-globe')}
                className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105 backdrop-blur-sm"
              >
                <Globe className="w-4 h-4" />
                <span>3D Threat Globe</span>
              </button>
              <button
                onClick={() => handleLaunchModule('ai-copilot')}
                className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105 backdrop-blur-sm"
              >
                <Bot className="w-4 h-4" />
                <span>AI Copilot</span>
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            HOW IT WORKS — 5-STAGE PIPELINE
        ══════════════════════════════════════════════════════════════════ */}
        <div>
          <div className="text-center mb-8">
            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-3 border ${
              isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              Architecture
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              End-to-End Cyber Defense Pipeline
            </h2>
            <p className={`text-sm mt-2 max-w-2xl mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              How raw network packets become autonomous containment actions and executive audit reports in under 3 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-0 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-500/20 via-indigo-500/40 to-purple-500/20" />

            {[
              {
                step: '01', label: 'INGEST', title: 'Multi-Source Telemetry',
                desc: 'Syslog, AWS CloudTrail, EDR telemetry, PCAP & NetFlow from 1,420+ sensor nodes worldwide.',
                color: '#00f0ff', icon: Database,
              },
              {
                step: '02', label: 'CORRELATE', title: 'AI Neural Engine',
                desc: 'Anthropic Claude AI correlates signals against MITRE ATT&CK killchains in milliseconds.',
                color: '#818cf8', icon: Cpu,
              },
              {
                step: '03', label: 'VISUALIZE', title: '3D WebGL Triage',
                desc: 'Attacks render in 3D WebGL with geographic attribution, actor profiling & blast radius.',
                color: '#34d399', icon: Globe,
              },
              {
                step: '04', label: 'CONTAIN', title: 'SOAR Orchestration',
                desc: 'Zero-touch playbooks isolate hosts, ban IPs on perimeter firewalls, revoke tokens.',
                color: '#fb923c', icon: Zap,
              },
              {
                step: '05', label: 'AUDIT', title: 'GRC & Compliance',
                desc: 'Generates ISO 27001 / SOC 2 audit reports, executive summaries, and immutable evidence logs.',
                color: '#a78bfa', icon: FileText,
              },
            ].map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.step} className="relative flex flex-col items-center text-center p-5">
                  {/* Step circle */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-xl"
                    style={{
                      backgroundColor: `${stage.color}15`,
                      border: `2px solid ${stage.color}40`,
                      boxShadow: `0 0 30px ${stage.color}20`,
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: stage.color }} />
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black font-mono border"
                      style={{
                        backgroundColor: stage.color,
                        color: '#030712',
                        borderColor: stage.color,
                      }}
                    >
                      {stage.step}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono font-black uppercase tracking-widest mb-1.5"
                    style={{ color: stage.color }}
                  >
                    {stage.label}
                  </span>
                  <h4 className={`text-sm font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {stage.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ALL MODULES — COMPLETE CAPABILITIES MATRIX
        ══════════════════════════════════════════════════════════════════ */}
        <div>
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-3 border ${
                isLight ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              }`}>
                All {ALL_MODULES.length} Modules
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Complete Platform Capabilities
              </h2>
              <p className={`text-sm mt-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Click any module card to expand full details, benefits, and use cases. Click "Launch" to open that module.
              </p>
            </div>

            {/* Search */}
            <div className={`relative flex-shrink-0 w-full sm:w-64 ${isLight ? '' : ''}`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none font-mono transition-all ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-400'
                    : 'bg-black/60 border-white/10 text-slate-200 placeholder-slate-600 focus:border-cyan-500/50'
                }`}
              />
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap mb-6">
            {usedCategories.map((cat) => {
              const count = cat === 'All Modules' ? ALL_MODULES.length : ALL_MODULES.filter((m) => m.category === cat).length;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? isLight
                        ? 'bg-cyan-600 text-white border border-cyan-600 shadow-md'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/20'
                      : isLight
                        ? 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                        : 'bg-black/40 text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/15'
                  }`}
                >
                  {cat}
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                    isActive
                      ? isLight ? 'bg-white/20 text-white' : 'bg-white/10 text-cyan-200'
                      : isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <p className={`text-xs font-mono mb-4 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            Showing <strong className={isLight ? 'text-slate-700' : 'text-slate-300'}>{filteredModules.length}</strong> of{' '}
            {ALL_MODULES.length} modules
            {searchQuery && (
              <> for "<strong className={isLight ? 'text-cyan-700' : 'text-cyan-400'}>{searchQuery}</strong>"</>
            )}
          </p>

          {/* Module cards grid */}
          {filteredModules.length === 0 ? (
            <div className={`text-center py-20 rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-white/5 bg-black/20'}`}>
              <Search className={`w-10 h-10 mx-auto mb-3 ${isLight ? 'text-slate-300' : 'text-slate-700'}`} />
              <p className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>No modules found</p>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredModules.map((mod) => {
                const Icon = mod.icon;
                const isExpanded = expandedModule === mod.id;
                return (
                  <div
                    key={mod.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${
                      isLight
                        ? `bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md ${isExpanded ? 'shadow-lg' : ''}`
                        : `bg-[#070e1d] border-white/8 hover:border-white/15 ${isExpanded ? 'border-white/20' : ''}`
                    }`}
                    style={{
                      borderTopColor: isExpanded ? mod.accentColor : undefined,
                      borderTopWidth: isExpanded ? '2px' : undefined,
                    }}
                  >
                    {/* Card Header — always visible */}
                    <button
                      className="w-full text-left p-5 cursor-pointer"
                      onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Icon */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: `${mod.accentColor}15`,
                            border: `1px solid ${mod.accentColor}30`,
                            color: mod.accentColor,
                            boxShadow: `0 0 20px ${mod.accentColor}10`,
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Title block */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-lg font-mono font-bold uppercase tracking-wider"
                              style={{
                                backgroundColor: `${mod.accentColor}12`,
                                color: mod.accentColor,
                                border: `1px solid ${mod.accentColor}25`,
                              }}
                            >
                              {mod.category}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180' : ''
                              } ${isLight ? 'text-slate-400' : 'text-slate-500'}`}
                            />
                          </div>
                          <h3 className={`text-sm font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {mod.title}
                          </h3>
                          <p className="text-[11px] mt-0.5 font-mono leading-snug" style={{ color: mod.accentColor }}>
                            {mod.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Short description — always visible */}
                      <p className={`text-xs mt-3 leading-relaxed line-clamp-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {mod.description}
                      </p>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className={`px-5 pb-5 space-y-4 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                        {/* Full description */}
                        <div className="pt-4">
                          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            {mod.description}
                          </p>
                        </div>

                        {/* Benefits */}
                        <div>
                          <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-2.5 ${
                            isLight ? 'text-slate-500' : 'text-slate-500'
                          }`}>
                            ✦ Key Features & Capabilities
                          </p>
                          <div className="space-y-1.5">
                            {mod.benefits.map((b, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-xs">
                                <CheckCircle2
                                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                  style={{ color: mod.accentColor }}
                                />
                                <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Use cases */}
                        <div className={`p-3 rounded-xl ${
                          isLight ? 'bg-slate-50 border border-slate-100' : 'bg-black/30 border border-white/5'
                        }`}>
                          <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-1 ${
                            isLight ? 'text-slate-500' : 'text-slate-500'
                          }`}>
                            Best For
                          </p>
                          <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            {mod.useCases}
                          </p>
                        </div>

                        {/* Launch button */}
                        <button
                          onClick={() => handleLaunchModule(mod.routeId)}
                          className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110 hover:scale-[1.02]"
                          style={{
                            background: `linear-gradient(135deg, ${mod.accentColor}20, ${mod.accentColor}10)`,
                            border: `1px solid ${mod.accentColor}40`,
                            color: mod.accentColor,
                          }}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          Launch {mod.title}
                        </button>
                      </div>
                    )}

                    {/* Always-visible quick launch (collapsed) */}
                    {!isExpanded && (
                      <div className={`px-5 pb-4 mt-auto border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                        <div className="flex items-center justify-between pt-3">
                          <button
                            onClick={() => setExpandedModule(mod.id)}
                            className={`text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors ${
                              isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <ChevronRight className="w-3 h-3" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleLaunchModule(mod.routeId)}
                            className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                            style={{
                              background: `${mod.accentColor}15`,
                              border: `1px solid ${mod.accentColor}35`,
                              color: mod.accentColor,
                            }}
                          >
                            Launch
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            KEY BENEFITS — WHY CYBERSHIELD?
        ══════════════════════════════════════════════════════════════════ */}
        <div>
          <div className="text-center mb-8">
            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-3 border ${
              isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              Why Choose CyberShield?
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Strategic Enterprise Advantages
            </h2>
            <p className={`text-sm mt-2 max-w-2xl mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Why leading SOC teams, MSSPs, and CISOs choose CyberShield Nexus over legacy SIEM tools and point solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                color: '#00f0ff', icon: Zap, title: 'Sub-Second Automated Defense',
                desc: 'Legacy tools alert humans after attackers have already lateralized. CyberShield SOAR automatically isolates infected machines, drops C2 connections on edge firewalls, and revokes compromised tokens in milliseconds — before damage spreads.',
                points: ['Eliminates 95% of manual alert triage fatigue', 'Zero-delay ransomware isolation playbooks', 'MTTR reduced from 4.2 hours to under 3 seconds'],
              },
              {
                color: '#a78bfa', icon: Brain, title: 'Anthropic Claude AI Copilot',
                desc: 'Turn junior analysts into Tier-3 threat hunters overnight. The embedded AI Copilot ingests raw logs, synthesizes bespoke YARA detection signatures on demand, and explains sophisticated attack killchains in plain English.',
                points: ['Instant YARA rule generation for any malware family', 'Deep log correlation across 2,400+ endpoints', 'Natural language threat hunting with no query syntax required'],
              },
              {
                color: '#34d399', icon: TrendingUp, title: 'Full Situational Awareness',
                desc: 'See cyber attacks unfold in real-time across the planet. Our 3D WebGL Threat Globe and 2D vector maps provide instant visual intelligence on attack vectors, geographic attribution, and targeted infrastructure.',
                points: ['Live ballistic photon attack trajectory arcs on 3D globe', '1-Click geographic IP range isolation from globe view', '40+ global threat intelligence feed aggregation'],
              },
              {
                color: '#fbbf24', icon: FileText, title: 'Audit-Ready Compliance',
                desc: 'Stop scrambling before audit time. CyberShield continuously collects evidence, monitors control effectiveness, and generates board-ready compliance reports for ISO 27001, SOC 2, PCI-DSS, HIPAA, and NIST CSF in one click.',
                points: ['5 major frameworks with continuous automated scoring', '1-Click audit evidence package generation', 'Executive PDF reports with branded company templates'],
              },
              {
                color: '#f87171', icon: Shield, title: 'Unified Single Pane of Glass',
                desc: 'Eliminate tool sprawl. CyberShield replaces 15+ point solutions — SIEM, SOAR, vulnerability scanner, endpoint management, threat intel platform, compliance tool — with one deeply integrated platform.',
                points: ['30+ security modules in a single unified interface', 'No context switching between disconnected tools', 'Shared data model with cross-module correlation'],
              },
              {
                color: '#67e8f9', icon: Award, title: 'Enterprise-Grade Scalability',
                desc: 'Built for the largest enterprises with 100,000+ endpoints across multiple geographies and compliance jurisdictions. Handles 50,000+ events per second with sub-millisecond correlation latency and 99.99% uptime SLA.',
                points: ['Supports 100,000+ endpoints per deployment', '50K events/second ingestion with sub-ms correlation', 'Multi-tenant MSSP mode with white-label reporting'],
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`p-6 rounded-2xl border transition-all group hover:scale-[1.01] ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                      : 'bg-[#070e1d] border-white/8 hover:border-white/15'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}30`, color: card.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-base font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {card.title}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {card.desc}
                  </p>
                  <div className={`space-y-1.5 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                    {card.points.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: card.color }} />
                        <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            FAQ SECTION
        ══════════════════════════════════════════════════════════════════ */}
        <div className={`p-6 md:p-10 rounded-3xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#070e1d] border-white/8'
        }`}>
          <div className="flex items-center gap-3 border-b pb-5 mb-5 ${isLight ? 'border-slate-100' : 'border-white/8'}">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-cyan-50 border border-cyan-200 text-cyan-700' : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
            }`}>
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Frequently Asked Questions
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                Architecture, integrations, AI capabilities, and compliance frameworks explained.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    isLight
                      ? isOpen ? 'bg-cyan-50 border-cyan-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : isOpen ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className={`text-sm font-bold flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <span
                        className="text-[10px] font-black font-mono px-2 py-0.5 rounded"
                        style={{ backgroundColor: isLight ? '#e0f7fa' : '#0e3a4a', color: '#00f0ff' }}
                      >
                        Q{idx + 1}
                      </span>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-cyan-400' : isLight ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className={`px-4 pb-4 border-t text-sm leading-relaxed ${
                      isLight ? 'border-cyan-200 text-slate-600 pt-3' : 'border-cyan-500/20 text-slate-300 pt-3'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            BOTTOM CTA
        ══════════════════════════════════════════════════════════════════ */}
        <div
          className={`relative p-10 rounded-3xl overflow-hidden text-center shadow-2xl border ${
            isLight
              ? 'bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-700 border-cyan-400/40'
              : 'border-cyan-400/25'
          }`}
          style={isLight ? {} : { background: 'linear-gradient(135deg, #030d1f 0%, #05122a 50%, #060a1e 100%)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-300/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="flex justify-center mb-4">
              <Shield className="w-14 h-14 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Secure Your Enterprise?
            </h3>
            <p className={`text-sm leading-relaxed max-w-xl mx-auto ${
              isLight ? 'text-blue-100/90' : 'text-slate-400'
            }`}>
              All 30+ security modules are active and ready. Start investigating live global telemetry,
              simulating attack vectors, and dispatching AI autonomous containment today.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                onClick={() => handleLaunchModule('command-center')}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl transition-all cursor-pointer hover:scale-105 ${
                  isLight
                    ? 'bg-white text-indigo-700 hover:bg-blue-50'
                    : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-cyan-500/25'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Go To Command Center</span>
              </button>
              <button
                onClick={() => handleLaunchModule('ai-copilot')}
                className="px-8 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105 backdrop-blur-sm"
              >
                <Bot className="w-4 h-4" />
                <span>Launch AI Copilot</span>
              </button>
              <button
                onClick={() => handleLaunchModule('settings')}
                className="px-8 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105 backdrop-blur-sm"
              >
                <Sliders className="w-4 h-4" />
                <span>Configure Platform</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
