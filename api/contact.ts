import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Basic rate limit: 5 requests / minute per IP (best-effort in-memory)
    const key = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anon');
    const now = Date.now();
    // @ts-ignore - attach cache to globalThis between invocations (single instance best effort)
    globalThis.__rlc = globalThis.__rlc || new Map<string, number[]>();
    // @ts-ignore
    const list: number[] = globalThis.__rlc.get(key) || [];
    const recent = list.filter((t) => now - t < 60_000);
    if (recent.length >= 5) return res.status(429).json({ error: 'Too many requests' });
    recent.push(now);
    // @ts-ignore
    globalThis.__rlc.set(key, recent);
    const { name = '', email = '', message = '', company = '', website = '', honey = '' } = req.body || {};
    // Honeypot trap
    if (honey) return res.status(204).end();
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });

    const payload = {
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 160),
      message: String(message).slice(0, 4000),
      company: String(company || '').slice(0, 160),
      website: String(website || '').slice(0, 300),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      ua: req.headers['user-agent'] || '',
      ts: new Date().toISOString(),
    };

    // Optional webhook for notifications
    const hook = process.env.CONTACT_WEBHOOK_URL;
    if (hook) {
      try {
        await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } catch (e) {
        console.warn('Contact webhook failed', e);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Contact API error', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
