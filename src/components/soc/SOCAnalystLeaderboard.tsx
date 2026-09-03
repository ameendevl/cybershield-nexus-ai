import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { Trophy, Award } from 'lucide-react';

interface AnalystRecord {
  rank: number;
  name: string;
  role: string;
  incidentsResolved: number;
  avgSlaMinutes: number;
  threatHuntPoints: number;
  shiftStatus: 'ON SHIFT' | 'OFF SHIFT' | 'STANDBY';
  avatar: string;
}

const ANALYSTS: AnalystRecord[] = [
  { rank: 1, name: 'Commander Sarah Vance', role: 'Director of Cybersecurity', incidentsResolved: 142, avgSlaMinutes: 3.4, threatHuntPoints: 1850, shiftStatus: 'ON SHIFT', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Senior Analyst J. Chen', role: 'Lead Incident Commander', incidentsResolved: 118, avgSlaMinutes: 4.1, threatHuntPoints: 1620, shiftStatus: 'ON SHIFT', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Analyst M. Patel', role: 'Tier 2 Malware Investigator', incidentsResolved: 95, avgSlaMinutes: 5.2, threatHuntPoints: 1410, shiftStatus: 'STANDBY', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Specialist S. Rodriguez', role: 'Tier 1 Triage Analyst', incidentsResolved: 84, avgSlaMinutes: 6.0, threatHuntPoints: 1200, shiftStatus: 'OFF SHIFT', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
];

export default function SOCAnalystLeaderboard() {
  return (
    <ViewContainer>
      <SectionTitle
        title="SOC Analyst Performance & Shift Roster Leaderboard"
        subtitle="Analyst SLA response metrics, threat hunting scores, and active shift roster telemetry"
        icon={<Trophy className="w-6 h-6 text-amber-400" />}
      />

      <CyberPanel title="SOC Security Command Leaderboard & Shift Telemetry" icon={<Award className="w-4 h-4 text-amber-400" />}>
        <div className="p-4 space-y-4 font-mono text-xs">
          
          <div className="space-y-2.5">
            {ANALYSTS.map((a) => (
              <div
                key={a.rank}
                className="p-3.5 rounded-xl bg-black/80 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      a.rank === 1
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40 ring-2 ring-amber-300'
                        : a.rank === 2
                        ? 'bg-gray-300 text-black'
                        : 'bg-amber-900/40 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    #{a.rank}
                  </div>

                  <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30 shrink-0" />

                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-100 truncate">{a.name}</h4>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          a.shiftStatus === 'ON SHIFT'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : a.shiftStatus === 'STANDBY'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-gray-800 text-gray-500'
                        }`}
                      >
                        {a.shiftStatus}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">{a.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-right shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-500/10">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase">Resolved</span>
                    <p className="text-xs font-bold text-emerald-400">{a.incidentsResolved} Tickets</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase">Avg SLA</span>
                    <p className="text-xs font-bold text-cyan-300">{a.avgSlaMinutes} mins</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase">Hunt Pts</span>
                    <p className="text-xs font-bold text-purple-300">{a.threatHuntPoints} Pts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </CyberPanel>
    </ViewContainer>
  );
}
