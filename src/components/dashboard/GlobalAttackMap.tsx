import { useMemo, useState, useEffect, useRef } from 'react';
import type { GlobalAttack } from '../../types';
import { getSeverityColor } from '../../utils/mockData';
import { 
  Shield, Zap, Globe, Activity, X, ArrowUpRight, ArrowDownLeft, Lock, CheckCircle2,
  ZoomIn, ZoomOut, Maximize2, Minimize2
} from 'lucide-react';

interface AttackMapProps {
  attacks: GlobalAttack[];
  className?: string;
  compact?: boolean;
}

interface CityNode {
  id: string;
  name: string;
  country: string;
  code: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  region: string;
  ipRange: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  aptGroup: string;
  defenseStatus: string;
}

const CITIES: CityNode[] = [
  { id: 'was', name: 'Washington D.C.', country: 'United States', code: 'US', lat: 38.9072, lng: -77.0369, x: 260, y: 155, region: 'North America', ipRange: '198.51.100.0/24', threatLevel: 'CRITICAL', aptGroup: 'APT29 (Cozy Bear)', defenseStatus: 'DEFCON 2 - ACTIVE' },
  { id: 'nyc', name: 'New York', country: 'United States', code: 'US', lat: 40.7128, lng: -74.0060, x: 268, y: 150, region: 'North America', ipRange: '192.0.2.0/24', threatLevel: 'HIGH', aptGroup: 'FIN7', defenseStatus: 'SHIELD ACTIVE' },
  { id: 'sfo', name: 'San Francisco', country: 'United States', code: 'US', lat: 37.7749, lng: -122.4194, x: 190, y: 160, region: 'North America', ipRange: '203.0.113.0/24', threatLevel: 'HIGH', aptGroup: 'APT41', defenseStatus: 'MONITORED' },
  { id: 'lon', name: 'London', country: 'United Kingdom', code: 'GB', lat: 51.5074, lng: -0.1278, x: 470, y: 118, region: 'Europe', ipRange: '185.199.108.0/24', threatLevel: 'MEDIUM', aptGroup: 'Turla Group', defenseStatus: 'SHIELD ACTIVE' },
  { id: 'par', name: 'Paris', country: 'France', code: 'FR', lat: 48.8566, lng: 2.3522, x: 480, y: 128, region: 'Europe', ipRange: '195.154.0.0/16', threatLevel: 'LOW', aptGroup: 'Sandworm', defenseStatus: 'NORMAL' },
  { id: 'ber', name: 'Berlin', country: 'Germany', code: 'DE', lat: 52.5200, lng: 13.4050, x: 505, y: 115, region: 'Europe', ipRange: '141.20.0.0/16', threatLevel: 'HIGH', aptGroup: 'APT28 (Fancy Bear)', defenseStatus: 'ELEVATED' },
  { id: 'mos', name: 'Moscow', country: 'Russia', code: 'RU', lat: 55.7558, lng: 37.6173, x: 565, y: 105, region: 'Eurasia', ipRange: '95.213.0.0/16', threatLevel: 'CRITICAL', aptGroup: 'Dragonfly / Energetic Bear', defenseStatus: 'OFFENSIVE READY' },
  { id: 'bei', name: 'Beijing', country: 'China', code: 'CN', lat: 39.9042, lng: 116.4074, x: 760, y: 150, region: 'Asia Pacific', ipRange: '202.108.0.0/16', threatLevel: 'CRITICAL', aptGroup: 'APT1 (Comment Crew)', defenseStatus: 'OFFENSIVE READY' },
  { id: 'tok', name: 'Tokyo', country: 'Japan', code: 'JP', lat: 35.6762, lng: 139.6503, x: 825, y: 160, region: 'Asia Pacific', ipRange: '133.242.0.0/16', threatLevel: 'MEDIUM', aptGroup: 'Lazarus Group', defenseStatus: 'SHIELD ACTIVE' },
  { id: 'seo', name: 'Seoul', country: 'South Korea', code: 'KR', lat: 37.5665, lng: 126.9780, x: 790, y: 158, region: 'Asia Pacific', ipRange: '211.233.0.0/16', threatLevel: 'HIGH', aptGroup: 'Kimsuky', defenseStatus: 'ALERT' },
  { id: 'pyo', name: 'Pyongyang', country: 'North Korea', code: 'KP', lat: 39.0392, lng: 125.7625, x: 785, y: 153, region: 'Asia Pacific', ipRange: '175.45.176.0/22', threatLevel: 'CRITICAL', aptGroup: 'Lazarus / Andariel', defenseStatus: 'HIGH THREAT SOURCE' },
  { id: 'del', name: 'New Delhi', country: 'India', code: 'IN', lat: 28.6139, lng: 77.2090, x: 665, y: 195, region: 'South Asia', ipRange: '115.240.0.0/16', threatLevel: 'HIGH', aptGroup: 'SideWinder', defenseStatus: 'MONITORED' },
  { id: 'teh', name: 'Tehran', country: 'Iran', code: 'IR', lat: 35.6892, lng: 51.3890, x: 600, y: 165, region: 'Middle East', ipRange: '5.160.0.0/16', threatLevel: 'CRITICAL', aptGroup: 'APT33 (Elfin)', defenseStatus: 'ACTIVE INTRUSION' },
  { id: 'dxb', name: 'Dubai', country: 'United Arab Emirates', code: 'AE', lat: 25.2048, lng: 55.2708, x: 610, y: 205, region: 'Middle East', ipRange: '94.200.0.0/16', threatLevel: 'MEDIUM', aptGroup: 'OilRig', defenseStatus: 'SHIELD ACTIVE' },
  { id: 'syd', name: 'Sydney', country: 'Australia', code: 'AU', lat: -33.8688, lng: 151.2093, x: 855, y: 350, region: 'Oceania', ipRange: '139.130.0.0/16', threatLevel: 'LOW', aptGroup: 'OceanLotus', defenseStatus: 'NORMAL' },
  { id: 'sao', name: 'São Paulo', country: 'Brazil', code: 'BR', lat: -23.5505, lng: -46.6333, x: 335, y: 310, region: 'South America', ipRange: '200.160.0.0/16', threatLevel: 'MEDIUM', aptGroup: 'TA505', defenseStatus: 'MONITORED' },
  { id: 'kyi', name: 'Kyiv', country: 'Ukraine', code: 'UA', lat: 50.4501, lng: 30.5234, x: 540, y: 125, region: 'Europe', ipRange: '91.200.0.0/16', threatLevel: 'CRITICAL', aptGroup: 'Gamaredon', defenseStatus: 'HEAVY ATTACK ZONE' },
  { id: 'sin', name: 'Singapore', country: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198, x: 740, y: 245, region: 'Asia Pacific', ipRange: '165.21.0.0/16', threatLevel: 'LOW', aptGroup: 'Winnti Group', defenseStatus: 'NORMAL' },
];

const CONTINENT_PATHS = [
  "M150,110 Q180,80 230,70 Q280,60 320,80 Q330,100 310,130 Q290,140 280,165 Q270,180 260,200 Q240,210 220,190 Q200,180 180,170 Q160,150 150,110 Z",
  "M180,75 L210,65 L240,68 L260,85 L280,95 L290,120 L270,145 L250,155 L220,140 L190,120 Z",
  "M280,220 Q310,210 340,230 Q360,270 340,320 Q320,360 290,370 Q270,350 280,300 Q285,260 280,220 Z",
  "M440,90 Q480,80 520,85 Q540,105 525,130 Q495,140 470,135 Q450,125 440,90 Z",
  "M460,100 L490,92 L510,100 L515,120 L485,128 L465,115 Z",
  "M450,150 Q500,145 530,170 Q540,210 520,260 Q490,290 460,270 Q440,230 450,190 Z",
  "M530,70 Q620,55 750,65 Q830,85 850,130 Q830,170 760,180 Q690,190 620,180 Q560,160 530,130 Q510,95 530,70 Z",
  "M560,85 L650,75 L740,82 L810,110 L780,150 L710,165 L630,155 L570,125 Z",
  "M780,290 Q840,280 870,305 Q875,340 840,365 Q800,370 775,340 Q770,310 780,290 Z",
  "M290,35 Q330,25 350,45 Q340,65 310,65 Q290,55 290,35 Z",
];

export default function GlobalAttackMap({ attacks, className = '', compact = false }: AttackMapProps) {
  const [selectedCity, setSelectedCity] = useState<CityNode | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [activeAttacksList, setActiveAttacksList] = useState<Array<GlobalAttack & { srcCity: CityNode; tgtCity: CityNode; color: string; pathD: string }>>([]);
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel(z => Math.min(2.2, +(z + 0.2).toFixed(1)));
  const handleZoomOut = () => setZoomLevel(z => Math.max(0.8, +(z - 0.2).toFixed(1)));
  const handleResetZoom = () => setZoomLevel(1.0);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && mapContainerRef.current) {
      mapContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Map data setup
  const processedAttacks = useMemo(() => {
    const list: Array<GlobalAttack & { srcCity: CityNode; tgtCity: CityNode; color: string; pathD: string }> = [];

    attacks.forEach((attack, idx) => {
      if (filterSeverity !== 'all' && attack.severity !== filterSeverity) return;

      const srcCity = CITIES.find(c => c.code === attack.source_country) || CITIES[idx % CITIES.length];
      let tgtCity = CITIES.find(c => c.code === attack.target_country);
      if (!tgtCity || tgtCity.id === srcCity.id) {
        tgtCity = CITIES[(idx + 4) % CITIES.length];
      }

      const color = getSeverityColor(attack.severity || 'medium');

      const dx = tgtCity.x - srcCity.x;
      const dy = tgtCity.y - srcCity.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      
      const sweep = idx % 2 === 0 ? 1 : 0;
      const curveHeight = Math.min(80, dr * 0.35);
      const mx = (srcCity.x + tgtCity.x) / 2;
      const my = (srcCity.y + tgtCity.y) / 2 - (sweep === 1 ? curveHeight : -curveHeight);

      const pathD = `M ${srcCity.x} ${srcCity.y} Q ${mx} ${my} ${tgtCity.x} ${tgtCity.y}`;

      list.push({
        ...attack,
        srcCity,
        tgtCity,
        color,
        pathD
      });
    });

    return list.slice(0, compact ? 25 : 60);
  }, [attacks, filterSeverity, compact]);

  useEffect(() => {
    setActiveAttacksList(processedAttacks);
  }, [processedAttacks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % Math.max(1, activeAttacksList.length));
    }, 2500);
    return () => clearInterval(interval);
  }, [activeAttacksList.length]);

  // Details for selected city
  const selectedCityStats = useMemo(() => {
    if (!selectedCity) return null;
    const outbound = activeAttacksList.filter(a => a.srcCity.id === selectedCity.id);
    const inbound = activeAttacksList.filter(a => a.tgtCity.id === selectedCity.id);
    const total = outbound.length + inbound.length;
    const isBlocked = blockedIPs.includes(selectedCity.ipRange);

    return {
      outbound,
      inbound,
      total,
      isBlocked,
    };
  }, [selectedCity, activeAttacksList, blockedIPs]);

  const currentTicker = activeAttacksList[tickerIndex] || activeAttacksList[0];

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const toggleBlockIP = (ipRange: string) => {
    if (blockedIPs.includes(ipRange)) {
      setBlockedIPs(prev => prev.filter(ip => ip !== ipRange));
      handleAction(`IP Range ${ipRange} Unblocked!`);
    } else {
      setBlockedIPs(prev => [...prev, ipRange]);
      handleAction(`IP Range ${ipRange} ISOLATED & BLOCKED!`);
    }
  };

  return (
    <div className={`relative flex flex-col bg-[#050914] rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl ${className}`}>
      
      {/* Top Cyber HUD Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-cyan-500/15 bg-cyber-darker/90 backdrop-blur-md z-20 gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Globe className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-cyan-300 tracking-wider uppercase flex items-center gap-2">
              Global Cyber Attack Vectors <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">REAL-TIME TELEMETRY</span>
            </h3>
            <p className="text-[11px] text-gray-400 font-mono">
              ACTIVE SENSORS: <span className="text-emerald-400 font-bold">1,420 SOC NODES</span> &nbsp;|&nbsp; CLICK ANY CITY FOR COUNTRY THREAT PROFILE
            </p>
          </div>
        </div>

        {/* Severity Filter Controls */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-cyan-500/20">
          <span className="text-[10px] text-gray-400 uppercase font-mono px-2">Filter:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                filterSeverity === sev
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas container */}
      <div ref={mapContainerRef} className="relative flex-1 min-h-[440px] w-full overflow-hidden bg-[#03060f]">
        
        {/* Tactical Map Controls Toolbar: Zoom In, Out, Reset, Fullscreen */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-black/80 border border-cyan-500/30 backdrop-blur-md shadow-xl font-mono text-xs">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 rounded-lg text-[10px] text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Reset Zoom Level"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <div className="w-px h-4 bg-cyan-500/20" />
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Toast Notification Action Message */}
        {actionNotice && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {actionNotice}
          </div>
        )}

        {/* Animated Cyber Grid lines background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Dynamic Radar Sweep Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/10 pointer-events-none">
          <div className="w-full h-full rounded-full border border-cyan-500/5 scale-75" />
          <div className="w-full h-full rounded-full border border-cyan-500/5 scale-50" />
          <div className="absolute inset-0 rounded-full bg-conic-radar opacity-10 animate-radar-sweep" />
        </div>

        {/* SVG World Map & Vector Arc Canvas */}
        <svg
          viewBox="0 0 960 480"
          className="w-full h-full select-none transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Continent Outlines */}
          <g className="opacity-40">
            {CONTINENT_PATHS.map((pathStr, i) => (
              <path
                key={i}
                d={pathStr}
                fill="rgba(0, 240, 255, 0.04)"
                stroke="rgba(0, 240, 255, 0.35)"
                strokeWidth="1.2"
                className="hover:fill-cyan-500/10 transition-colors"
              />
            ))}
          </g>

          {/* Latitude & Longitude Reference Lines */}
          <g stroke="rgba(0, 240, 255, 0.08)" strokeWidth="0.8" strokeDasharray="4,4">
            <line x1="0" y1="240" x2="960" y2="240" />
            <line x1="480" y1="0" x2="480" y2="480" />
            <circle cx="480" cy="240" r="180" fill="none" />
            <circle cx="480" cy="240" r="300" fill="none" />
          </g>

          {/* Attack Arcs & Particle Lasers */}
          {activeAttacksList.map((attack) => {
            const isRelatedToSelected = selectedCity && (attack.srcCity.id === selectedCity.id || attack.tgtCity.id === selectedCity.id);
            const isDimmed = selectedCity && !isRelatedToSelected;

            return (
              <g key={attack.id} className="group" opacity={isDimmed ? 0.15 : 1}>
                <path
                  d={attack.pathD}
                  fill="none"
                  stroke={attack.color}
                  strokeWidth={isRelatedToSelected ? "2.5" : "1.5"}
                  strokeOpacity={isRelatedToSelected ? "0.9" : "0.3"}
                  strokeLinecap="round"
                />

                <path
                  d={attack.pathD}
                  fill="none"
                  stroke={isRelatedToSelected ? "#ffffff" : attack.color}
                  strokeWidth={isRelatedToSelected ? "3.5" : "2.5"}
                  strokeDasharray="20 120"
                  strokeLinecap="round"
                  filter="url(#glow-cyan)"
                  className="animate-laser-flow"
                />

                <circle
                  cx={attack.srcCity.x}
                  cy={attack.srcCity.y}
                  r="3"
                  fill="#ff0054"
                  className="animate-ping"
                />

                <circle
                  cx={attack.tgtCity.x}
                  cy={attack.tgtCity.y}
                  r="6"
                  fill="none"
                  stroke={attack.color}
                  strokeWidth="1"
                  className="animate-pulse"
                />
              </g>
            );
          })}

          {/* City Nodes & HUD Markers */}
          {CITIES.map((city) => {
            const isSelected = selectedCity?.id === city.id;
            const cityAttacks = activeAttacksList.filter(a => a.srcCity.id === city.id || a.tgtCity.id === city.id);
            const hasAttacks = cityAttacks.length > 0;
            const isBlocked = blockedIPs.includes(city.ipRange);

            return (
              <g
                key={city.id}
                transform={`translate(${city.x}, ${city.y})`}
                onClick={() => setSelectedCity(city)}
                className="cursor-pointer group"
              >
                {/* Target Lock Reticle on Hover/Select */}
                <circle
                  r={isSelected ? "16" : "10"}
                  fill="none"
                  stroke={isBlocked ? "#ff0054" : isSelected ? "#00f0ff" : "rgba(0, 240, 255, 0.3)"}
                  strokeWidth={isSelected ? "2" : "1"}
                  strokeDasharray={isSelected ? "none" : "3 3"}
                  className="group-hover:stroke-cyan-400 group-hover:scale-125 transition-all duration-300"
                />

                {/* Inner Pulsing City Beacon */}
                <circle
                  r="4"
                  fill={isBlocked ? "#ff0054" : hasAttacks ? "#00f0ff" : "#4b5563"}
                  filter={hasAttacks ? "url(#glow-cyan)" : undefined}
                  className={hasAttacks ? "animate-pulse" : ""}
                />

                {/* Center Core Dot */}
                <circle r="1.5" fill="#ffffff" />

                {/* City Label Badge */}
                <g transform="translate(12, -8)" className="pointer-events-none">
                  <rect
                    x="-4"
                    y="-10"
                    width={city.name.length * 6.5 + 24}
                    height="16"
                    rx="4"
                    fill="rgba(5, 9, 20, 0.9)"
                    stroke={isBlocked ? "#ff0054" : isSelected ? "#00f0ff" : hasAttacks ? "rgba(0, 240, 255, 0.4)" : "rgba(255, 255, 255, 0.1)"}
                    strokeWidth={isSelected ? "1.5" : "0.8"}
                  />

                  <text
                    x="0"
                    y="1"
                    fill={isBlocked ? "#ff0054" : "#00f0ff"}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                  >
                    {city.code}
                  </text>

                  <text
                    x="18"
                    y="1"
                    fill="#e2e8f0"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="500"
                  >
                    {city.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Live Attack Ticker Overlay at Bottom Left (Hidden when detail panel open) */}
        {currentTicker && !selectedCity && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm glass-panel p-3 rounded-xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 animate-pulse">
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" /> LIVE INTERCEPT
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase">
                  {currentTicker.severity}
                </span>
              </div>
              <p className="text-xs font-mono font-semibold text-gray-200 truncate">
                {currentTicker.srcCity.name} <span className="text-red-400">({currentTicker.srcCity.code})</span> → {currentTicker.tgtCity.name} <span className="text-cyan-400">({currentTicker.tgtCity.code})</span>
              </p>
              <p className="text-[10px] text-gray-400 font-mono truncate">
                TYPE: <span className="text-yellow-400">{currentTicker.attack_type || 'APT Intrusion'}</span> | PORT 443/TLS
              </p>
            </div>
          </div>
        )}

        {/* Detailed Country / City Threat Drawer Panel (Triggers on Click) */}
        {selectedCity && selectedCityStats && (
          <div className="absolute top-4 right-4 bottom-4 w-96 z-30 glass-panel p-5 rounded-2xl border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-3 border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold font-mono text-sm shadow-lg shadow-cyan-500/20">
                    {selectedCity.code}
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-cyan-300 tracking-wide">{selectedCity.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">{selectedCity.country} · {selectedCity.region}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 font-mono">
                  <p className="text-[10px] text-gray-400 uppercase">THREAT LEVEL</p>
                  <p className={`text-xs font-bold ${selectedCity.threatLevel === 'CRITICAL' ? 'text-red-400' : selectedCity.threatLevel === 'HIGH' ? 'text-orange-400' : 'text-yellow-400'}`}>
                    {selectedCity.threatLevel}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 font-mono">
                  <p className="text-[10px] text-gray-400 uppercase">DEFENSE STATUS</p>
                  <p className="text-xs font-bold text-emerald-400">{selectedCity.defenseStatus}</p>
                </div>
              </div>

              {/* Threat Intelligence Detailed Telemetry Matrix */}
              <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/20 mb-4 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">COUNTRY &bull; CITY:</span>
                  <span className="text-white font-bold">{selectedCity.country}, {selectedCity.name}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">IP / IOC SUBNET:</span>
                  <span className="text-cyan-300 font-bold">{selectedCity.ipRange}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">THREAT TYPE:</span>
                  <span className="text-yellow-400 font-bold">{selectedCity.aptGroup}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">SOURCE &rarr; TARGET:</span>
                  <span className="text-gray-200 truncate">{selectedCity.name} &rarr; Cloud Datacenter</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">FIRST DETECTED:</span>
                  <span className="text-gray-400">14m ago</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">LAST ACTIVITY:</span>
                  <span className="text-emerald-400 font-bold">2s ago (Active Stream)</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">CONFIDENCE SCORE:</span>
                  <span className="text-cyan-400 font-bold">98.6% (AI Verified)</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">MITIGATION STATUS:</span>
                  <span className={selectedCityStats.isBlocked ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {selectedCityStats.isBlocked ? 'ISOLATED & TRAFFIC BLOCKED' : 'PROACTIVE HONEYPOT ACTIVE'}
                  </span>
                </div>
              </div>

              {/* Attack Summary Counter */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-center font-mono">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-center gap-1 text-red-400 text-xs font-bold mb-1">
                    <ArrowUpRight className="w-4 h-4" /> OUTBOUND
                  </div>
                  <span className="text-2xl font-bold text-red-400">{selectedCityStats.outbound.length}</span>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-bold mb-1">
                    <ArrowDownLeft className="w-4 h-4" /> INBOUND
                  </div>
                  <span className="text-2xl font-bold text-cyan-400">{selectedCityStats.inbound.length}</span>
                </div>
              </div>

              {/* Live Telemetry Attacks List */}
              <div className="space-y-2 mb-4">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> RECENT CYBER VECTORS ({selectedCityStats.total})
                </h4>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 font-mono">
                  {selectedCityStats.outbound.concat(selectedCityStats.inbound).slice(0, 4).map((att, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-black/60 border border-white/5 text-[10px] flex items-center justify-between">
                      <div>
                        <span className="text-gray-300 font-bold">{att.srcCity.name}</span>
                        <span className="text-red-400 mx-1">→</span>
                        <span className="text-cyan-300 font-bold">{att.tgtCity.name}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold uppercase">
                        {att.attack_type || 'Malware'}
                      </span>
                    </div>
                  ))}
                  {selectedCityStats.total === 0 && (
                    <p className="text-xs text-gray-400 py-2 text-center font-mono">No active threats targeting this subnet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-cyan-500/20">
              <button
                onClick={() => toggleBlockIP(selectedCity.ipRange)}
                className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  selectedCityStats.isBlocked
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                }`}
              >
                <Lock className="w-4 h-4" />
                {selectedCityStats.isBlocked ? 'UNBLOCK SUBNET TRAFFIC' : 'ISOLATE & BLOCK SUBNET'}
              </button>

              <button
                onClick={() => handleAction(`Countermeasures deployed for ${selectedCity.name}!`)}
                className="w-full py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Shield className="w-4 h-4" />
                DEPLOY COUNTERMEASURES
              </button>
            </div>

          </div>
        )}

        {/* Map Legend Overlay at Bottom Right */}
        {!selectedCity && (
          <div className="absolute bottom-4 right-4 z-20 glass-panel px-3 py-2 rounded-xl border border-cyan-500/20 backdrop-blur-md flex items-center gap-4 text-[10px] font-mono text-gray-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Critical Arc</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Active Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>SOC Node</span>
            </div>
          </div>
        )}

      </div>

      {/* Embedded Style for Conic Radar & Laser Animations */}
      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-radar-sweep {
          animation: radarSweep 10s linear infinite;
        }
        .bg-conic-radar {
          background: conic-gradient(from 0deg, rgba(0, 240, 255, 0.25) 0deg, transparent 60deg, transparent 360deg);
        }
        @keyframes laserFlow {
          0% { stroke-dashoffset: 140; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-laser-flow {
          animation: laserFlow 2s linear infinite;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
