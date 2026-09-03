import type { Incident, Alert, Vulnerability, Asset } from '../types';

export function exportToCSV(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(header => {
          const val = (row as any)[header];
          const escaped = String(val ?? '').replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportIncidentsReport(incidents: Incident[]) {
  const data = incidents.map(i => ({
    ID: i.id,
    Title: i.title,
    Severity: i.severity,
    Status: i.status,
    Category: (i as any).category || 'Security Operations',
    Assignee: (i as any).assignee || 'SOC Specialist',
    Source_IP: (i as any).source_ip || '192.168.1.1',
    Created_At: i.created_at,
  }));
  exportToCSV('CyberShield_Incidents_Report', data);
}

export function exportAlertsReport(alerts: Alert[]) {
  const data = alerts.map(a => ({
    ID: a.id,
    Title: a.title,
    Severity: a.severity,
    Source: a.source,
    Status: a.status,
    Created_At: a.created_at,
  }));
  exportToCSV('CyberShield_SOC_Alerts_Report', data);
}

export function exportVulnerabilitiesReport(vulns: Vulnerability[]) {
  const data = vulns.map(v => ({
    ID: v.id,
    CVE: v.cve_id || 'CVE-Pending',
    Title: v.title,
    Severity: v.severity,
    CVSS_Score: v.cvss_score,
    Affected_Asset: (v as any).affected_asset || 'Production Server',
    Status: v.status,
  }));
  exportToCSV('CyberShield_Vulnerabilities_Report', data);
}

export function exportAssetsReport(assets: Asset[]) {
  const data = assets.map(ast => ({
    ID: ast.id,
    Name: ast.name,
    Type: ast.type,
    IP_Address: ast.ip_address,
    OS: (ast as any).os || 'Enterprise Linux',
    Risk_Score: (ast as any).risk_score || 'Low',
    Status: ast.status,
  }));
  exportToCSV('CyberShield_Asset_Inventory_Report', data);
}
