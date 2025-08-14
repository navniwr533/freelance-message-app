import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const palette = {
  sand: '#CBB59C',
  cream: '#FFF9F0',
  mint: '#E9E1D8',
  sage: '#B9AFA5',
  black: '#141414',
  purple: '#8B6F4E',
  white: '#fff',
};

type Project = {
  slug: string;
  name: string;
  tag: string;
  tone: [string, string];
  img?: string;
  summary: string;
  result?: string;
};

// Slim, on‑brand, only work directly relevant to AI messaging + product layer
const projects: Project[] = [
  {
    slug: 'outreach-engine',
    name: 'Outreach Engine',
    tag: 'Core Product',
    tone: ['#8B6F4E', '#CBB59C'],
    // AI themed abstract circuit / network image
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&auto=format&fit=crop&w=1200',
    summary: 'Adaptive message generation with tone + context memory across a session.',
    result: 'Draft time –52%'
  },
  {
    slug: 'tone-persona',
    name: 'Tone & Persona Layer',
    tag: 'AI Layer',
    tone: ['#B9AFA5', '#FFF9F0'],
    // AI interface / neural net visualization
    img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&auto=format&fit=crop&w=1200',
    summary: 'Real‑time rewriting that keeps intent while shifting formality / energy.',
    result: 'Revision passes –40%'
  },
  {
    slug: 'payments-licensing',
    name: 'Payments + Licensing',
    tag: 'Commerce Infra',
    tone: ['#E9E1D8', '#B9AFA5'],
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&auto=format&fit=crop&w=1200',
    summary: 'Stripe + Razorpay hybrid with keyless trial window and seat licensing.',
    result: 'Setup friction –30%'
  },
  {
    slug: 'brand-system',
    name: 'Brand System Refresh',
    tag: 'Design System',
    tone: ['#FFF9F0', '#8B6F4E'],
    img: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&auto=format&fit=crop&w=1200',
    summary: 'Unified warm palette + motion rules for calmer perceived latency.',
    result: 'Perceived speed +18%'
  }
];

export default function Showcase() {
  return (
    <section id="work" style={{ padding: '5rem 1.2rem', background: '#F5F1EA' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ color: palette.purple, fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.5px', marginBottom: 18 }}>
          Selected Work
        </motion.h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, willChange: 'transform' }}>
          {projects.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.015 }}
              style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                border: `1.5px solid ${palette.sand}`,
                background: `linear-gradient(135deg, ${p.tone[0]} 0%, ${p.tone[1]} 100%)`,
                boxShadow: `0 6px 18px rgba(0,0,0,0.05)`,
                aspectRatio: '4 / 3',
                display: 'flex',
                alignItems: 'flex-end',
                willChange: 'transform',
                cursor: 'none'
              }}>
              <Link to={`/work/${p.slug}`} style={{ position: 'absolute', inset: 0, zIndex: 3, cursor: 'none' }} aria-label={`Open case: ${p.name}`}></Link>
              {p.img && (
                <img
                  src={p.img}
                  srcSet={`${p.img}&w=480 480w, ${p.img}&w=768 768w, ${p.img}&w=1024 1024w, ${p.img}&w=1400 1400w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.92) contrast(1.04)', transform: 'translateZ(0)' }}
                />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.58), rgba(10,10,10,0.1))', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', padding: '0.9rem 0.9rem 1.05rem 0.9rem', width: '100%', color: '#fff', zIndex: 2 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>{p.name}</div>
                <div style={{ marginTop: 2, opacity: 0.9, fontSize: '0.78rem', letterSpacing: '0.5px', fontWeight: 600 }}>{p.tag}</div>
                <div style={{ marginTop: 6, fontSize: '0.72rem', lineHeight: 1.25, opacity: 0.9 }}>{p.summary}</div>
                {p.result && <div style={{ marginTop: 6, fontSize: '0.7rem', fontWeight: 600, color: palette.sand }}>{p.result}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
