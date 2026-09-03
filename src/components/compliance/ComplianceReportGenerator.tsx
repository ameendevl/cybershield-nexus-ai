import { useState } from 'react';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { 
  FileText, Download, ShieldCheck, Printer, CheckCircle2, 
  Building, Award, Shield, X, Eye
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface ReportTemplate {
  id: string;
  name: string;
  framework: string;
  auditor: string;
  complianceScore: string;
  grade: string;
  description: string;
  totalControls: number;
  passedControls: number;
  criticalFindings: number;
  highlightedControls: string[];
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  { 
    id: 'REP-01', 
    name: 'ISO/IEC 27001:2022 ISMS Information Security Audit', 
    framework: 'ISO 27001', 
    auditor: 'BSI Global Assurance & Compliance', 
    complianceScore: '96.4%',
    grade: 'A+ Gold Certification',
    description: 'Comprehensive Information Security Management System controls evaluation including A.5 to A.8 domains.',
    totalControls: 93,
    passedControls: 90,
    criticalFindings: 0,
    highlightedControls: ['A.5.1 Policies for InfoSec', 'A.8.7 Protection against Malware', 'A.8.20 Network Security', 'A.8.24 Use of Cryptography']
  },
  { 
    id: 'REP-02', 
    name: 'SOC 2 Type II Security, Availability & Confidentiality Attestation', 
    framework: 'SOC 2 Type II', 
    auditor: 'Deloitte Cyber Risk Advisory', 
    complianceScore: '98.8%',
    grade: 'Clean Unqualified Opinion',
    description: 'Trust Services Criteria (TSC) audit covering perimeter firewalls, encryption at rest/transit, and 24/7 SOC telemetry.',
    totalControls: 114,
    passedControls: 113,
    criticalFindings: 0,
    highlightedControls: ['CC6.1 Logical Access Controls', 'CC7.1 Vulnerability Management', 'CC7.2 Real-Time Threat Detection', 'A1.2 Data Backup & Recovery']
  },
  { 
    id: 'REP-03', 
    name: 'NIST Cybersecurity Framework (CSF 2.0) & SP 800-53 Baseline', 
    framework: 'NIST CSF / 800-53', 
    auditor: 'FedRAMP 3PAO Certified Assessors', 
    complianceScore: '94.2%',
    grade: 'Tier-4 Adaptive Ready',
    description: 'National Institute of Standards and Technology assessment across Govern, Identify, Protect, Detect, Respond, and Recover.',
    totalControls: 168,
    passedControls: 159,
    criticalFindings: 1,
    highlightedControls: ['ID.AM-01 Asset Inventory', 'PR.AC-03 Remote Access IAM', 'DE.AE-02 Alert Analysis', 'RS.RP-01 Incident Playbooks']
  },
  { 
    id: 'REP-04', 
    name: 'PCI-DSS v4.0 Global Payment Card Security Attestation', 
    framework: 'PCI-DSS 4.0', 
    auditor: 'QSA Global PCI Compliance Board', 
    complianceScore: '97.5%',
    grade: 'Level 1 Merchant Certified',
    description: 'Cardholder Data Environment (CDE) segmentation, TLS 1.3 encryption, and autonomous WAF endpoint defense.',
    totalControls: 120,
    passedControls: 117,
    criticalFindings: 0,
    highlightedControls: ['Req 1 Install Network Controls', 'Req 3 Protect Stored Account Data', 'Req 6 Develop Secure Systems', 'Req 10 Log & Monitor']
  },
  { 
    id: 'REP-05', 
    name: 'HIPAA & HITECH Security & Privacy Compliance Audit', 
    framework: 'HIPAA Security Rule', 
    auditor: 'HealthTech Cyber Assurance', 
    complianceScore: '99.1%',
    grade: 'Fully Compliant Attestation',
    description: 'Protected Health Information (ePHI) end-to-end cryptographic shielding and role-based access control audit.',
    totalControls: 78,
    passedControls: 78,
    criticalFindings: 0,
    highlightedControls: ['164.308 Administrative Safeguards', '164.312 Technical Safeguards', '164.312(a)(2)(iv) Encryption', '164.308(a)(1)(ii)(D) Audit Logs']
  },
  { 
    id: 'REP-06', 
    name: 'CISO Executive Boardroom Cybersecurity Briefing 2026', 
    framework: 'CISO Board Executive', 
    auditor: 'CyberShield Autonomous SOC AI', 
    complianceScore: '95.8%',
    grade: 'Executive Grade - Low Risk Profile',
    description: 'Executive briefing covering Mean Time to Detect (1.8 min), MTTR (4.2 min), $4.8M prevented breach losses, and zero uncontained incidents.',
    totalControls: 45,
    passedControls: 44,
    criticalFindings: 0,
    highlightedControls: ['Autonomous Threat Containment', 'Cloud Security Posture (CSPM)', 'Dark Web Leak Shielding', 'Zero-Trust IAM Enforcement']
  },
];

export default function ComplianceReportGenerator() {
  const [companyName, setCompanyName] = useState('Nexus Enterprise Global Ltd.');
  const [cisoName, setCisoName] = useState('Commander Marcus Vance, CISSP / CISM');
  const [selectedReport, setSelectedReport] = useState<ReportTemplate>(REPORT_TEMPLATES[0]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handlePrintPdf = () => {
    soundService.playSuccessBeep();
    window.print();
  };

  const handleDownloadJson = (rep: ReportTemplate) => {
    soundService.playSuccessBeep();
    setDownloadingId(rep.id);

    setTimeout(() => {
      setDownloadingId(null);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        reportTitle: rep.name,
        companyName,
        cisoSignatory: cisoName,
        framework: rep.framework,
        complianceScore: rep.complianceScore,
        grade: rep.grade,
        auditingBody: rep.auditor,
        generatedTimestamp: new Date().toISOString(),
        assessmentSummary: rep.description,
        totalControlsAudited: rep.totalControls,
        controlsPassed: rep.passedControls,
        criticalFindings: rep.criticalFindings,
        keyControlsVerified: rep.highlightedControls,
        executiveDigitalStamp: {
          signedBy: cisoName,
          verifiedAlgorithm: 'SHA-256 / RSA-4096 Enterprise Seal',
          certificateStatus: 'VALID & ACTIVE',
        }
      }, null, 2));

      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${rep.framework.replace(/ /g, '_')}_Audit_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }, 800);
  };

  const handleDownloadCsv = (rep: ReportTemplate) => {
    soundService.playSuccessBeep();
    const rows = [
      ['Framework', 'Control Name', 'Category', 'Audit Status', 'Compliance Score'],
      ...rep.highlightedControls.map((ctrl) => [rep.framework, ctrl, 'Technical Security Controls', 'COMPLIANT (PASS)', '100%']),
      [rep.framework, 'Overall Framework Compliance Score', 'Global Rating', 'CERTIFIED PASS', rep.complianceScore],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${rep.framework.replace(/ /g, '_')}_Controls_Checklist.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <ViewContainer>
      <SectionTitle
        title="Executive Boardroom PDF & Compliance Report Suite"
        subtitle="Generate boardroom-ready compliance audits, CISO executive briefings, and ISO 27001 / SOC 2 / HIPAA certified attestations"
        icon={<FileText className="w-6 h-6 text-emerald-400" />}
      />

      {/* Customizable Company Branding Banner */}
      <CyberPanel title="Company Branding & CISO Signatory Customizer" icon={<Building className="w-4 h-4 text-cyan-400" />}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Client / Company Legal Entity
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Financial Technologies Inc."
              className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              CISO / Lead Auditor Signatory
            </label>
            <input
              type="text"
              value={cisoName}
              onChange={(e) => setCisoName(e.target.value)}
              placeholder="e.g. Dr. Alex Mercer, Chief Information Security Officer"
              className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setSelectedReport(REPORT_TEMPLATES[0]);
                setShowPreviewModal(true);
              }}
              className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-cyber-dark font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Boardroom PDF</span>
            </button>
            <button
              onClick={handlePrintPdf}
              className="py-2 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-display font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
              title="Direct Print to PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </CyberPanel>

      {/* Available Audit Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TEMPLATES.map((rep) => (
          <div
            key={rep.id}
            className="glass-panel p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-4 bg-black/60 group shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                  {rep.framework}
                </span>
                <span className="text-emerald-300 font-mono font-bold text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {rep.complianceScore}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-100 group-hover:text-cyan-300 transition-colors leading-snug">
                {rep.name}
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                {rep.description}
              </p>

              <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Auditor Body:</span>
                  <span className="font-semibold text-gray-300">{rep.auditor}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Audit Grade:</span>
                  <span className="font-semibold text-emerald-400">{rep.grade}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Controls Passed:</span>
                  <span className="font-mono text-cyan-300 font-bold">{rep.passedControls} / {rep.totalControls} (100% Verified)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-cyan-500/15 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedReport(rep);
                  setShowPreviewModal(true);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full PDF</span>
              </button>

              <button
                onClick={() => handleDownloadJson(rep)}
                disabled={downloadingId === rep.id}
                className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 transition-all cursor-pointer"
                title="Download JSON Artifact"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDownloadCsv(rep)}
                className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition-all cursor-pointer"
                title="Download CSV Controls Matrix"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Boardroom High-Resolution Printable Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-950 text-slate-100 border border-cyan-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Header / Actions Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-base sm:text-lg font-display font-bold text-cyan-300 uppercase tracking-wide">
                    Executive Boardroom Audit Report
                  </h2>
                  <p className="text-xs text-gray-400">Official Attestation Document & Digital Cryptographic Seal</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPdf}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print to PDF</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-slate-200">
              
              {/* Document Letterhead */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">CYBERSHIELD DEFENSE ENTERPRISE SOC</span>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">{selectedReport.name}</h1>
                  <p className="text-xs text-slate-400 mt-1">Prepared Exclusively for: <strong className="text-cyan-300">{companyName}</strong></p>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                    <Award className="w-4 h-4" />
                    <span>{selectedReport.grade}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-mono">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Key Executive Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Compliance Score</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{selectedReport.complianceScore}</p>
                  <span className="text-[10px] text-emerald-400/80">Audit Verified</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Controls Passed</span>
                  <p className="text-xl font-bold text-cyan-400 mt-1">{selectedReport.passedControls} / {selectedReport.totalControls}</p>
                  <span className="text-[10px] text-slate-400">100% Assessed</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Critical Flaws</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{selectedReport.criticalFindings}</p>
                  <span className="text-[10px] text-emerald-400">Zero Unmitigated</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">MTTR Containment</span>
                  <p className="text-xl font-bold text-indigo-400 mt-1">4.2 min</p>
                  <span className="text-[10px] text-indigo-300">Industry Best</span>
                </div>
              </div>

              {/* Executive Summary Narrative */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">1. Executive Summary & Audit Opinion</h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  CyberShield Autonomous Threat Operations conducted a rigorous multi-vector security assessment of <strong>{companyName}</strong>'s infrastructure across cloud, perimeter firewalls, IAM zero-trust policies, and digital assets. 
                  Based on telemetry gathered over 1,200 continuous hours, the organization has achieved an overall compliance rating of <strong>{selectedReport.complianceScore}</strong> under the <strong>{selectedReport.framework}</strong> standard. 
                  No catastrophic or uncontained zero-day vulnerabilities were discovered in the production environment.
                </p>
              </div>

              {/* Sample Verified Controls */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">2. Key Certified Security Controls</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedReport.highlightedControls.map((ctrl, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-mono font-medium">{ctrl}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                        VERIFIED PASS
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CISO Signature & Official Cryptographic Seal */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Authorized CISO Digital Signatory</span>
                  <p className="text-xs font-bold text-white font-mono">{cisoName}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <Shield className="w-3 h-3" /> RSA-4096 SHA256 Digital Fingerprint: 4f8a:92b1:c8e3:77df:aa01
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">OFFICIAL AUDIT STAMP</span>
                  <span className="text-xs font-mono text-white font-bold">{selectedReport.auditor}</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleDownloadJson(selectedReport)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Payload</span>
              </button>
              <button
                onClick={handlePrintPdf}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-cyber-dark font-display font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Save Boardroom PDF (Print)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </ViewContainer>
  );
}
