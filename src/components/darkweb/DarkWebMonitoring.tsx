import { useState } from 'react';
import { ViewContainer, CyberPanel, SectionTitle } from '../ui/common';
import { Eye, ShieldAlert, Lock, RefreshCw, CheckCircle2, Download, Search, Globe, Users } from 'lucide-react';
import { soundService } from '../../services/soundService';
import { exportToCSV } from '../../utils/exportUtils';

interface LeakedCredential {
  id: string;
  email: string;
  hashType: string;
  breachSource: string;
  leakDate: string;
  riskSeverity: 'critical' | 'high' | 'medium';
  status: 'exposed' | 'reset_forced' | 'resolved';
}

const mockLeaks: LeakedCredential[] = [
  { id: 'LEAK-101', email: 'vance.marcus@cybershield.ai', hashType: 'SHA-256 (Salted)', breachSource: 'BreachForums Telegram Dump', leakDate: '2026-08-28', riskSeverity: 'critical', status: 'exposed' },
  { id: 'LEAK-102', email: 'sec.analyst@cybershield.ai', hashType: 'Bcrypt', breachSource: 'Russian Market Leak', leakDate: '2026-08-15', riskSeverity: 'high', status: 'exposed' },
  { id: 'LEAK-103', email: 'dev.ops@cybershield.ai', hashType: 'MD5 (Legacy)', breachSource: 'Stealer Logs Collection', leakDate: '2026-08-01', riskSeverity: 'medium', status: 'resolved' },
  { id: 'LEAK-104', email: 'ceo.office@cybershield.ai', hashType: 'Natively Plaintext', breachSource: 'DarkNet Stealer Bundle v4', leakDate: '2026-08-30', riskSeverity: 'critical', status: 'exposed' },
];

const APT_GROUPS = [
  { name: 'Lazarus Group (APT38)', origin: 'North Korea', target: 'Financial & Crypto', threatLevel: 'CRITICAL', status: 'ACTIVE CAMPAIGN' },
  { name: 'LockBit 3.0 Ransomware', origin: 'Eastern Europe', target: 'Enterprise Infrastructure', threatLevel: 'CRITICAL', status: 'ACTIVE LEAK SITE' },
  { name: 'Fancy Bear (APT28)', origin: 'Russia', target: 'Defense & Aerospace', threatLevel: 'HIGH', status: 'MONITORED' },
  { name: 'FIN7 / Carbanak', origin: 'Global Syndicate', target: 'POS & E-Commerce', threatLevel: 'HIGH', status: 'MONITORED' }
];

export default function DarkWebMonitoring() {
  const [leaks, setLeaks] = useState<LeakedCredential[]>(mockLeaks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const handleRunDarkwebScan = () => {
    soundService.playAlertAlarm();
    setIsScanning(true);
    setTimeout(() => {
      soundService.playSuccessBeep();
      setIsScanning(false);
      setActionMsg('Dark Web Crawler completed: 4 Exposed Credentials & 2 Dark Forum Mentions Found!');
      setTimeout(() => setActionMsg(''), 4000);
    }, 2000);
  };

  const handleForceReset = (id: string) => {
    soundService.playSuccessBeep();
    setLeaks(prev =>
      prev.map(l => (l.id === id ? { ...l, status: 'reset_forced' } : l))
    );
    setActionMsg(`Force Password Reset & Active Session Invalidation dispatched for ${id}!`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleExportLeaks = () => {
    soundService.playSuccessBeep();
    exportToCSV('DarkWeb_Leaked_Credentials', leaks);
  };

  const filteredLeaks = leaks.filter(l =>
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.breachSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ViewContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionTitle
          title="Dark Web Intelligence & Credential Breach Monitor"
          subtitle="Continuous crawling of DarkNet markets, Telegram dump channels, stealer logs, and APT forums"
          icon={<Eye className="w-6 h-6 text-purple-400" />}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunDarkwebScan}
            disabled={isScanning}
            className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-purple-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Crawling Dark Web...' : 'Run Dark Web Scan'}</span>
          </button>

          <button
            onClick={handleExportLeaks}
            className="p-2 rounded-xl bg-black/60 border border-cyan-500/20 text-cyan-300 hover:text-cyan-200 transition-all"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-purple-500/15 border border-purple-400/50 text-purple-300 text-xs font-mono flex items-center gap-2 shadow-lg animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* APT Threat Actor Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {APT_GROUPS.map((apt, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-cyber-darker/90 border border-purple-500/30 font-mono space-y-2 shadow-xl hover:border-purple-400/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" /> {apt.origin}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[9px] font-bold border border-red-500/30">
                {apt.threatLevel}
              </span>
            </div>
            <h4 className="text-xs font-bold text-gray-100 truncate">{apt.name}</h4>
            <p className="text-[10px] text-gray-400">Primary Target: <span className="text-cyan-300">{apt.target}</span></p>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-purple-500/15">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" /> {apt.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Leaked Credentials Table */}
      <CyberPanel
        title="Exposed Corporate Credentials Feed"
        icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
        action={
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search email or leak source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-xl bg-black/80 border border-purple-500/30 text-gray-200 text-xs font-mono focus:outline-none focus:border-purple-400 w-48 sm:w-64"
            />
          </div>
        }
      >
        <div className="p-4 max-h-[500px] overflow-y-auto divide-y divide-purple-500/10 font-mono text-xs">
          {filteredLeaks.map((leak) => (
            <div key={leak.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-purple-500/5 px-2 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">{leak.id}</span>
                  <span className="text-gray-100 font-bold">{leak.email}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${leak.riskSeverity === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300'}`}>
                    {leak.riskSeverity}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Breach Source: <span className="text-cyan-300">{leak.breachSource}</span> ({leak.hashType})</p>
                <p className="text-[10px] text-gray-500">Leaked Date: {leak.leakDate}</p>
              </div>

              <div>
                {leak.status === 'reset_forced' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reset Triggered
                  </span>
                ) : (
                  <button
                    onClick={() => handleForceReset(leak.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                    <span>Force Password Reset</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CyberPanel>
    </ViewContainer>
  );
}

