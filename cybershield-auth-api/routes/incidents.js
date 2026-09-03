const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/incidents — Retrieve all SOC incidents
router.get('/', (req, res) => {
  const { status, severity } = req.query;
  let sql = 'SELECT * FROM incidents';
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

  sql += ' ORDER BY created_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to query incidents: ' + err.message });
    }
    res.json({ count: rows.length, incidents: rows });
  });
});

// GET /api/incidents/:id — Single incident
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM incidents WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Incident not found' });
    res.json(row);
  });
});

// POST /api/incidents — Create new incident
router.post('/', (req, res) => {
  const {
    title,
    description,
    severity = 'high',
    status = 'investigating',
    category = 'Intrusion',
    assigned_to = 'Unassigned',
    source_ip = '0.0.0.0',
    target_asset = 'Unknown Asset',
    mitre_technique = 'T1190',
  } = req.body || {};

  if (!title) {
    return res.status(400).json({ error: 'Incident title is required.' });
  }

  const id = 'INC-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();

  const sql = `
    INSERT INTO incidents (id, title, description, severity, status, category, assigned_to, source_ip, target_asset, mitre_technique, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [id, title, description, severity, status, category, assigned_to, source_ip, target_asset, mitre_technique, now, now],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Add to audit logs
      db.run(
        'INSERT INTO audit_logs (id, user_id, action, target, details) VALUES (?, ?, ?, ?, ?)',
        ['AUD-' + Date.now(), 'system', 'INCIDENT_CREATED', id, `Created incident: ${title}`]
      );

      db.get('SELECT * FROM incidents WHERE id = ?', [id], (err, row) => {
        res.status(201).json({ message: 'Incident logged in SOC database', incident: row });
      });
    }
  );
});

// PATCH /api/incidents/:id/status — Update status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const now = new Date().toISOString();
  db.run(
    'UPDATE incidents SET status = ?, updated_at = ? WHERE id = ?',
    [status, now, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Incident not found' });

      // Add audit log
      db.run(
        'INSERT INTO audit_logs (id, user_id, action, target, details) VALUES (?, ?, ?, ?, ?)',
        ['AUD-' + Date.now(), 'analyst', 'INCIDENT_STATUS_CHANGE', req.params.id, `Status set to: ${status}`]
      );

      res.json({ message: `Incident ${req.params.id} updated to ${status}`, incidentId: req.params.id, status });
    }
  );
});

// PATCH /api/incidents/:id/isolate — Auto-Isolate host action
router.patch('/:id/isolate', (req, res) => {
  const now = new Date().toISOString();
  db.get('SELECT * FROM incidents WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Incident not found' });

    db.run(
      "UPDATE incidents SET status = 'contained', updated_at = ? WHERE id = ?",
      [now, req.params.id],
      function (updateErr) {
        if (updateErr) return res.status(500).json({ error: updateErr.message });

        db.run(
          'INSERT INTO audit_logs (id, user_id, action, target, details) VALUES (?, ?, ?, ?, ?)',
          [
            'AUD-' + Date.now(),
            'soar_engine',
            'HOST_ISOLATED',
            row.target_asset || req.params.id,
            `Automated network isolation triggered for asset ${row.target_asset} via incident ${req.params.id}`,
          ]
        );

        res.json({
          message: `Host ${row.target_asset} successfully isolated from corporate network. Incident marked Contained.`,
          incidentId: req.params.id,
          isolatedAsset: row.target_asset,
          status: 'contained',
        });
      }
    );
  });
});

// DELETE /api/incidents/:id — Delete incident
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM incidents WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Incident not found' });
    res.json({ message: `Incident ${req.params.id} purged from SOC records.` });
  });
});

module.exports = router;
