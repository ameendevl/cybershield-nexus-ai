import { useState } from 'react';
import { ViewContainer, SectionTitle } from '../ui/common';
import { useApp } from '../../store/AppContext';
import { 
  Globe, CheckCircle2, 
  Activity, RefreshCw, Plus, ExternalLink, Lock, Server, X, Zap
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface MonitoredEndpoint {
  id: string;
  name: string;
  url: string;
  type: 'PRODUCTION_API' | 'AUTH_GATEWAY' | 'CUSTOMER_PORTAL' | 'DATABASE_CLUSTER' | 'VPN_GATEWAY';
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  httpStatus: number;
  uptimePercent: string;
  latencyMs: number;
  sslDaysRemaining: number;
  sslIssuer: string;
  tlsVersion: string;
  autoRenew: boolean;
  lastChecked: string;
}

const INITIAL_ENDPOINTS: MonitoredEndpoint[] = [
  {
    id: 'EP-01',
    name: 'Primary API Gateway & Microservices Cluster',
    url: 'https://api.nexus-defense.io/v1/health',
    type: 'PRODUCTION_API',
    status: 'OPERATIONAL',
    httpStatus: 200,
    uptimePercent: '99.99%',
    latencyMs: 24,
    sslDaysRemaining: 74,
    sslIssuer: 'DigiCert Global Root G2',
    tlsVersion: 'TLS 1.3 (AES_256_GCM)',
    autoRenew: true,
    lastChecked: '12s ago',
  },
  {
    id: 'EP-02',
    name: 'Customer Authentication & SSO Identity Hub',
    url: 'https://auth.nexus-defense.io/oauth2/v2.0',
    type: 'AUTH_GATEWAY',
    status: 'OPERATIONAL',
    httpStatus: 200,
    uptimePercent: '100.0%',
    latencyMs: 18,
    sslDaysRemaining: 142,
    sslIssuer: 'Cloudflare Inc ECC CA-3',
    tlsVersion: 'TLS 1.3 (CHACHA20_POLY1305)',
    autoRenew: true,
    lastChecked: '45s ago',
  },
  {
    id: 'EP-03',
    name: 'Executive & Customer Portal Dashboard',
    url: 'https://portal.nexus-defense.io',
    type: 'CUSTOMER_PORTAL',
    status: 'OPERATIONAL',
    httpStatus: 200,
    uptimePercent: '99.95%',
    latencyMs: 35,
    sslDaysRemaining: 18, // Warning: < 30 days
    sslIssuer: 'Let\'s Encrypt Authority X3',
    tlsVersion: 'TLS 1.3 (AES_128_GCM)',
    autoRenew: true,
    lastChecked: '1m ago',
  },
  {
    id: 'EP-04',
    name: 'Zero-Trust Perimeter WireGuard VPN Endpoint',
    url: 'https://vpn.nexus-defense.io:443',
    type: 'VPN_GATEWAY',
    status: 'OPERATIONAL',
    httpStatus: 200,
    uptimePercent: '99.98%',
    latencyMs: 12,
    sslDaysRemaining: 210,
    sslIssuer: 'Sectigo RSA Organization Validation',
    tlsVersion: 'TLS 1.3 (AES_256_GCM)',
    autoRenew: true,
    lastChecked: '30s ago',
  },
  {
    id: 'EP-05',
    name: 'SIEM Log Ingestion & Telemetry Pipeline',
    url: 'https://ingest.nexus-defense.io/telemetry',
    type: 'DATABASE_CLUSTER',
    status: 'OPERATIONAL',
    httpStatus: 200,
    uptimePercent: '99.92%',
    latencyMs: 48,
    sslDaysRemaining: 5, // Critical: < 7 days
    sslIssuer: 'ZeroSSL RSA Domain Secure',
    tlsVersion: 'TLS 1.2 (ECDHE-RSA-AES256)',
    autoRenew: false,
    lastChecked: 'Just now',
  },
];

export default function CorporateUptimeMonitor() {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  const [endpoints, setEndpoints] = useState<MonitoredEndpoint[]>(INITIAL_ENDPOINTS);
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusPageModal, setShowStatusPageModal] = useState(false);

  // New endpoint inputs
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<MonitoredEndpoint['type']>('PRODUCTION_API');

  const handlePingAll = () => {
    soundService.playAlertAlarm();
    setIsScanningAll(true);

    setTimeout(() => {
      soundService.playSuccessBeep();
      setIsScanningAll(false);
      setEndpoints((prev) =>
        prev.map((ep) => ({
          ...ep,
          latencyMs: Math.floor(Math.random() * 25) + 12,
          lastChecked: 'Just now',
          httpStatus: 200,
        }))
      );
    }, 1200);
  };

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    soundService.playSuccessBeep();
    const newEp: MonitoredEndpoint = {
      id: `EP-0${endpoints.length + 1}`,
      name: newName,
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      type: newType,
      status: 'OPERATIONAL',
      httpStatus: 200,
      uptimePercent: '100.0%',
      latencyMs: Math.floor(Math.random() * 20) + 15,
      sslDaysRemaining: 89,
      sslIssuer: 'Let\'s Encrypt Authority X3',
      tlsVersion: 'TLS 1.3 (AES_256_GCM)',
      autoRenew: true,
      lastChecked: 'Just now',
    };

    setEndpoints((prev) => [newEp, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewUrl('');
  };

  return (
    <ViewContainer>
      <SectionTitle
        title="Corporate Domain Uptime & SSL Expiry Monitor"
        subtitle="24/7 autonomous availability tracking, SSL certificate renewal countdown, TLS 1.3 cryptographic validation, and public status pages"
        icon={<Globe className={`w-6 h-6 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />}
      />

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'glass-panel border-cyan-500/20 bg-black/60'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Average SLA Uptime
            </span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">99.98%</p>
          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Global 30-Day SLA Rating</span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'glass-panel border-cyan-500/20 bg-black/60'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Monitored Endpoints
            </span>
            <Server className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
          </div>
          <p className={`text-2xl font-display font-bold mt-1 ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>
            {endpoints.length} Active
          </p>
          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>100% Operational Status</span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'glass-panel border-cyan-500/20 bg-black/60'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              SSL Expiring Soon
            </span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-display font-bold text-amber-600 dark:text-amber-400 mt-1">
            {endpoints.filter(e => e.sslDaysRemaining < 30).length} Certs
          </p>
          <span className={`text-[10px] ${isLight ? 'text-amber-700' : 'text-amber-400/80'}`}>Action Required &lt; 30 Days</span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'glass-panel border-cyan-500/20 bg-black/60'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Average Latency
            </span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <p className={`text-2xl font-display font-bold mt-1 ${isLight ? 'text-indigo-700' : 'text-indigo-300'}`}>
            {Math.round(endpoints.reduce((acc, curr) => acc + curr.latencyMs, 0) / endpoints.length)} ms
          </p>
          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Fast Global Edge Route</span>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-black/60 border-cyan-500/20 glass-panel'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
            Real-Time Telemetry Polling Active across Global POPs
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStatusPageModal(true)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-cyan-500/30 text-cyan-300'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Status Page</span>
          </button>

          <button
            onClick={handlePingAll}
            disabled={isScanningAll}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningAll ? 'animate-spin' : ''}`} />
            <span>{isScanningAll ? 'Pinging Nodes...' : 'Ping All Endpoints'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Domain</span>
          </button>
        </div>
      </div>

      {/* Endpoints Inventory Grid */}
      <div className="space-y-3">
        {endpoints.map((ep) => {
          const isExpiringCritical = ep.sslDaysRemaining <= 7;
          const isExpiringWarning = ep.sslDaysRemaining > 7 && ep.sslDaysRemaining <= 30;

          return (
            <div
              key={ep.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-cyan-400 text-slate-800'
                  : 'glass-panel border-cyan-500/20 hover:border-cyan-400/40 bg-black/70'
              }`}
            >
              {/* Left Details */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    isLight ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {ep.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {ep.status} ({ep.httpStatus})
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-gray-400'
                  }`}>
                    {ep.type.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-gray-100'}`}>{ep.name}</h4>
                <a
                  href={ep.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-xs font-mono flex items-center gap-1 hover:underline truncate ${
                    isLight ? 'text-cyan-700' : 'text-cyan-400'
                  }`}
                >
                  <span>{ep.url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              {/* Middle SSL Telemetry Card */}
              <div className={`flex items-center gap-4 p-3 rounded-xl border text-xs font-mono shrink-0 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/40 border-white/5'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>SSL Expiration</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    isExpiringCritical ? 'text-red-500 animate-pulse' :
                    isExpiringWarning ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <Lock className="w-3.5 h-3.5" />
                    {ep.sslDaysRemaining} Days Left
                  </span>
                </div>

                <div className={`w-px h-8 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />

                <div>
                  <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Certificate Issuer</span>
                  <span className={`font-medium truncate max-w-[130px] block ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{ep.sslIssuer}</span>
                </div>

                <div className={`w-px h-8 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />

                <div>
                  <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Latency</span>
                  <span className={`font-bold ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>{ep.latencyMs} ms</span>
                </div>
              </div>

              {/* Right Uptime & Action */}
              <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                <div className="text-right">
                  <span className={`text-[10px] uppercase block ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>30D SLA</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{ep.uptimePercent}</span>
                </div>

                <button
                  onClick={() => {
                    soundService.playSuccessBeep();
                    setEndpoints(prev => prev.map(e => e.id === ep.id ? { ...e, latencyMs: Math.floor(Math.random() * 20) + 12, lastChecked: 'Just now' } : e));
                  }}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-cyan-800'
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                  }`}
                  title="Ping Endpoint Now"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Endpoint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'glass-panel border-cyan-500/40 bg-cyber-darker text-gray-100'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isLight ? 'border-slate-200' : 'border-cyan-500/20'
            }`}>
              <h3 className={`text-sm font-display font-bold uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-cyan-300'
              }`}>
                <Plus className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                <span>Add Corporate Domain to Monitor</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1 rounded-lg cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEndpoint} className="space-y-4 text-xs">
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  Service / System Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Enterprise Payment Webhook Server"
                  required
                  className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      : 'bg-black/60 border-cyan-500/20 text-gray-200 focus:border-cyan-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  Target Domain or URL
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://payments.company.com/health"
                  required
                  className={`w-full px-3.5 py-2 rounded-xl border font-mono text-[11px] focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      : 'bg-black/60 border-cyan-500/20 text-gray-200 focus:border-cyan-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  Infrastructure Category
                </label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                      : 'bg-black/60 border-cyan-500/20 text-cyan-300 focus:border-cyan-400'
                  }`}
                >
                  <option value="PRODUCTION_API">Production API</option>
                  <option value="AUTH_GATEWAY">Authentication Gateway</option>
                  <option value="CUSTOMER_PORTAL">Customer Portal</option>
                  <option value="DATABASE_CLUSTER">Database Cluster</option>
                  <option value="VPN_GATEWAY">VPN Perimeter</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-gray-400'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Start Monitoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Public Status Page View Modal */}
      {showStatusPageModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-3xl p-6 sm:p-8 rounded-3xl border space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'glass-panel border-cyan-500/40 bg-cyber-darker text-gray-100'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${
              isLight ? 'border-slate-200' : 'border-cyan-500/20'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-base font-display font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  All Systems Operational • Public Status Page
                </h3>
              </div>
              <button
                onClick={() => setShowStatusPageModal(false)}
                className={`p-1.5 rounded-lg cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Global Cloud Infrastructure & Edge Routing Healthy</p>
                <p className={`text-[11px] ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>All 5 production systems operating at 99.98% uptime SLA</p>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {endpoints.map((ep) => (
                <div key={ep.id} className={`p-3 rounded-xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/60 border-white/5'
                }`}>
                  <div>
                    <p className={`font-bold ${isLight ? 'text-slate-900' : 'text-gray-200'}`}>{ep.name}</p>
                    <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{ep.url}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    Operational ({ep.latencyMs}ms)
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowStatusPageModal(false)}
                className={`px-5 py-2 rounded-xl font-bold text-xs cursor-pointer ${
                  isLight
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm'
                    : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                }`}
              >
                Close Status Window
              </button>
            </div>
          </div>
        </div>
      )}

    </ViewContainer>
  );
}
