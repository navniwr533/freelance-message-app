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

export default function Nav() {
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)', background: '#0f0f12AA', borderBottom: `1px solid ${palette.sand}33` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem' }}>
        <div style={{ color: palette.cream, fontWeight: 800, letterSpacing: '-0.3px' }}>FMG</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { k: 'work', t: 'Work' },
            { k: 'app-root', t: 'App' },
            { k: 'capabilities', t: 'Capabilities' },
            { k: 'contact', t: 'Contact' },
          ].map((l) => (
            <motion.button key={l.k} onClick={() => go(l.k)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: 'transparent', color: palette.mint, border: 'none', fontWeight: 600, cursor: 'pointer' }}>{l.t}</motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}
