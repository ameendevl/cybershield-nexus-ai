import { useMemo, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { ViewContainer, CyberPanel, SectionTitle, SeverityBadge, StatusBadge, SearchInput } from '../ui/common';
import MetricCard from '../dashboard/MetricCard';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar } from 'recharts';
import { Server, Shield, Cpu, Wifi, Monitor, Database, Cloud, Smartphone, Network, Wrench } from 'lucide-react';
import { getSeverityColor } from '../../utils/mockData';

import { soundService } from '../../services/soundService';
import { Plus } from 'lucide-react';

const typeIcons: Record<string, typeof Server> = {
  server: Server, workstation: Monitor, network: Network, cloud: Cloud,
  database: Database, application: Cpu, mobile: Smartphone, iot: Wifi,
};

export default function AssetManagement() {
  const { assets } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newHostname, setNewHostname] = useState('');
  const [newIP, setNewIP] = useState('');
  const [newOS, setNewOS] = useState('Ubuntu 22.04 LTS');

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostname.trim()) return;

    soundService.playSuccessBeep();
    const newAst: any = {
      id: `AST-${Date.now()}`,
      name: newHostname.trim(),
      ip_address: newIP || '10.0.3.15',
      type: 'server',
      os_type: newOS,
      status: 'active',
      criticality: 'high',
      location: 'AWS us-east-1',
      last_seen: new Date().toISOString(),
    };

    assets.unshift(newAst);
    setNewHostname('');
    setNewIP('');
    setShowRegisterModal(false);
  };

  const handleQuarantineAsset = (assetName: string) => {
    soundService.playAlertAlarm();
    alert(`EDR Agent Signal Dispatched: Host ${assetName} has been Quarantined & Isolated from LAN.`);
  };

  const filtered = useMemo(() => {
    let result = assets;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q) || a.ip_address?.includes(q) || a.os_type?.toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') result = result.filter((a) => a.type === typeFilter);
    return result.slice(0, 50);
  }, [assets, search, typeFilter]);

  const stats = useMemo(() => {
    const active = assets.filter((a) => a.status === 'active').length;
    const critical = assets.filter((a) => a.criticality === 'critical').length;
    const maintenance = assets.filter((a) => a.status === 'maintenance').length;
    const total = assets.length;
    return { active, critical, maintenance, total };
  }, [assets]);

  const typeDist = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => { counts[a.type] = (counts[a.type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: getSeverityColor(name === 'server' ? 'critical' : name === 'cloud' ? 'high' : name === 'database' ? 'medium' : 'low') }));
  }, [assets]);

  const statusDist = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: name === 'active' ? '#00ff88' : name === 'maintenance' ? '#ffbe0b' : name === 'critical' ? '#ff0054' : '#4b5563' }));
  }, [assets]);

  const locationDist = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => { if (a.location) counts[a.location] = (counts[a.location] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const assetTypes = ['all', 'server', 'workstation', 'network', 'cloud', 'database', 'application', 'mobile', 'iot'];

  return (
    <ViewContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 font-mono">
        <SectionTitle title="Infrastructure Asset & EDR Management" subtitle="Inventory, monitor, and enforce EDR endpoint control across systems" icon={<Server className="w-6 h-6 text-cyan-400" />} />
        
        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 text-cyber-dark font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-cyber-dark font-bold" />
          <span>Register New Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Total Assets" value={stats.total} icon={<Server className="w-5 h-5" />} color="#00f0ff" subtitle="inventory" />
        <MetricCard title="Active" value={stats.active} icon={<Shield className="w-5 h-5" />} color="#00ff88" subtitle="operational" />
        <MetricCard title="Critical" value={stats.critical} icon={<Cpu className="w-5 h-5" />} color="#ff0054" subtitle="high priority" />
        <MetricCard title="In Maintenance" value={stats.maintenance} icon={<Wrench className="w-5 h-5" />} color="#ffbe0b" subtitle="offline" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <CyberPanel title="Asset Types" icon={<Cpu className="w-4 h-4" />}>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeDist} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                  {typeDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Asset Status" icon={<Shield className="w-4 h-4" />}>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={statusDist} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: '#1a1a2e' }} dataKey="value" cornerRadius={6} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Assets by Location" icon={<Network className="w-4 h-4" />}>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationDist}>
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(0,240,255,0.05)' }} />
                <Bar dataKey="value" fill="#00f0ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>
      </div>

      <CyberPanel
        title="Asset Inventory"
        icon={<Server className="w-4 h-4" />}
        action={<div className="w-48"><SearchInput value={search} onChange={setSearch} placeholder="Search assets..." /></div>}
      >
        <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-cyan-500/10 font-mono">
          {assetTypes.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase tracking-wider border transition-all capitalize ${
                typeFilter === t ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' : 'text-gray-600 border-cyan-500/10 hover:text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="max-h-[500px] overflow-y-auto divide-y divide-cyan-500/5 font-mono">
          {filtered.map((asset) => {
            const Icon = typeIcons[asset.type] || Server;
            return (
              <div key={asset.id} className="px-4 py-3 hover:bg-cyan-500/5 transition-colors flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-300 font-medium">{asset.name}</p>
                    <SeverityBadge severity={asset.criticality} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-[10px] text-gray-600 font-mono">{asset.ip_address}</span>
                    <span className="text-[10px] text-gray-600">{asset.os_type}</span>
                    <span className="text-[10px] text-gray-600">{asset.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={asset.status} />
                  <button
                    onClick={() => handleQuarantineAsset(asset.name)}
                    className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase transition-all"
                  >
                    Quarantine EDR
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </CyberPanel>

      {/* Register Asset Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRegisterAsset} className="w-full max-w-md p-5 rounded-2xl bg-cyber-darker border border-cyan-500/40 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Register Infrastructure Asset & EDR
              </span>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold"
              >
                Cancel ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Hostname / FQDN</label>
                <input
                  type="text"
                  placeholder="e.g. prod-db-01.cybershield.internal"
                  value={newHostname}
                  onChange={(e) => setNewHostname(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">IP Address</label>
                <input
                  type="text"
                  placeholder="e.g. 10.0.3.45"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Operating System</label>
                <select
                  value={newOS}
                  onChange={(e) => setNewOS(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/20 text-purple-300 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS</option>
                  <option value="Windows Server 2022">Windows Server 2022</option>
                  <option value="Red Hat Enterprise Linux 9">Red Hat Enterprise Linux 9</option>
                  <option value="Debian 12 Bookworm">Debian 12 Bookworm</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-cyber-dark font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              Enroll Asset into EDR Monitoring
            </button>
          </form>
        </div>
      )}
    </ViewContainer>
  );
}

