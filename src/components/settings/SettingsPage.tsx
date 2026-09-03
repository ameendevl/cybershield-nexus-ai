import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { soundService } from '../../services/soundService';
import { exportIncidentsReport, exportAlertsReport, exportVulnerabilitiesReport, exportAssetsReport } from '../../utils/exportUtils';
import { 
  Shield, User, Bell, Volume2, VolumeX, Download, RefreshCw, 
  CheckCircle2, AlertTriangle, Save, Sliders, Database, Server,
  Sun, Moon, Palette
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, alerts, incidents, vulnerabilities, assets, refreshData, themeMode, setThemeMode } = useApp();

  const [name, setName] = useState(currentUser?.full_name || 'Senior SOC Analyst');
  const [email, setEmail] = useState(currentUser?.email || 'sec.analyst@cybershield.ai');
  const [role, setRole] = useState(currentUser?.role || 'Senior SOC Analyst');
  
  const [soundEnabled, setSoundEnabled] = useState(soundService.isSoundEnabled());
  const [strictnessLevel, setStrictnessLevel] = useState<'moderate' | 'strict' | 'paranoid'>('strict');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleSoundToggle = () => {
    const updated = soundService.toggleSound();
    setSoundEnabled(updated);
    if (updated) soundService.playSuccessBeep();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playSuccessBeep();
    setSaveSuccessMsg('Security profile & clearance settings saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark font-mono text-gray-200">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-cyan-300 flex items-center gap-2">
              <Sliders className="w-6 h-6 text-cyan-400" />
              SOC Security Configuration & Settings
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Manage Security Clearance, Threat Thresholds, MFA Biometrics & Data Exporters
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/20 hover:border-cyan-400/50 text-xs text-cyan-300 font-bold flex items-center gap-1.5 transition-all shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Matrix</span>
            </button>
          </div>
        </div>

        {/* Save Success Banner */}
        {saveSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: User Profile & Clearance */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyber-darker/90 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-cyan-500/15 pb-3">
                <User className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                  Analyst Profile & Clearance
                </h2>
              </div>

              <div className="flex flex-col items-center text-center py-2">
                <div className="relative mb-3">
                  <img
                    src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full border-2 border-cyan-400/60 object-cover shadow-xl shadow-cyan-500/20"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
                </div>
                <h3 className="text-sm font-bold text-gray-100">{name}</h3>
                <p className="text-xs text-cyan-400">{email}</p>
                <span className="mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {role}
                </span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">SOC Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Clearance Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-gray-200 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-cyber-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg mt-3"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile Info</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Security Controls & Report Exporters */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Appearance & Interface Theme Selector */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyber-darker/90 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    Interface Appearance & SOC Theme
                  </h2>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 font-bold uppercase border border-cyan-500/30">
                  Current: {themeMode === 'dark' ? 'Dark Cyber Matrix' : 'Light Command Center'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dark Theme Option */}
                <button
                  onClick={() => {
                    setThemeMode('dark');
                    soundService.playSuccessBeep();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    themeMode === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/15'
                      : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Moon className="w-4 h-4 text-cyan-400" />
                      <span>Dark Cyber Matrix</span>
                    </div>
                    {themeMode === 'dark' && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    High-contrast cyberpunk dark palette optimized for 24/7 low-light SOC command operations.
                  </p>
                </button>

                {/* Light Theme Option */}
                <button
                  onClick={() => {
                    setThemeMode('light');
                    soundService.playSuccessBeep();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    themeMode === 'light'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/15'
                      : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Light Command Center</span>
                    </div>
                    {themeMode === 'light' && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Ultra-clean slate & white luminescent layout with high readability for daylight environments.
                  </p>
                </button>
              </div>
            </div>

            {/* Audio & Alert Preferences */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyber-darker/90 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    Audio & Telemetry Sound Alerts
                  </h2>
                </div>
                <button
                  onClick={handleSoundToggle}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    soundEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                  <span>{soundEnabled ? 'Threat Audio Enabled' : 'Muted'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <button
                  onClick={() => setStrictnessLevel('moderate')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    strictnessLevel === 'moderate'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-black/40 border-cyan-500/15 text-gray-400'
                  }`}
                >
                  <p className="font-bold">Moderate Threshold</p>
                  <p className="text-[10px] text-gray-500 mt-1">Alerts on High & Critical severities</p>
                </button>

                <button
                  onClick={() => setStrictnessLevel('strict')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    strictnessLevel === 'strict'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-black/40 border-cyan-500/15 text-gray-400'
                  }`}
                >
                  <p className="font-bold">Strict Strictness (Default)</p>
                  <p className="text-[10px] text-gray-500 mt-1">Alerts on Medium, High & Critical</p>
                </button>

                <button
                  onClick={() => setStrictnessLevel('paranoid')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    strictnessLevel === 'paranoid'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-black/40 border-cyan-500/15 text-gray-400'
                  }`}
                >
                  <p className="font-bold">Paranoid Inspection</p>
                  <p className="text-[10px] text-gray-500 mt-1">Triggers on all telemetry events</p>
                </button>
              </div>
            </div>

            {/* 1-Click SOC Report Exporters */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-cyber-darker/90 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    SOC Telemetry & Audit Report Exporters
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => { exportIncidentsReport(incidents); soundService.playSuccessBeep(); }}
                  className="p-3.5 rounded-xl bg-black/60 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-200">Export Incidents Log (CSV)</p>
                      <p className="text-[10px] text-gray-500">{incidents.length} Records</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </button>

                <button
                  onClick={() => { exportAlertsReport(alerts); soundService.playSuccessBeep(); }}
                  className="p-3.5 rounded-xl bg-black/60 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-200">Export SOC Alerts (CSV)</p>
                      <p className="text-[10px] text-gray-500">{alerts.length} Telemetry Alerts</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </button>

                <button
                  onClick={() => { exportVulnerabilitiesReport(vulnerabilities); soundService.playSuccessBeep(); }}
                  className="p-3.5 rounded-xl bg-black/60 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-200">Export CVE Audit (CSV)</p>
                      <p className="text-[10px] text-gray-500">{vulnerabilities.length} Vulnerabilities</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </button>

                <button
                  onClick={() => { exportAssetsReport(assets); soundService.playSuccessBeep(); }}
                  className="p-3.5 rounded-xl bg-black/60 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-200">Export Asset Inventory (CSV)</p>
                      <p className="text-[10px] text-gray-500">{assets.length} Monitored Assets</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
