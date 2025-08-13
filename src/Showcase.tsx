import { motion } from 'framer-motion';

const palette = {
  sand: '#D6A99D',
  cream: '#FBF3D5',
  mint: '#D6DAC8',
  sage: '#9CAFAA',
  black: '#18181b',
  purple: '#7c3aed',
  white: '#fff',
};

const projects = [
  { name: 'Dawn Commerce', tag: 'E‑commerce', tone: ['#7c3aed', '#D6A99D'] },
  { name: 'Peak Fitness', tag: 'Mobile App', tone: ['#18181b', '#9CAFAA'] },
  { name: 'Casa Interior', tag: 'Brand + Site', tone: ['#FBF3D5', '#7c3aed'] },
  { name: 'Vista AI', tag: 'SaaS', tone: ['#D6DAC8', '#18181b'] },
];

export default function Showcase() {
  return (
    <section id="work" style={{ padding: '5rem 1.2rem', background: '#0f0f12' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ color: palette.cream, fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.5px', marginBottom: 18 }}>
          Selected Work
        </motion.h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {projects.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.06 }}
              style={{ borderRadius: 16, overflow: 'hidden', border: `2px solid ${palette.sand}`, background: `linear-gradient(135deg, ${p.tone[0]} 0%, ${p.tone[1]} 100%)`, boxShadow: `0 10px 30px ${palette.sand}22` }}>
              <div style={{ padding: '1rem 1rem 3rem 1rem', color: p.tone[0] === '#18181b' ? palette.cream : palette.black }}>
                <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{p.name}</div>
                <div style={{ marginTop: 4, opacity: 0.9 }}>{p.tag}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
