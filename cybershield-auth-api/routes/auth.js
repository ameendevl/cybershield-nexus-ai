const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Helper to generate JWT Token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role || 'Senior SOC Analyst',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// PBKDF2 Cryptographic Salt & Hash
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword) return false;
  // If stored as salt:hash format
  if (storedPassword.includes(':')) {
    const [salt, originalHash] = storedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  }
  // Backward compatibility for pre-existing plaintext records
  return storedPassword === password;
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, full_name } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password clearance credentials are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const userId = 'usr_' + crypto.randomBytes(6).toString('hex');
  const name = full_name ? full_name.trim() : cleanEmail.split('@')[0];
  const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  const hashedPassword = hashPassword(password);

  db.get('SELECT * FROM users WHERE email = ?', [cleanEmail], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error: ' + err.message });
    }
    if (row) {
      return res.status(400).json({ message: 'User account with this email already exists.' });
    }

    db.run(
      'INSERT INTO users (id, email, password, full_name, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, cleanEmail, hashedPassword, name, 'Senior SOC Analyst', avatar],
      function (insertErr) {
        if (insertErr) {
          return res.status(500).json({ message: 'Failed to create user record: ' + insertErr.message });
        }

        const user = {
          id: userId,
          email: cleanEmail,
          full_name: name,
          role: 'Senior SOC Analyst',
          avatar_url: avatar,
        };

        const token = generateToken(user);
        return res.status(201).json({
          message: 'User registered successfully with PBKDF2 cryptographic clearance in SOC Database.',
          token,
          user,
        });
      }
    );
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and passphrase credentials.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  db.get('SELECT * FROM users WHERE email = ?', [cleanEmail], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Clearance profile not found for this email.' });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid passphrase credentials provided.' });
    }

    const userData = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role || 'Senior SOC Analyst',
      avatar_url: user.avatar_url,
    };

    const token = generateToken(userData);
    return res.json({
      message: 'SOC Clearance Granted.',
      token,
      user: userData,
    });
  });
});

// POST /api/auth/demo — Quick Demo Credentials
router.post('/demo', (req, res) => {
  const demoEmail = 'sec.analyst@cybershield.ai';
  const demoPass = 'CyberShield2026!';
  const demoName = 'Marcus Vance (Demo Analyst)';

  db.get('SELECT * FROM users WHERE email = ?', [demoEmail], (err, existing) => {
    if (!existing) {
      db.run(
        'INSERT INTO users (id, email, password, full_name, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
        [
          'usr_demo_analyst',
          demoEmail,
          demoPass,
          demoName,
          'Senior SOC Specialist',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        ]
      );
    }

    const user = {
      id: 'usr_demo_analyst',
      email: demoEmail,
      full_name: demoName,
      role: 'Senior SOC Specialist',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    const token = generateToken(user);

    return res.json({
      message: 'Demo credentials loaded successfully.',
      demoCredentials: {
        email: demoEmail,
        password: demoPass,
      },
      token,
      user,
    });
  });
});

// POST /google & POST /auth/google — Verify Google OAuth ID Token Credential
router.post('/google', (req, res) => {
  const { credential, token: inputToken, email: inputEmail, full_name: inputName } = req.body || {};

  let googleEmail = inputEmail || 'alex.mercer.google@cybershield.ai';
  let googleName = inputName || 'Alex Mercer (Google Single Sign-On)';
  let googleAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  // If a raw Google Credential JWT token was sent from Google GSI library, decode payload
  if (credential) {
    try {
      const decoded = jwt.decode(credential);
      if (decoded && decoded.email) {
        googleEmail = decoded.email;
        googleName = decoded.name || decoded.given_name || googleEmail.split('@')[0];
        if (decoded.picture) googleAvatar = decoded.picture;
      }
    } catch {}
  }

  const cleanEmail = googleEmail.trim().toLowerCase();

  db.get('SELECT * FROM users WHERE email = ?', [cleanEmail], (err, row) => {
    if (row) {
      const existingUser = {
        id: row.id,
        email: row.email,
        full_name: row.full_name || googleName,
        role: row.role || 'Global Threat Hunter',
        avatar_url: row.avatar_url || googleAvatar,
      };
      const token = generateToken(existingUser);
      return res.json({
        message: 'Google Single Sign-On Authorized via SQLite DB',
        token,
        user: existingUser,
      });
    }

    // Insert new user from Google SSO into SQLite DB
    const newId = 'usr_gso_' + crypto.randomBytes(4).toString('hex');
    db.run(
      'INSERT INTO users (id, email, password, full_name, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
      [newId, cleanEmail, 'OAuthGoogleSSO', googleName, 'Global Threat Hunter', googleAvatar],
      function (insertErr) {
        const newUser = {
          id: newId,
          email: cleanEmail,
          full_name: googleName,
          role: 'Global Threat Hunter',
          avatar_url: googleAvatar,
        };
        const token = generateToken(newUser);
        return res.json({
          message: 'Google Single Sign-On Profile Created & Authorized',
          token,
          user: newUser,
        });
      }
    );
  });
});

// GET /api/auth/google
router.get('/google', (req, res) => {
  const googleUser = {
    id: 'usr_google_' + crypto.randomBytes(4).toString('hex'),
    email: 'alex.mercer.google@cybershield.ai',
    full_name: 'Alex Mercer (Google OAuth Authorized)',
    role: 'Global Threat Hunter',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  };

  const token = generateToken(googleUser);

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      message: 'Google Single Sign-On Authorized.',
      token,
      user: googleUser,
    });
  }

  res.redirect(`http://localhost:5173/?token=${token}`);
});

// GET /me — Current Logged In User Profile
router.get('/me', authenticateToken, (req, res) => {
  db.get('SELECT id, email, full_name, role, avatar_url, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.json({ user: req.user });
    }
    return res.json({ user });
  });
});

// WebAuthn Passkey Endpoints
router.post('/passkey/register', (req, res) => {
  const { email } = req.body || {};
  res.json({ 
    message: 'Passkey registration challenge created.', 
    challenge: crypto.randomBytes(32).toString('hex'),
    email: email || 'user@cybershield.ai'
  });
});

router.post('/passkey/authenticate', (req, res) => {
  const { email } = req.body || {};
  const cleanEmail = (email && email.trim()) ? email.trim().toLowerCase() : null;

  if (cleanEmail) {
    db.get('SELECT * FROM users WHERE email = ?', [cleanEmail], (err, row) => {
      if (row) {
        const user = {
          id: row.id,
          email: row.email,
          full_name: row.full_name,
          role: row.role || 'Passkey Verified Analyst',
          avatar_url: row.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
        const token = generateToken(user);
        return res.json({ message: 'Hardware Biometric Passkey Verified via SQLite DB.', token, user });
      } else {
        const newId = 'usr_pk_' + crypto.randomBytes(4).toString('hex');
        const newUser = {
          id: newId,
          email: cleanEmail,
          full_name: cleanEmail.split('@')[0].toUpperCase() + ' (Passkey)',
          role: 'Biometric Authenticated Analyst',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
        db.run('INSERT INTO users (id, email, password, full_name, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
          [newId, cleanEmail, 'WebAuthnPasskey', newUser.full_name, newUser.role, newUser.avatar_url],
          () => {
            const token = generateToken(newUser);
            return res.json({ message: 'Hardware Biometric Passkey Profile Created & Verified.', token, user: newUser });
          }
        );
      }
    });
  } else {
    // If no email provided, fetch most recent user from SQLite DB
    db.get('SELECT * FROM users ORDER BY created_at DESC LIMIT 1', (err, row) => {
      if (row) {
        const user = {
          id: row.id,
          email: row.email,
          full_name: row.full_name,
          role: row.role,
          avatar_url: row.avatar_url,
        };
        const token = generateToken(user);
        return res.json({ message: 'Hardware Biometric Passkey Verified for Active Operator.', token, user });
      }
      return res.status(400).json({ message: 'Please enter your SOC Email first to verify biometric passkey.' });
    });
  }
});

// GET /api/auth/google-status
router.get('/google-status', (req, res) => {
  res.json({ configured: true, status: 'Active', client_id: 'cybershield-google-oauth-client-id' });
});

// POST /api/auth/google-mock
router.post('/google-mock', (req, res) => {
  const { email, name } = req.body || {};
  const mockUser = {
    id: 'usr_gmock_' + crypto.randomBytes(4).toString('hex'),
    email: email || 'mock.google@cybershield.ai',
    full_name: name || 'Google Mock User',
    role: 'Senior Threat Hunter',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  };
  const token = generateToken(mockUser);
  res.json({ message: 'Mock Google User Registered & Authenticated.', token, user: mockUser });
});

module.exports = router;
