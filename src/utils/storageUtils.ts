// LocalStorage Helper for CyberShield SOC Data Persistence

const KEYS = {
  SIEM_RULES: 'cybershield_siem_rules',
  DARKWEB_LEAKS: 'cybershield_darkweb_leaks',
  SANDBOX_REPORTS: 'cybershield_sandbox_reports',
};

export const storageUtils = {
  get<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },

  KEYS,
};
