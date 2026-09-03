const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'cybershield.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

db.serialize(() => {
  // 1. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      role TEXT DEFAULT 'SOC Specialist',
      avatar_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Incidents Table
  db.run(`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      severity TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'investigating',
      category TEXT,
      assigned_to TEXT,
      source_ip TEXT,
      target_asset TEXT,
      mitre_technique TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Alerts Table
  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      severity TEXT NOT NULL,
      category TEXT,
      source_ip TEXT,
      target_asset TEXT,
      status TEXT DEFAULT 'active',
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      details TEXT
    )
  `);

  // 4. Vulnerabilities Table
  db.run(`
    CREATE TABLE IF NOT EXISTS vulnerabilities (
      id TEXT PRIMARY KEY,
      cve_id TEXT,
      title TEXT NOT NULL,
      severity TEXT NOT NULL,
      cvss_score REAL,
      status TEXT DEFAULT 'open',
      affected_asset TEXT,
      remediation TEXT,
      discovered_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Audit Logs Table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      target TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      details TEXT
    )
  `);

  // Seed Incidents if empty
  db.get('SELECT COUNT(*) as count FROM incidents', (err, row) => {
    if (!err && row && row.count === 0) {
      console.log('Seeding initial SOC incidents into SQLite...');
      const seedIncidents = [
        [
          'INC-8092',
          'Ransomware Lateral Movement in Finance Domain Controller',
          'LockBit 3.0 strain detected attempting SMB lateral traversal from SRV-FIN-DC01 to customer database.',
          'critical',
          'investigating',
          'Ransomware / Lateral Movement',
          'Marcus Vance (Senior SOC Specialist)',
          '194.26.29.114',
          'SRV-FIN-DC01',
          'T1021.002 - SMB/Windows Admin Shares',
          new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          new Date().toISOString(),
        ],
        [
          'INC-8091',
          'LSASS Credential Memory Dump via Procdump Utility',
          'Unauthorized privileged memory dump of lsass.exe detected on workstation HR-WS-09.',
          'high',
          'investigating',
          'Credential Access',
          'Sarah Jenkins (Threat Hunter)',
          '10.0.4.82',
          'HR-WS-09',
          'T1003.001 - LSASS Memory',
          new Date(Date.now() - 1000 * 60 * 42).toISOString(),
          new Date().toISOString(),
        ],
        [
          'INC-8090',
          'Distributed SYN Flood Saturated Edge API Gateway',
          'Layer 4 SYN flood exceeding 180,000 pps targeting AWS Cloud Perimeter.',
          'medium',
          'contained',
          'Denial of Service',
          'Alex Mercer (Global Threat Hunter)',
          '185.220.101.5',
          'GW-EDGE-US-EAST',
          'T1498.001 - Direct Network Flood',
          new Date(Date.now() - 1000 * 60 * 110).toISOString(),
          new Date().toISOString(),
        ],
        [
          'INC-8089',
          'Boolean-Based SQL Injection on Checkout API Endpoint',
          'Attacker injected OR 1=1 boolean bypass payload against /api/v2/orders.',
          'critical',
          'resolved',
          'Web Application Exploit',
          'Elena Rostova (Lead Security Architect)',
          '45.142.214.19',
          'WEB-APP-CLUSTER-02',
          'T1190 - Exploit Public-Facing Application',
          new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          new Date().toISOString(),
        ],
      ];

      const stmt = db.prepare(
        'INSERT INTO incidents (id, title, description, severity, status, category, assigned_to, source_ip, target_asset, mitre_technique, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      seedIncidents.forEach((inc) => stmt.run(inc));
      stmt.finalize();
    }
  });

  // Seed Vulnerabilities if empty
  db.get('SELECT COUNT(*) as count FROM vulnerabilities', (err, row) => {
    if (!err && row && row.count === 0) {
      console.log('Seeding initial CVE vulnerabilities into SQLite...');
      const seedVulns = [
        [
          'VULN-001',
          'CVE-2024-38077',
          'Windows Remote Desktop Licensing Service Remote Code Execution',
          'critical',
          9.8,
          'open',
          'SRV-FIN-DC01',
          'Apply Microsoft Out-of-Band KB5040442 patch and disable RDP licensing service on perimeter.',
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        ],
        [
          'VULN-002',
          'CVE-2023-38606',
          'Kernel Memory Read/Write Operation Page Table Bypass',
          'high',
          8.6,
          'in_progress',
          'KRNL-GATEWAY-01',
          'Upgrade OS kernel to release 6.8.0-40 or patch with hardware integrity lockdown.',
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        ],
        [
          'VULN-003',
          'CVE-2023-44487',
          'HTTP/2 Protocol Rapid Reset Stream Cancellation DDoS Vulnerability',
          'high',
          7.5,
          'mitigated',
          'GW-EDGE-US-EAST',
          'Enforce strict stream limit concurrency in Nginx / Envoy reverse proxy.',
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        ],
        [
          'VULN-004',
          'CVE-2023-3817',
          'OpenSSL Excessive DH Key Computation Denial of Service',
          'medium',
          5.3,
          'open',
          'WEB-APP-CLUSTER-02',
          'Update OpenSSL libraries to 3.2.1+ LTS across all Docker container base images.',
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        ],
      ];

      const stmt = db.prepare(
        'INSERT INTO vulnerabilities (id, cve_id, title, severity, cvss_score, status, affected_asset, remediation, discovered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      seedVulns.forEach((v) => stmt.run(v));
      stmt.finalize();
    }
  });

  // Seed Alerts if empty
  db.get('SELECT COUNT(*) as count FROM alerts', (err, row) => {
    if (!err && row && row.count === 0) {
      console.log('Seeding initial alerts into SQLite...');
      const seedAlerts = [
        ['ALT-9001', 'LSASS In-Memory Credential Dump', 'critical', 'Credential Access', '10.0.4.82', 'HR-WS-09', 'active', new Date(Date.now() - 1000 * 60 * 12).toISOString(), 'Mimikatz sekurlsa::logonpasswords detected by EDR agent.'],
        ['ALT-9002', 'Kerberoasting SPN Ticket Request Anomaly', 'high', 'Lateral Movement', '192.168.1.144', 'SRV-FIN-DC01', 'active', new Date(Date.now() - 1000 * 60 * 25).toISOString(), 'Abnormal RC4 encryption requested for service accounts.'],
        ['ALT-9003', 'Massive Outbound Data Exfiltration over DNS Tunnel', 'critical', 'Exfiltration', '10.0.12.33', 'EDGE-DNS-01', 'active', new Date(Date.now() - 1000 * 60 * 40).toISOString(), 'High frequency of encoded TXT queries to c2-beacon.darknet.ru.'],
        ['ALT-9004', 'Unauthorized SSH Root Brute-Force Cluster', 'medium', 'Initial Access', '185.220.101.5', 'GW-EDGE-US-EAST', 'contained', new Date(Date.now() - 1000 * 60 * 85).toISOString(), '480 failed password attempts across 60 seconds.'],
        ['ALT-9005', 'Cloud IAM Privilege Escalation via AssumeRole', 'high', 'Privilege Escalation', '54.210.12.8', 'AWS-IAM-ADMIN', 'investigating', new Date(Date.now() - 1000 * 60 * 130).toISOString(), 'sts:AssumeRole called from unapproved geographic region (RO).'],
      ];

      const stmt = db.prepare(
        'INSERT INTO alerts (id, title, severity, category, source_ip, target_asset, status, timestamp, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      seedAlerts.forEach((a) => stmt.run(a));
      stmt.finalize();
    }
  });
});

module.exports = db;
