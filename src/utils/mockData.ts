import type { Alert, Asset, GlobalAttack, Incident, Threat, ThreatActor, Vulnerability } from '../types';

const severities = ['critical', 'high', 'medium', 'low'] as const;
const threatCategories = ['malware', 'ransomware', 'phishing', 'ddos', 'intrusion', 'data_exfiltration', 'privilege_escalation', 'lateral_movement'];
const assetTypes = ['server', 'workstation', 'network', 'cloud', 'database', 'application', 'mobile', 'iot'];
const attackTypes = ['DDoS', 'Malware', 'Ransomware', 'Phishing', 'SQL Injection', 'XSS', 'Brute Force', 'Credential Stuffing', 'Zero-Day', 'APT'];
const countries = ['US', 'CN', 'RU', 'KP', 'IR', 'BR', 'IN', 'GB', 'DE', 'FR', 'JP', 'AU', 'CA', 'NL', 'UA'];

const countryCoords: Record<string, [number, number]> = {
  'US': [37.0902, -95.7129],
  'CN': [35.8617, 104.1954],
  'RU': [61.5240, 105.3188],
  'KP': [40.3399, 127.5101],
  'IR': [32.4279, 53.6880],
  'BR': [-14.2350, -51.9253],
  'IN': [20.5937, 78.9629],
  'GB': [55.3781, -3.4360],
  'DE': [51.1657, 10.4515],
  'FR': [46.2276, 2.2137],
  'JP': [36.2048, 138.2529],
  'AU': [-25.2744, 133.7751],
  'CA': [56.1304, -106.3468],
  'NL': [52.1326, 5.2913],
  'UA': [48.3794, 31.1656],
};

const countryCities: Record<string, string> = {
  'US': 'Washington D.C.',
  'CN': 'Beijing',
  'RU': 'Moscow',
  'KP': 'Pyongyang',
  'IR': 'Tehran',
  'BR': 'Brasília',
  'IN': 'New Delhi',
  'GB': 'London',
  'DE': 'Berlin',
  'FR': 'Paris',
  'JP': 'Tokyo',
  'AU': 'Sydney',
  'CA': 'Ottawa',
  'NL': 'Amsterdam',
  'UA': 'Kyiv',
};

function randomItem<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomId(): string {
  return crypto.randomUUID();
}

function randomIP(): string {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function randomDate(daysBack: number = 30): string {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return past.toISOString();
}

export function generateAssets(count: number = 50): Asset[] {
  const assets: Asset[] = [];
  for (let i = 0; i < count; i++) {
    assets.push({
      id: randomId(),
      org_id: 'default-org',
      name: `Asset-${String(i + 1).padStart(4, '0')}`,
      type: randomItem(assetTypes),
      ip_address: randomIP(),
      mac_address: `${randomItem(['00:1A', '00:1B', '00:1C', '00:1D'])}:${Math.random().toString(16).slice(2, 5)}:${Math.random().toString(16).slice(2, 5)}`,
      os_type: randomItem(['Windows Server 2022', 'Ubuntu 22.04', 'RHEL 9', 'macOS', 'CentOS', 'Debian']),
      os_version: 'Latest',
      status: randomItem(['active', 'inactive', 'maintenance', 'critical']),
      criticality: randomItem(severities),
      location: randomItem(['US-East', 'US-West', 'EU-West', 'APAC', 'LATAM']),
      last_seen: randomDate(7),
      created_at: randomDate(90),
    });
  }
  return assets;
}

export function generateThreats(count: number = 100): Threat[] {
  const threats: Threat[] = [];
  const mitreIds = ['T1566', 'T1190', 'T1059', 'T1078', 'T1021', 'T1003', 'T1486', 'T1490'];

  for (let i = 0; i < count; i++) {
    threats.push({
      id: randomId(),
      org_id: 'default-org',
      title: `${randomItem(attackTypes)} Attack Detected - ${randomItem(['Network', 'Endpoint', 'Cloud', 'Application'])}`,
      description: 'Automated threat detection identified suspicious activity',
      severity: randomItem(severities),
      category: randomItem(threatCategories),
      mitre_attack_id: randomItem(mitreIds),
      source_ip: randomIP(),
      target_ip: randomIP(),
      status: randomItem(['active', 'investigating', 'contained', 'resolved', 'false_positive']),
      assigned_to: null,
      ioc: [randomIP(), `hash-${Math.random().toString(36).slice(2, 12)}`, `domain-${Math.random().toString(36).slice(2, 10)}.com`],
      first_seen: randomDate(14),
      last_seen: randomDate(3),
      created_at: randomDate(14),
    });
  }
  return threats;
}

export function generateAlerts(count: number = 200): Alert[] {
  const alerts: Alert[] = [];
  const sources = ['SIEM', 'EDR', 'NDR', 'Firewall', 'IDS', 'WAF', 'Cloud Security', 'Email Gateway'];

  for (let i = 0; i < count; i++) {
    const severity = randomItem(severities);
    alerts.push({
      id: randomId(),
      org_id: 'default-org',
      threat_id: randomId(),
      asset_id: randomId(),
      title: `${randomItem(attackTypes)} Alert - ${severity.toUpperCase()} Severity`,
      description: 'Security event triggered alert based on detection rule',
      severity,
      status: randomItem(['new', 'in_progress', 'acknowledged', 'resolved', 'dismissed']),
      source: randomItem(sources),
      rule_id: `RULE-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
      raw_data: { event_type: randomItem(attackTypes), count: Math.floor(Math.random() * 1000) },
      acknowledged_by: null,
      acknowledged_at: null,
      created_at: randomDate(7),
    });
  }
  return alerts;
}

export function generateIncidents(count: number = 30): Incident[] {
  const incidents: Incident[] = [];
  const incidentTypes = ['Security Breach', 'Data Leak', 'Malware Infection', 'Unauthorized Access', 'Policy Violation', 'System Compromise'];

  for (let i = 0; i < count; i++) {
    incidents.push({
      id: randomId(),
      org_id: 'default-org',
      title: `INC-${String(i + 1).padStart(5, '0')}: ${randomItem(incidentTypes)}`,
      description: 'Incident created based on security event correlation',
      severity: randomItem(severities),
      status: randomItem(['open', 'investigating', 'contained', 'eradicated', 'recovered', 'closed']),
      priority: randomItem(['p1', 'p2', 'p3', 'p4']),
      incident_type: randomItem(incidentTypes),
      assigned_to: null,
      created_by: null,
      estimated_impact: randomItem(['Critical', 'High', 'Medium', 'Low']),
      resolved_at: null,
      created_at: randomDate(30),
      updated_at: randomDate(10),
    });
  }
  return incidents;
}

export function generateVulnerabilities(count: number = 80): Vulnerability[] {
  const vulns: Vulnerability[] = [];
  const cvePrefix = ['CVE-2023', 'CVE-2024', 'CVE-2025'];
  const vendors = ['Microsoft', 'Adobe', 'Oracle', 'Apache', 'nginx', 'OpenSSL', 'Linux Kernel'];

  for (let i = 0; i < count; i++) {
    const severity = randomItem(severities);
    vulns.push({
      id: randomId(),
      org_id: 'default-org',
      asset_id: randomId(),
      cve_id: `${randomItem(cvePrefix)}-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`,
      title: `${randomItem(vendors)} ${randomItem(['RCE', 'XSS', 'SQLi', 'DoS', 'Privilege Escalation', 'Information Disclosure'])} Vulnerability`,
      description: 'Vulnerability discovered during security assessment',
      severity,
      cvss_score: severity === 'critical' ? 9 + Math.random() : severity === 'high' ? 7 + Math.random() * 2 : severity === 'medium' ? 4 + Math.random() * 3 : 1 + Math.random() * 3,
      exploit_available: Math.random() > 0.6,
      patch_available: Math.random() > 0.4,
      status: randomItem(['open', 'remediating', 'patched', 'risk_accepted', 'false_positive']),
      remediation: 'Apply vendor patch or implement compensating controls',
      discovered_at: randomDate(60),
      created_at: randomDate(60),
    });
  }
  return vulns;
}

export function generateThreatActors(count: number = 20): ThreatActor[] {
  const actors: ThreatActor[] = [];
  const actorNames = ['APT29', 'APT28', 'Lazarus', 'FIN7', 'Carbanak', 'Turla', 'Dragonfly', 'Sandworm', 'Equation Group', 'APT41', 'Winnti', 'OceanLotus', 'APT33', 'APT35', 'APT38', 'OilRig', 'MuddyWater', 'TA505', 'Evil Corp', 'Conti'];

  for (let i = 0; i < count; i++) {
    actors.push({
      id: randomId(),
      name: actorNames[i] || `APT-UNKNOWN-${i}`,
      aliases: [`Group-${i}`, `Threat-${String.fromCharCode(65 + i)}`],
      country: randomItem(countries),
      motivation: randomItem(['Espionage', 'Financial', 'Sabotage', 'Hacktivism']),
      sophistication: randomItem(['Advanced', 'Expert', 'Novice', 'Intermediate']),
      attack_patterns: [randomItem(threatCategories), randomItem(threatCategories)],
      targeted_sectors: randomItem([['Finance', 'Healthcare', 'Government', 'Energy', 'Retail', 'Technology']]),
      first_seen: randomDate(365 * 3),
      last_seen: randomDate(30),
      description: 'Known threat actor with documented attack history',
      created_at: randomDate(365),
    });
  }
  return actors;
}

export function generateGlobalAttacks(count: number = 500): GlobalAttack[] {
  const attacks: GlobalAttack[] = [];

  for (let i = 0; i < count; i++) {
    const sourceCountry = randomItem(countries);
    const targetCountry = randomItem(countries.filter(c => c !== sourceCountry));
    const sourceCoords = countryCoords[sourceCountry] || [0, 0];
    const targetCoords = countryCoords[targetCountry] || [0, 0];

    attacks.push({
      id: randomId(),
      source_country: sourceCountry,
      target_country: targetCountry,
      source_city: countryCities[sourceCountry] || 'Unknown',
      target_city: countryCities[targetCountry] || 'Unknown',
      source_lat: sourceCoords[0] + (Math.random() - 0.5) * 10,
      source_lng: sourceCoords[1] + (Math.random() - 0.5) * 10,
      target_lat: targetCoords[0] + (Math.random() - 0.5) * 10,
      target_lng: targetCoords[1] + (Math.random() - 0.5) * 10,
      attack_type: randomItem(attackTypes),
      severity: randomItem(severities),
      timestamp: randomDate(24),
    });
  }
  return attacks;
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#ff0054';
    case 'high': return '#ff6b35';
    case 'medium': return '#ffbe0b';
    case 'low': return '#00ff88';
    default: return '#00f0ff';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'open':
    case 'new':
      return '#ff0054';
    case 'investigating':
    case 'in_progress':
      return '#ffbe0b';
    case 'contained':
    case 'acknowledged':
      return '#00f0ff';
    case 'resolved':
    case 'closed':
    case 'patched':
      return '#00ff88';
    case 'dismissed':
    case 'false_positive':
      return '#888888';
    default:
      return '#00f0ff';
  }
}
