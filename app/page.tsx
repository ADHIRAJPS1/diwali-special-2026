"use client";

import { useEffect, useState } from "react";

function Mascot() {
  return <svg className="mascot" viewBox="0 0 260 240" role="img" aria-label="A cheerful little diya mascot">
    <ellipse cx="130" cy="211" rx="88" ry="15" fill="#351b2b" opacity=".12" />
    <path d="M129 76c-4-20 13-32 17-48 20 16 21 37 6 54" fill="#ff9d32" />
    <path d="M135 70c-1-12 6-20 10-29 8 11 7 22 0 32" fill="#fff1a6" />
    <path d="M52 123c8 42 38 70 78 70s70-28 78-70c-27 16-55 22-78 22s-51-6-78-22Z" fill="#ef6f38" />
    <path d="M52 123c24 17 52 25 78 25s54-8 78-25c-3 13-8 24-14 34-20 10-42 15-64 15s-44-5-64-15c-6-10-11-21-14-34Z" fill="#c94e35" />
    <path d="M81 107c13-13 30-19 49-19s36 6 49 19c-13 12-30 19-49 19s-36-7-49-19Z" fill="#552941" />
    <circle cx="111" cy="109" r="4" fill="#fff4d2"/><circle cx="149" cy="109" r="4" fill="#fff4d2" />
    <path d="M117 121q13 12 26 0" fill="none" stroke="#fff4d2" strokeWidth="4" strokeLinecap="round" />
    <path d="M72 147c-12 3-18 10-17 20 12 0 20-5 24-15m109-5c12 3 18 10 17 20-12 0-20-5-24-15" fill="none" stroke="#f5bc64" strokeWidth="6" strokeLinecap="round" />
    <path d="M91 182q-12 12-21 4m99-4q12 12 21 4" fill="none" stroke="#552941" strokeWidth="5" strokeLinecap="round" />
    <path d="M62 99 51 89m157 10 11-10M78 74 70 60m112 14 8-14" stroke="#d98b35" strokeWidth="3" strokeLinecap="round" />
    <circle cx="49" cy="87" r="4" fill="#ef6f38"/><circle cx="213" cy="87" r="4" fill="#ef6f38"/>
  </svg>;
}

function Confetti({ active }: { active: boolean }) {
  return active ? <div className="confetti" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div> : null;
}

export default function Home() {
  const [count, setCount] = useState<number | null>(null);
  const [online, setOnline] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", age: "", message: "", consent: false });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/celebrate").then(async (r) => { const d = await r.json(); setOnline(Boolean(d.configured)); if (d.configured) setCount(d.count); }).catch(() => setOnline(false));
  }, []);

  async function celebrate() {
    if (celebrating) return;
    setCelebrating(true);
    setMessage("A little light, a lot of joy. Green Diwali!");
    window.setTimeout(() => setCelebrating(false), 1800);
    try {
      const response = await fetch("/api/celebrate", { method: "POST" });
      const data = await response.json();
      if (response.ok) { setCount(data.count); setOnline(true); }
      else setOnline(false);
    } catch { setOnline(false); }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus(""); setSending(true);
    try {
      const response = await fetch("/api/message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn't save that message.");
      setStatus("Your wish has been tucked safely away. Thank you!");
      setForm({ name: "", phone: "", email: "", age: "", message: "", consent: false });
    } catch (error) { setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again."); }
    finally { setSending(false); }
  }

  return <main>
    <div className="paper-texture" aria-hidden="true" />
    <header className="topbar"><a className="brand" href="#top" aria-label="Green Diwali home"><span className="brand-mark">✦</span> little lights, big joy</a><a className="nav-link" href="#why">Our kind of celebration <span>↗</span></a></header>
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span /> A brighter kind of Diwali</div>
        <h1>Let joy<br />light up the <em>world.</em></h1>
        <p className="intro">More sparkle in our hearts. Less smoke in our skies. Celebrate the festival of lights with one joyful click.</p>
        <div className="counter" aria-live="polite"><span className="counter-icon">✳</span><div><strong>{count === null ? "— — —" : count.toLocaleString("en-IN")}</strong><small>{online ? "lights added around the world" : "global counter connects when deployed"}</small></div><span className="counter-dot" /></div>
        <div className="hero-actions"><button className="celebrate-button" onClick={celebrate} disabled={celebrating}><span className="button-spark">✦</span>{celebrating ? "Sending good vibes…" : "Celebrate Green Diwali"}<span className="arrow">↗</span></button><span className="safe-note"><span>✓</span> All the fun. Just a screen animation.</span></div>
      </div>
      <div className="hero-art"><div className="sun-disc" /><div className="arch"><div className="arch-inner" /><div className="star star-one">✦</div><div className="star star-two">✧</div><div className="star star-three">✳</div><div className="flower flower-one">✿</div><div className="flower flower-two">✿</div><Mascot /><div className="speech"><span>Arre suno!</span><br />Green Diwali yha pr<br />enjoy krne ka ✨</div></div><div className="art-caption"><span className="caption-line" /> meet Diya, your festival buddy</div></div>
      <div className="scroll-cue"><span /> scroll for a little more light</div>
    </section>
    <section className="wish-popup" aria-live="polite"><Confetti active={celebrating} />{message && <><span className="wish-star">✦</span><span>{message}</span><button onClick={() => setMessage("")} aria-label="Dismiss celebration message">×</button></>}</section>
    <section className="why" id="why"><div className="section-number">01 <span>—</span> A festival, with a lighter footprint</div><div className="why-grid"><h2>Keep the <em>magic.</em><br />Leave the smoke.</h2><div className="why-text"><p>Diwali is the glow of diyas, the warmth of being together, and wishes that travel farther than any fireworks.</p><p>Here, every click adds a little light to a shared celebration. No loud bangs, no smoke—just a tiny burst of colour on your screen and a whole lot of festive feeling.</p><a href="#wish">Add your wish <span>↓</span></a></div></div><div className="motif-row"><span>✳</span><span>✦</span><span>❋</span><span>✦</span><span>✳</span></div></section>
    <section className="wish-section" id="wish"><div className="wish-intro"><div className="section-number">02 <span>—</span> Send a little light</div><h2>Leave a wish<br />for the <em>world.</em></h2><p>Want to add a message to the celebration? It’s completely optional. Your personal details stay private and are never shown publicly.</p><div className="privacy-chip"><span>⌑</span> Private by design <span className="chip-divider">·</span> Shared only with campaign organisers</div></div>
      <form className="wish-form" onSubmit={submit}>
        <label className="field-label" htmlFor="message">Your Diwali wish <span>required</span></label><textarea id="message" maxLength={500} required placeholder="May your home be full of light…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        <div className="form-divider"><span>THE REST IS UP TO YOU</span></div>
        <div className="field-grid"><label>Name <span>optional</span><input autoComplete="name" maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="What should we call you?" /></label><label>Email <span>optional</span><input autoComplete="email" type="email" maxLength={254} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Phone <span>optional</span><input autoComplete="tel" type="tel" maxLength={30} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></label><label>Age <span>optional · 18+</span><input type="number" min="18" max="120" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="18 or older" /></label></div>
        <label className="consent"><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} required /><span>I agree to let the campaign organisers securely store this wish and any details I choose to share. My details will not be made public.</span></label>
        <button className="submit-button" disabled={sending}>{sending ? "Sending your wish…" : "Send your wish"}<span>↗</span></button><p className="form-status" role="status">{status}</p><p className="privacy-foot">Please don’t include sensitive or financial information. We collect only what you choose to share for this campaign.</p>
      </form></section>
    <footer><a className="brand" href="#top"><span className="brand-mark">✦</span> little lights, big joy</a><p>Wishing you a safe, joyful & greener Diwali.</p><span className="footer-star">✺</span></footer>
  </main>;
}
