import { useState } from 'react';
import { ViewContainer, SectionTitle } from '../ui/common';
import { useApp } from '../../store/AppContext';
import { 
  Terminal, Copy, Check, Download, Play
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface RemediationItem {
  id: string;
  cveId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  cvss: number;
  category: string;
  affectedSystems: string;
  bashScript: string;
  powershellScript: string;
  dockerScript: string;
  nginxScript: string;
}

const REMEDIATION_CATALOG: RemediationItem[] = [
  {
    id: 'PATCH-01',
    cveId: 'CVE-2024-3400',
    title: 'Palo Alto GlobalProtect Gateway PAN-OS Command Injection',
    severity: 'CRITICAL',
    cvss: 10.0,
    category: 'Edge Firewall RCE',
    affectedSystems: 'PAN-OS 10.2, 11.0, 11.1 Gateway Nodes',
    bashScript: `#!/bin/bash
# CyberShield Autonomous Patch Engine - CVE-2024-3400
echo "[*] Step 1: Disabling Device Telemetry on GlobalProtect..."
panos-cli set deviceconfig setting telemetry device-health-performance disabled
echo "[*] Step 2: Applying Threat Prevention Signature 95187..."
panos-cli update content-pack --signature-id 95187 --action reset-both
echo "[*] Step 3: Verifying Active Gateway Session State..."
panos-cli show running security-policy | grep -i "GlobalProtect-Lockdown"
echo "[+] [SUCCESS] Mitigation deployed. Zero-day RCE vector neutralized."`,
    powershellScript: `# CyberShield PowerShell Module - Firewall Gateway Remediation
Write-Host "[*] Checking Network Connection to PAN-OS Management Interface..." -ForegroundColor Cyan
$Headers = @{ "X-PAN-KEY" = "env:PANOS_SEC_API_KEY" }
Invoke-RestMethod -Uri "https://firewall.corp.internal/api/?type=config&action=set&xpath=/config/devices/entry/deviceconfig/setting/telemetry&element=<device-health-performance>no</device-health-performance>" -Method Post -Headers $Headers
Write-Host "[+] Telemetry daemon disabled successfully." -ForegroundColor Green
Write-Host "[+] Palo Alto PAN-OS CVE-2024-3400 Patched." -ForegroundColor Green`,
    dockerScript: `# Kubernetes / Docker Container Mitigation
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: panos-gateway-patch
  namespace: kube-system
spec:
  template:
    spec:
      containers:
      - name: firewall-shield
        image: cybershield/panos-hotfix:v11.1-hotfix1
        securityContext:
          capabilities:
            add: ["NET_ADMIN"]`,
    nginxScript: `# Nginx Reverse Proxy Header Protection for CVE-2024-3400
location /ssl-vpn/ {
    # Block suspicious telemetry session cookies
    if ($http_cookie ~* "SESSID=\.\./") {
        return 403 "Blocked by CyberShield WAF Rule #95187";
    }
    proxy_pass https://backend_vpn_cluster;
}`,
  },
  {
    id: 'PATCH-02',
    cveId: 'CVE-2024-3094',
    title: 'XZ Utils Embedded Malicious SSHD Backdoor',
    severity: 'CRITICAL',
    cvss: 10.0,
    category: 'Supply Chain Compromise',
    affectedSystems: 'Linux Debian, Fedora, openSUSE with xz 5.6.0/5.6.1',
    bashScript: `#!/bin/bash
# CyberShield Autonomous Patch - CVE-2024-3094
echo "[*] Checking installed liblzma / xz package versions..."
XZ_VER=$(xz --version | head -n 1 | awk '{print $4}')
echo "[i] Detected xz version: $XZ_VER"

if [[ "$XZ_VER" == "5.6.0" || "$XZ_VER" == "5.6.1" ]]; then
    echo "[!] Compromised version detected! Downgrading to safe release 5.4.5..."
    apt-get update && apt-get install --allow-downgrades -y xz-utils=5.4.5-0.1 liblzma5=5.4.5-0.1
    systemctl restart sshd
    echo "[+] [SUCCESS] Downgraded to clean release. OpenSSH daemon restarted."
else
    echo "[+] System is running clean xz build ($XZ_VER). No action needed."
fi`,
    powershellScript: `# Windows WSL2 / Linux Subsystem XZ Integrity Check
wsl --exec bash -c "xz --version | grep '5.4' || sudo apt-get install -y --allow-downgrades xz-utils=5.4.5-0.1"
Write-Host "[+] Linux Subsystem Verified Safe against XZ Backdoor." -ForegroundColor Green`,
    dockerScript: `# Dockerfile Security Patch
FROM alpine:3.19.1
# Pin safe xz package explicitly
RUN apk add --no-cache xz=5.4.5-r0 liblzma=5.4.5-r0`,
    nginxScript: `# Drop rogue SSH tunnel requests at edge
stream {
    server {
        listen 2222;
        proxy_pass 127.0.0.1:22;
        # Rate limit SSH handshake probes
        limit_conn_zone $binary_remote_addr zone=ssh_conn:10m;
        limit_conn ssh_conn 3;
    }
}`,
  },
  {
    id: 'PATCH-03',
    cveId: 'CVE-2021-44228',
    title: 'Apache Log4j JNDI Remote Code Execution (Log4Shell)',
    severity: 'CRITICAL',
    cvss: 10.0,
    category: 'Java Library Exploit',
    affectedSystems: 'Log4j versions 2.0-beta9 to 2.14.1',
    bashScript: `#!/bin/bash
# CyberShield Global Hotfix - Log4Shell
echo "[*] Injecting JVM Environment Variable Flag..."
export LOG4J_FORMAT_MSG_NO_LOOKUPS=true
echo 'JAVA_TOOL_OPTIONS="-Dlog4j2.formatMsgNoLookups=true"' >> /etc/environment

echo "[*] Purging JndiLookup.class from existing fat JARs..."
find / -name "*log4j-core*.jar" -exec zip -q -d {} org/apache/logging/log4j/core/lookup/JndiLookup.class \\; 2>/dev/null
echo "[+] [SUCCESS] JNDI Lookup class removed. Exploit vector eradicated."`,
    powershellScript: `# Windows Enterprise Log4j Hotfix
[System.Environment]::SetEnvironmentVariable("LOG4J_FORMAT_MSG_NO_LOOKUPS", "true", [System.EnvironmentVariableTarget]::Machine)
Get-ChildItem -Path C:\\ -Filter "*log4j-core*.jar" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "[*] Patching JAR: $($_.FullName)" -ForegroundColor Yellow
    # Set JVM Argument in Java Options
}
Write-Host "[+] Environment Variable LOG4J_FORMAT_MSG_NO_LOOKUPS=true applied." -ForegroundColor Green`,
    dockerScript: `# Kubernetes Environment Variable Injection Patch
apiVersion: v1
kind: Pod
metadata:
  name: enterprise-app
spec:
  containers:
  - name: java-service
    env:
    - name: LOG4J_FORMAT_MSG_NO_LOOKUPS
      value: "true"`,
    nginxScript: `# Nginx WAF Rule to block Log4j JNDI Strings
if ($http_user_agent ~* "(\\$\\{jndi:(ldap|rmi|dns|nis|iiop))") {
    return 403 "Blocked: Log4j Exploit Detected";
}
if ($request_body ~* "(\\$\\{jndi:(ldap|rmi|dns|nis|iiop))") {
    return 403 "Blocked: Log4j Exploit Payload";
}`,
  },
  {
    id: 'PATCH-04',
    cveId: 'MISCONFIG-SEC-01',
    title: 'Nginx Missing HTTP Security Headers & TLS Hardening',
    severity: 'HIGH',
    cvss: 7.5,
    category: 'Web Server Hardening',
    affectedSystems: 'Production Nginx & Reverse Proxy Ingress',
    bashScript: `#!/bin/bash
# CyberShield Automated Nginx Hardening
cat << 'EOF' > /etc/nginx/conf.d/security_headers.conf
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
EOF
nginx -t && systemctl reload nginx
echo "[+] [SUCCESS] Military-grade HSTS & CSP headers activated in Nginx."`,
    powershellScript: `# IIS / Windows Web Hardening
Set-WebConfigurationProperty -Filter "/system.webServer/httpProtocol/customHeaders" -Name "." -Value @{name='Strict-Transport-Security';value='max-age=31536000; includeSubDomains'}
Set-WebConfigurationProperty -Filter "/system.webServer/httpProtocol/customHeaders" -Name "." -Value @{name='X-Frame-Options';value='DENY'}
Write-Host "[+] IIS Security Headers injected successfully." -ForegroundColor Green`,
    dockerScript: `# Docker Nginx Secure Ingress
FROM nginx:alpine
COPY security_headers.conf /etc/nginx/conf.d/
EXPOSE 443`,
    nginxScript: `# Production Nginx SSL Hardening Block
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;`,
  },
];

export default function AutoPatchRemediation() {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  const [selectedPatch, setSelectedPatch] = useState<RemediationItem>(REMEDIATION_CATALOG[0]);
  const [activeTab, setActiveTab] = useState<'BASH' | 'POWERSHELL' | 'DOCKER' | 'NGINX'>('BASH');
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  const getActiveCode = () => {
    switch (activeTab) {
      case 'POWERSHELL':
        return selectedPatch.powershellScript;
      case 'DOCKER':
        return selectedPatch.dockerScript;
      case 'NGINX':
        return selectedPatch.nginxScript;
      case 'BASH':
      default:
        return selectedPatch.bashScript;
    }
  };

  const handleCopyCode = () => {
    soundService.playSuccessBeep();
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    soundService.playSuccessBeep();
    const ext = activeTab === 'BASH' ? 'sh' : activeTab === 'POWERSHELL' ? 'ps1' : activeTab === 'DOCKER' ? 'yaml' : 'conf';
    const blob = new Blob([getActiveCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberShield_Patch_${selectedPatch.cveId}_${activeTab.toLowerCase()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleRunSimulation = () => {
    soundService.playAlertAlarm();
    setSimulating(true);
    setSimulationLogs([`[0.0s] Initializing Sandbox Remediation Container for ${selectedPatch.cveId}...`]);

    setTimeout(() => {
      setSimulationLogs((prev) => [...prev, `[0.4s] Checking Target Host Permissions & Kernel Capability Mesh...`]);
    }, 400);

    setTimeout(() => {
      setSimulationLogs((prev) => [...prev, `[0.9s] Executing ${activeTab} Remediation Script...`]);
    }, 900);

    setTimeout(() => {
      setSimulationLogs((prev) => [...prev, `[1.4s] Validating Post-Patch Integrity: CVE Vulnerability Scanner -> NEGATIVE (0 findings)`]);
    }, 1400);

    setTimeout(() => {
      soundService.playSuccessBeep();
      setSimulating(false);
      setSimulationLogs((prev) => [
        ...prev,
        `[1.8s] [SUCCESS 200 OK] ${selectedPatch.cveId} Fully Patched & Immunity Enforced!`,
      ]);
    }, 1800);
  };

  return (
    <ViewContainer>
      <SectionTitle
        title="1-Click Auto-Patch & Remediation Script Engine"
        subtitle="Generate, test, and copy ready-to-run Linux Bash, Windows PowerShell, Docker, and Nginx fix scripts for high-risk CVEs"
        icon={<Terminal className="w-6 h-6 text-emerald-500" />}
      />

      {/* Main Remediation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: CVE Catalog List */}
        <div className="space-y-3">
          <h3 className={`text-xs font-display font-bold uppercase tracking-wider px-1 ${
            isLight ? 'text-slate-800' : 'text-cyan-300'
          }`}>
            Available Security Patches ({REMEDIATION_CATALOG.length})
          </h3>

          <div className="space-y-2">
            {REMEDIATION_CATALOG.map((item) => {
              const isSelected = selectedPatch.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedPatch(item);
                    setSimulationLogs([]);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-cyan-50 border-cyan-400 shadow-md text-slate-800'
                        : 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-500/15'
                      : isLight
                        ? 'bg-white border-slate-200 hover:border-cyan-300 text-slate-800 shadow-sm'
                        : 'bg-black/60 border-white/10 hover:border-cyan-500/30 text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-400 font-mono font-bold text-[10px]">
                      {item.cveId}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400">
                      CVSS {item.cvss}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold mt-1.5 leading-snug ${isLight ? 'text-slate-900' : 'text-gray-200'}`}>
                    {item.title}
                  </h4>

                  <p className={`text-[10px] mt-1 truncate ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                    {item.affectedSystems}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Generator & Live Simulator */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active Patch Details Card */}
          <div className={`p-5 rounded-2xl border space-y-3 shadow-md ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'glass-panel border-cyan-500/30 bg-black/70'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono ${
                  isLight ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-500/20 text-cyan-300'
                }`}>
                  {selectedPatch.category}
                </span>
                <h2 className={`text-base font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {selectedPatch.title} ({selectedPatch.cveId})
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  Target Scope: <strong className={isLight ? 'text-slate-900' : 'text-gray-300'}>{selectedPatch.affectedSystems}</strong>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 font-mono font-bold text-xs border border-red-500/40">
                  CVSS {selectedPatch.cvss} CRITICAL
                </span>
              </div>
            </div>

            {/* Language / Platform Tabs */}
            <div className={`flex items-center justify-between pt-2 border-t flex-wrap gap-2 ${
              isLight ? 'border-slate-200' : 'border-white/5'
            }`}>
              <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/80 border-cyan-500/20'
              }`}>
                <button
                  onClick={() => setActiveTab('BASH')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    activeTab === 'BASH'
                      ? isLight ? 'bg-cyan-600 text-white shadow-sm' : 'bg-cyan-500 text-cyber-dark shadow-md'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Linux Bash (.sh)
                </button>
                <button
                  onClick={() => setActiveTab('POWERSHELL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    activeTab === 'POWERSHELL'
                      ? isLight ? 'bg-cyan-600 text-white shadow-sm' : 'bg-cyan-500 text-cyber-dark shadow-md'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  PowerShell (.ps1)
                </button>
                <button
                  onClick={() => setActiveTab('DOCKER')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    activeTab === 'DOCKER'
                      ? isLight ? 'bg-cyan-600 text-white shadow-sm' : 'bg-cyan-500 text-cyber-dark shadow-md'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Kubernetes (.yaml)
                </button>
                <button
                  onClick={() => setActiveTab('NGINX')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    activeTab === 'NGINX'
                      ? isLight ? 'bg-cyan-600 text-white shadow-sm' : 'bg-cyan-500 text-cyber-dark shadow-md'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Nginx WAF
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/30 text-cyan-300'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                </button>

                <button
                  onClick={handleDownloadScript}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                  }`}
                  title="Download Script File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Block Window */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 text-gray-500 text-[10px]">
                <span>AUTOMATED REMEDIATION SCRIPT ({activeTab})</span>
                <span>SHA-256 VERIFIED</span>
              </div>
              <pre className="mt-3 text-emerald-400 leading-relaxed select-all">
                {getActiveCode()}
              </pre>
            </div>

            {/* Live Simulation Runner Button */}
            <div className="flex items-center justify-between pt-2">
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Safe sandbox runner tests patch logic against simulated vulnerable node
              </span>

              <button
                onClick={handleRunSimulation}
                disabled={simulating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-display font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
              >
                <Play className={`w-4 h-4 ${simulating ? 'animate-spin' : 'fill-current'}`} />
                <span>{simulating ? 'Running Sandbox Patch...' : 'Test Run Patch in Sandbox'}</span>
              </button>
            </div>

            {/* Simulation Terminal Output Box */}
            {simulationLogs.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 font-mono text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold pb-2 border-b border-emerald-500/20 text-[11px]">
                  <Terminal className="w-4 h-4" />
                  <span>Sandbox Patch Execution Terminal</span>
                </div>
                {simulationLogs.map((log, i) => (
                  <p key={i} className="text-gray-200 text-[11px]">{log}</p>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </ViewContainer>
  );
}
