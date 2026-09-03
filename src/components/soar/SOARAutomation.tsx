import { useState } from 'react';
import { ViewContainer, CyberPanel, SectionTitle, StatusBadge } from '../ui/common';
import MetricCard from '../dashboard/MetricCard';
import { Zap, Play, Clock, CheckCircle, AlertTriangle, Plus, ChevronRight, Pause, Download } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Playbook {
  id: string;
  name: string;
  description: string;
  triggerType: string;
  triggerConditions: string;
  status: 'active' | 'paused' | 'draft';
  steps: { id: string; name: string; type: string; automated: boolean }[];
  executions: number;
  successRate: number;
  avgDuration: string;
  lastRun: string;
}

const mockPlaybooks: Playbook[] = [
  {
    id: 'PB-001', name: 'Auto-Isolate Compromised Endpoint', description: 'Automatically isolates endpoints flagged by EDR as critical compromise',
    triggerType: 'EDR Alert', triggerConditions: 'severity == critical && confidence > 90', status: 'active',
    steps: [
      { id: 's1', name: 'Verify alert with threat intel', type: 'enrichment', automated: true },
      { id: 's2', name: 'Isolate endpoint from network', type: 'action', automated: true },
      { id: 's3', name: 'Collect forensic artifacts', type: 'collection', automated: true },
      { id: 's4', name: 'Notify SOC team', type: 'notification', automated: true },
      { id: 's5', name: 'Create incident ticket', type: 'ticketing', automated: true },
    ],
    executions: 47, successRate: 96, avgDuration: '2.3 min', lastRun: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'PB-002', name: 'Block Malicious IP at Firewall', description: 'Adds malicious IPs to firewall blocklist based on threat intel feeds',
    triggerType: 'Threat Intel', triggerConditions: 'ioc_type == ip && severity >= high', status: 'active',
    steps: [
      { id: 's1', name: 'Validate IOC against multiple sources', type: 'enrichment', automated: true },
      { id: 's2', name: 'Check for false positives', type: 'analysis', automated: true },
      { id: 's3', name: 'Add to firewall blocklist', type: 'action', automated: true },
      { id: 's4', name: 'Log action to audit trail', type: 'logging', automated: true },
    ],
    executions: 312, successRate: 99, avgDuration: '0.8 min', lastRun: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'PB-003', name: 'Phishing Email Response', description: 'Removes phishing emails from all mailboxes and blocks sender',
    triggerType: 'Email Gateway', triggerConditions: 'email_threat == phishing', status: 'active',
    steps: [
      { id: 's1', name: 'Extract URLs and attachments', type: 'extraction', automated: true },
      { id: 's2', name: 'Sandbox analysis', type: 'analysis', automated: true },
      { id: 's3', name: 'Remove from all mailboxes', type: 'action', automated: true },
      { id: 's4', name: 'Block sender domain', type: 'action', automated: true },
      { id: 's5', name: 'Notify affected users', type: 'notification', automated: true },
    ],
    executions: 189, successRate: 94, avgDuration: '5.1 min', lastRun: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'PB-004', name: 'Vulnerability Auto-Remediation', description: 'Automatically patches critical vulnerabilities on non-production systems',
    triggerType: 'Vulnerability Scan', triggerConditions: 'severity == critical && patch_available == true', status: 'paused',
    steps: [
      { id: 's1', name: 'Validate patch availability', type: 'enrichment', automated: true },
      { id: 's2', name: 'Check system criticality', type: 'analysis', automated: true },
      { id: 's3', name: 'Schedule maintenance window', type: 'scheduling', automated: true },
      { id: 's4', name: 'Apply patch', type: 'action', automated: true },
      { id: 's5', name: 'Verify system health', type: 'validation', automated: true },
    ],
    executions: 56, successRate: 91, avgDuration: '15.2 min', lastRun: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'PB-005', name: 'Cloud Account Anomaly Response', description: 'Investigates and responds to anomalous cloud API activity',
    triggerType: 'Cloud Security', triggerConditions: 'api_anomaly_score > 80', status: 'draft',
    steps: [
      { id: 's1', name: 'Query cloud audit logs', type: 'enrichment', automated: true },
      { id: 's2', name: 'Score anomaly confidence', type: 'analysis', automated: true },
      { id: 's3', name: 'Notify cloud security team', type: 'notification', automated: false },
    ],
    executions: 0, successRate: 0, avgDuration: 'N/A', lastRun: 'Never',
  },
];

const stepTypeColors: Record<string, string> = {
  enrichment: '#00f0ff', action: '#ff0054', collection: '#ffbe0b', notification: '#00ff88',
  ticketing: '#7b2cbf', logging: '#4b5563', analysis: '#ff6b35', extraction: '#00f0ff',
  scheduling: '#ffbe0b', validation: '#00ff88',
};

export default function SOARAutomation() {
  const [selectedPb, setSelectedPb] = useState(mockPlaybooks[0].id);
  const [executingPb, setExecutingPb] = useState<string | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const current = mockPlaybooks.find((p) => p.id === selectedPb) || mockPlaybooks[0];

  const handleRunPlaybook = (pb: Playbook) => {
    soundService.playAlertAlarm();
    setExecutingPb(pb.id);
    setActiveStepIdx(0);
    setExecutionLog([`[0.0s] Triggering SOAR Playbook: ${pb.name}...`]);

    pb.steps.forEach((step, idx) => {
      setTimeout(() => {
        soundService.playSuccessBeep();
        setActiveStepIdx(idx);
        setExecutionLog(prev => [...prev, `[${(idx + 1) * 0.8}s] Step ${idx + 1}: ${step.name} (${step.type.toUpperCase()}) -> SUCCESS`]);
      }, (idx + 1) * 800);
    });

    setTimeout(() => {
      setActiveStepIdx(null);
      setExecutionLog(prev => [...prev, `[COMPLETE] Playbook ${pb.id} executed successfully. Containment verified!`]);
      setTimeout(() => {
        setExecutingPb(null);
        setExecutionLog([]);
      }, 4000);
    }, (pb.steps.length + 1) * 800);
  };

  const handleExportScript = (pb: Playbook) => {
    soundService.playSuccessBeep();
    const scriptContent = `#!/bin/bash
# ==============================================================================
# CyberShield Nexus AI - SOAR Automated Remediation Playbook
# Playbook ID: ${pb.id}
# Title: ${pb.name}
# Trigger: ${pb.triggerConditions}
# Generated: ${new Date().toUTCString()}
# ==============================================================================

echo "[+] Initializing SOAR Playbook Execution: ${pb.name}"

# Step 1: Firewall Isolation Rule
echo "[+] Applying Perimeter iptables isolation rule..."
iptables -A INPUT -s 194.26.29.114 -j DROP
iptables -A FORWARD -s 194.26.29.114 -j DROP

# Step 2: Host Lockdown (PowerShell Equivalent)
# powershell.exe -Command "Disable-NetAdapter -Name 'Ethernet' -Confirm:\\$false"
# powershell.exe -Command "Stop-Process -Name 'mimikatz','procdump' -Force"

# Step 3: SOC Incident Notification Webhook
echo "[+] Alerting SOC Slack / Teams Webhook..."
curl -X POST -H 'Content-type: application/json' --data '{"text":"[SOAR] Playbook ${pb.id} triggered containment successfully."}' https://hooks.slack.com/services/CYBERSHIELD/ALERT/001

echo "[✓] SOAR Playbook completed. Host contained and evidence preserved."
`;

    const blob = new Blob([scriptContent], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOAR_Playbook_${pb.id}_Remediation.sh`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const stats = {
    active: mockPlaybooks.filter((p) => p.status === 'active').length,
    totalExecutions: mockPlaybooks.reduce((acc, p) => acc + p.executions, 0),
    avgSuccess: Math.round(mockPlaybooks.filter((p) => p.successRate > 0).reduce((acc, p) => acc + p.successRate, 0) / mockPlaybooks.filter((p) => p.successRate > 0).length),
    timeSaved: '18.5h',
  };

  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [newStepName, setNewStepName] = useState('');
  const [newStepType, setNewStepType] = useState('action');

  const handleAddCustomStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepName.trim()) return;

    soundService.playSuccessBeep();
    current.steps.push({
      id: `s${current.steps.length + 1}`,
      name: newStepName.trim(),
      type: newStepType,
      automated: true,
    });

    setNewStepName('');
    setShowAddStepModal(false);
  };

  return (
    <ViewContainer>
      <SectionTitle title="SOAR Automation" subtitle="Security orchestration, automation, and response playbooks" icon={<Zap className="w-6 h-6" />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Active Playbooks" value={stats.active} icon={<Zap className="w-5 h-5" />} color="#00f0ff" subtitle="running" />
        <MetricCard title="Total Executions" value={stats.totalExecutions.toLocaleString()} icon={<Play className="w-5 h-5" />} color="#00ff88" subtitle="all time" />
        <MetricCard title="Avg Success Rate" value={`${stats.avgSuccess}%`} icon={<CheckCircle className="w-5 h-5" />} color="#ffbe0b" subtitle="automation" />
        <MetricCard title="Time Saved" value={stats.timeSaved} icon={<Clock className="w-5 h-5" />} color="#7b2cbf" subtitle="today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Playbook list */}
        <CyberPanel title="Playbooks" icon={<Zap className="w-4 h-4" />} className="lg:col-span-1">
          <div className="divide-y divide-cyan-500/5 max-h-[600px] overflow-y-auto font-mono">
            {mockPlaybooks.map((pb) => (
              <button
                key={pb.id}
                onClick={() => setSelectedPb(pb.id)}
                className={`w-full text-left px-4 py-3 hover:bg-cyan-500/5 transition-colors ${selectedPb === pb.id ? 'bg-cyan-500/10' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-2 h-2 rounded-full ${pb.status === 'active' ? 'bg-cyber-success animate-pulse' : pb.status === 'paused' ? 'bg-cyber-warning' : 'bg-gray-600'}`} />
                  <span className="text-xs font-mono text-cyan-400">{pb.id}</span>
                </div>
                <p className="text-sm text-gray-300 font-medium mb-1">{pb.name}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-600">
                  <span>{pb.executions} runs</span>
                  <span className={pb.successRate >= 95 ? 'text-cyber-success' : pb.successRate >= 80 ? 'text-cyber-warning' : 'text-cyber-error'}>
                    {pb.successRate > 0 ? `${pb.successRate}% success` : 'No runs'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CyberPanel>

        {/* Playbook detail */}
        <div className="lg:col-span-2 space-y-4 font-mono">
          <CyberPanel title="Playbook Details" icon={<ChevronRight className="w-4 h-4" />}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-display font-bold text-cyan-300">{current.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{current.id}</p>
                </div>
                <StatusBadge status={current.status} />
              </div>
              <p className="text-sm text-gray-400 mb-4">{current.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                  <p className="text-[10px] text-gray-600 uppercase">Trigger</p>
                  <p className="text-sm text-cyan-300 mt-0.5">{current.triggerType}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                  <p className="text-[10px] text-gray-600 uppercase">Executions</p>
                  <p className="text-sm text-gray-300 mt-0.5">{current.executions}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                  <p className="text-[10px] text-gray-600 uppercase">Avg Duration</p>
                  <p className="text-sm text-gray-300 mt-0.5">{current.avgDuration}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyber-darker/60 border border-cyan-500/10">
                  <p className="text-[10px] text-gray-600 uppercase">Success Rate</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: current.successRate >= 95 ? '#00ff88' : '#ffbe0b' }}>{current.successRate > 0 ? `${current.successRate}%` : 'N/A'}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyber-darker/40 border border-cyan-500/10 mb-4">
                <p className="text-[10px] text-gray-600 uppercase mb-1">Trigger Conditions</p>
                <code className="text-xs text-cyan-400 font-mono">{current.triggerConditions}</code>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunPlaybook(current)}
                  disabled={!!executingPb}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyber-success/15 border border-cyber-success/30 text-cyber-success text-sm font-medium hover:bg-cyber-success/25 transition-all shadow-md"
                >
                  <Play className="w-4 h-4" /> Run Now
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyber-warning/15 border border-cyber-warning/30 text-cyber-warning text-sm font-medium hover:bg-cyber-warning/25 transition-all">
                  <Pause className="w-4 h-4" /> {current.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => handleExportScript(current)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/25 transition-all"
                  title="Download bash / PowerShell remediation script"
                >
                  <Download className="w-4 h-4" /> Export Script
                </button>
              </div>

              {/* Live Playbook Execution Console */}
              {executionLog.length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-black/80 border border-emerald-500/30 text-xs sound-mono space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1 text-emerald-400 font-bold text-[10px]">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Playbook Execution Progress
                    </span>
                    <span>{executingPb}</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1 text-[11px] pt-1">
                    {executionLog.map((log, index) => (
                      <p key={index} className={log.includes('SUCCESS') ? 'text-emerald-300 font-bold' : log.includes('COMPLETE') ? 'text-cyan-300 font-bold' : 'text-amber-300'}>
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CyberPanel>

          {/* Workflow steps */}
          <CyberPanel
            title={`Workflow Steps (${current.steps.length})`}
            icon={<Play className="w-4 h-4" />}
            action={
              <button
                onClick={() => setShowAddStepModal(true)}
                className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Add Custom Step</span>
              </button>
            }
          >
            <div className="p-5">
              <div className="space-y-0">
                {current.steps.map((step, i) => {
                  const isActive = activeStepIdx === i;
                  return (
                    <div key={step.id} className={`flex items-start gap-3 p-2 rounded-xl transition-all ${isActive ? 'bg-cyan-500/15 ring-1 ring-cyan-400 scale-102 shadow-lg' : ''}`}>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${isActive ? 'animate-bounce' : ''}`} style={{ backgroundColor: `${stepTypeColors[step.type] || '#00f0ff'}15`, color: stepTypeColors[step.type] || '#00f0ff', border: `1px solid ${stepTypeColors[step.type] || '#00f0ff'}30` }}>
                          {i + 1}
                        </div>
                        {i < current.steps.length - 1 && <div className="w-0.5 h-12" style={{ backgroundColor: `${stepTypeColors[step.type] || '#00f0ff'}30` }} />}
                      </div>
                      <div className="pb-8 flex-1">
                        <p className="text-sm text-gray-300 font-medium">{step.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ color: stepTypeColors[step.type] || '#00f0ff', backgroundColor: `${stepTypeColors[step.type] || '#00f0ff'}10` }}>{step.type}</span>
                          {step.automated ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-success/15 text-cyber-success flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Automated</span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-warning/15 text-cyber-warning flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Manual</span>
                          )}
                          {isActive && <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400 text-cyber-dark font-bold animate-pulse">EXECUTING NODE...</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CyberPanel>
        </div>
      </div>

      {/* Add Custom Step Modal */}
      {showAddStepModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddCustomStep} className="w-full max-w-md p-5 rounded-2xl bg-cyber-darker border border-cyan-500/40 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Add Custom SOAR Workflow Step
              </span>
              <button
                type="button"
                onClick={() => setShowAddStepModal(false)}
                className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold"
              >
                Cancel ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Step Action Name</label>
                <input
                  type="text"
                  placeholder="e.g. Send Teams Channel Alert & Contain AWS IAM"
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Step Type</label>
                <select
                  value={newStepType}
                  onChange={(e) => setNewStepType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="action">Action (Containment / Firewall)</option>
                  <option value="enrichment">Enrichment (Intel / Whois)</option>
                  <option value="notification">Notification (Slack / Email / Teams)</option>
                  <option value="ticketing">Ticketing (Jira / ServiceNow)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-cyber-dark font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              Add Step Node
            </button>
          </form>
        </div>
      )}
    </ViewContainer>
  );
}
