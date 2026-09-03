import { useApp } from '../../store/AppContext';
import { SeverityBadge, StatusBadge, timeAgo, CyberPanel, EmptyState } from '../ui/common';
import { AlertTriangle, CheckCircle, Filter, Inbox } from 'lucide-react';
import { useMemo, useState } from 'react';

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export default function AlertList({ maxAlerts }: { maxAlerts?: number }) {
  const { alerts, acknowledgeAlert } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = [...alerts].sort((a, b) => {
      const sevDiff = severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
      if (sevDiff !== 0) return sevDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    if (filter !== 'all') result = result.filter((a) => a.status === filter);
    if (severityFilter !== 'all') result = result.filter((a) => a.severity === severityFilter);
    if (maxAlerts) result = result.slice(0, maxAlerts);
    return result;
  }, [alerts, filter, severityFilter, maxAlerts]);

  const statusFilters = ['all', 'new', 'in_progress', 'acknowledged', 'resolved', 'dismissed'];
  const severityFilters = ['all', 'critical', 'high', 'medium', 'low'];

  return (
    <CyberPanel
      title="Live Alert Stream"
      icon={<AlertTriangle className="w-4 h-4" />}
      action={
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs text-gray-500">{filtered.length} alerts</span>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b border-cyan-500/10">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase tracking-wider border transition-all ${
              filter === s ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' : 'text-gray-600 border-cyan-500/10 hover:text-gray-400'
            }`}
          >
            {s === 'all' ? 'All Status' : s.replace(/_/g, ' ')}
          </button>
        ))}
        <div className="w-px h-4 bg-cyan-500/15 mx-1" />
        {severityFilters.map((s) => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase tracking-wider border transition-all ${
              severityFilter === s ? 'bg-cyber-error/15 text-cyber-error border-cyber-error/40' : 'text-gray-600 border-cyan-500/10 hover:text-gray-400'
            }`}
          >
            {s === 'all' ? 'All Severity' : s}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="max-h-[600px] overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState message="No alerts matching current filters" icon={<Inbox className="w-8 h-8" />} />
        ) : (
          <div className="divide-y divide-cyan-500/5">
            {filtered.map((alert) => (
              <div
                key={alert.id}
                className="px-4 py-3 hover:bg-cyan-500/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.severity === 'critical' ? 'bg-cyber-error animate-pulse' :
                        alert.severity === 'high' ? 'bg-cyber-warning' :
                        alert.severity === 'medium' ? 'bg-cyber-success' : 'bg-cyan-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={alert.severity} />
                      <span className="text-[10px] text-gray-600 font-mono">{alert.rule_id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-medium">{alert.source}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{alert.title}</p>
                    <p className="text-xs text-gray-600">{alert.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-gray-700">{timeAgo(alert.created_at)}</span>
                      <StatusBadge status={alert.status} />
                    </div>
                  </div>
                  {alert.status === 'new' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded text-[11px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all flex items-center gap-1 shrink-0"
                    >
                      <CheckCircle className="w-3 h-3" /> Ack
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CyberPanel>
  );
}
