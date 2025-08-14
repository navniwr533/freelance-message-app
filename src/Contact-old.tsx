const palette = {
  sand: '#D6A99D',
  cream: '#FBF3D5',
  mint: '#D6DAC8',
  sage: '#9CAFAA',
  black: '#18181b',
  purple: '#7c3aed',
  white: '#fff',
};

export default function Contact() {
  return (
    <section id="contact" style={{ padding: '5rem 1.2rem', background: '#0f0f12', borderTop: `1px solid ${palette.sand}33` }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ color: palette.cream, fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.5px', textAlign: 'center' }}>Let’s work together</div>
        <div style={{ color: palette.mint, marginTop: 8, opacity: 0.9, textAlign: 'center' }}>Small, focused projects ship fastest. Say hello —</div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          const body = Object.fromEntries(fd.entries());
          if (!body.name || !body.email || !body.message) { alert('Please fill name, email, and message.'); return; }
          try {
            const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (!res.ok) throw new Error('Failed');
            (e.currentTarget as HTMLFormElement).reset();
            // Analytics (optional)
            window.plausible?.('Contact Submitted');
            alert('Thanks! I will get back to you shortly.');
          } catch { alert('Failed to send. Please email me at navni@example.com'); }
        }}
          style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input name="name" placeholder="Your name" required style={{ gridColumn: 'span 1', padding: '0.8rem 1rem', borderRadius: 10, border: `1px solid ${palette.sage}`, background: '#0f0f12', color: palette.cream }} />
          <input name="email" type="email" placeholder="Email" required style={{ gridColumn: 'span 1', padding: '0.8rem 1rem', borderRadius: 10, border: `1px solid ${palette.sage}`, background: '#0f0f12', color: palette.cream }} />
          <input name="company" placeholder="Company (optional)" style={{ gridColumn: 'span 1', padding: '0.8rem 1rem', borderRadius: 10, border: `1px solid ${palette.sage}`, background: '#0f0f12', color: palette.cream }} />
          <input name="website" placeholder="Website (optional)" style={{ gridColumn: 'span 1', padding: '0.8rem 1rem', borderRadius: 10, border: `1px solid ${palette.sage}`, background: '#0f0f12', color: palette.cream }} />
          <textarea name="message" placeholder="Tell me about your project" required rows={5} style={{ gridColumn: 'span 2', padding: '0.8rem 1rem', borderRadius: 10, border: `1px solid ${palette.sage}`, background: '#0f0f12', color: palette.cream }} />
          {/* Honeypot */}
          <input name="honey" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
          <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
            <button type="submit" className="btn btn-brand" style={{ padding: '0.8rem 1.3rem' }}>Send message</button>
          </div>
        </form>
      </div>
    </section>
  );
}
