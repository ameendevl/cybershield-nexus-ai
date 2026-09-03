const express = require('express');
const router = express.Router();

const REQRES_BASE_URL = 'https://reqres.in/api/users';
const TIMEOUT_MS = 8000;

// Helper to fetch with timeout
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.REQRES_API_KEY ? { 'x-api-key': process.env.REQRES_API_KEY } : {}),
        ...options.headers,
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// In-memory demo cache for interactive demonstration if upstream is offline or updates are made
let mockUsersOverride = null;

// GET /api/reqres/users?page=1&per_page=6
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const per_page = Math.min(100, Math.max(1, parseInt(req.query.per_page) || 6));

    const upstreamUrl = `${REQRES_BASE_URL}?page=${page}&per_page=${per_page}`;
    const response = await fetchWithTimeout(upstreamUrl);

    if (!response.ok) {
      return res.status(502).json({ error: 'ReqRes Cloud API gateway returned status ' + response.status });
    }

    const data = await response.json();
    if (mockUsersOverride && mockUsersOverride.length > 0) {
      data.data = mockUsersOverride;
      data.total = mockUsersOverride.length;
      data.total_pages = Math.ceil(mockUsersOverride.length / per_page);
    }
    return res.json(data);
  } catch (err) {
    console.error('ReqRes proxy error:', err);
    // Fallback sandbox users if network is constrained
    return res.json({
      page: 1,
      per_page: 6,
      total: 12,
      total_pages: 2,
      data: [
        { id: 1, email: "george.bluth@reqres.in", first_name: "George", last_name: "Bluth", avatar: "https://reqres.in/img/faces/1-image.jpg" },
        { id: 2, email: "janet.weaver@reqres.in", first_name: "Janet", last_name: "Weaver", avatar: "https://reqres.in/img/faces/2-image.jpg" },
        { id: 3, email: "emma.wong@reqres.in", first_name: "Emma", last_name: "Wong", avatar: "https://reqres.in/img/faces/3-image.jpg" },
        { id: 4, email: "eve.holt@reqres.in", first_name: "Eve", last_name: "Holt", avatar: "https://reqres.in/img/faces/4-image.jpg" },
        { id: 5, email: "charles.morris@reqres.in", first_name: "Charles", last_name: "Morris", avatar: "https://reqres.in/img/faces/5-image.jpg" },
        { id: 6, email: "tracey.ramos@reqres.in", first_name: "Tracey", last_name: "Ramos", avatar: "https://reqres.in/img/faces/6-image.jpg" }
      ],
      support: { url: "https://reqres.in/#support-heading", text: "ReqRes Cloud Sandbox" }
    });
  }
});

// GET /api/reqres/users/:id
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const upstreamUrl = `${REQRES_BASE_URL}/${id}`;
    const response = await fetchWithTimeout(upstreamUrl);

    if (response.status === 404) {
      return res.status(404).json({ error: 'User with ID ' + id + ' not found on ReqRes Cloud.' });
    }

    if (!response.ok) {
      return res.status(502).json({ error: 'ReqRes Cloud API unavailable' });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.json({
      data: {
        id: parseInt(id) || 1,
        email: "analyst." + id + "@reqres.in",
        first_name: "Agent",
        last_name: "#" + id,
        avatar: "https://reqres.in/img/faces/" + ((parseInt(id) % 12) + 1) + "-image.jpg"
      },
      support: { url: "https://reqres.in/#support-heading", text: "ReqRes Cloud Sandbox Detail" }
    });
  }
});

// POST /api/reqres/users
router.post('/users', async (req, res) => {
  const { name, job } = req.body || {};
  if (!name || !job) {
    return res.status(400).json({ error: 'Both name and job fields are required for demo user creation.' });
  }

  try {
    const response = await fetchWithTimeout(REQRES_BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ name, job }),
    });

    const data = await response.json();
    return res.status(201).json(data);
  } catch (err) {
    return res.status(201).json({
      name,
      job,
      id: Math.floor(Math.random() * 900 + 100).toString(),
      createdAt: new Date().toISOString()
    });
  }
});

// PUT /api/reqres/users/:id
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, job } = req.body || {};
  if (!name || !job) {
    return res.status(400).json({ error: 'Both name and job fields are required for updating demo user.' });
  }

  try {
    const response = await fetchWithTimeout(`${REQRES_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, job }),
    });

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.json({
      name,
      job,
      updatedAt: new Date().toISOString()
    });
  }
});

// DELETE /api/reqres/users/:id
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await fetchWithTimeout(`${REQRES_BASE_URL}/${id}`, { method: 'DELETE' });
    return res.status(204).send();
  } catch (err) {
    return res.status(204).send();
  }
});

module.exports = router;
