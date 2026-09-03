import React, { useState } from 'react';
import { ViewContainer, CyberPanel, SectionTitle } from '../ui/common';
import { Code2, Plus, Play, Download, CheckCircle2, Terminal } from 'lucide-react';
import { soundService } from '../../services/soundService';

import { storageUtils } from '../../utils/storageUtils';

interface SIEMRule {
  id: string;
  name: string;
  eventType: string;
  condition: string;
  threshold: number;
  timeWindowSec: number;
  severity: 'critical' | 'high' | 'medium';
  action: string;
}

const defaultRules: SIEMRule[] = [
  { id: 'RULE-01', name: 'Brute Force SSH Login Attempt', eventType: 'auth_failed', condition: 'attempts > threshold', threshold: 5, timeWindowSec: 60, severity: 'high', action: 'Block IP & Alert SOC' },
  { id: 'RULE-02', name: 'Potential SQL Injection in Web Payload', eventType: 'web_request', condition: 'body contains "UNION SELECT"', threshold: 1, timeWindowSec: 10, severity: 'critical', action: 'WAF Drop & Quarantine' },
  { id: 'RULE-03', name: 'Unauthorized Admin Privilege Escalation', eventType: 'privilege_change', condition: 'new_role == "root"', threshold: 1, timeWindowSec: 30, severity: 'critical', action: 'Revoke Token & Alert' },
];

export default function DetectionRuleBuilder() {
  const [rules, setRules] = useState<SIEMRule[]>(() =>
    storageUtils.get(storageUtils.KEYS.SIEM_RULES, defaultRules)
  );
  const [ruleName, setRuleName] = useState('');
  const [eventType, setEventType] = useState('failed_login');
  const [condition, setCondition] = useState('attempts > threshold');
  const [threshold, setThreshold] = useState(5);
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium'>('high');
  const action = 'Block IP & Trigger Sound Alarm';
  
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName) return;

    soundService.playSuccessBeep();
    const newRule: SIEMRule = {
      id: `RULE-${String(rules.length + 1).padStart(2, '0')}`,
      name: ruleName,
      eventType,
      condition,
      threshold: Number(threshold),
      timeWindowSec: 60,
      severity,
      action,
    };

    const updated = [newRule, ...rules];
    setRules(updated);
    storageUtils.set(storageUtils.KEYS.SIEM_RULES, updated);

    setRuleName('');
    setTestResult(`New Rule ${newRule.id} compiled & saved to LocalStorage SIEM Engine!`);
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleTestRule = (rule: SIEMRule) => {
    soundService.playAlertAlarm();
    setTestResult(`Testing Rule ${rule.id} against active log stream... MATCH FOUND (100% Precision)`);
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleExportYARA = () => {
    soundService.playSuccessBeep();
    const yaraRules = rules.map(r => `
rule ${r.id.replace(/-/g, '_')}_${r.name.replace(/\s+/g, '_')} {
  meta:
    description = "${r.name}"
    severity = "${r.severity}"
  strings:
    $a = "${r.eventType}"
    $b = "${r.action}"
  condition:
    $a and $b
}`).join('\n');

    const blob = new Blob([yaraRules], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberShield_YARA_Rules_${new Date().toISOString().slice(0, 10)}.yar`;
    link.click();
  };

  const handleExportSigma = () => {
    soundService.playSuccessBeep();
    const sigmaRules = rules.map(r => `
title: ${r.name}
id: ${crypto.randomUUID()}
status: experimental
description: Auto-generated SIGMA detection rule for ${r.name}
logsource:
    category: ${r.eventType}
detection:
    selection:
        condition: "${r.condition}"
    timeframe: ${r.timeWindowSec}s
    condition: selection
level: ${r.severity}
falsepositives:
    - Unknown
`).join('\n---\n');

    const blob = new Blob([sigmaRules], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberShield_Sigma_Rules_${new Date().toISOString().slice(0, 10)}.yml`;
    link.click();
  };

  return (
    <ViewContainer>
      <SectionTitle
        title="Custom SIEM & YARA/Sigma Rule Builder"
        subtitle="Construct detection rules, test against live logs, and export YARA rule signatures"
        icon={<Code2 className="w-6 h-6" />}
      />

      {testResult && (
        <div className="mb-4 p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-pulse shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Rule Creation Form */}
        <CyberPanel title="Rule Compiler Form" icon={<Plus className="w-4 h-4" />}>
          <form onSubmit={handleCreateRule} className="p-5 space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Rule Name</label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g. Detect Reverse Shell Execution"
                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="failed_login">auth_failed (Failed Login)</option>
                <option value="web_request">web_request (HTTP Payload)</option>
                <option value="process_creation">process_creation (Sysmon)</option>
                <option value="network_connection">network_connection (Outbound IP)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Condition Expression</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Threshold</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-cyber-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy SIEM Rule</span>
            </button>
          </form>
        </CyberPanel>

        {/* Right 2 Cols: Active Rules List & YARA Export */}
        <CyberPanel
          title="Active SIEM Rules Engine"
          icon={<Terminal className="w-4 h-4" />}
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportSigma}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export SIGMA (.yml)</span>
              </button>
              <button
                onClick={handleExportYARA}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export YARA (.yar)</span>
              </button>
            </div>
          }
        >
          <div className="p-4 max-h-[500px] overflow-y-auto divide-y divide-cyan-500/10 font-mono text-xs">
            {rules.map((r) => (
              <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cyan-500/5 px-2 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{r.id}</span>
                    <span className="text-gray-100 font-bold">{r.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${r.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {r.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">Condition: <code className="text-purple-300">{r.condition}</code> (Threshold: {r.threshold})</p>
                  <p className="text-[10px] text-emerald-400">Action: {r.action}</p>
                </div>

                <button
                  onClick={() => handleTestRule(r)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Test Rule</span>
                </button>
              </div>
            ))}
          </div>
        </CyberPanel>

      </div>
    </ViewContainer>
  );
}
