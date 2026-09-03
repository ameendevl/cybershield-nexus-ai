export interface Asset {
  id: string;
  org_id: string;
  name: string;
  type: string;
  ip_address: string | null;
  mac_address: string | null;
  os_type: string | null;
  os_version: string | null;
  status: string;
  criticality: string;
  location: string | null;
  last_seen: string | null;
  created_at: string;
}

export interface Threat {
  id: string;
  org_id: string;
  title: string;
  description: string | null;
  severity: string;
  category: string | null;
  mitre_attack_id: string | null;
  source_ip: string | null;
  target_ip: string | null;
  status: string;
  assigned_to: string | null;
  ioc: string[] | null;
  first_seen: string;
  last_seen: string;
  created_at: string;
}

export interface Alert {
  id: string;
  org_id: string;
  threat_id: string | null;
  asset_id: string | null;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  source: string | null;
  rule_id: string | null;
  raw_data: Record<string, unknown> | null;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
}

export interface Incident {
  id: string;
  org_id: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  priority: string;
  incident_type: string | null;
  assigned_to: string | null;
  created_by: string | null;
  estimated_impact: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vulnerability {
  id: string;
  org_id: string;
  asset_id: string | null;
  cve_id: string | null;
  title: string;
  description: string | null;
  severity: string;
  cvss_score: number | null;
  exploit_available: boolean;
  patch_available: boolean;
  status: string;
  remediation: string | null;
  discovered_at: string;
  created_at: string;
}

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[] | null;
  country: string | null;
  motivation: string | null;
  sophistication: string | null;
  attack_patterns: string[] | null;
  targeted_sectors: string[] | null;
  first_seen: string | null;
  last_seen: string | null;
  description: string | null;
  created_at: string;
}

export interface Playbook {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  trigger_type: string | null;
  trigger_conditions: Record<string, unknown> | null;
  steps: Record<string, unknown>[] | null;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForensicsCase {
  id: string;
  org_id: string;
  incident_id: string | null;
  title: string;
  status: string;
  evidence_count: number;
  lead_analyst: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplianceItem {
  id: string;
  org_id: string;
  framework: string;
  control_id: string;
  control_name: string;
  description: string | null;
  status: string;
  evidence_links: string[] | null;
  assessor_id: string | null;
  assessed_at: string | null;
  created_at: string;
}

export interface GlobalAttack {
  id: string;
  source_country: string | null;
  target_country: string | null;
  source_city?: string | null;
  target_city?: string | null;
  source_lat: number | null;
  source_lng: number | null;
  target_lat: number | null;
  target_lng: number | null;
  attack_type: string | null;
  severity: string | null;
  timestamp: string;
}

export interface SecurityMetric {
  id: string;
  org_id: string;
  metric_type: string;
  metric_name: string;
  value: number;
  unit: string | null;
  tags: Record<string, unknown> | null;
  recorded_at: string;
}

export interface User {
  id: string;
  org_id?: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  last_active: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type AssetType = 'server' | 'workstation' | 'network' | 'cloud' | 'database' | 'application' | 'mobile' | 'iot';
export type ThreatCategory = 'malware' | 'ransomware' | 'phishing' | 'ddos' | 'intrusion' | 'data_exfiltration' | 'privilege_escalation' | 'lateral_movement';
