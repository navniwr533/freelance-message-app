import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const palette = {
  sand: '#CBB59C',
  cream: '#FFF9F0',
  mint: '#E9E1D8',
  sage: '#B9AFA5',
  black: '#141414',
  purple: '#8B6F4E',
  white: '#fff',
};

export default function Nav() {
  const links = [
    { k: 'work', t: 'Work' },
    { k: 'app-root', t: 'App' },
    { k: 'capabilities', t: 'Capabilities' },
    { k: 'contact', t: 'Contact' },
  ] as const;
  const [active, setActive] = useState<string>(links[0].k);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 760 : false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
    setMenuOpen(false);
    try { (window as any).plausible?.('Nav Click', { props: { id } }); } catch {}
  };
  useEffect(() => {
    const ids = links.map((l) => l.k);
    
    // Improved scroll-based detection for accurate tracking
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const viewportMiddle = scrollY + windowHeight * 0.4; // Use upper 40% of viewport
        
        let currentSection = '';
        let maxVisibility = 0;
        
        ids.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = scrollY + rect.top;
            const elementBottom = elementTop + rect.height;
            
            // Calculate how much of the element is visible in the viewport
            const visibleTop = Math.max(elementTop, scrollY);
            const visibleBottom = Math.min(elementBottom, scrollY + windowHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibility = visibleHeight / rect.height;
            
            // Prioritize sections that are well within viewport
            if (viewportMiddle >= elementTop && viewportMiddle <= elementBottom) {
              if (visibility > maxVisibility) {
                maxVisibility = visibility;
                currentSection = id;
              }
            }
          }
        });
        
        // Fallback to closest section if none is perfectly in view
        if (!currentSection) {
          let minDistance = Infinity;
          ids.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
              const rect = element.getBoundingClientRect();
              const elementCenter = scrollY + rect.top + rect.height / 2;
              const distance = Math.abs(elementCenter - viewportMiddle);
              
              if (distance < minDistance) {
                minDistance = distance;
                currentSection = id;
              }
            }
          });
        }
        
        if (currentSection && currentSection !== active) {
          setActive(currentSection);
        }
        
        rafId = null;
      });
    };
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [active]);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 760);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useEffect(() => {
    // Position the animated pill behind the active button
    const btn = btnRefs.current[active];
    const wrap = wrapRef.current;
    if (btn && wrap) {
      const b = btn.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      setPill({ left: b.left - w.left, top: b.top - w.top, width: b.width, height: b.height });
    }
  }, [active]);
  useEffect(() => {
    const onResize = () => {
      const btn = btnRefs.current[active];
      const wrap = wrapRef.current;
      if (btn && wrap) {
        const b = btn.getBoundingClientRect();
        const w = wrap.getBoundingClientRect();
        setPill({ left: b.left - w.left, top: b.top - w.top, width: b.width, height: b.height });
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active]);
  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const h = document.documentElement;
          const total = h.scrollHeight - h.clientHeight;
          const p = total > 0 ? h.scrollTop / total : 0;
          setProgress(Math.max(0, Math.min(1, p)));
          setScrolled(h.scrollTop > 50); // More responsive scroll detection
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Use passive listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial call
    
    return () => { 
      window.removeEventListener('scroll', onScroll); 
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <nav style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      backdropFilter: scrolled ? 'none' : 'blur(6px)',
      background: scrolled ? '#FFFFFFF8' : '#FFFFFF88',
      borderBottom: `1px solid ${palette.sand}55`,
      cursor: 'auto',
      transition: 'backdrop-filter 80ms ease-out, background 80ms ease-out',
      willChange: 'backdrop-filter, background'
    }}>
      <div style={{ 
        position: 'absolute', 
        left: 0, 
        top: 0, 
        height: 2, 
        background: palette.purple, 
        width: `${progress * 100}%`, 
        transition: 'width 60ms ease-out',
        willChange: 'width'
      }} />
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem', position: 'relative', cursor: 'auto' }}>
  <div style={{ color: palette.purple, fontWeight: 900, letterSpacing: '-0.6px', cursor: 'auto' }}>IFOXY studios</div>
        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-label="Toggle menu" style={{ background: 'transparent', border: `1px solid ${palette.sand}80`, color: palette.purple, padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>
              ☰
            </button>
            {menuOpen && (
        <div style={{ position: 'absolute', right: 12, top: 48, background: '#FFFFFF', border: `1px solid ${palette.sand}66`, borderRadius: 12, boxShadow: `0 10px 30px rgba(0,0,0,0.08)`, padding: 8, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 160, cursor: 'auto' }}>
                {links.map((l) => (
          <a key={l.k} href={`#${l.k}`} onClick={(e) => { e.preventDefault(); go(l.k); }} style={{ color: active === l.k ? palette.purple : palette.black, textDecoration: 'none', padding: '8px 10px', borderRadius: 8, fontWeight: active === l.k ? 800 : 600, cursor: 'pointer' }}>
                    {l.t}
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div ref={wrapRef} style={{ position: 'relative', display: 'flex', gap: 16, alignItems: 'center', padding: 4, borderRadius: 9999, cursor: 'auto' }}>
            <motion.div
              aria-hidden
              initial={false}
              animate={{ left: pill.left - 6, top: pill.top - 4, width: pill.width + 12, height: pill.height + 8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.2 }}
              style={{ 
                position: 'absolute', 
                background: `${palette.purple}14`, 
                border: `1px solid ${palette.purple}55`, 
                borderRadius: 9999, 
                zIndex: 0, 
                pointerEvents: 'none', 
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            />
            {links.map((l) => (
              <motion.a
                key={l.k}
                ref={(el) => { btnRefs.current[l.k] = el as unknown as HTMLButtonElement; }}
                href={`#${l.k}`}
                onClick={(e) => { e.preventDefault(); go(l.k); }}
                whileHover={{ scale: 1.015, transition: { duration: 0.08, ease: [0.25, 0.1, 0.25, 1] } }}
                whileTap={{ scale: 0.985, transition: { duration: 0.05, ease: [0.25, 0.1, 0.25, 1] } }}
                style={{
                  background: 'transparent',
                  color: active === l.k ? palette.purple : palette.black,
                  border: 'none', textDecoration: 'none',
                  fontWeight: active === l.k ? 800 : 600,
                  letterSpacing: active === l.k ? '-0.2px' : '-0.1px',
                  cursor: 'pointer',
                  padding: '8px 10px',
                  position: 'relative',
                  zIndex: 1,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
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
