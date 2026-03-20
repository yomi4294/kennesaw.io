import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({ origin: isProd ? false : 'http://localhost:5173' }));
app.use(express.json());

// ── Weather proxy ──────────────────────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  const { city, type = 'weather' } = req.query;
  if (!city) return res.status(400).json({ error: 'city is required' });

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OpenWeatherMap API key not configured' });

  const url = `https://api.openweathermap.org/data/2.5/${type}?q=${encodeURIComponent(city)},us&appid=${apiKey}&units=metric`;
  try {
    const { default: fetch } = await import('node-fetch');
    const upstream = await fetch(url);
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to reach weather service' });
  }
});

// ── Google Books proxy ─────────────────────────────────────────────────────────
app.get('/api/books', async (req, res) => {
  const { q, maxResults = 10, startIndex = 0 } = req.query;
  if (!q) return res.status(400).json({ error: 'q is required' });

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${maxResults}&startIndex=${startIndex}`;
  try {
    const { default: fetch } = await import('node-fetch');
    const upstream = await fetch(url);
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to reach Google Books service' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
  try {
    const { default: fetch } = await import('node-fetch');
    const upstream = await fetch(url);
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to reach Google Books service' });
  }
});

// ── Serve React build in production ──────────────────────────────────────────
if (isProd) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
