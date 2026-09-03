import { useState } from 'react';
import { ViewContainer, CyberPanel, SectionTitle } from '../ui/common';
import { Server, Radio, Activity, CheckCircle2, AlertTriangle, Lock, Layers, Flame } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface NetworkNode {
  id: string;
  name: string;
  type: 'firewall' | 'router' | 'web_server' | 'database' | 'endpoint' | 'cloud';
  ip: string;
  status: 'healthy' | 'warning' | 'attacked' | 'isolated';
  trafficKbps: number;
  connections: string[];
  cpuUsage: number;
}

const initialNodes: NetworkNode[] = [
  { id: 'n1', name: 'Edge PaloAlto Firewall', type: 'firewall', ip: '192.168.1.1', status: 'healthy', trafficKbps: 4500, connections: ['n2', 'n3'], cpuUsage: 34 },
  { id: 'n2', name: 'DMZ NGINX Web Cluster', type: 'web_server', ip: '10.0.1.50', status: 'attacked', trafficKbps: 12800, connections: ['n1', 'n4'], cpuUsage: 89 },
  { id: 'n3', name: 'Internal Core Router', type: 'router', ip: '10.0.2.1', status: 'healthy', trafficKbps: 8200, connections: ['n1', 'n5', 'n6'], cpuUsage: 42 },
  { id: 'n4', name: 'PostgreSQL Database Primary', type: 'database', ip: '10.0.1.99', status: 'warning', trafficKbps: 3100, connections: ['n2'], cpuUsage: 67 },
  { id: 'n5', name: 'Active Directory DC-01', type: 'endpoint', ip: '10.0.2.10', status: 'healthy', trafficKbps: 1900, connections: ['n3'], cpuUsage: 28 },
  { id: 'n6', name: 'AWS Cloud Gateway (us-east-1)', type: 'cloud', ip: '54.210.12.88', status: 'healthy', trafficKbps: 9400, connections: ['n3'], cpuUsage: 45 },
];

export default function NetworkTopology() {
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(nodes[1]);
  const [isolationMsg, setIsolationMsg] = useState('');
  const [isInfectionSimActive, setIsInfectionSimActive] = useState(false);

  const handleIsolateNode = (nodeId: string) => {
    soundService.playAlertAlarm();
    setNodes(prev =>
      prev.map(n => (n.id === nodeId ? { ...n, status: 'isolated', trafficKbps: 0, cpuUsage: 5 } : n))
    );
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => (prev ? { ...prev, status: 'isolated', trafficKbps: 0, cpuUsage: 5 } : null));
    }
    setIsolationMsg(`Node ${nodeId} network traffic isolated & firewall zero-trust policy deployed!`);
    setTimeout(() => setIsolationMsg(''), 4000);
  };

  const handleRestoreNode = (nodeId: string) => {
    soundService.playSuccessBeep();
    setNodes(prev =>
      prev.map(n => (n.id === nodeId ? { ...n, status: 'healthy', trafficKbps: 2400, cpuUsage: 25 } : n))
    );
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => (prev ? { ...prev, status: 'healthy', trafficKbps: 2400, cpuUsage: 25 } : null));
    }
  };

  const handleSimulateInfection = () => {
    soundService.playAlertAlarm();
    setIsInfectionSimActive(true);
    setIsolationMsg('SIMULATION STARTED: Lateral Movement Malware spreading across subnets!');

    setTimeout(() => {
      setNodes(prev =>
        prev.map(n => (n.id === 'n4' || n.id === 'n3' ? { ...n, status: 'attacked', trafficKbps: 15400, cpuUsage: 98 } : n))
      );
      soundService.playAlertAlarm();
    }, 1500);

    setTimeout(() => {
      setIsInfectionSimActive(false);
      setIsolationMsg('SOAR Playbook Auto-Triggered: Lateral infection contained!');
      setTimeout(() => setIsolationMsg(''), 4000);
    }, 4500);
  };

  return (
    <ViewContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <SectionTitle
          title="Network Topology & Digital Twin Graph"
          subtitle="Real-time network node mapping, packet inspection, lateral movement tracing, and 1-click containment"
          icon={<Layers className="w-6 h-6 text-cyan-400" />}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateInfection}
            disabled={isInfectionSimActive}
            className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <Flame className={`w-4 h-4 text-red-400 ${isInfectionSimActive ? 'animate-bounce' : ''}`} />
            <span>{isInfectionSimActive ? 'Infection Spreading...' : 'Simulate Malware Infection'}</span>
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {isolationMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2 animate-pulse shadow-lg">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{isolationMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Visual Node Map */}
        <CyberPanel title="Live Infrastructure Digital Twin Map" icon={<Activity className="w-4 h-4" />} className="lg:col-span-2">
          <div className="p-6 min-h-[500px] bg-black/90 relative rounded-xl border border-cyan-500/15 overflow-hidden flex flex-col justify-between font-mono">
            
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.15) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
              }}
            />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const statusColor =
                  node.status === 'attacked'
                    ? 'border-red-500/60 bg-red-500/10 text-red-300 shadow-red-500/30'
                    : node.status === 'isolated'
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                    : node.status === 'warning'
                    ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-300'
                    : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-cyan-500/20';

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-105 shadow-xl relative ${statusColor} ${
                      isSelected ? 'ring-2 ring-cyan-400' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 border border-white/10">
                        {node.type}
                      </span>
                      <span className={`w-2.5 h-2.5 rounded-full ${node.status === 'attacked' ? 'bg-red-500 animate-ping' : node.status === 'isolated' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <Server className="w-4 h-4 text-cyan-400 shrink-0" />
                      <h4 className="text-xs font-bold truncate">{node.name}</h4>
                    </div>

                    <p className="text-[10px] text-gray-400 truncate">{node.ip}</p>
                    <div className="mt-3 grid grid-cols-2 gap-1 text-[9px] pt-2 border-t border-white/10">
                      <div>Traffic: <span className="font-bold text-cyan-300">{node.trafficKbps} Kbps</span></div>
                      <div>CPU Load: <span className="font-bold text-purple-300">{node.cpuUsage}%</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status Legend */}
            <div className="relative z-10 pt-4 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Healthy</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Under Attack</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Isolated</span>
              </div>
              <span>6 Monitored Infrastructure Nodes</span>
            </div>

          </div>
        </CyberPanel>

        {/* Right Col: Node Inspector & Controls */}
        <CyberPanel title="Node Inspector & Action Controls" icon={<Radio className="w-4 h-4" />}>
          <div className="p-5 space-y-4 font-mono text-xs">
            {selectedNode ? (
              <>
                <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 uppercase">Selected Target</span>
                    <span className="text-cyan-400 font-bold">{selectedNode.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-100">{selectedNode.name}</h3>
                  <p className="text-xs text-cyan-300">{selectedNode.ip}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Node Status:</span>
                    <span className={`font-bold uppercase ${selectedNode.status === 'attacked' ? 'text-red-400' : selectedNode.status === 'isolated' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {selectedNode.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Live Throughput:</span>
                    <span className="font-bold text-emerald-400">{selectedNode.trafficKbps} Kbps</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">CPU Workload:</span>
                    <span className="font-bold text-purple-400">{selectedNode.cpuUsage}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800">
                    <span className="text-gray-400">Connected Neighbors:</span>
                    <span className="font-bold text-cyan-300">{selectedNode.connections.join(', ')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 space-y-2">
                  {selectedNode.status === 'isolated' ? (
                    <button
                      onClick={() => handleRestoreNode(selectedNode.id)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Restore Network Connectivity</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleIsolateNode(selectedNode.id)}
                      className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20"
                    >
                      <Lock className="w-4 h-4 text-red-400" />
                      <span>Isolate Node from Network</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic text-center py-10">Select a node from the topology map to inspect.</p>
            )}
          </div>
        </CyberPanel>

      </div>

      {/* Live PCAP Packet Capture Stream Table */}
      <CyberPanel title="Live Node PCAP Packet Inspection Feed" icon={<Activity className="w-4 h-4 text-cyan-400" />} className="mt-6">
        <div className="p-4 max-h-56 overflow-y-auto divide-y divide-cyan-500/10 font-mono text-xs">
          <div className="py-1 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase border-b border-cyan-500/20">
            <span>Timestamp</span>
            <span>Protocol</span>
            <span>Source IP:Port</span>
            <span>Destination IP:Port</span>
            <span>Packet Payload Summary</span>
            <span>Status</span>
          </div>
          <div className="py-2 flex items-center justify-between hover:bg-cyan-500/5 px-2 rounded">
            <span className="text-gray-500">12:38:04.102</span>
            <span className="text-purple-400 font-bold">TCP [SYN]</span>
            <span className="text-cyan-300">45.33.32.156:58412</span>
            <span className="text-emerald-400">10.0.1.50:443</span>
            <span className="text-gray-300 truncate">TLS 1.3 Client Hello (SNI: api.cybershield.ai)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">PASS</span>
          </div>
          <div className="py-2 flex items-center justify-between hover:bg-cyan-500/5 px-2 rounded">
            <span className="text-gray-500">12:38:04.288</span>
            <span className="text-red-400 font-bold">HTTP [POST]</span>
            <span className="text-red-400 font-bold">185.220.101.5:4444</span>
            <span className="text-cyan-300">10.0.1.99:5432</span>
            <span className="text-red-300 font-bold truncate">PostgreSQL 'UNION SELECT pg_sleep(10)'</span>
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[9px] font-bold border border-red-500/30">BLOCKED</span>
          </div>
          <div className="py-2 flex items-center justify-between hover:bg-cyan-500/5 px-2 rounded">
            <span className="text-gray-500">12:38:04.510</span>
            <span className="text-cyan-400 font-bold">UDP [DNS]</span>
            <span className="text-cyan-300">10.0.2.10:53</span>
            <span className="text-gray-300">8.8.8.8:53</span>
            <span className="text-gray-300 truncate">Standard Query A c2.darknet-bot.xyz</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">FLAGGED</span>
          </div>
        </div>
      </CyberPanel>
    </ViewContainer>
  );
}

