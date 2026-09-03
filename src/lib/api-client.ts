// Centralized API Client Layer for CyberShield Nexus
// Configurable base URL with relative fallback
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export interface HealthResponse {
  status: string;
}

export interface AuthCapabilities {
  provider: string;
  methods: {
    emailPassword: boolean;
    googleOAuth: boolean;
    webAuthn: boolean;
  };
  notes: string[];
}

export interface CurrentUserSession {
  authenticated: boolean;
  userId?: string;
  sessionId?: string;
  organizationId?: string | null;
  provider?: string;
  error?: string;
}

export interface SecurityActivityItem {
  event: string;
  at: string;
  requestId: string;
  ip: string;
}

export interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqResUsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUser[];
  support?: {
    url: string;
    text: string;
  };
}

export interface TelemetryLogPacket {
  method: string;
  url: string;
  status: number;
  statusText: string;
  latencyMs: number;
  timestamp: string;
  data: any;
}

class ApiClient {
  private lastTelemetry: TelemetryLogPacket | null = null;
  private telemetryListeners: Array<(telemetry: TelemetryLogPacket) => void> = [];

  public onTelemetry(cb: (telemetry: TelemetryLogPacket) => void) {
    this.telemetryListeners.push(cb);
    if (this.lastTelemetry) cb(this.lastTelemetry);
    return () => {
      this.telemetryListeners = this.telemetryListeners.filter(l => l !== cb);
    };
  }

  public getLastTelemetry(): TelemetryLogPacket | null {
    return this.lastTelemetry;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const startTime = performance.now();

    try {
      const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const latencyMs = Math.round(performance.now() - startTime);
      let data: any = null;

      if (res.status === 204) {
        data = null;
      } else {
        const text = await res.text();
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text;
        }
      }

      this.lastTelemetry = {
        method: options.method || 'GET',
        url: endpoint,
        status: res.status,
        statusText: res.statusText || (res.ok ? 'OK' : 'ERR'),
        latencyMs,
        timestamp: new Date().toISOString(),
        data,
      };
      this.telemetryListeners.forEach(l => l(this.lastTelemetry!));

      if (!res.ok) {
        const errorMsg = data?.error || data?.message || `HTTP ${res.status} ${res.statusText}`;
        const err: any = new Error(errorMsg);
        err.status = res.status;
        err.data = data;
        throw err;
      }

      return data as T;
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      this.lastTelemetry = {
        method: options.method || 'GET',
        url: endpoint,
        status: err.status || 0,
        statusText: err.message || 'Network Failed',
        latencyMs,
        timestamp: new Date().toISOString(),
        data: err.data || { error: err.message },
      };
      this.telemetryListeners.forEach(l => l(this.lastTelemetry!));
      throw err;
    }
  }

  // 1. Health check
  public async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/healthz');
  }

  // 2. Capabilities
  public async getCapabilities(): Promise<AuthCapabilities> {
    return this.request<AuthCapabilities>('/api/auth/capabilities');
  }

  // 3. Current Session
  public async getCurrentSession(): Promise<CurrentUserSession> {
    return this.request<CurrentUserSession>('/api/auth/me');
  }

  // 4. Security Activity
  public async getActivity(limit = 20): Promise<{ items: SecurityActivityItem[] }> {
    return this.request<{ items: SecurityActivityItem[] }>(`/api/auth/activity?limit=${limit}`);
  }

  // 5. ReqRes Users List
  public async getReqResUsers(page = 1, perPage = 6): Promise<ReqResUsersListResponse> {
    return this.request<ReqResUsersListResponse>(`/api/reqres/users?page=${page}&per_page=${perPage}`);
  }

  // 6. ReqRes User Detail
  public async getReqResUser(id: number | string): Promise<{ data: ReqResUser; support?: any }> {
    return this.request<{ data: ReqResUser; support?: any }>(`/api/reqres/users/${id}`);
  }

  // 7. Create Demo User
  public async createReqResUser(name: string, job: string): Promise<{ name: string; job: string; id: string; createdAt: string }> {
    return this.request<{ name: string; job: string; id: string; createdAt: string }>('/api/reqres/users', {
      method: 'POST',
      body: JSON.stringify({ name, job }),
    });
  }

  // 8. Update Demo User
  public async updateReqResUser(id: number | string, name: string, job: string): Promise<{ name: string; job: string; updatedAt: string }> {
    return this.request<{ name: string; job: string; updatedAt: string }>(`/api/reqres/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, job }),
    });
  }

  // 9. Delete One Demo User
  public async deleteReqResUser(id: number | string): Promise<void> {
    await this.request<void>(`/api/reqres/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
