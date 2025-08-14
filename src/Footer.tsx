const palette = {
  sand: '#CBB59C',
  cream: '#FFF9F0',
  mint: '#E9E1D8',
  sage: '#B9AFA5',
  black: '#141414',
  purple: '#8B6F4E',
  white: '#fff',
};

export default function Footer() {
  return (
    <footer style={{ background: '#F5F1EA', color: palette.black, padding: '2.5rem 1.2rem', textAlign: 'center', borderTop: `1px solid ${palette.sand}55` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontWeight: 800, color: palette.purple, letterSpacing: '-0.3px' }}>Freelance Message Generator</div>
        <div style={{ opacity: 0.85, marginTop: 6 }}>Built with care. No tracking, no nonsense.</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
          <a href="https://github.com/navniwr533" target="_blank" rel="noreferrer" style={{ color: palette.purple, textDecoration: 'none' }}>GitHub</a>
          <a href="https://x.com" target="_blank" rel="noreferrer" style={{ color: palette.purple, textDecoration: 'none' }}>Twitter</a>
          <a href="/privacy" style={{ color: palette.purple, textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ color: palette.purple, textDecoration: 'none' }}>Terms</a>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>© {new Date().getFullYear()} Navni — All rights reserved.</div>
      </div>
    </footer>
  );
}
