import React, { useState } from "react";

const PriestContactPage = () => {
  const [formState, setFormState] = useState({ name: "", email: "", topic: "Just Saying Hello", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const quickFacts = [
    { label: "Best For", value: "Questions, feedback, or just saying hello" },
    { label: "Response Time", value: "Usually within 2–3 days" },
    { label: "Office Hours", value: "Tue – Fri, 9:00 AM – 3:00 PM" },
    { label: "Urgent Priestly Care", value: "Call the church office directly" },
    { label: "Preferred For Long Notes", value: "Email over social media" },
    { label: "Newsletter", value: "Monthly, no spam, easy to unsubscribe" }
  ];

  const reachMethods = [
    { title: "Email", value: "daniel@harborlightchurch.org", desc: "The most reliable way to reach me. I read every message myself, usually with coffee in hand." },
    { title: "Church Office", value: "+251 11 555 0148", desc: "For scheduling, building questions, or anything the office team can help with directly." },
    { title: "Instagram", value: "@priest.daniel.worku", desc: "Where I post shorter reflections between longer posts here on the journal." },
    { title: "Mail", value: "Harbor Light Church, Bole Road, Addis Ababa", desc: "For letters, cards, or anything that deserves a stamp instead of a send button." }
  ];

  const location = {
    address: "Harbor Light Church, Bole Road, Addis Ababa, Ethiopia",
    note: "My office sits behind the sanctuary. If the door's open, so am I — no appointment required most weekday mornings.",
    serviceTimes: ["Sunday — 9:00 & 11:00 AM", "Wednesday Prayer — 6:30 PM", "Office Hours — Tue–Fri, 9:00 AM–3:00 PM"]
  };

  const faqs = [
    { q: "Do you offer priestly counseling to people outside the congregation?", a: "Yes, within reason. Email me a little about what you're looking for and I'll tell you honestly whether I'm the right person, or point you toward someone better suited." },
    { q: "Can I request prayer without attending the church?", a: "Absolutely. Our Wednesday prayer meeting takes requests from anyone, and I personally pray through the list every morning." },
    { q: "Are you available for weddings or funerals outside Harbor Light?", a: "Occasionally, depending on the calendar. Reach out as early as you can — these get booked months ahead." },
    { q: "Do you read and reply to every comment on the blog?", a: "I try to. It sometimes takes a week or two, but I've never left one unread." }
  ];

  const handleChange = (field) => (e) => setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="church-portal">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --sky-top: #a9d3e8;
          --sky-mid: #d5eaf3;
          --sky-low: #f3f8fa;
          --navy: #1c3a52;
          --navy-deep: #0f2438;
          --slate: #3d5a6c;
          --gold: #cf9f3f;
          --gold-deep: #96731f;
          --white: #ffffff;
          --deep-red: #7a1010;
        }

        * { box-sizing: border-box; }

        .church-portal {
          font-family: 'Nunito Sans', sans-serif;
          background: linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 40%, var(--sky-low) 100%);
          color: var(--navy);
          -webkit-font-smoothing: antialiased;
        }
        .wrapper { max-width: 1180px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 2; }
        .display { font-family: 'Cormorant Garamond', serif; }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold);
        }
        a { color: inherit; text-decoration: none; }

        .cloud-layer { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .cloud { position: absolute; background: rgba(255,255,255,0.75); border-radius: 100px; filter: blur(1px); }
        .cloud::before, .cloud::after { content: ''; position: absolute; background: inherit; border-radius: 100px; }
        .cloud-a { width: 180px; height: 55px; top: 8%; left: -10%; animation: drift 70s linear infinite; }
        .cloud-a::before { width: 90px; height: 90px; top: -45px; left: 25px; }
        .cloud-a::after { width: 70px; height: 70px; top: -30px; left: 90px; }
        .cloud-b { width: 130px; height: 40px; top: 22%; left: -15%; animation: drift 95s linear infinite; animation-delay: -20s; opacity: 0.6; }
        .cloud-b::before { width: 65px; height: 65px; top: -32px; left: 18px; }
        .cloud-b::after { width: 50px; height: 50px; top: -22px; left: 65px; }
        .cloud-c { width: 220px; height: 60px; top: 4%; left: -20%; animation: drift 120s linear infinite; animation-delay: -50s; opacity: 0.5; }
        .cloud-c::before { width: 100px; height: 100px; top: -50px; left: 30px; }
        .cloud-c::after { width: 80px; height: 80px; top: -35px; left: 110px; }
        @keyframes drift { from { transform: translateX(0); } to { transform: translateX(160vw); } }
        @media (prefers-reduced-motion: reduce) { .cloud { animation: none !important; } }

        section { padding: 90px 0; position: relative; z-index: 1; }

        .nav-bar {
          position: sticky; top: 0; z-index: 40;
          display: flex; align-items: center; gap: 26px;
          padding: 0 24px; height: 100px;
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          overflow-x: auto; white-space: nowrap; scrollbar-width: none;
        }
        .nav-bar::-webkit-scrollbar { display: none; }
        .nav-brand { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.6rem; color: #eaf3f8; margin-right: 10px; flex-shrink: 0; }
        .nav-item { font-size: 1.05rem; font-weight: 700; color: #ffffff; cursor: pointer; flex-shrink: 0; position: relative; padding: 4px 0; transition: color 0.2s ease; }
        .nav-item:hover { color: var(--gold); }
        .nav-item::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 2px; background: var(--gold); transition: width 0.25s ease; }
        .nav-item:hover::after { width: 100%; }

        .fact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; background: transparent; border-radius: 12px; overflow: hidden; }
        .fact-item { background: var(--deep-red); padding: 26px 28px; border-radius: 10px; }
        .fact-label { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); margin: 0 0 8px 0; }
        .fact-value { font-size: 1.35rem; color: #eaf3f8; margin: 0; line-height: 1.5; }
        @media (max-width: 600px) { .fact-grid { grid-template-columns: 1fr; } }

        .pull-quote { border-left: 4px solid var(--gold); padding-left: 30px; margin: 0; }

        /* REACH GRID */
        .reach-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
        @media (max-width: 650px) { .reach-grid { grid-template-columns: 1fr; } }
        .reach-card {
          padding: 32px;
          border-radius: 12px;
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          border-left: 3px solid var(--gold);
          border-top: 1px solid rgba(255,255,255,0.08);
          border-right: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .reach-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.15rem; font-weight: 500; color: var(--gold);
          margin: 8px 0 14px 0; word-break: break-word;
        }

        /* FORM — rebuilt as a clearly bounded, high-contrast card */
        .form-card {
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
          border-radius: 20px;
          padding: 48px;
          box-shadow: 0 30px 60px -20px rgba(15,36,56,0.45), 0 2px 0 rgba(207,159,63,0.5);
          border: 1px solid rgba(255,255,255,0.08);
        }
        @media (max-width: 600px) { .form-card { padding: 30px 22px; } }
        .contact-form { display: grid; gap: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
        .field-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 8px; display: block; font-weight: 600;
        }
        .field-input, .field-select, .field-textarea {
          width: 100%; padding: 15px 16px; font-size: 1.05rem;
          border-radius: 8px; border: 1.5px solid rgba(28,58,82,0.15);
          background: #fbfdfe; color: var(--navy-deep);
          font-family: 'Nunito Sans', sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .field-input::placeholder, .field-textarea::placeholder { color: rgba(28,58,82,0.4); }
        .field-select option { color: var(--navy-deep); background: #ffffff; }
        .field-input:focus, .field-select:focus, .field-textarea:focus {
          outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(207,159,63,0.25);
        }
        .field-textarea { resize: vertical; min-height: 150px; }
        .submit-btn {
          justify-self: start; background: var(--gold); color: var(--navy-deep);
          border: none; padding: 17px 42px; font-size: 1.05rem; font-weight: 700;
          border-radius: 30px; cursor: pointer; transition: background 0.2s ease, transform 0.15s ease;
          box-shadow: 0 10px 24px -8px rgba(0,0,0,0.4);
        }
        .submit-btn:hover { background: #e0b455; transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }
        .success-note {
          background: rgba(207,159,63,0.16); border: 1px solid rgba(207,159,63,0.4);
          border-radius: 10px; padding: 22px 26px; font-size: 1.05rem; color: #eaf3f8;
        }

        /* LOCATION */
        .location-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 46px; align-items: center; }
        @media (max-width: 800px) { .location-grid { grid-template-columns: 1fr; } }
        .map-frame {
          width: 100%; aspect-ratio: 4/3; border-radius: 14px; overflow: hidden;
          box-shadow: 0 20px 40px rgba(15,36,56,0.2); border: none;
        }
        .service-time-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; border-bottom: 1px dashed rgba(255,255,255,0.2);
          font-size: 1.2rem;
        }
        .service-time-row:last-child { border-bottom: none; }

        /* FAQ */
        .faq-item { border-bottom: 1px solid rgba(28,58,82,0.14); }
        .faq-item:first-child { border-top: 1px solid rgba(28,58,82,0.14); }
        .faq-question {
          width: 100%; text-align: left; background: none; border: none; cursor: pointer;
          padding: 24px 0; display: flex; justify-content: space-between; align-items: center;
          gap: 20px; font-family: 'Cormorant Garamond', serif; font-size: 1.65rem; font-weight: 700;
          color: var(--navy-deep);
        }
        .faq-toggle {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          border: 1.5px solid var(--gold); color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; font-family: 'IBM Plex Mono', monospace;
        }
        .faq-answer { padding: 0 0 26px 0; font-size: 1.2rem; color: #3d5a6c; line-height: 1.8; max-width: 640px; }
      `}</style>

      <div className="cloud-layer">
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      {/* HERO */}
      <section style={{ padding: '100px 0 80px 0', background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h1 className="display" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.12, margin: '0 0 26px 0', color: '#eaf3f8' }}>
            I'd genuinely love to hear from you
          </h1>
          <p style={{ fontSize: '1.55rem', color: '#a9c2d3', lineHeight: 1.75, marginBottom: '0', maxWidth: '560px' }}>
            Whether it's a question about something I've written, a prayer request, or just a hello —
            this page goes straight to me, not a committee. Scroll down for the form, or reach out
            however feels easiest.
          </p>
        </div>
      </section>

      {/* QUICK FACTS BAND */}
      <div style={{ background: 'linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%)', position: 'relative', overflow: 'hidden' }}>
        <section style={{ padding: '64px 0' }}>
          <div className="wrapper">
            <div className="fact-grid">
              {quickFacts.map((f, i) => (
                <div className="fact-item" key={i}>
                  <p className="fact-label">{f.label}</p>
                  <p className="fact-value">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* WAYS TO REACH ME */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '1000px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 34px 0', color: 'var(--navy-deep)' }}>
            Ways to Reach Me
          </h2>
          <div className="reach-grid">
            {reachMethods.map((m, i) => (
              <div className="reach-card" key={i}>
                <h4 className="display" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#eaf3f8' }}>{m.title}</h4>
                <p className="reach-value">{m.value}</p>
                <p style={{ fontSize: '1.15rem', color: '#a9c2d3', lineHeight: 1.75, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 34px 0', color: '#ffffff' }}>
            Write as much or as little as you'd like
          </h2>

          <div className="form-card">
            {submitted ? (
              <div className="success-note">
                Thank you — your message is on its way to me. I read everything myself, so it may take
                a few days, but I will get back to you.
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div>
                    <label className="field-label" htmlFor="name">Name</label>
                    <input className="field-input" id="name" type="text" placeholder="Your full name" value={formState.name} onChange={handleChange("name")} required />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="email">Email</label>
                    <input className="field-input" id="email" type="email" placeholder="you@email.com" value={formState.email} onChange={handleChange("email")} required />
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="topic">What's this about?</label>
                  <select className="field-select" id="topic" value={formState.topic} onChange={handleChange("topic")}>
                    <option>Just Saying Hello</option>
                    <option>A Question About Something I Wrote</option>
                    <option>A Prayer Request</option>
                    <option>Priestly Counseling</option>
                    <option>Weddings / Funerals</option>
                    <option>Something Else</option>
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="message">Your Message</label>
                  <textarea className="field-textarea" id="message" placeholder="Take your time — I'll read all of it." value={formState.message} onChange={handleChange("message")} required />
                </div>
                <button className="submit-btn" type="submit">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#ffffff' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 20px 0', color: 'var(--navy-deep)' }}>
            A Few FAQ Questions

          </h2>
          <div>
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="faq-toggle">{openFaq === i ? "–" : "+"}</span>
                </button>
                {openFaq === i && <p className="faq-answer">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section style={{ background: 'linear-gradient(180deg, var(--sky-mid) 0%, var(--sky-low) 100%)' }}>
        <div className="wrapper" style={{ maxWidth: '760px' }}>
          <p className="pull-quote display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 600, color: 'var(--navy-deep)', lineHeight: 1.55 }}>
            "You don't need the right words or a good reason. If something's on your heart, I'd rather
            hear it imperfectly than not at all."
          </p>
          <p style={{ marginTop: '26px', fontSize: '1.25rem', color: '#3d5a6c' }}>— Daniel</p>
        </div>
      </section>

      {/* LOCATION & SERVICE TIMES */}
      <div style={{ background: 'var(--deep-red)', position: 'relative', overflow: 'hidden' }}>
        <section>
          <div className="wrapper">
            <h2 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700, margin: '0 0 40px 0', color: '#ffffff' }}>
              Visit In Person

            </h2>
            <div className="location-grid">
              <div className="map-frame">
                <iframe
                  title="Harbor Light Church location"
                  src="https://www.google.com/maps?q=Bole+Road,+Addis+Ababa,+Ethiopia&output=embed"
                  style={{ width: '100%', height: '100%', border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div>
                <p style={{ fontSize: '1.4rem', color: '#eaf3f8', lineHeight: 1.75, marginBottom: '12px' }}>{location.address}</p>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, marginBottom: '20px', maxWidth: '460px' }}>{location.note}</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Harbor+Light+Church+Bole+Road+Addis+Ababa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow"
                  style={{ fontSize: '0.85rem', display: 'inline-block', marginBottom: '30px', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}
                >
                  Get Directions →
                </a>
                <div>
                  {location.serviceTimes.map((t, i) => {
                    const [label, time] = t.split(" — ");
                    return (
                      <div className="service-time-row" key={i} style={{ color: '#eaf3f8' }}>
                        <span>{label}</span>
                        <span className="eyebrow" style={{ fontSize: '0.85rem' }}>{time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer style={{ background: 'var(--navy-deep)', color: '#89a3b5', padding: '60px 0 30px 0', borderBottom: '6px solid var(--deep-red)' }}>
        <div className="wrapper">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '38px', marginBottom: '44px' }}>
            <div>
              <h4 className="display" style={{ color: '#eaf3f8', fontSize: '1.8rem', fontWeight: 700, marginBottom: '14px' }}>Daniel Worku</h4>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.7 }}>Priest at Harbor Light Church. Writing about faith, family, and the ordinary work of ministry.</p>
            </div>
            {[
              { title: "Read", items: ["Latest Posts", "Journal", "Sermon Notes", "Archive"] },
              { title: "About", items: ["My Story", "Family", "Books I Recommend"] },
              { title: "Connect", items: ["Email Me", "Instagram", "YouTube"] }
            ].map((col, i) => (
              <div key={i}>
                <h5 className="eyebrow" style={{ color: '#eaf3f8', marginBottom: '12px', fontSize: '0.85rem' }}>{col.title}</h5>
                {col.items.map((s, j) => (
                  <p key={j} style={{ fontSize: '1.2rem', margin: '10px 0', cursor: 'pointer' }}>{s}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <p className="eyebrow" style={{ margin: 0, fontSize: '0.85rem' }}>© 2026 Daniel Worku</p>
            <p className="eyebrow" style={{ margin: 0, fontSize: '0.85rem' }}>Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PriestContactPage;