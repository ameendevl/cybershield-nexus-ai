import { useState } from 'react';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { 
  Bell, Send, Plus, CheckCircle2, X, Activity, MessageSquare
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface NotificationChannel {
  id: string;
  name: string;
  type: 'SLACK' | 'TEAMS' | 'PAGERDUTY' | 'DISCORD' | 'WEBHOOK';
  targetUrl: string;
  enabled: boolean;
  triggerSeverity: 'CRITICAL_ONLY' | 'HIGH_AND_CRITICAL' | 'ALL_INCIDENTS';
  lastDispatched: string;
  successRate: string;
}

interface DispatchLog {
  id: string;
  channelName: string;
  type: string;
  alertTitle: string;
  timestamp: string;
  status: '200 OK' | 'DELIVERED';
  latency: string;
}

const INITIAL_CHANNELS: NotificationChannel[] = [
  { 
    id: 'WH-SLACK-01', 
    name: '#soc-threat-escalations (Slack Corporate)', 
    type: 'SLACK', 
    targetUrl: 'https://hooks.slack.com/services/T08271/B08291/92a8b3c8f1e245a', 
    enabled: true,
    triggerSeverity: 'CRITICAL_ONLY',
    lastDispatched: '2 mins ago',
    successRate: '99.9%'
  },
  { 
    id: 'WH-TEAMS-02', 
    name: 'CISO Incident Response Command (MS Teams)', 
    type: 'TEAMS', 
    targetUrl: 'https://cybershield.webhook.office.com/webhookb2/88219c-44bc/IncomingWebhook', 
    enabled: true,
    triggerSeverity: 'HIGH_AND_CRITICAL',
    lastDispatched: '14 mins ago',
    successRate: '100%'
  },
  { 
    id: 'WH-PAGER-03', 
    name: 'On-Call Tier-3 SRE PagerDuty Service', 
    type: 'PAGERDUTY', 
    targetUrl: 'https://events.pagerduty.com/v2/enqueue?routing_key=pd-sec-ops-991', 
    enabled: true,
    triggerSeverity: 'CRITICAL_ONLY',
    lastDispatched: '1 hour ago',
    successRate: '100%'
  },
  { 
    id: 'WH-DISCORD-04', 
    name: '#devsecops-build-alerts (Discord)', 
    type: 'DISCORD', 
    targetUrl: 'https://discord.com/api/webhooks/11298491829/X_token_sec_key_88', 
    enabled: false,
    triggerSeverity: 'ALL_INCIDENTS',
    lastDispatched: 'Yesterday',
    successRate: '98.5%'
  },
  { 
    id: 'WH-CUSTOM-05', 
    name: 'Enterprise Splunk SIEM Syslog Receiver', 
    type: 'WEBHOOK', 
    targetUrl: 'https://siem-collector.enterprise.internal/api/v1/cyber-events', 
    enabled: true,
    triggerSeverity: 'ALL_INCIDENTS',
    lastDispatched: 'Just now',
    successRate: '100%'
  },
];

const INITIAL_LOGS: DispatchLog[] = [
  { id: 'LOG-881', channelName: '#soc-threat-escalations (Slack)', type: 'SLACK', alertTitle: 'Ransomware Vector Containment on Node-04', timestamp: '2 mins ago', status: '200 OK', latency: '42ms' },
  { id: 'LOG-880', channelName: 'CISO Incident Response (MS Teams)', type: 'TEAMS', alertTitle: 'Brute Force Attack IP 185.220.101.4 Banned', timestamp: '14 mins ago', status: '200 OK', latency: '38ms' },
  { id: 'LOG-879', channelName: 'On-Call Tier-3 (PagerDuty)', type: 'PAGERDUTY', alertTitle: 'Zero-Day CVE-2024-3400 Exploit Attempt', timestamp: '1 hour ago', status: 'DELIVERED', latency: '54ms' },
  { id: 'LOG-878', channelName: 'Enterprise Splunk SIEM', type: 'WEBHOOK', alertTitle: 'Active DNS Amplification DDoS Filtered', timestamp: '2 hours ago', status: '200 OK', latency: '19ms' },
];

export default function AlertNotificationManager() {
  const [channels, setChannels] = useState<NotificationChannel[]>(INITIAL_CHANNELS);
  const [logs, setLogs] = useState<DispatchLog[]>(INITIAL_LOGS);
  const [sendingChannelId, setSendingChannelId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  // New Channel State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'SLACK' | 'TEAMS' | 'PAGERDUTY' | 'DISCORD' | 'WEBHOOK'>('SLACK');
  const [newUrl, setNewUrl] = useState('');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL_ONLY' | 'HIGH_AND_CRITICAL' | 'ALL_INCIDENTS'>('CRITICAL_ONLY');

  const handleToggleChannel = (id: string) => {
    soundService.playSuccessBeep();
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const handleSendTestPayload = (channel: NotificationChannel) => {
    soundService.playAlertAlarm();
    setSendingChannelId(channel.id);
    setTestSuccessMessage(null);

    setTimeout(() => {
      soundService.playSuccessBeep();
      setSendingChannelId(null);
      setTestSuccessMessage(`[${channel.type} 200 OK] Dispatched simulated JSON alert payload to: ${channel.name}`);

      const newLog: DispatchLog = {
        id: `LOG-${Math.floor(Math.random() * 900) + 100}`,
        channelName: channel.name,
        type: channel.type,
        alertTitle: '[TEST DISPATCH] Critical Perimeter Breach Simulated Payload',
        timestamp: 'Just now',
        status: '200 OK',
        latency: `${Math.floor(Math.random() * 30) + 20}ms`,
      };
      setLogs((prev) => [newLog, ...prev]);

      setTimeout(() => setTestSuccessMessage(null), 5000);
    }, 1200);
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    soundService.playSuccessBeep();
    const newChan: NotificationChannel = {
      id: `WH-${newType}-${Date.now().toString().slice(-4)}`,
      name: newName,
      type: newType,
      targetUrl: newUrl,
      enabled: true,
      triggerSeverity: newSeverity,
      lastDispatched: 'Never',
      successRate: '100%',
    };

    setChannels((prev) => [newChan, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewUrl('');
  };

  return (
    <ViewContainer>
      <SectionTitle
        title="Corporate Alert Webhooks & Notification Dispatcher"
        subtitle="Route real-time SIEM alerts, ransomware triggers, and threat intelligence to Slack, Microsoft Teams, PagerDuty, and Custom Webhooks"
        icon={<Bell className="w-6 h-6 text-cyan-400" />}
      />

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-black/60 border border-cyan-500/20 glass-panel">
        <div>
          <h3 className="text-sm font-display font-bold text-cyan-300 uppercase tracking-wide">
            Enterprise Webhook Connectors
          </h3>
          <p className="text-xs text-gray-400">
            {channels.filter(c => c.enabled).length} of {channels.length} active channels receiving live security dispatches
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Corporate Channel</span>
        </button>
      </div>

      {/* Test Feedback Notification */}
      {testSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{testSuccessMessage}</span>
        </div>
      )}

      {/* Active Channels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="p-5 rounded-2xl bg-black/70 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                    ch.type === 'SLACK' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    ch.type === 'TEAMS' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    ch.type === 'PAGERDUTY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {ch.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ch.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {ch.enabled ? 'LIVE DISPATCH' : 'MUTED'}
                  </span>
                </div>

                <span className="text-[11px] text-gray-400 font-mono">
                  Success: <strong className="text-emerald-400">{ch.successRate}</strong>
                </span>
              </div>

              <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>{ch.name}</span>
              </h4>

              <p className="text-xs text-gray-400 font-mono truncate bg-black/40 p-2 rounded-lg border border-white/5">
                {ch.targetUrl}
              </p>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>Trigger Rule: <strong className="text-amber-300">{ch.triggerSeverity.replace(/_/g, ' ')}</strong></span>
                <span>Last Fired: <strong className="text-gray-300">{ch.lastDispatched}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleChannel(ch.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ch.enabled
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {ch.enabled ? 'Mute Channel' : 'Activate Channel'}
              </button>

              <button
                onClick={() => handleSendTestPayload(ch)}
                disabled={sendingChannelId === ch.id || !ch.enabled}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white font-bold text-xs uppercase flex items-center gap-2 shadow-md disabled:opacity-40 cursor-pointer"
              >
                <Send className={`w-3.5 h-3.5 ${sendingChannelId === ch.id ? 'animate-bounce' : ''}`} />
                <span>{sendingChannelId === ch.id ? 'Firing Webhook...' : 'Test Webhook'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook Dispatch History Audit Log */}
      <CyberPanel title="Recent Webhook Dispatch Telemetry Log" icon={<Activity className="w-4 h-4 text-emerald-400" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/60 text-gray-400 uppercase text-[10px] border-b border-cyan-500/20">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Target Channel</th>
                <th className="p-3">Trigger Payload Event</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Latency</th>
                <th className="p-3">HTTP Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="p-3 text-cyan-300 font-bold">{log.id}</td>
                  <td className="p-3 text-gray-200 font-bold">{log.channelName}</td>
                  <td className="p-3 text-gray-300">{log.alertTitle}</td>
                  <td className="p-3 text-gray-500">{log.timestamp}</td>
                  <td className="p-3 text-emerald-400">{log.latency}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberPanel>

      {/* Add New Channel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-cyan-500/40 space-y-4 shadow-2xl animate-in zoom-in-95 bg-cyber-darker">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <h3 className="text-sm font-display font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Configure Corporate Webhook Channel</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChannel} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Channel Display Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. #security-critical-alerts"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-gray-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                    Connector Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-cyan-300 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="SLACK">Slack Webhook</option>
                    <option value="TEAMS">Microsoft Teams</option>
                    <option value="PAGERDUTY">PagerDuty</option>
                    <option value="DISCORD">Discord Webhook</option>
                    <option value="WEBHOOK">Custom HTTPS API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                    Trigger Severity Threshold
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e: any) => setNewSeverity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-cyan-300 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="CRITICAL_ONLY">Critical Only (P1)</option>
                    <option value="HIGH_AND_CRITICAL">High & Critical (P1/P2)</option>
                    <option value="ALL_INCIDENTS">All Telemetry Incidents</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Target Webhook URL / Endpoint
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-gray-200 font-mono text-[11px] focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Save & Enable Connector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </ViewContainer>
  );
}
