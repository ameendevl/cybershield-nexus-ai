import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  trend?: number;
  subtitle?: string;
  sparkline?: number[];
}

export default function MetricCard({
  title,
  value,
  icon,
  color = '#00f0ff',
  trend,
  subtitle,
  sparkline,
}: MetricCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="relative glass-panel rounded-xl p-4 border border-cyan-500/15 hover:border-cyan-500/30 transition-all group overflow-hidden">
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: color }}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
            >
              {icon}
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{title}</span>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-cyber-error' : 'text-cyber-success'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-display font-bold" style={{ color }}>{value}</span>
          {subtitle && <span className="text-xs text-gray-600">{subtitle}</span>}
        </div>

        {sparkline && sparkline.length > 1 && (
          <div className="mt-3 flex items-end gap-0.5 h-8">
            {sparkline.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${(v / Math.max(...sparkline)) * 100}%`,
                  backgroundColor: `${color}40`,
                  minHeight: '2px',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
