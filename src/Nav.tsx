import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
  const [active, setActive] = useState<string>('');
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };
  useEffect(() => {
    const ids = ['work', 'app-root', 'capabilities', 'contact'];
    const opts: IntersectionObserverInit = { root: null, rootMargin: '0px 0px -55% 0px', threshold: 0.2 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, opts);
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)', background: '#0f0f12AA', borderBottom: `1px solid ${palette.sand}33` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem' }}>
        <div style={{ color: palette.cream, fontWeight: 900, letterSpacing: '-0.5px' }}>FMG</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { k: 'work', t: 'Work' },
            { k: 'app-root', t: 'App' },
            { k: 'capabilities', t: 'Capabilities' },
            { k: 'contact', t: 'Contact' },
          ].map((l) => (
            <motion.button key={l.k} onClick={() => go(l.k)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: 'transparent', color: active === l.k ? palette.cream : palette.mint, border: 'none', fontWeight: active === l.k ? 800 : 600, letterSpacing: active === l.k ? '-0.2px' : '-0.1px', cursor: 'pointer', borderBottom: active === l.k ? `2px solid ${palette.purple}` : '2px solid transparent', paddingBottom: 4 }}>{l.t}</motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}
