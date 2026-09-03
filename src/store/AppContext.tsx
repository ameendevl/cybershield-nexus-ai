import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Alert, Asset, GlobalAttack, Incident, Threat, ThreatActor, Vulnerability, ForensicsCase, ComplianceItem, Playbook, User } from '../types';
import { generateAlerts, generateAssets, generateGlobalAttacks, generateIncidents, generateThreats, generateVulnerabilities, generateThreatActors } from '../utils/mockData';
import { apiService } from '../services/api';

interface AppState {
  threats: Threat[];
  alerts: Alert[];
  incidents: Incident[];
  vulnerabilities: Vulnerability[];
  assets: Asset[];
  globalAttacks: GlobalAttack[];
  threatActors: ThreatActor[];
  forensicsCases: ForensicsCase[];
  complianceItems: ComplianceItem[];
  playbooks: Playbook[];
  isLoading: boolean;
  selectedView: string;
  sidebarCollapsed: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  themeMode: 'dark' | 'light';
}

interface AppContextType extends AppState {
  setSelectedView: (view: string) => void;
  toggleSidebar: () => void;
  refreshData: () => void;
  acknowledgeAlert: (alertId: string) => void;
  updateIncidentStatus: (incidentId: string, status: string) => void;
  addAlerts: (count: number) => void;
  login: (userData: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cybershield_auth_user';
const THEME_STORAGE_KEY = 'cybershield_theme_mode';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved && saved !== 'logged_out') {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [themeMode, setThemeModeState] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  // Synchronize theme with HTML & Body classes and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {}

    const root = document.documentElement;
    const body = document.body;

    if (themeMode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
  }, [themeMode]);

  const [state, setState] = useState<AppState>(() => ({
    threats: generateThreats(150),
    alerts: generateAlerts(300),
    incidents: generateIncidents(50),
    vulnerabilities: generateVulnerabilities(120),
    assets: generateAssets(80),
    globalAttacks: generateGlobalAttacks(800),
    threatActors: generateThreatActors(25),
    forensicsCases: [],
    complianceItems: [],
    playbooks: [],
    isLoading: false,
    selectedView: 'command-center',
    sidebarCollapsed: false,
    isAuthenticated: !!user,
    currentUser: user,
    themeMode,
  }));

  // On App Mount, validate local session token and fetch live SQLite SOC data
  useEffect(() => {
    refreshData();

    const token = apiService.getToken();
    if (token) {
      apiService
        .getMe()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            setState((prev) => ({
              ...prev,
              isAuthenticated: true,
              currentUser: res.user,
            }));
            try {
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
            } catch {}
          }
        })
        .catch(() => {});
    }
  }, []);

  const login = useCallback((userData: User) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch {}

    setUser(userData);
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      currentUser: userData,
    }));
  }, []);

  const logout = useCallback(() => {
    apiService.signOut();
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'logged_out');
    } catch {}

    setUser(null);
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      currentUser: null,
    }));
  }, []);

  const setSelectedView = useCallback((view: string) => {
    setState((prev) => ({ ...prev, selectedView: view }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  const refreshData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const [alerts, incidents, threats, assets, vulns, attacks] = await Promise.all([
      apiService.getAlerts(),
      apiService.getIncidents(),
      apiService.getThreats(),
      apiService.getAssets(),
      apiService.getVulnerabilities(),
      apiService.getGlobalAttacks(),
    ]);

    setState((prev) => ({
      ...prev,
      alerts,
      incidents,
      threats,
      assets,
      vulnerabilities: vulns,
      globalAttacks: attacks,
      isLoading: false,
    }));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'acknowledged', acknowledged_at: new Date().toISOString() } : a
      ),
    }));
  }, []);

  const updateIncidentStatus = useCallback((incidentId: string, status: string) => {
    // Optimistic UI update
    setState((prev) => ({
      ...prev,
      incidents: prev.incidents.map((i) =>
        i.id === incidentId ? { ...i, status, updated_at: new Date().toISOString() } : i
      ),
    }));

    // Async SQLite persistence
    apiService.updateIncidentStatus(incidentId, status).catch(() => {});
  }, []);

  const addAlerts = useCallback((count: number) => {
    const newAlerts = generateAlerts(count);
    setState((prev) => ({
      ...prev,
      alerts: [...newAlerts, ...prev.alerts].slice(0, 500),
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      setState((s) => ({ ...s, themeMode: next }));
      return next;
    });
  }, []);

  const setThemeMode = useCallback((mode: 'dark' | 'light') => {
    setThemeModeState(mode);
    setState((s) => ({ ...s, themeMode: mode }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        themeMode,
        setSelectedView,
        toggleSidebar,
        refreshData,
        acknowledgeAlert,
        updateIncidentStatus,
        addAlerts,
        login,
        logout,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
