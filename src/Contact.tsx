const palette = {
  sand: '#CBB59C',
  cream: '#FFF9F0',
  mint: '#E9E1D8',
  sage: '#B9AFA5',
  black: '#141414',
  purple: '#8B6F4E',
  white: '#fff',
};

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string } | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  // Initialize EmailJS on component mount
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'MeqkzNk-EbN_AawXF';
    emailjs.init(publicKey);
  }, []);
  return (
    <section id="contact" style={{ position: 'relative', overflow: 'hidden', padding: '5rem 1.2rem', background: '#F5F1EA', borderTop: `1px solid ${palette.sand}55` }}>
      {/* local subtle tint + vignette, very faint */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'linear-gradient(120deg, rgba(251,231,239,0.08) 0%, rgba(232,226,255,0.08) 50%, rgba(255,255,255,0.08) 100%)' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: [
          'radial-gradient(40% 40% at 0% 0%, rgba(0,0,0,0.04), transparent 60%)',
          'radial-gradient(40% 40% at 100% 0%, rgba(0,0,0,0.035), transparent 60%)',
          'radial-gradient(40% 40% at 0% 100%, rgba(0,0,0,0.035), transparent 60%)',
          'radial-gradient(40% 40% at 100% 100%, rgba(0,0,0,0.04), transparent 60%)',
        ].join(', ') }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ color: palette.purple, fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.5px', textAlign: 'center' }}>Let’s work together</div>
        <div style={{ color: palette.black, marginTop: 8, opacity: 0.85, textAlign: 'center' }}>Small, focused projects ship fastest. Say hello —</div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setNotice(null);
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            const body: any = Object.fromEntries(fd.entries());
            const errs: typeof errors = {};
            if (!body.name) errs!.name = 'Please enter your name';
            if (!body.email) errs!.email = 'Please enter a valid email';
            if (!body.message) errs!.message = 'Please add a short message';
            setErrors(Object.keys(errs).length ? errs : null);
            if (Object.keys(errs).length) return;
            try {
              setSending(true);
              
              // Store form reference before async call
              const form = e.currentTarget as HTMLFormElement;
              
              // EmailJS configuration - using environment variables
              const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_b9g7ce2';
              const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_6iowtw1';
              
              // Prepare email template parameters
              const templateParams = {
                from_name: body.name,
                from_email: body.email,
                to_email: 'ns9365967@gmail.com',
                message: body.message,
                company: body.company || 'Not provided',
                website: body.website || 'Not provided',
              };
              
              // Send email using EmailJS
              console.log('Sending email with params:', templateParams);
              console.log('Service ID:', serviceId);
              console.log('Template ID:', templateId);
              
              const result = await emailjs.send(serviceId, templateId, templateParams);
              console.log('EmailJS success:', result);
              
              form.reset();
              try { (window as any).plausible?.('Contact Submitted'); } catch {}
              setNotice({ ok: true, text: 'Thanks! I will get back to you shortly.' });
            } catch (error) {
              console.error('EmailJS error details:', error);
              console.error('Error status:', (error as any)?.status);
              console.error('Error text:', (error as any)?.text);
              try { (window as any).plausible?.('Contact Submit Failed'); } catch {}
              
              let errorMessage = 'Failed to send. Please email me at ns9365967@gmail.com';
              if ((error as any)?.text) {
                errorMessage = `Failed to send: ${(error as any).text}`;
              }
              setNotice({ ok: false, text: errorMessage });
            } finally {
              setSending(false);
            }
          }}
          style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          aria-describedby="contact-status"
        >
          <label style={{ display: 'contents' }}>
            <span className="visually-hidden">Name</span>
            <input name="name" placeholder="Your name" required aria-invalid={!!errors?.name} aria-describedby={errors?.name ? 'err-name' : undefined}
              style={{ gridColumn: 'span 1', padding: '0.8rem 1rem', borderRadius: 10, border: `1.5px solid ${palette.sand}`, background: palette.cream, color: palette.black, cursor: 'none', outline: 'none' }} />
          </label>
          <label style={{ display: 'contents' }}>
            <span className="visually-hidden">Email</span>
            <input name="email" type="email" placeholder="Email" required aria-invalid={!!errors?.email} aria-describedby={errors?.email ? 'err-email' : undefined}
              style={{ gridColumn: 'span 1', padding: '0.8rem 1rem', borderRadius: 10, border: `1.5px solid ${palette.sand}`, background: palette.cream, color: palette.black, cursor: 'none', outline: 'none' }} />
          </label>
          {errors?.name && <div id="err-name" style={{ gridColumn: 'span 1', color: '#f87171', fontSize: 12 }}>{errors.name}</div>}
          {errors?.email && <div id="err-email" style={{ gridColumn: 'span 1', color: '#f87171', fontSize: 12 }}>{errors.email}</div>}
          <input name="company" placeholder="Company (optional)" style={{ gridColumn: 'span 1', padding: '0.8rem 1rem', borderRadius: 10, border: `1.5px solid ${palette.sand}`, background: palette.cream, color: palette.black, cursor: 'none', outline: 'none' }} />
          <input name="website" placeholder="Website (optional)" style={{ gridColumn: 'span 1', padding: '0.8rem 1rem', borderRadius: 10, border: `1.5px solid ${palette.sand}`, background: palette.cream, color: palette.black, cursor: 'none', outline: 'none' }} />
          <label style={{ display: 'contents' }}>
            <span className="visually-hidden">Message</span>
            <textarea name="message" placeholder="Tell me about your project" required rows={5} aria-invalid={!!errors?.message} aria-describedby={errors?.message ? 'err-message' : undefined}
              style={{ 
                gridColumn: 'span 2', 
                padding: '0.8rem 1rem', 
                borderRadius: 10, 
                border: `1.5px solid ${palette.sand}`, 
                background: palette.cream, 
                color: palette.black, 
                cursor: 'pointer', 
                outline: 'none',
                resize: 'none',
                minHeight: '120px',
                maxHeight: '120px',
                height: '120px'
              }} />
          </label>
          {errors?.message && <div id="err-message" style={{ gridColumn: 'span 2', color: '#f87171', fontSize: 12 }}>{errors.message}</div>}
          {/* Honeypot */}
          <input name="honey" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
          <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
            <button type="submit" className="btn btn-brand" disabled={sending} style={{ padding: '0.8rem 1.3rem', opacity: sending ? 0.7 : 1, cursor: 'none' }}>{sending ? 'Sending…' : 'Send message'}</button>
          </div>
          <div id="contact-status" aria-live="polite" style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: 4, fontSize: 14, color: notice ? (notice.ok ? palette.mint : '#f87171') : 'inherit' }}>
            {notice?.text}
          </div>
        </form>
      </div>
    </section>
  );
}
