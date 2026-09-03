const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/vulnerabilities
router.get('/', (req, res) => {
  const { status, severity } = req.query;
  let sql = 'SELECT * FROM vulnerabilities';
  const params = [];
  const conditions = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (severity) {
    conditions.push('severity = ?');
    params.push(severity);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY cvss_score DESC, discovered_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: rows.length, vulnerabilities: rows });
  });
});

// POST /api/vulnerabilities
router.post('/', (req, res) => {
  const {
    cve_id = 'CVE-2026-' + Math.floor(1000 + Math.random() * 9000),
    title,
    severity = 'high',
    cvss_score = 7.5,
    status = 'open',
    affected_asset = 'Unspecified Asset',
    remediation = 'Apply vendor security patch and restrict network access.',
  } = req.body || {};

  if (!title) return res.status(400).json({ error: 'Vulnerability title is required' });

  const id = 'VULN-' + Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO vulnerabilities (id, cve_id, title, severity, cvss_score, status, affected_asset, remediation, discovered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, cve_id, title, severity, cvss_score, status, affected_asset, remediation, now],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: 'Vulnerability logged in Asset Risk Register',
        vulnerability: { id, cve_id, title, severity, cvss_score, status, affected_asset, remediation, discovered_at: now },
      });
    }
  );
});

// PATCH /api/vulnerabilities/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  db.run('UPDATE vulnerabilities SET status = ? WHERE id = ?', [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Vulnerability not found' });
    res.json({ message: `Vulnerability ${req.params.id} marked as ${status}`, vulnId: req.params.id, status });
  });
});

module.exports = router;
