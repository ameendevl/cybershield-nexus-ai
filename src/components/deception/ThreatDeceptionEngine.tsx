import { useState } from 'react';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { Radio, AlertOctagon, Plus } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface CanaryDecoy {
  id: string;
  name: string;
  type: 'HONEY_CREDENTIAL' | 'DECOY_FILE' | 'HONEY_PORT' | 'CANARY_TOKEN';
  location: string;
  status: 'ARMED' | 'TRIGGERED';
  triggersCount: number;
}

const INITIAL_DECOYS: CanaryDecoy[] = [
  { id: 'DEC-01', name: 'AD Admin Honey-Credential (svc_backup_admin)', type: 'HONEY_CREDENTIAL', location: 'Active Directory Domain DC01', status: 'ARMED', triggersCount: 0 },
  { id: 'DEC-02', name: 'Confidential Financial Decoy File (passwords_2026.xlsx)', type: 'DECOY_FILE', location: '\\\\FIN-SRV-01\\Share\\Confidential', status: 'TRIGGERED', triggersCount: 3 },
  { id: 'DEC-03', name: 'Decoy SSH Honey-Port (2222)', type: 'HONEY_PORT', location: 'Core Router 10.0.1.1:2222', status: 'ARMED', triggersCount: 0 },
  { id: 'DEC-04', name: 'AWS Decoy API Secret Key (AKIAIOSFODNN7EXAMPLE)', type: 'CANARY_TOKEN', location: 'Dev Workstation Workload', status: 'TRIGGERED', triggersCount: 1 },
];

export default function ThreatDeceptionEngine() {
  const [decoys, setDecoys] = useState<CanaryDecoy[]>(INITIAL_DECOYS);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [newDecoyName, setNewDecoyName] = useState('');
  const [newDecoyType, setNewDecoyType] = useState<'HONEY_CREDENTIAL' | 'DECOY_FILE' | 'HONEY_PORT' | 'CANARY_TOKEN'>('HONEY_CREDENTIAL');

  const handleDeployDecoy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecoyName.trim()) return;

    soundService.playSuccessBeep();
    const newDec: CanaryDecoy = {
      id: `DEC-0${decoys.length + 1}`,
      name: newDecoyName.trim(),
      type: newDecoyType,
      location: 'Enterprise Network Segment',
      status: 'ARMED',
      triggersCount: 0,
    };

    setDecoys((prev) => [newDec, ...prev]);
    setNewDecoyName('');
    setShowDeployModal(false);
  };

  return (
    <ViewContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 font-mono">
        <SectionTitle
          title="Threat Deception & Canary Tokens Engine"
          subtitle="Deploy honeypots, honey-credentials, decoy files, and intruder trap alerts"
          icon={<Radio className="w-6 h-6 text-amber-400" />}
        />

        <button
          onClick={() => setShowDeployModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Deploy New Canary Trap</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-cyber-darker border border-amber-500/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Armed Decoys</p>
          <p className="text-xl font-bold text-amber-400 mt-1">{decoys.filter(d => d.status === 'ARMED').length} Active Traps</p>
          <p className="text-[9px] text-gray-500">Monitoring Intruder Touches</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyber-darker border border-red-500/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Triggered Traps</p>
          <p className="text-xl font-bold text-red-400 mt-1">{decoys.filter(d => d.status === 'TRIGGERED').length} Intrusion Alerts</p>
          <p className="text-[9px] text-gray-500">Attacker Infiltration Flagged</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyber-darker border border-cyan-500/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Total Interceptions</p>
          <p className="text-xl font-bold text-cyan-300 mt-1">4 Touches</p>
          <p className="text-[9px] text-gray-500">100% Zero False Positive</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyber-darker border border-emerald-500/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold">SOAR Auto-Containment</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">ACTIVE</p>
          <p className="text-[9px] text-gray-500">1-Click Host Quarantine</p>
        </div>
      </div>

      <CyberPanel title="Active Deception Traps & Canary Token Inventory" icon={<AlertOctagon className="w-4 h-4 text-amber-400" />}>
        <div className="p-4 space-y-3 font-mono text-xs">
          <div className="space-y-2.5">
            {decoys.map((d) => (
              <div
                key={d.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  d.status === 'TRIGGERED'
                    ? 'bg-red-950/20 border-red-500/40'
                    : 'bg-black/80 border-amber-500/20'
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      {d.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        d.status === 'TRIGGERED'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {d.status === 'TRIGGERED' ? '⚠️ TRAP TRIGGERED!' : 'ARMED'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-100">{d.name}</h4>
                  <p className="text-[10px] text-cyan-300">Location: {d.location}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  <span className="text-[10px] text-gray-400 font-bold">{d.triggersCount} Touches</span>
                  {d.status === 'TRIGGERED' && (
                    <button
                      onClick={() => {
                        soundService.playAlertAlarm();
                        alert(`Triggering SOAR Active Isolation for intruder interacting with ${d.name}!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase shadow-md"
                    >
                      Isolate Attacker Host
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CyberPanel>

      {/* Deploy Decoy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleDeployDecoy} className="w-full max-w-md p-5 rounded-2xl bg-cyber-darker border border-amber-500/40 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" /> Deploy New Canary Deception Trap
              </span>
              <button
                type="button"
                onClick={() => setShowDeployModal(false)}
                className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold"
              >
                Cancel ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Decoy Trap Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fake Azure Storage Connection String"
                  value={newDecoyName}
                  onChange={(e) => setNewDecoyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-amber-500/20 text-gray-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Trap Type</label>
                <select
                  value={newDecoyType}
                  onChange={(e) => setNewDecoyType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-amber-500/20 text-amber-300 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="HONEY_CREDENTIAL">Honey-Credential (Active Directory)</option>
                  <option value="DECOY_FILE">Decoy File (Word / Excel Honey-token)</option>
                  <option value="HONEY_PORT">Honey-Port (Fake Telnet / RDP Listener)</option>
                  <option value="CANARY_TOKEN">Canary Token (Fake AWS API Key)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              Arm Canary Trap
            </button>
          </form>
        </div>
      )}
    </ViewContainer>
  );
}
