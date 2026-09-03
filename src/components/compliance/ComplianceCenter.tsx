import { useState, useMemo } from 'react';
import { ViewContainer, CyberPanel, SectionTitle } from '../ui/common';
import MetricCard from '../dashboard/MetricCard';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar } from 'recharts';
import { ScrollText, CheckCircle, AlertTriangle, FileCheck, Shield, Download } from 'lucide-react';

interface ControlItem {
  id: string;
  framework: string;
  controlId: string;
  controlName: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_assessed';
  evidence: string[];
  assessor: string;
  assessedAt: string | null;
}

const frameworks = ['SOC 2', 'ISO 27001', 'PCI DSS', 'NIST 800-53', 'GDPR', 'HIPAA'];

const mockControls: ControlItem[] = [
  { id: '1', framework: 'SOC 2', controlId: 'CC6.1', controlName: 'Logical and Physical Access Controls', description: 'The entity implements logical access controls to protect against unauthorized access.', status: 'compliant', evidence: ['access_policy.pdf', 'iam_config.json'], assessor: 'KPMG', assessedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: '2', framework: 'SOC 2', controlId: 'CC7.2', controlName: 'System Monitoring', description: 'The entity monitors system components for anomalies.', status: 'compliant', evidence: ['siem_config.pdf', 'alert_logs.json'], assessor: 'KPMG', assessedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: '3', framework: 'SOC 2', controlId: 'CC7.4', controlName: 'Incident Response', description: 'The entity responds to identified incidents.', status: 'in_progress', evidence: ['ir_plan_v2.pdf'], assessor: 'KPMG', assessedAt: null },
  { id: '4', framework: 'ISO 27001', controlId: 'A.5.1', controlName: 'Information Security Policy', description: 'Management direction and support for information security.', status: 'compliant', evidence: ['security_policy.pdf'], assessor: 'BSI', assessedAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: '5', framework: 'ISO 27001', controlId: 'A.12.6', controlName: 'Technical Vulnerability Management', description: 'Timely information about technical vulnerabilities and evaluation of exposure.', status: 'non_compliant', evidence: [], assessor: 'BSI', assessedAt: null },
  { id: '6', framework: 'PCI DSS', controlId: '6.5.1', controlName: 'Vulnerability Scanning', description: 'Address vulnerabilities by scanning and patching systems.', status: 'in_progress', evidence: ['scan_report_q3.pdf'], assessor: 'QSA', assessedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: '7', framework: 'NIST 800-53', controlId: 'AC-2', controlName: 'Account Management', description: 'Manage system accounts, establish conditions for group membership.', status: 'compliant', evidence: ['account_mgmt.pdf', 'iam_logs.json'], assessor: 'Internal', assessedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: '8', framework: 'NIST 800-53', controlId: 'SI-4', controlName: 'System Monitoring', description: 'Monitor the system for attacks and indicators of attacks.', status: 'compliant', evidence: ['monitoring_config.pdf'], assessor: 'Internal', assessedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: '9', framework: 'GDPR', controlId: 'Art.32', controlName: 'Security of Processing', description: 'Implement appropriate technical and organizational measures.', status: 'not_assessed', evidence: [], assessor: 'DPO', assessedAt: null },
  { id: '10', framework: 'HIPAA', controlId: '164.308', controlName: 'Administrative Safeguards', description: 'Security management processes to protect ePHI.', status: 'compliant', evidence: ['hipaa_policy.pdf'], assessor: 'OCR', assessedAt: new Date(Date.now() - 30 * 86400000).toISOString() },
];

const statusColors: Record<string, string> = {
  compliant: '#00ff88',
  non_compliant: '#ff0054',
  in_progress: '#ffbe0b',
  not_assessed: '#4b5563',
};

export default function ComplianceCenter() {
  const [selectedFramework, setSelectedFramework] = useState('all');

  const filtered = useMemo(() => {
    if (selectedFramework === 'all') return mockControls;
    return mockControls.filter((c) => c.framework === selectedFramework);
  }, [selectedFramework]);

  const stats = useMemo(() => {
    const compliant = mockControls.filter((c) => c.status === 'compliant').length;
    const nonCompliant = mockControls.filter((c) => c.status === 'non_compliant').length;
    const inProgress = mockControls.filter((c) => c.status === 'in_progress').length;
    const notAssessed = mockControls.filter((c) => c.status === 'not_assessed').length;
    return { compliant, nonCompliant, inProgress, notAssessed };
  }, []);

  const complianceScore = Math.round((stats.compliant / mockControls.length) * 100);

  const frameworkData = useMemo(() => {
    return frameworks.map((fw) => {
      const controls = mockControls.filter((c) => c.framework === fw);
      const compliant = controls.filter((c) => c.status === 'compliant').length;
      const score = controls.length > 0 ? Math.round((compliant / controls.length) * 100) : 0;
      return { name: fw, score, fill: score > 70 ? '#00ff88' : score > 40 ? '#ffbe0b' : '#ff0054' };
    });
  }, []);

  const statusData = [
    { name: 'Compliant', value: stats.compliant, fill: '#00ff88' },
    { name: 'Non-Compliant', value: stats.nonCompliant, fill: '#ff0054' },
    { name: 'In Progress', value: stats.inProgress, fill: '#ffbe0b' },
    { name: 'Not Assessed', value: stats.notAssessed, fill: '#4b5563' },
  ];

  return (
    <ViewContainer>
      <SectionTitle title="Compliance Center" subtitle="Track compliance across regulatory frameworks and standards" icon={<ScrollText className="w-6 h-6" />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard title="Overall Score" value={`${complianceScore}%`} icon={<CheckCircle className="w-5 h-5" />} color={complianceScore > 70 ? '#00ff88' : '#ffbe0b'} subtitle="compliance" />
        <MetricCard title="Compliant" value={stats.compliant} icon={<FileCheck className="w-5 h-5" />} color="#00ff88" subtitle="controls" />
        <MetricCard title="Non-Compliant" value={stats.nonCompliant} icon={<AlertTriangle className="w-5 h-5" />} color="#ff0054" subtitle="violations" />
        <MetricCard title="In Progress" value={stats.inProgress + stats.notAssessed} icon={<ScrollText className="w-5 h-5" />} color="#ffbe0b" subtitle="pending" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <CyberPanel title="Framework Compliance Scores" icon={<Shield className="w-4 h-4" />} className="lg:col-span-2">
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frameworkData}>
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                <YAxis stroke="#4b5563" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'rgba(0,240,255,0.05)' }} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {frameworkData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CyberPanel>

        <CyberPanel title="Control Status" icon={<FileCheck className="w-4 h-4" />}>
          <div className="p-4 h-64 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="60%">
              <RadialBarChart innerRadius="40%" outerRadius="100%" data={statusData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: '#1a1a2e' }} dataKey="value" cornerRadius={6} />
                <Tooltip contentStyle={{ background: '#0a0e17', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.fill }} />
                  <span className="text-[10px] text-gray-500">{s.name}</span>
                  <span className="text-[10px] font-bold ml-auto" style={{ color: s.fill }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CyberPanel>
      </div>

      {/* Framework filter */}
      <CyberPanel
        title="Compliance Controls"
        icon={<ScrollText className="w-4 h-4" />}
        action={<button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 hover:bg-cyan-500/20 transition-all"><Download className="w-3.5 h-3.5" /> Export Report</button>}
      >
        <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-cyan-500/10">
          {['all', ...frameworks].map((fw) => (
            <button
              key={fw}
              onClick={() => setSelectedFramework(fw)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase tracking-wider border transition-all ${
                selectedFramework === fw ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' : 'text-gray-600 border-cyan-500/10 hover:text-gray-400'
              }`}
            >
              {fw === 'all' ? 'All Frameworks' : fw}
            </button>
          ))}
        </div>
        <div className="divide-y divide-cyan-500/5 max-h-[500px] overflow-y-auto">
          {filtered.map((control) => (
            <div key={control.id} className="px-4 py-3 hover:bg-cyan-500/5 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-1 h-full rounded-full shrink-0 self-stretch" style={{ backgroundColor: statusColors[control.status] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-cyan-400">{control.controlId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-secondary/15 text-cyber-secondary border border-cyber-secondary/30">{control.framework}</span>
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{control.controlName}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{control.description}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {control.evidence.map((e) => (
                      <span key={e} className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 flex items-center gap-1">
                        <FileCheck className="w-3 h-3" /> {e}
                      </span>
                    ))}
                    {control.assessedAt && <span className="text-[10px] text-gray-700">Assessed by {control.assessor} · {new Date(control.assessedAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                <span
                  className="text-[10px] px-2 py-1 rounded uppercase font-bold shrink-0"
                  style={{ color: statusColors[control.status], backgroundColor: `${statusColors[control.status]}15`, border: `1px solid ${statusColors[control.status]}30` }}
                >
                  {control.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CyberPanel>
    </ViewContainer>
  );
}
