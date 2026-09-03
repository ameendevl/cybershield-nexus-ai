

interface CyberLogoProps {
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
  className?: string;
}

export default function CyberLogo({ size = 'md', collapsed = false, className = '' }: CyberLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Glowing Cyber Shield Icon */}
      <div className="relative shrink-0 group cursor-pointer">
        {/* Outer glowing pulsing aura */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-600 blur-sm opacity-75 group-hover:opacity-100 animate-pulse transition-all duration-300" />
        
        {/* Core Shield Badge */}
        <div className={`relative ${iconSizes[size]} rounded-xl bg-[#060c18] border border-cyan-400/50 flex items-center justify-center shadow-2xl overflow-hidden`}>
          
          {/* Cyber SVG Graphic Logo */}
          <svg className="w-3/5 h-3/5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Cyber Shield Frame */}
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#logoGrad)" fillOpacity="0.2" />
            {/* Center Cyber Core Crosshair */}
            <circle cx="12" cy="11" r="3" stroke="#00f0ff" strokeWidth="1.8" />
            <path d="M12 8v1M12 13v1M9 11h1M14 11h1" stroke="#00ff88" strokeWidth="1.8" />
          </svg>

          {/* SVG Gradient Definition */}
          <svg className="absolute w-0 h-0">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#7b2cbf" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Live SOC Sensor Indicator */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#060c18] animate-ping" />
      </div>

      {/* Typography Brand Name */}
      {!collapsed && (
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-100 to-indigo-300 tracking-wider text-base uppercase drop-shadow-sm">
              CYBER<span className="text-cyan-400 font-extrabold">SHIELD</span>
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono font-bold tracking-widest uppercase">
              AI SOC
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono font-medium tracking-widest uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> NEXUS ENTERPRISE
          </p>
        </div>
      )}
    </div>
  );
}
