import type { ReactNode } from 'react';
import { getSeverityColor, getStatusColor } from '../../utils/mockData';
import { useApp } from '../../store/AppContext';

export function SeverityBadge({ severity }: { severity: string }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';
  const color = getSeverityColor(severity);

  if (isLight) {
    const lightColorMap: Record<string, { bg: string; text: string; border: string }> = {
      critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      high: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
      medium: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
      low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      info: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    };
    const style = lightColorMap[severity.toLowerCase()] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {severity}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border"
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';
  const color = getStatusColor(status);
  const label = status.replace(/_/g, ' ');

  if (isLight) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold border bg-slate-100 border-slate-300 text-slate-800">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border"
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
      }}
    >
      {label}
    </span>
  );
}

export function CyberPanel({
  children,
  className = '',
  title,
  icon,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
      isLight
        ? 'bg-white border-slate-200 shadow-sm text-slate-800'
        : 'glass-panel border-cyan-500/20 shadow-xl text-gray-100'
    } ${className}`}>
      {title && (
        <div className={`flex items-center justify-between px-4 py-3.5 border-b ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-black/40 border-cyan-500/15'
        }`}>
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                isLight
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                  : 'bg-cyan-500/10 border-cyan-400/30 text-cyan-400 shadow-sm shadow-cyan-500/20'
              }`}>
                {icon}
              </div>
            )}
            <h3 className={`text-xs sm:text-sm font-display font-bold tracking-wide uppercase ${
              isLight ? 'text-slate-900' : 'text-cyan-300'
            }`}>
              {title}
            </h3>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatPill({ label, value, color = '#00f0ff' }: { label: string; value: string | number; color?: string }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  return (
    <div className={`flex flex-col items-center px-4 py-2 rounded-xl border shadow-sm ${
      isLight ? 'bg-slate-50 border-slate-200' : 'bg-cyan-500/5 border-cyan-500/15'
    }`}>
      <span className="text-lg font-display font-bold" style={{ color: isLight ? '#0284c7' : color }}>
        {value}
      </span>
      <span className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${
        isLight ? 'text-slate-500' : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  );
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function ProgressBar({ value, max, color = '#00f0ff', height = 6 }: { value: number; max: number; color?: string; height?: number }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className={`w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-gray-800/60'}`} style={{ height }}>
      <div
        className="rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          height: '100%',
          background: isLight ? `linear-gradient(90deg, #0284c7, #2563eb)` : `linear-gradient(90deg, ${color}80, ${color})`,
          boxShadow: isLight ? undefined : `0 0 8px ${color}80`,
        }}
      />
    </div>
  );
}

export function SectionTitle({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-md ${
            isLight
              ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
              : 'bg-gradient-to-br from-cyan-500/20 via-indigo-500/15 to-transparent border-cyan-400/40 text-cyan-300 shadow-cyan-500/20'
          }`}>
            {icon}
          </div>
        )}
        <div>
          <h2 className={`text-xl sm:text-2xl font-display font-bold tracking-wide ${
            isLight ? 'text-slate-900' : 'text-cyan-300 drop-shadow-sm'
          }`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ViewContainer({ children }: { children: ReactNode }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  return (
    <div className={`flex-1 overflow-y-auto overflow-x-hidden transition-colors duration-200 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-cyber-dark text-gray-100'
    }`}>
      <div className={`p-4 md:p-6 min-h-full ${
        isLight
          ? 'bg-slate-50'
          : 'bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark cyber-grid-bg'
      }`}>
        <div className="max-w-[1920px] mx-auto">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon?: ReactNode }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  return (
    <div className={`flex flex-col items-center justify-center py-16 ${isLight ? 'text-slate-400' : 'text-gray-600'}`}>
      {icon && <div className={`mb-3 ${isLight ? 'text-slate-500' : 'text-gray-700'}`}>{icon}</div>}
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Search...'}
      className={`px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 ${
        isLight
          ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600/30'
          : 'bg-cyber-darker/60 border border-cyan-500/20 text-gray-200 placeholder-gray-600 focus:border-cyan-400/50 focus:ring-cyan-400/30'
      } ${className || 'w-full'}`}
    />
  );
}

export function FilterButton({ active, onClick, children, color = '#00f0ff' }: { active: boolean; onClick: () => void; children: ReactNode; color?: string }) {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  if (isLight) {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
          active
            ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider border transition-all cursor-pointer ${
        active ? '' : 'border-cyan-500/15 text-gray-500 hover:text-gray-300 hover:border-cyan-500/30'
      }`}
      style={active ? { borderColor: `${color}50`, color, backgroundColor: `${color}10` } : undefined}
    >
      {children}
    </button>
  );
}
