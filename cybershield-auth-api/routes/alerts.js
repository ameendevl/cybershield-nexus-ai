const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/alerts
router.get('/', (req, res) => {
  const { severity, status } = req.query;
  let sql = 'SELECT * FROM alerts';
  const params = [];
  const conditions = [];

  if (severity) {
    conditions.push('severity = ?');
    params.push(severity);
  }
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY timestamp DESC LIMIT 100';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: rows.length, alerts: rows });
  });
});

// POST /api/alerts
router.post('/', (req, res) => {
  const {
    title,
    severity = 'medium',
    category = 'Anomaly',
    source_ip = '10.0.0.1',
    target_asset = 'Perimeter',
    status = 'active',
    details = '',
  } = req.body || {};

  if (!title) return res.status(400).json({ error: 'Alert title is required' });

  const id = 'ALT-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO alerts (id, title, severity, category, source_ip, target_asset, status, timestamp, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, severity, category, source_ip, target_asset, status, now, details],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Alert recorded in SIEM', alert: { id, title, severity, category, source_ip, target_asset, status, timestamp: now, details } });
    }
  );
});

// PATCH /api/alerts/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  db.run('UPDATE alerts SET status = ? WHERE id = ?', [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Alert not found' });
    res.json({ message: `Alert ${req.params.id} updated to ${status}`, alertId: req.params.id, status });
  });
});

module.exports = router;
