import React, { useState } from "react";
import API from "../api/api";
import "./Contact.css";

const Contact = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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

  const handleChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await API.post("/contact", formState);
      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || "Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="church-portal">
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
            {submitted && (
              <div className="success-note">
                Thank you — your message is on its way to me. I read everything myself, so it may take
                a few days, but I will get back to you.
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                name="name"
                value={formState.name}
                onChange={handleChange("name")}
                placeholder="Your Name"
                required
                className="contact-input"
              />
              <input
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange("email")}
                placeholder="Email"
                required
                className="contact-input"
              />
              <textarea
                name="message"
                value={formState.message}
                onChange={handleChange("message")}
                placeholder="Take your time — I'll read all of it."
                required
                className="contact-textarea"
              />
              <button type="submit" className="contact-btn" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </button>
              {error && <p style={{ color: "#fb7185", marginTop: "20px", fontWeight: "700" }}>{error}</p>}
            </form>
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

export default Contact;