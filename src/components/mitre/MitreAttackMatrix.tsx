import { useState } from 'react';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { Crosshair, CheckCircle2, AlertTriangle, Eye, Shield } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  coverage: number; // 0 - 100%
  rulesCount: number;
  status: 'COVERED' | 'PARTIAL' | 'UNCOVERED';
  description: string;
}

const MITRE_TACTICS = [
  'Reconnaissance', 'Resource Dev', 'Initial Access', 'Execution',
  'Persistence', 'Priv Escalation', 'Defense Evasion', 'Credential Access',
  'Discovery', 'Lateral Movement', 'Collection', 'C2 Communication',
  'Exfiltration', 'Impact'
];

const SAMPLE_TECHNIQUES: MitreTechnique[] = [
  { id: 'T1595', name: 'Active Scanning', tactic: 'Reconnaissance', coverage: 95, rulesCount: 8, status: 'COVERED', description: 'Port scanning, IP sweeps, vulnerability scanning' },
  { id: 'T1566', name: 'Phishing Attachments', tactic: 'Initial Access', coverage: 92, rulesCount: 14, status: 'COVERED', description: 'Spearphishing links & malicious macro attachments' },
  { id: 'T1059', name: 'Command & Scripting Interpreter', tactic: 'Execution', coverage: 98, rulesCount: 22, status: 'COVERED', description: 'PowerShell bypass, cmd.exe execution, bash scripts' },
  { id: 'T1547', name: 'Boot or Logon Autostart', tactic: 'Persistence', coverage: 85, rulesCount: 11, status: 'COVERED', description: 'Windows Registry Run keys, startup folder persistence' },
  { id: 'T1068', name: 'Exploitation for Privilege Escalation', tactic: 'Priv Escalation', coverage: 90, rulesCount: 16, status: 'COVERED', description: 'Kernel exploits, UAC bypass, token impersonation' },
  { id: 'T1027', name: 'Obfuscated Files or Information', tactic: 'Defense Evasion', coverage: 78, rulesCount: 9, status: 'PARTIAL', description: 'Base64 strings, XOR encryption, memory reflection' },
  { id: 'T1003', name: 'OS Credential Dumping', tactic: 'Credential Access', coverage: 96, rulesCount: 19, status: 'COVERED', description: 'LSASS memory dumping via Mimikatz / ProcDump' },
  { id: 'T1046', name: 'Network Service Discovery', tactic: 'Discovery', coverage: 88, rulesCount: 7, status: 'COVERED', description: 'Internal SMB, RPC, and Active Directory enumeration' },
  { id: 'T1021', name: 'Remote Services (PsExec/RDP)', tactic: 'Lateral Movement', coverage: 91, rulesCount: 13, status: 'COVERED', description: 'Lateral movement via PsExec, WMI, and RDP sessions' },
  { id: 'T1071', name: 'Application Layer Protocol (C2)', tactic: 'C2 Communication', coverage: 94, rulesCount: 18, status: 'COVERED', description: 'Cobalt Strike HTTPS beacons, DNS tunneling' },
  { id: 'T1041', name: 'Exfiltration Over C2 Channel', tactic: 'Exfiltration', coverage: 80, rulesCount: 6, status: 'PARTIAL', description: 'Data egress over encrypted C2 sockets' },
  { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact', coverage: 100, rulesCount: 25, status: 'COVERED', description: 'Ransomware file encryption extensions (.locked, .crypto)' },
];

export default function MitreAttackMatrix() {
  const [selectedTech, setSelectedTech] = useState<MitreTechnique | null>(SAMPLE_TECHNIQUES[2]);

  return (
    <ViewContainer>
      <SectionTitle
        title="MITRE ATT&CK Framework Heatmap & Defense Coverage"
        subtitle="14 Tactic Matrix, enterprise detection rule coverage, and adversary technique mapping"
        icon={<Crosshair className="w-6 h-6 text-emerald-400" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Heatmap Overview Cards */}
        <div className="p-4 rounded-2xl bg-cyber-darker border border-emerald-500/30 flex items-center justify-between font-mono">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Overall ATT&CK Coverage</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">91.4% Covered</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">168 / 184 Techniques Shielded</p>
          </div>
          <CheckCircle2 className="w-10 h-10 text-emerald-400 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl bg-cyber-darker border border-cyan-500/30 flex items-center justify-between font-mono">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Active Detection Rules</p>
            <h3 className="text-2xl font-bold text-cyan-300 mt-1">167 SIGMA & YARA</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Engineered for Enterprise SOC</p>
          </div>
          <Shield className="w-10 h-10 text-cyan-400 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl bg-cyber-darker border border-amber-500/30 flex items-center justify-between font-mono">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Priority Coverage Gaps</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">2 Partial Gaps</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">T1027 Obfuscation & T1041 Exfiltration</p>
          </div>
          <AlertTriangle className="w-10 h-10 text-amber-400 opacity-80" />
        </div>
      </div>

      {/* MITRE ATT&CK 14 Tactics Grid */}
      <CyberPanel title="MITRE ATT&CK 14-Tactic Heatmap Grid" icon={<Crosshair className="w-4 h-4 text-emerald-400" />} className="mb-4">
        <div className="p-4 overflow-x-auto font-mono text-xs space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 min-w-[800px]">
            {MITRE_TACTICS.map((tactic, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-black/60 border border-cyan-500/20 text-center space-y-1">
                <span className="text-[9px] text-cyan-400 font-bold uppercase truncate block">{tactic}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  {(88 + (idx % 12)).toFixed(0)}% Rule Coverage
                </span>
              </div>
            ))}
          </div>

          {/* Sample Techniques Cards */}
          <div className="space-y-2 pt-2">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Key Adversary Techniques & Mapped SIGMA Rules</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {SAMPLE_TECHNIQUES.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => {
                    soundService.playSuccessBeep();
                    setSelectedTech(tech);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-102 font-mono ${
                    selectedTech?.id === tech.id
                      ? 'bg-cyan-500/20 border-cyan-400 ring-1 ring-cyan-300'
                      : 'bg-black/80 border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-300">{tech.id}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        tech.status === 'COVERED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tech.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-200 truncate">{tech.name}</h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 border-t border-cyan-500/10 pt-1.5">
                    <span>{tech.tactic}</span>
                    <span className="text-emerald-400 font-bold">{tech.rulesCount} Rules</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CyberPanel>

      {/* Technique Detail Inspector Modal / Box */}
      {selectedTech && (
        <CyberPanel title={`Technique Telemetry Inspector: ${selectedTech.id} - ${selectedTech.name}`} icon={<Eye className="w-4 h-4 text-cyan-400" />}>
          <div className="p-4 space-y-3 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2">
              <div>
                <span className="text-base font-bold text-cyan-300">{selectedTech.name} ({selectedTech.id})</span>
                <p className="text-xs text-gray-400 mt-0.5">{selectedTech.description}</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                Coverage: {selectedTech.coverage}% ({selectedTech.rulesCount} Detection Signatures)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/20 space-y-1">
                <p className="text-[10px] text-cyan-400 font-bold uppercase">Mapped SIGMA & YARA Detection Rules</p>
                <p className="text-gray-300">1. `sysmon_powershell_encoded_command.yml`</p>
                <p className="text-gray-300">2. `yara_lsass_dump_mimikatz.yar`</p>
                <p className="text-gray-300">3. `win_cmd_suspicious_subprocesses.yml`</p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-purple-500/20 space-y-1">
                <p className="text-[10px] text-purple-400 font-bold uppercase">Known Threat Actor Groups</p>
                <p className="text-purple-300 font-bold">APT29 (Cozy Bear), Lazarus Group, FIN7, Wizard Spider</p>
                <p className="text-gray-400 text-[10px] mt-1">Recommended SOAR Action: Automated endpoint memory dump and token revocation.</p>
              </div>
            </div>
          </div>
        </CyberPanel>
      )}
    </ViewContainer>
  );
}
