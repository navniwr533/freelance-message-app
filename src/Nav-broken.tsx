import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const palette = {
  cream: '#FAF7F0',
  purple: '#9A8ABA',
  mint: '#A8E6A3',
  sand: '#C4A484',
};

export default function Nav() {
  const links = [
    { k: 'work', t: 'Work' },
    { k: 'app-root', t: 'Generate' },
    { k: 'capabilities', t: 'About' },
    { k: 'contact', t: 'Contact' },
  ] as const;
  
  const [active, setActive] = useState<string>(links[0].k);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement>>({});
  
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
    setMenuOpen(false);
    try { (window as any).plausible?.('Nav Click', { props: { id } }); } catch {}
  };

  useEffect(() => {
    const ids = links.map((l) => l.k);
    const opts: IntersectionObserverInit = { root: null, rootMargin: '0px 0px -55% 0px', threshold: 0.2 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, opts);
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 760);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const btn = btnRefs.current[active];
    const wrap = wrapRef.current;
    if (btn && wrap) {
      const b = btn.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      setPill({ left: b.left - w.left, top: b.top - w.top, width: b.width, height: b.height });
    }
  }, [active]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? h.scrollTop / total : 0;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)', background: '#0f0f12AA', borderBottom: `1px solid ${palette.sand}33` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: 2, background: palette.purple, width: `${progress * 100}%`, transition: 'width 120ms linear' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem', position: 'relative' }}>
        <div style={{ color: palette.cream, fontWeight: 900, letterSpacing: '-0.6px' }}>FMG</div>
        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-label="Toggle menu" style={{ background: 'transparent', border: `1px solid ${palette.sand}55`, color: palette.cream, padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>
              ☰
            </button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 12, top: 48, background: '#0f0f12', border: `1px solid ${palette.sand}44`, borderRadius: 12, boxShadow: `0 10px 30px ${palette.sand}22`, padding: 8, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 160 }}>
                {links.map((l) => (
                  <a key={l.k} href={`#${l.k}`} onClick={(e) => { e.preventDefault(); go(l.k); }} style={{ color: active === l.k ? palette.cream : palette.mint, textDecoration: 'none', padding: '8px 10px', borderRadius: 8, fontWeight: active === l.k ? 800 : 600 }}>
                    {l.t}
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div ref={wrapRef} style={{ position: 'relative', display: 'flex', gap: 16, alignItems: 'center', padding: 4, borderRadius: 9999 }}>
            <motion.div
              aria-hidden
              initial={false}
              animate={{ left: pill.left - 6, top: pill.top - 4, width: pill.width + 12, height: pill.height + 8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.5 }}
              style={{ position: 'absolute', background: `${palette.purple}22`, border: `1px solid ${palette.purple}77`, borderRadius: 9999, zIndex: 0, pointerEvents: 'none' }}
            />
            {links.map((l) => (
              <motion.a
                key={l.k}
                ref={(el) => { btnRefs.current[l.k] = el as unknown as HTMLButtonElement; }}
                href={`#${l.k}`}
                onClick={(e) => { e.preventDefault(); go(l.k); }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent',
                  color: active === l.k ? palette.cream : palette.mint,
                  border: 'none', textDecoration: 'none',
                  fontWeight: active === l.k ? 800 : 600,
                  letterSpacing: active === l.k ? '-0.2px' : '-0.1px',
                  cursor: 'pointer',
                  padding: '8px 10px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {l.t}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
