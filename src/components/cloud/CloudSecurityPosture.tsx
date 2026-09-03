import { useState } from 'react';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { Cloud, CheckCircle2, RefreshCw } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface CloudFinding {
  id: string;
  provider: 'AWS' | 'AZURE' | 'GCP' | 'KUBERNETES';
  title: string;
  resource: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN' | 'REMEDIATED';
  description: string;
}

const SAMPLE_FINDINGS: CloudFinding[] = [
  { id: 'CSPM-101', provider: 'AWS', title: 'Public S3 Bucket Policy Exposure', resource: 's3://cybershield-finance-backups', severity: 'CRITICAL', status: 'OPEN', description: 'S3 bucket policy grants wildcard Principal READ permissions to external internet.' },
  { id: 'CSPM-102', provider: 'AZURE', title: 'Entra ID Unused Global Admin Account', resource: 'user:admin-backup@cybershield.onmicrosoft.com', severity: 'HIGH', status: 'OPEN', description: 'Global Administrator account has MFA disabled and 90+ days inactivity.' },
  { id: 'CSPM-103', provider: 'KUBERNETES', title: 'Privileged Container Pod Execution', resource: 'pod/prod-ingress-nginx-controller', severity: 'CRITICAL', status: 'OPEN', description: 'Pod spec enables securityContext.privileged = true without AppArmor profile.' },
  { id: 'CSPM-104', provider: 'GCP', title: 'Unencrypted Cloud SQL Database', resource: 'projects/cybershield/instances/db-prod-01', severity: 'HIGH', status: 'OPEN', description: 'Cloud SQL Postgres instance lacks Customer-Managed Encryption Key (CMEK).' },
];

export default function CloudSecurityPosture() {
  const [findings, setFindings] = useState<CloudFinding[]>(SAMPLE_FINDINGS);
  const [providerFilter, setProviderFilter] = useState('ALL');
  const [isScanning, setIsScanning] = useState(false);

  const handleRemediate = (id: string, title: string) => {
    soundService.playSuccessBeep();
    setFindings((prev) => prev.map((f) => f.id === id ? { ...f, status: 'REMEDIATED' } : f));
    alert(`Auto-Remediation Dispatched: [${title}] security policy applied.`);
  };

  const handleRunCloudScan = () => {
    soundService.playAlertAlarm();
    setIsScanning(true);
    setTimeout(() => {
      soundService.playSuccessBeep();
      setIsScanning(false);
      alert('Cloud Security Posture Scan Completed across AWS, Azure, GCP, and Kubernetes clusters.');
    }, 1800);
  };

  const filtered = findings.filter((f) => providerFilter === 'ALL' || f.provider === providerFilter);

  return (
    <ViewContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 font-mono">
        <SectionTitle
          title="Cloud Security Posture Management (CSPM)"
          subtitle="AWS, Azure, GCP, and Kubernetes cluster telemetry, misconfiguration auditing, and auto-remediation"
          icon={<Cloud className="w-6 h-6 text-indigo-400" />}
        />

        <button
          onClick={handleRunCloudScan}
          disabled={isScanning}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Auditing Cloud Clusters...' : 'Run CSPM Multi-Cloud Audit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-cyber-darker border border-indigo-500/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold">AWS Posture Score</p>
          <p className="text-xl font-bold text-indigo-400 mt-1">94% Compliant</p>
          <p className="text-[9px] text-gray-500">12 Accounts Monitored</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyber-darker border border-cyan-500/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Azure Security Score</p>
          <p className="text-xl font-bold text-cyan-300 mt-1">91% Compliant</p>
          <p className="text-[9px] text-gray-500">Entra ID Audit Active</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyber-darker border border-purple-500/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Kubernetes Policy</p>
          <p className="text-xl font-bold text-purple-300 mt-1">88% Compliant</p>
          <p className="text-[9px] text-gray-500">6 Clusters Monitored</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyber-darker border border-red-500/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Open Misconfigurations</p>
          <p className="text-xl font-bold text-red-400 mt-1">{findings.filter(f => f.status === 'OPEN').length} Urgent</p>
          <p className="text-[9px] text-gray-500">Auto-Remediation Ready</p>
        </div>
      </div>

      <CyberPanel title="Cloud Infrastructure Misconfiguration Feed" icon={<Cloud className="w-4 h-4 text-indigo-400" />}>
        <div className="p-4 space-y-3 font-mono text-xs">
          
          <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-2">
            {['ALL', 'AWS', 'AZURE', 'GCP', 'KUBERNETES'].map((p) => (
              <button
                key={p}
                onClick={() => setProviderFilter(p)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  providerFilter === p
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400'
                    : 'bg-black/60 text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filtered.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl bg-black/80 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                      [{f.provider}] {f.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px] uppercase border border-red-500/30">
                      {f.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-100">{f.title}</h4>
                  <p className="text-[11px] text-indigo-300 truncate">{f.resource}</p>
                  <p className="text-[10px] text-gray-400">{f.description}</p>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  {f.status === 'OPEN' ? (
                    <button
                      onClick={() => handleRemediate(f.id, f.title)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-cyber-dark font-bold text-xs uppercase shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Auto-Remediate</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Remediated</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </CyberPanel>
    </ViewContainer>
  );
}
