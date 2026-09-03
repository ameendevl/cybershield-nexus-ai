import { useState } from 'react';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import { 
  Lock, XCircle, Plus, Users, Building, Activity, 
  RefreshCw, X
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface UserRole {
  id: string;
  name: string;
  email: string;
  role: 'CISO' | 'TIER_3_LEAD' | 'TIER_1_ANALYST' | 'AUDITOR';
  mfaEnforced: boolean;
  status: 'ACTIVE' | 'REVOKED';
  lastActive: string;
  sessionIp: string;
}

interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  status: 'SUCCESS' | 'BLOCKED';
}

const INITIAL_IAM_USERS: UserRole[] = [
  { id: 'IAM-01', name: 'Commander Marcus Vance', email: 'sec.analyst@cybershield.ai', role: 'CISO', mfaEnforced: true, status: 'ACTIVE', lastActive: 'Just now', sessionIp: '192.168.1.104' },
  { id: 'IAM-02', name: 'Sarah Vance, CISSP', email: 'sarah.vance@cybershield.ai', role: 'TIER_3_LEAD', mfaEnforced: true, status: 'ACTIVE', lastActive: '8m ago', sessionIp: '10.0.4.12' },
  { id: 'IAM-03', name: 'J. Chen (Malware Analyst)', email: 'j.chen@cybershield.ai', role: 'TIER_3_LEAD', mfaEnforced: true, status: 'ACTIVE', lastActive: '25m ago', sessionIp: '10.0.4.18' },
  { id: 'IAM-04', name: 'M. Patel (Triage Specialist)', email: 'm.patel@cybershield.ai', role: 'TIER_1_ANALYST', mfaEnforced: true, status: 'ACTIVE', lastActive: '1h ago', sessionIp: '10.0.4.22' },
  { id: 'IAM-05', name: 'BSI External Compliance Auditor', email: 'auditor@bsi-assurance.org', role: 'AUDITOR', mfaEnforced: false, status: 'ACTIVE', lastActive: 'Yesterday', sessionIp: '194.71.107.5' },
];

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  { id: 'AUD-991', actor: 'Commander Marcus Vance', action: 'Approved Firewall Auto-Block Policy #9901', resource: 'Perimeter NextGen Firewall', timestamp: 'Just now', ipAddress: '192.168.1.104', status: 'SUCCESS' },
  { id: 'AUD-990', actor: 'Sarah Vance, CISSP', action: 'Exported ISO 27001 Executive Boardroom PDF', resource: 'Compliance Engine', timestamp: '12m ago', ipAddress: '10.0.4.12', status: 'SUCCESS' },
  { id: 'AUD-989', actor: 'Unknown Entity (Attempt)', action: 'Unauthorized SSH Access to Ingestion Cluster', resource: 'SSH Port 2222', timestamp: '1h ago', ipAddress: '185.220.101.4', status: 'BLOCKED' },
  { id: 'AUD-988', actor: 'J. Chen', action: 'Decompiled Emotet Payload in Malware Sandbox', resource: 'Sandbox VM-02', timestamp: '2h ago', ipAddress: '10.0.4.18', status: 'SUCCESS' },
];

export default function ZeroTrustIAM() {
  const [users, setUsers] = useState<UserRole[]>(INITIAL_IAM_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Organization Details State
  const [orgName, setOrgName] = useState('Nexus Cyber Defense Global Ltd.');
  const [orgDomain, setOrgDomain] = useState('nexus-defense.io');
  const [ssoProvider, setSsoProvider] = useState<'OKTA' | 'AZURE_AD' | 'GOOGLE_WORKSPACE' | 'NATIVE_MFA'>('OKTA');

  // New Invite State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole['role']>('TIER_1_ANALYST');

  const handleRevokeSession = (id: string, name: string) => {
    soundService.playAlertAlarm();
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 'REVOKED' } : u));

    const newLog: AuditEvent = {
      id: `AUD-${Math.floor(Math.random() * 900) + 100}`,
      actor: 'CISO Master Admin',
      action: `Revoked Security Session for ${name}`,
      resource: 'Zero-Trust IAM Vault',
      timestamp: 'Just now',
      ipAddress: '192.168.1.104',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleRestoreSession = (id: string) => {
    soundService.playSuccessBeep();
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 'ACTIVE' } : u));
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    soundService.playSuccessBeep();
    const newUser: UserRole = {
      id: `IAM-0${users.length + 1}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      mfaEnforced: true,
      status: 'ACTIVE',
      lastActive: 'Invited (Pending First MFA Login)',
      sessionIp: 'Pending',
    };

    setUsers((prev) => [newUser, ...prev]);

    const newLog: AuditEvent = {
      id: `AUD-${Math.floor(Math.random() * 900) + 100}`,
      actor: 'CISO Master Admin',
      action: `Invited new ${inviteRole} clearance for ${inviteName}`,
      resource: 'Team Role Provisioner',
      timestamp: 'Just now',
      ipAddress: '192.168.1.104',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <ViewContainer>
      <SectionTitle
        title="Multi-Tenant Organization & Team RBAC Clearance"
        subtitle="Manage corporate tenant settings, analyst clearance tiers, WebAuthn MFA enforcement, and real-time SOC activity audit logs"
        icon={<Lock className="w-6 h-6 text-cyan-400" />}
      />

      {/* Organization Settings Banner */}
      <CyberPanel title="Corporate Organization & Identity Federation Hub" icon={<Building className="w-4 h-4 text-cyan-400" />}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/20 text-cyan-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Corporate Domain
            </label>
            <input
              type="text"
              value={orgDomain}
              onChange={(e) => setOrgDomain(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/20 text-cyan-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Enterprise SSO Integration
            </label>
            <select
              value={ssoProvider}
              onChange={(e: any) => setSsoProvider(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/20 text-emerald-300 focus:outline-none focus:border-cyan-400 font-bold"
            >
              <option value="OKTA">Okta Enterprise SSO (SAML 2.0)</option>
              <option value="AZURE_AD">Microsoft Entra ID (Azure AD)</option>
              <option value="GOOGLE_WORKSPACE">Google Workspace SSO</option>
              <option value="NATIVE_MFA">CyberShield Hardware WebAuthn</option>
            </select>
          </div>
        </div>
      </CyberPanel>

      {/* Team Roster Header Actions */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-black/60 border border-cyan-500/20 glass-panel">
        <div>
          <h3 className="text-sm font-display font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Active Team Clearance Roster ({users.length})</span>
          </h3>
          <p className="text-xs text-gray-400">
            {users.filter(u => u.status === 'ACTIVE').length} active analysts with authenticated cryptographic tokens
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Security Analyst</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="space-y-3">
        {users.map((u) => {
          const isRevoked = u.status === 'REVOKED';

          return (
            <div
              key={u.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
                isRevoked ? 'bg-red-950/20 border-red-500/30 opacity-75' : 'bg-black/70 border-cyan-500/20 hover:border-cyan-400/40'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                    u.role === 'CISO' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    u.role === 'TIER_3_LEAD' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                    u.role === 'TIER_1_ANALYST' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {u.role.replace(/_/g, ' ')}
                  </span>

                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                    isRevoked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {u.status}
                  </span>

                  {u.mfaEnforced && (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                      FIDO2 / MFA ACTIVE
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-gray-100">{u.name}</h4>
                <p className="text-xs text-gray-400 font-mono">{u.email}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-gray-400 shrink-0">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Last Active</span>
                  <span className="text-gray-200">{u.lastActive}</span>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Session IP</span>
                  <span className="text-cyan-300">{u.sessionIp}</span>
                </div>
              </div>

              <div className="shrink-0 self-end md:self-center">
                {isRevoked ? (
                  <button
                    onClick={() => handleRestoreSession(u.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-Authorize</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRevokeSession(u.id, u.name)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Revoke Clearance</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-Time SOC Audit Trail Table */}
      <CyberPanel title="SOC Activity & Governance Audit Trail (Immutable Log)" icon={<Activity className="w-4 h-4 text-emerald-400" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/60 text-gray-400 uppercase text-[10px] border-b border-cyan-500/20">
              <tr>
                <th className="p-3">Audit Event ID</th>
                <th className="p-3">Operator / Actor</th>
                <th className="p-3">Action Executed</th>
                <th className="p-3">Resource Target</th>
                <th className="p-3">Origin IP</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="p-3 text-cyan-300 font-bold">{log.id}</td>
                  <td className="p-3 text-gray-200 font-bold">{log.actor}</td>
                  <td className="p-3 text-gray-300">{log.action}</td>
                  <td className="p-3 text-cyan-400">{log.resource}</td>
                  <td className="p-3 text-gray-400">{log.ipAddress}</td>
                  <td className="p-3 text-gray-500">{log.timestamp}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberPanel>

      {/* Invite Team Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-cyan-500/40 space-y-4 shadow-2xl bg-cyber-darker">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <h3 className="text-sm font-display font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Invite SOC Security Specialist</span>
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Analyst Full Legal Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Emily Thorne"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-gray-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Corporate Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.thorne@nexus-defense.io"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-gray-200 font-mono text-[11px] focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  Security Clearance Tier
                </label>
                <select
                  value={inviteRole}
                  onChange={(e: any) => setInviteRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-cyan-300 focus:outline-none focus:border-cyan-400 font-bold"
                >
                  <option value="TIER_1_ANALYST">Tier 1 SOC Analyst (Triage & Monitoring)</option>
                  <option value="TIER_3_LEAD">Tier 3 Lead (Incident Responder & Forensics)</option>
                  <option value="CISO">CISO / SuperAdmin (Full Governance Clearance)</option>
                  <option value="AUDITOR">External Compliance Auditor (Read-Only Attestation)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Issue Clearance Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </ViewContainer>
  );
}
