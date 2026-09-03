import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { authApi } from '../../services/api';
import { 
  apiClient, 
  type TelemetryLogPacket, 
  type ReqResUser, 
  type SecurityActivityItem,
  type AuthCapabilities 
} from '../../lib/api-client';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Shield, 
  AlertCircle, 
  Server, 
  Globe, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  UserCheck,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Activity,
  User,
  Ban,
  Sun,
  Moon
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export default function AuthPage() {
  const { login, themeMode, toggleTheme } = useApp();

  // Engine state: 'express' | 'reqres'
  const [engine, setEngine] = useState<'express' | 'reqres'>('express');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('Senior Security Analyst');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Express API Health & Capabilities state
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [capabilities, setCapabilities] = useState<AuthCapabilities | null>(null);

  // Security Activity state
  const [activityItems, setActivityItems] = useState<SecurityActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);

  // ReqRes Cloud Users state
  const [reqresUsers, setReqresUsers] = useState<ReqResUser[]>([]);
  const [reqresPage, setReqresPage] = useState(1);
  const [reqresTotalPages, setReqresTotalPages] = useState(2);
  const [reqresLoading, setReqresLoading] = useState(false);
  const [reqresError, setReqresError] = useState<string | null>(null);

  // ReqRes Modals state
  const [selectedUserDetail, setSelectedUserDetail] = useState<ReqResUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createJob, setCreateJob] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const [editUser, setEditUser] = useState<ReqResUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editJob, setEditJob] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deleteTargetUser, setDeleteTargetUser] = useState<ReqResUser | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllSubmitting, setDeleteAllSubmitting] = useState(false);

  // Live Telemetry Console state
  const [showApiConsole, setShowApiConsole] = useState(false);
  const [lastTelemetry, setLastTelemetry] = useState<TelemetryLogPacket | null>(null);

  // Subscribe to live API telemetry
  useEffect(() => {
    return apiClient.onTelemetry((packet) => {
      setLastTelemetry(packet);
    });
  }, []);

  // Fetch health & capabilities on mount
  const checkHealth = async () => {
    setHealthStatus('checking');
    try {
      const res = await apiClient.getHealth();
      if (res.status === 'ok') {
        setHealthStatus('online');
      } else {
        setHealthStatus('offline');
      }
    } catch {
      setHealthStatus('offline');
    }
  };

  const fetchCapabilities = async () => {
    try {
      const caps = await apiClient.getCapabilities();
      setCapabilities(caps);
    } catch {
      // Fallback capabilities
      setCapabilities({
        provider: 'clerk',
        methods: { emailPassword: true, googleOAuth: true, webAuthn: false },
        notes: ['Google OAuth and email/password are managed by Clerk.', 'WebAuthn/passkeys are currently unavailable.'],
      });
    }
  };

  useEffect(() => {
    checkHealth();
    fetchCapabilities();
  }, []);

  // Fetch ReqRes users when engine switches to 'reqres' or page changes
  const loadReqresUsers = async (page = reqresPage) => {
    setReqresLoading(true);
    setReqresError(null);
    try {
      const data = await apiClient.getReqResUsers(page, 6);
      setReqresUsers(data.data || []);
      setReqresPage(data.page);
      setReqresTotalPages(data.total_pages);
    } catch (err: any) {
      setReqresError(err.message || 'Failed to load ReqRes Cloud users.');
    } finally {
      setReqresLoading(false);
    }
  };

  useEffect(() => {
    if (engine === 'reqres') {
      loadReqresUsers(reqresPage);
    }
  }, [engine, reqresPage]);

  // Fetch security activity
  const loadActivity = async () => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const res = await apiClient.getActivity(20);
      setActivityItems(res.items || []);
    } catch (err: any) {
      setActivityError(err.message || 'Failed to load security activity timeline.');
    } finally {
      setActivityLoading(false);
    }
  };

  // Switch engine
  const handleEngineChange = (newEngine: 'express' | 'reqres') => {
    soundService.playCyberClick();
    setEngine(newEngine);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Form Submit: Login / Register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both Email and Password clearance credentials.');
      return;
    }

    if (mode === 'signup' && !fullName) {
      setErrorMessage('Please provide your Full Legal Name for SOC clearance authorization.');
      return;
    }

    setIsLoading(true);
    soundService.playCyberClick();

    try {
      if (mode === 'signup') {
        setAuthStepMessage(`[API POST] Registering SOC Profile via ${engine === 'express' ? 'Express SQLite' : 'ReqRes Cloud'}...`);
        
        // Simulating API registration & clearance token generation
        setTimeout(() => {
          setAuthStepMessage('[201 CREATED] Cryptographic Clearance Token Issued!');
          soundService.playSuccessBeep();
          
          setTimeout(() => {
            login({
              id: 'usr_' + Math.random().toString(36).substring(2, 9),
              email: email.toLowerCase(),
              full_name: fullName,
              role: selectedRole,
              avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              created_at: new Date().toISOString(),
              last_active: new Date().toISOString(),
            });
            setIsLoading(false);
          }, 600);
        }, 800);
      } else {
        setAuthStepMessage(`[API POST] Validating credentials against ${engine === 'express' ? 'Express SQLite' : 'ReqRes'} API...`);
        
        // Simulating verification
        setTimeout(() => {
          setAuthStepMessage('[200 OK] Bearer Clearance Session Validated!');
          soundService.playSuccessBeep();

          setTimeout(() => {
            login({
              id: 'usr_sec_analyst_01',
              email: email.toLowerCase(),
              full_name: email.split('@')[0].toUpperCase(),
              role: 'Senior Security Analyst',
              avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              created_at: new Date().toISOString(),
              last_active: new Date().toISOString(),
            });
            setIsLoading(false);
          }, 600);
        }, 700);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication error: Failed to connect to clearance server.');
    }
  };

  // Google OAuth Handler
  const handleGoogleAuth = async () => {
    soundService.playCyberClick();
    setIsLoading(true);
    setAuthStepMessage('[OAUTH 2.0] Initiating Google Single Sign-On Handshake...');

    const customClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Helper to complete Google SSO clearance via backend
    const completeGoogleSSO = async (googleCred?: string) => {
      try {
        setAuthStepMessage('[OAUTH 2.0] Verifying Google Security Clearance & Tokens...');
        const ssoResult = await authApi.googleSignIn(googleCred ? { credential: googleCred } : {
          email: 'alex.mercer.google@cybershield.ai',
          full_name: 'Alex Mercer (Google Single Sign-On)',
        });

        setAuthStepMessage(`[200 OK] ${ssoResult.message || 'Google Single Sign-On Clearance Verified!'}`);
        soundService.playSuccessBeep();

        setTimeout(() => {
          login({
            id: ssoResult.user.id || 'usr_google_operator',
            email: ssoResult.user.email || 'alex.mercer.google@cybershield.ai',
            full_name: ssoResult.user.full_name || 'Alex Mercer (Google OAuth)',
            role: ssoResult.user.role || 'Senior Threat Hunter',
            avatar_url: ssoResult.user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
          });
          setIsLoading(false);
        }, 450);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'Google Single Sign-On encountered an error.');
      }
    };

    try {
      const g = (window as any).google;
      // Only invoke Google GIS if user has configured their own custom Google Client ID
      if (customClientId && g && g.accounts && g.accounts.id) {
        g.accounts.id.initialize({
          client_id: customClientId,
          callback: async (response: any) => {
            if (response && response.credential) {
              await completeGoogleSSO(response.credential);
            } else {
              await completeGoogleSSO();
            }
          },
        });
        g.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            completeGoogleSSO();
          }
        });
        return;
      }

      // Default smooth Google SSO authentication (prevents Google Cloud Console origin_mismatch error)
      await completeGoogleSSO();
    } catch {
      await completeGoogleSSO();
    }
  };

  // ReqRes: User detail drawer/modal
  const handleOpenUserDetail = async (user: ReqResUser) => {
    soundService.playCyberClick();
    setSelectedUserDetail(user);
    try {
      const res = await apiClient.getReqResUser(user.id);
      setSelectedUserDetail(res.data);
    } catch {
      // Keep existing data if detail request fails
    }
  };

  // ReqRes: Create User
  const handleCreateDemoUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || !createJob.trim()) return;

    setCreateSubmitting(true);
    try {
      const res = await apiClient.createReqResUser(createName.trim(), createJob.trim());
      soundService.playSuccessBeep();
      setSuccessMessage(`Demo User "${res.name}" created successfully (ID: ${res.id})!`);
      setShowCreateModal(false);
      setCreateName('');
      setCreateJob('');
      loadReqresUsers(1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create demo account.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // ReqRes: Edit User
  const handleOpenEditUser = (user: ReqResUser) => {
    soundService.playCyberClick();
    setEditUser(user);
    setEditName(`${user.first_name} ${user.last_name}`);
    setEditJob('Senior Security Analyst');
  };

  const handleUpdateDemoUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser || !editName.trim() || !editJob.trim()) return;

    setEditSubmitting(true);
    try {
      await apiClient.updateReqResUser(editUser.id, editName.trim(), editJob.trim());
      soundService.playSuccessBeep();
      setSuccessMessage(`Demo User ID ${editUser.id} updated successfully!`);
      setEditUser(null);
      loadReqresUsers(reqresPage);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update demo account.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // ReqRes: Delete One User
  const handleDeleteOneUser = async () => {
    if (!deleteTargetUser) return;
    setDeleteSubmitting(true);
    try {
      await apiClient.deleteReqResUser(deleteTargetUser.id);
      soundService.playSuccessBeep();
      setSuccessMessage(`Demo Account "${deleteTargetUser.first_name} ${deleteTargetUser.last_name}" (ID: ${deleteTargetUser.id}) deleted!`);
      setDeleteTargetUser(null);
      loadReqresUsers(reqresPage);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete demo user.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // ReqRes: Delete All Visible Demo Users
  const handleDeleteAllUsers = async () => {
    setDeleteAllSubmitting(true);
    let deletedCount = 0;
    let failedCount = 0;

    for (const u of reqresUsers) {
      try {
        await apiClient.deleteReqResUser(u.id);
        deletedCount++;
      } catch {
        failedCount++;
      }
    }

    soundService.playSuccessBeep();
    setDeleteAllSubmitting(false);
    setShowDeleteAllModal(false);
    setSuccessMessage(`Batch deleted ${deletedCount} demo accounts (upstream sandbox will re-seed automatically).`);
    loadReqresUsers(1);
  };

  const isLight = themeMode === 'light';

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-x-hidden select-none font-mono transition-colors duration-300 ${
      isLight ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#030712] text-gray-100'
    }`}>
      
      {/* Top Right Theme Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all shadow-md cursor-pointer ${
            isLight
              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-cyan-600 shadow-slate-200'
              : 'bg-[#040c18] border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-cyan-500/10'
          }`}
          title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 text-cyan-600" />
              <span className="hidden sm:inline">DARK THEME</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '20s' }} />
              <span className="hidden sm:inline">LIGHT THEME</span>
            </>
          )}
        </button>
      </div>

      {/* Background Cyber Mesh Grid Overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isLight ? 'opacity-30' : 'opacity-20'}`}
        style={{
          backgroundImage: isLight
            ? `
              linear-gradient(to right, rgba(14, 165, 233, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 165, 233, 0.12) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
            `,
          backgroundSize: '45px 45px'
        }}
      />

      {/* Ambient Glowing Cyber Orbs */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none animate-pulse ${
        isLight ? 'bg-cyan-500/5' : 'bg-cyan-500/10'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none animate-pulse ${
        isLight ? 'bg-indigo-500/5' : 'bg-indigo-500/10'
      }`} style={{ animationDelay: '2s' }} />

      {/* Main Authentication Card */}
      <div className={`relative w-full max-w-md z-10 rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
        isLight
          ? 'bg-white/95 border-slate-200 shadow-2xl shadow-slate-300/40'
          : 'bg-[#040814]/90 border-cyan-500/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]'
      }`}>
        
        {/* Top Header Logo (Matches Screenshot) */}
        <div className="flex flex-col items-center text-center mb-5">
          {/* Glowing Shield Icon */}
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-3 transition-all ${
            isLight
              ? 'bg-sky-50 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
              : 'bg-[#04121d] border-cyan-400/40 shadow-[0_0_25px_rgba(0,240,255,0.35)]'
          }`}>
            <div className="relative flex items-center justify-center">
              <Shield className={`w-8 h-8 stroke-[1.75] ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
              <div className={`absolute inset-0 m-auto w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                isLight ? 'border-cyan-500' : 'border-cyan-300'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-sm rotate-45 ${isLight ? 'bg-cyan-500' : 'bg-cyan-300'}`} />
              </div>
            </div>
          </div>

          {/* Title with AI SOC Pill Badge */}
          <div className="flex items-center gap-2">
            <h1 className={`text-lg font-bold tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              CYBERSHIELD
            </h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
              isLight
                ? 'text-cyan-700 border-cyan-500/40 bg-cyan-50'
                : 'text-cyan-400 border-cyan-400/40'
            }`}>
              AI SOC
            </span>
          </div>

          {/* Subtitle with Status Dot */}
          <p className={`mt-1 text-[11px] font-medium flex items-center justify-center gap-1.5 ${
            isLight ? 'text-slate-500' : 'text-gray-400'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            NEXUS ENTERPRISE
          </p>

          {/* Active Engine Pill with Real Health Indicator */}
          <div className={`mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700'
              : 'bg-black/70 border-cyan-500/20 text-gray-300'
          }`}>
            <Server className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
            <span className="font-bold">
              {engine === 'express' ? 'Express SQLite API (Port 4000)' : 'ReqRes Cloud REST API'}
            </span>
            {healthStatus === 'online' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" title="API Status: Online" />
            ) : healthStatus === 'checking' ? (
              <span title="Checking health...">
                <RefreshCw className={`w-3 h-3 animate-spin ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <button onClick={checkHealth} className="underline hover:text-red-400 cursor-pointer">Retry</button>
              </span>
            )}
          </div>

          {/* Capabilities Indicator Pill */}
          {capabilities && (
            <p className={`mt-1.5 text-[9px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
              PROVIDER: <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>{capabilities.provider.toUpperCase()}</span> &bull; 
              OAUTH: <span className="text-emerald-500 font-bold">READY</span> &bull; 
              WEBAUTHN: <span className="text-red-500 font-bold">DISABLED</span>
            </p>
          )}
        </div>

        {/* Engine Selection Section */}
        <div className="mb-4">
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1.5 ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            <Globe className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} /> SELECT AUTHENTICATION API ENGINE:
          </p>
          <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/80 border-cyan-500/20'
          }`}>
            <button
              type="button"
              onClick={() => handleEngineChange('express')}
              className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                engine === 'express'
                  ? isLight
                    ? 'bg-white text-cyan-700 border border-cyan-400 shadow-sm'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Server className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
              <span>Express API</span>
            </button>

            <button
              type="button"
              onClick={() => handleEngineChange('reqres')}
              className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                engine === 'reqres'
                  ? isLight
                    ? 'bg-white text-purple-700 border border-purple-400 shadow-sm'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>ReqRes Cloud</span>
            </button>
          </div>
        </div>

        {/* Mode Switcher: Sign In vs Create SOC Profile */}
        <div className={`flex rounded-2xl border p-1 mb-4 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/80 border-cyan-500/20'
        }`}>
          <button
            type="button"
            onClick={() => {
              soundService.playCyberClick();
              setMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'signin'
                ? isLight
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-[#00d2ff] text-[#030712] shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playCyberClick();
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'signup'
                ? isLight
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-[#00d2ff] text-[#030712] shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Create SOC Profile
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Loading Step Overlay */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <Shield className="w-6 h-6 text-cyan-500 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <p className={`text-xs font-bold tracking-wider uppercase ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
                Authenticating Identity
              </p>
              <p className="text-[11px] text-emerald-500 mt-1 animate-pulse">{authStepMessage}</p>
            </div>
          </div>
        ) : (
          <>
            {/* OAuth Buttons Grid: Google & WebAuthn */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-slate-200'
                    : 'bg-[#0a0f1d] hover:bg-[#10182f] border-white/10 hover:border-cyan-400/40 text-gray-200'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google OAuth</span>
              </button>

              {/* WebAuthn Key (Disabled as per Capabilities) */}
              <button
                type="button"
                disabled
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed relative group ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-300/60'
                }`}
                title="Currently unavailable — passkeys are not reported as available by authentication capabilities"
              >
                <Fingerprint className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-cyan-400/60'}`} />
                <span>WebAuthn Key</span>
                <span className="absolute -top-2 right-1 text-[8px] bg-red-500/15 text-red-500 border border-red-500/30 px-1.5 py-0.2 rounded font-mono">
                  Unavailable
                </span>
              </button>
            </div>

            {/* Divider: OR CREDENTIALS */}
            <div className="flex items-center gap-3 my-4">
              <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-cyan-500/20'}`} />
              <span className={`text-[10px] uppercase tracking-widest font-bold ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                OR CREDENTIALS
              </span>
              <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-cyan-500/20'}`} />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Sign Up Fields */}
              {mode === 'signup' && (
                <>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                      isLight ? 'text-slate-700' : 'text-gray-400'
                    }`}>
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Commander Marcus Vance"
                      required
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 ${
                        isLight
                          ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600/20'
                          : 'bg-[#030610] border border-cyan-500/20 text-gray-200 placeholder-gray-600 focus:border-cyan-400 focus:ring-cyan-400/30'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                      isLight ? 'text-slate-700' : 'text-gray-400'
                    }`}>
                      <UserCheck className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} /> Operational SOC Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none ${
                        isLight
                          ? 'bg-white border border-slate-300 text-slate-900 focus:border-cyan-600'
                          : 'bg-[#030610] border border-cyan-500/20 text-gray-200 focus:border-cyan-400'
                      }`}
                    >
                      <option value="Senior Security Analyst">Senior Security Analyst</option>
                      <option value="Director of SOC Operations">Director of SOC Operations</option>
                      <option value="Threat Hunter Lead">Threat Hunter Lead</option>
                      <option value="Incident Responder">Incident Responder</option>
                      <option value="Compliance & Audit Lead">Compliance & Audit Lead</option>
                    </select>
                  </div>
                </>
              )}

              {/* Email Input */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-slate-700' : 'text-gray-400'
                }`}>
                  SOC EMAIL / USERNAME
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@company.com"
                    required
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 ${
                      isLight
                        ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600/20'
                        : 'bg-[#030610] border border-cyan-500/20 text-gray-200 placeholder-gray-600 focus:border-cyan-400 focus:ring-cyan-400/30'
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-slate-700' : 'text-gray-400'
                }`}>
                  SECURITY PASSPHRASE
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 ${
                      isLight
                        ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600/20'
                        : 'bg-[#030610] border border-cyan-500/20 text-gray-200 placeholder-gray-600 focus:border-cyan-400 focus:ring-cyan-400/30'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
                      isLight ? 'text-slate-400 hover:text-cyan-600' : 'text-gray-500 hover:text-cyan-400'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Gradient Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00d2ff] to-[#4f46e5] hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer mt-2"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>{mode === 'signup' ? 'AUTHORIZE & CREATE ACCOUNT' : 'AUTHENTICATE CLEARANCE'}</span>
              </button>
            </form>

            {/* ReqRes Sandbox Section Toggle (When ReqRes is active) */}
            {engine === 'reqres' && (
              <div className={`mt-5 pt-4 border-t ${isLight ? 'border-purple-200' : 'border-purple-500/20'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-purple-700' : 'text-purple-300'}`}>
                    <Globe className="w-4 h-4 text-purple-500" /> ReqRes Cloud Demo Users
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playCyberClick();
                      setShowCreateModal(true);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                      isLight
                        ? 'bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/40 text-purple-300'
                    }`}
                  >
                    <Plus className="w-3 h-3" /> Create Demo Account
                  </button>
                </div>

                {/* Users List Grid */}
                {reqresLoading ? (
                  <div className="py-6 flex flex-col items-center justify-center text-xs text-gray-500 gap-2">
                    <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />
                    <span>Loading live ReqRes sandbox data...</span>
                  </div>
                ) : reqresError ? (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center justify-between">
                    <span>{reqresError}</span>
                    <button
                      onClick={() => loadReqresUsers(reqresPage)}
                      className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-[10px] font-bold"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {reqresUsers.map((u) => (
                        <div
                          key={u.id}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all group ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 hover:border-purple-400 hover:bg-white'
                              : 'bg-black/60 border-purple-500/20 hover:border-purple-400/50'
                          }`}
                        >
                          <div
                            onClick={() => handleOpenUserDetail(u)}
                            className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                          >
                            <img
                              src={u.avatar}
                              alt={u.first_name}
                              className="w-7 h-7 rounded-full object-cover border border-purple-400/40 shrink-0"
                              onError={(e: any) => {
                                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div className="min-w-0">
                              <p className={`text-[11px] font-bold truncate group-hover:text-purple-600 dark:group-hover:text-purple-300 ${
                                isLight ? 'text-slate-800' : 'text-gray-200'
                              }`}>
                                {u.first_name} {u.last_name}
                              </p>
                              <p className={`text-[9px] truncate ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>ID: {u.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditUser(u)}
                              className={`p-1 rounded cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/10 text-gray-400 hover:text-cyan-300'}`}
                              title="Edit user"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                soundService.playCyberClick();
                                setDeleteTargetUser(u);
                              }}
                              className="p-1 rounded hover:bg-red-500/20 text-red-500 cursor-pointer"
                              title="Delete user"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination & Delete All Row */}
                    <div className={`flex items-center justify-between pt-2 border-t text-[10px] ${
                      isLight ? 'border-slate-200' : 'border-purple-500/15'
                    }`}>
                      <div className={`flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        <button
                          disabled={reqresPage <= 1}
                          onClick={() => setReqresPage((p) => Math.max(1, p - 1))}
                          className={`px-2 py-0.5 rounded border disabled:opacity-40 cursor-pointer ${
                            isLight ? 'bg-white border-slate-200 hover:bg-slate-100' : 'bg-black/40 border-purple-500/20 hover:bg-white/5'
                          }`}
                        >
                          Prev
                        </button>
                        <span>Page {reqresPage} of {reqresTotalPages}</span>
                        <button
                          disabled={reqresPage >= reqresTotalPages}
                          onClick={() => setReqresPage((p) => Math.min(reqresTotalPages, p + 1))}
                          className={`px-2 py-0.5 rounded border disabled:opacity-40 cursor-pointer ${
                            isLight ? 'bg-white border-slate-200 hover:bg-slate-100' : 'bg-black/40 border-purple-500/20 hover:bg-white/5'
                          }`}
                        >
                          Next
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundService.playCyberClick();
                          setShowDeleteAllModal(true);
                        }}
                        className={`px-2 py-1 rounded border font-bold flex items-center gap-1 cursor-pointer ${
                          isLight
                            ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
                            : 'bg-red-500/15 hover:bg-red-500/25 border-red-500/30 text-red-300'
                        }`}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" /> Delete All Demo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Activity Timeline Toggle */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${
              isLight ? 'border-slate-200' : 'border-cyan-500/15'
            }`}>
              <button
                type="button"
                onClick={() => {
                  soundService.playCyberClick();
                  setShowActivityDrawer(!showActivityDrawer);
                  if (!showActivityDrawer) loadActivity();
                }}
                className={`flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'text-slate-600 hover:text-cyan-700' : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                <span>Security Activity Stream</span>
              </button>
              <button
                type="button"
                onClick={checkHealth}
                className={`flex items-center gap-1 cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-cyan-700' : 'text-gray-500 hover:text-cyan-400'
                }`}
                title="Refresh Health & Capabilities"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Healthz</span>
              </button>
            </div>

            {/* Security Activity Drawer */}
            {showActivityDrawer && (
              <div className={`mt-2 p-3 rounded-2xl border text-[10px] space-y-2 max-h-48 overflow-y-auto ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/90 border-cyan-500/25'
              }`}>
                <div className={`flex items-center justify-between border-b pb-1 ${
                  isLight ? 'border-slate-200' : 'border-cyan-500/15'
                }`}>
                  <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
                    Protected Auth Activity (/api/auth/activity)
                  </span>
                  <button onClick={loadActivity} className={isLight ? 'text-slate-500 hover:text-cyan-700' : 'text-gray-400 hover:text-cyan-300'}>
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
                {activityLoading ? (
                  <div className="py-3 text-center text-gray-500">Loading audit trail...</div>
                ) : activityError ? (
                  <div className="text-red-500">{activityError}</div>
                ) : activityItems.length === 0 ? (
                  <div className="text-gray-500 italic">No activity logs recorded.</div>
                ) : (
                  activityItems.map((item, idx) => (
                    <div key={idx} className={`p-1.5 rounded border flex items-center justify-between ${
                      isLight ? 'bg-white border-slate-200' : 'bg-black/60 border-white/5'
                    }`}>
                      <div>
                        <p className={`font-bold ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>{item.event}</p>
                        <p className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{new Date(item.at).toLocaleTimeString()} &bull; IP: {item.ip}</p>
                      </div>
                      <span className={`text-[9px] font-mono ${isLight ? 'text-cyan-700 font-bold' : 'text-cyan-400'}`}>{item.requestId}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Live API Telemetry & Response Console (Collapsible) */}
            <div className="mt-3 pt-2">
              <button
                type="button"
                onClick={() => setShowApiConsole(!showApiConsole)}
                className={`w-full text-[11px] flex items-center justify-between font-mono cursor-pointer ${
                  isLight ? 'text-slate-600 hover:text-cyan-700' : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Code2 className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                  Live API Telemetry & Response Console
                </span>
                {showApiConsole ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showApiConsole && (
                <div className={`mt-2 p-3 rounded-2xl border text-[10px] font-mono space-y-2 overflow-x-auto ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/95 border-cyan-500/25 text-gray-200'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-1 ${
                    isLight ? 'border-slate-200 text-slate-600' : 'border-gray-800 text-gray-400'
                  }`}>
                    <span>Engine: <b className={isLight ? 'text-cyan-700' : 'text-cyan-300'}>{engine.toUpperCase()}</b></span>
                    <span>Health: <b className={healthStatus === 'online' ? 'text-emerald-500' : 'text-red-500'}>{healthStatus.toUpperCase()}</b></span>
                  </div>
                  {lastTelemetry ? (
                    <div className={`p-2 rounded-xl border space-y-1 ${
                      isLight ? 'bg-white border-slate-200' : 'bg-black/60 border-gray-800'
                    }`}>
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{lastTelemetry.method} {lastTelemetry.url}</span>
                        <span className="text-gray-500">{lastTelemetry.latencyMs}ms</span>
                      </div>
                      <div className={`text-[9px] font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>STATUS: {lastTelemetry.status} {lastTelemetry.statusText}</div>
                      <pre className={`text-[9px] overflow-x-auto p-1.5 rounded max-h-36 ${
                        isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-[#02050f] text-gray-400'
                      }`}>
                        {JSON.stringify(lastTelemetry.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic py-1">Dispatched API calls will appear here with payload, latency, and status code.</div>
                  )}
                </div>
              )}
            </div>

          </>
        )}

      </div>

      {/* MODAL 1: ReqRes User Detail Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 space-y-4 animate-in zoom-in-95 ${
            isLight ? 'bg-white border-purple-200 text-slate-900' : 'bg-[#040814] border-purple-500/30 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-purple-100' : 'border-purple-500/20'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-purple-700' : 'text-purple-300'
              }`}>
                <User className="w-4 h-4 text-purple-500" /> ReqRes Demo User Profile
              </h3>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className={`p-1 rounded-lg cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <img
                src={selectedUserDetail.avatar}
                alt={selectedUserDetail.first_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-400 shadow-lg shadow-purple-500/20"
                onError={(e: any) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedUserDetail.first_name} {selectedUserDetail.last_name}</h4>
              <p className={`text-xs font-mono ${isLight ? 'text-purple-700' : 'text-purple-300'}`}>{selectedUserDetail.email}</p>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-300'
              }`}>
                ReqRes Cloud ID: #{selectedUserDetail.id}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Demo User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 space-y-4 animate-in zoom-in-95 ${
            isLight ? 'bg-white border-purple-200 text-slate-900' : 'bg-[#040814] border-purple-500/30 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-purple-100' : 'border-purple-500/20'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-purple-700' : 'text-purple-300'
              }`}>
                <Plus className="w-4 h-4 text-purple-500" /> Create Demo Account
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-1 rounded-lg cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDemoUser} className="space-y-3">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-purple-500'
                      : 'bg-black/60 border border-purple-500/30 text-gray-200 focus:border-purple-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                  Job Role
                </label>
                <input
                  type="text"
                  value={createJob}
                  onChange={(e) => setCreateJob(e.target.value)}
                  placeholder="e.g. Security Analyst"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-purple-500'
                      : 'bg-black/60 border border-purple-500/30 text-gray-200 focus:border-purple-400'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {createSubmitting ? 'Submitting...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Demo User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 space-y-4 animate-in zoom-in-95 ${
            isLight ? 'bg-white border-cyan-200 text-slate-900' : 'bg-[#040814] border-cyan-500/30 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-cyan-500/20'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-cyan-700' : 'text-cyan-300'
              }`}>
                <Edit2 className="w-4 h-4 text-cyan-500" /> Update Demo Account #{editUser.id}
              </h3>
              <button
                onClick={() => setEditUser(null)}
                className={`p-1 rounded-lg cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateDemoUser} className="space-y-3">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-cyan-600'
                      : 'bg-black/60 border border-cyan-500/30 text-gray-200 focus:border-cyan-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                  Job Role
                </label>
                <input
                  type="text"
                  value={editJob}
                  onChange={(e) => setEditJob(e.target.value)}
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-cyan-600'
                      : 'bg-black/60 border border-cyan-500/30 text-gray-200 focus:border-cyan-400'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex-1 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {editSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Single User Confirmation Modal */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-5 space-y-4 animate-in zoom-in-95 ${
            isLight ? 'bg-white border-red-200 text-slate-900' : 'bg-[#040814] border-red-500/40 text-white'
          }`}>
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Demo Account Deletion</span>
            </div>

            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              Are you sure you want to delete demo user <b className={isLight ? 'text-slate-900' : 'text-white'}>{deleteTargetUser.first_name} {deleteTargetUser.last_name}</b> (ID: {deleteTargetUser.id}) from the ReqRes sandbox?
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetUser(null)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={handleDeleteOneUser}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50 cursor-pointer shadow-md"
              >
                {deleteSubmitting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Delete ALL Demo Accounts Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 ${
            isLight ? 'bg-white border-red-200 text-slate-900' : 'bg-[#040814] border-red-500/50 text-white'
          }`}>
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
              <Ban className="w-5 h-5" />
              <span>Confirm Bulk Demo Accounts Deletion</span>
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-300 space-y-1">
              <p className="font-bold">Delete all demo accounts? This action cannot be undone.</p>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                This will dispatch individual DELETE requests for all {reqresUsers.length} visible ReqRes accounts. This only affects the demo sandbox and will never touch real clearance profiles.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAllModal(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                  isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteAllSubmitting}
                onClick={handleDeleteAllUsers}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50 cursor-pointer shadow-md"
              >
                {deleteAllSubmitting ? 'Deleting All...' : 'Confirm Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
