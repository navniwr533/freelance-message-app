const palette = {
  sand: '#D6A99D',
  cream: '#FBF3D5',
  mint: '#D6DAC8',
  sage: '#9CAFAA',
  black: '#18181b',
  purple: '#7c3aed',
  white: '#fff',
};

export default function Footer() {
  return (
    <footer style={{ background: '#0f0f12', color: palette.sage, padding: '2.5rem 1.2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontWeight: 700, color: palette.cream }}>Freelance Message Generator</div>
        <div style={{ opacity: 0.9, marginTop: 6 }}>Built with care. No tracking, no nonsense.</div>
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>© {new Date().getFullYear()} Navni — All rights reserved.</div>
      </div>
    </footer>
  );
}
