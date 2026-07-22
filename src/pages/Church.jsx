import React, { useEffect, useState } from "react";
import "./Church.css";

const Church = () => {
  const [showConstructionAd, setShowConstructionAd] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConstructionAd(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismissConstructionAd = () => setShowConstructionAd(false);

  // TODO: replace with your real details — this is the church you currently serve at
  const currentChurch = {
    name: "Harbor Light — Eastside",
    role: "Where I Serve Now",
    pastorRole: "Associate Pastor",
    address: "88 Founders Road, Addis Ababa",
    service: "Sundays · 10:00 AM",
    phone: "+251 11 555 0142",
    email: "eastside@harborlight.church",
    since: "Serving since 2021",
    description:
      "Eastside is home for me — a growing congregation where I lead worship, teach midweek study, and walk alongside families throughout the week. If you're new, I'd love to meet you after the 10:00 AM service.",
    img: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=1200&q=80",
    alt: "Small chapel with wooden pews where I currently serve"
  };

  const posts = [
    {
      tag: "Heritage",
      title: "Ethiopia's Ancient Faith",
      excerpt:
        "Long before most of Europe had heard the Gospel, the Kingdom of Aksum had already made Christianity its state religion under King Ezana in the 4th century — making Ethiopia one of the very first Christian nations on earth.",
      img: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80",
      alt: "Sunlight streaming through a church interior"
    },
    {
      tag: "Architecture",
      title: "The Rock-Hewn Churches of Lalibela",
      excerpt:
        "Carved directly out of solid volcanic rock in the 12th and 13th centuries, the eleven monolithic churches of Lalibela remain one of the most extraordinary feats of faith and craftsmanship in Christian history.",
      img: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=900&q=80",
      alt: "Small stone chapel interior"
    },
    {
      tag: "Community",
      title: "Faith in the Highlands Today",
      excerpt:
        "From the drumbeats of Timkat to the bonfires of Meskel, the rhythms of the Ethiopian church calendar still shape daily life — knitting together generations of believers in cities and highland villages alike.",
      img: "https://images.unsplash.com/photo-1465378552210-6900a2e5a4c0?auto=format&fit=crop&w=900&q=80",
      alt: "Chapel exterior at dusk"
    },
    {
      tag: "Language & Liturgy",
      title: "The Ge'ez Tongue of Worship",
      excerpt:
        "Ge'ez, an ancient Semitic language no longer spoken day to day, still carries the liturgy of the Ethiopian Orthodox Tewahedo Church — its chants and manuscripts preserving a living link to the earliest centuries of the faith.",
      img: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&w=900&q=80",
      alt: "Old manuscript pages"
    },
    {
      tag: "Pilgrimage",
      title: "Walking the Path to Aksum",
      excerpt:
        "Each year, pilgrims travel on foot for days to reach Aksum, believed by many to hold the Ark of the Covenant — a journey of endurance that mirrors the deeper spiritual pilgrimage at the heart of the faith.",
      img: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=900&q=80",
      alt: "Pilgrims walking a highland road"
    },
    {
      tag: "Festival",
      title: "Timkat: Ethiopia's Epiphany",
      excerpt:
        "Every January, streets fill with color as replicas of the Ark are carried in procession to be blessed near water — a three-day celebration of baptism and renewal that draws entire communities together.",
      img: "https://images.unsplash.com/photo-1508261303786-0aa5d5d4de10?auto=format&fit=crop&w=900&q=80",
      alt: "Colorful festival procession"
    },
    {
      tag: "Art & Craft",
      title: "Icons Painted in Devotion",
      excerpt:
        "Ethiopian religious art, with its bold color and distinctive large eyes, has developed its own visual language over centuries — icons that serve not as decoration but as windows into prayer.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
      alt: "Traditional religious icon painting"
    },
    {
      tag: "Legacy",
      title: "Monasteries of Lake Tana",
      excerpt:
        "Scattered across the islands of Lake Tana, centuries-old monasteries hold some of Ethiopia's oldest religious manuscripts and paintings, tended quietly by monks who continue a tradition unbroken for generations.",
      img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
      alt: "Monastery on a lake island"
    }
  ];

  const campuses = [
    {
      name: "Harbor Light — Downtown",
      role: "Sunday Service",
      address: "214 Wharf Street, Addis Ababa",
      service: "Sundays · 9:00 & 11:00 AM",
      img: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=900&q=80",
      alt: "Downtown church sanctuary filled with light"
    },
    {
      name: "Harbor Light — Eastside",
      role: "Sunday Service",
      address: "88 Founders Road, Addis Ababa",
      service: "Sundays · 10:00 AM",
      img: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=900&q=80",
      alt: "Small chapel with wooden pews"
    },
    {
      name: "Harbor Light — Riverside",
      role: "Sunday Service",
      address: "12 Mill Lane, Addis Ababa",
      service: "Sundays · 8:30 AM",
      img: "https://images.unsplash.com/photo-1465378552210-6900a2e5a4c0?auto=format&fit=crop&w=900&q=80",
      alt: "Riverside chapel exterior at dusk"
    }
  ];

  return (
    <div className="church-page">
      <section className="church-hero">
        <img
          src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=80"
          alt="A beautiful church filled with light"
        />
        <div className="church-hero-content">
          <span className="eyebrow">Our Church</span>
          <h1 className="display">A living faith, rooted in ancient soil.</h1>
          <p>From the highlands of Aksum to the halls we gather in today, our story is part of one of the oldest continuous Christian traditions on earth.</p>
          <button className="hero-cta">Read Our Story</button>
        </div>
      </section>

      {showConstructionAd && (
        <div style={{ background: 'var(--navy-deep)', padding: '1px 24px 40px 24px' }}>
          <div className="construction-ad visible">
            <div className="construction-ad-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80"
                alt="Church building under construction"
              />
              <span className="construction-ad-badge">Under Construction</span>
            </div>
            <button className="construction-ad-close" onClick={dismissConstructionAd} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="construction-ad-body">
              <span className="eyebrow">Building For Tomorrow</span>
              <h3>A new home for a growing church</h3>
              <p>Our Eastside campus has outgrown its walls — help us build a larger sanctuary for the families joining us each week.</p>
              <div className="ad-progress-label">
                <span>Progress</span>
                <strong>62% complete</strong>
              </div>
              <div className="ad-progress-track">
                <div className="ad-progress-fill" style={{ width: "62%" }} />
              </div>
              <button className="construction-ad-support-btn">Support the Build</button>
            </div>
          </div>
        </div>
      )}

      <section className="serve-now-section">
        <div className="wrapper">
          <div className="serve-now-card">
            <div className="serve-now-img-wrap">
              <img src={currentChurch.img} alt={currentChurch.alt} />
              <span className="serve-now-badge">{currentChurch.role}</span>
            </div>
            <div className="serve-now-body">
              <span className="serve-now-role">{currentChurch.pastorRole}</span>
              <h2 className="display">{currentChurch.name}</h2>
              <div className="serve-now-since">{currentChurch.since}</div>
              <p className="serve-now-desc">{currentChurch.description}</p>
              <div className="serve-now-details">
                <div className="serve-now-line"><strong>Address:</strong> {currentChurch.address}</div>
                <div className="serve-now-line"><strong>Service:</strong> {currentChurch.service}</div>
                <div className="serve-now-line"><strong>Phone:</strong> {currentChurch.phone}</div>
                <div className="serve-now-line"><strong>Email:</strong> {currentChurch.email}</div>
              </div>
              <button className="serve-now-cta">
                Visit This Campus
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="campuses-section">
        <div className="wrapper">
          <div className="campuses-head">
            <span className="eyebrow">Where We Gather</span>
            <h2 className="display">The churches it serves</h2>
            <p>One community, gathered every Sunday across three campuses — each with its own rhythm, but the same commitment to the Word.</p>
          </div>

          <div className="campus-grid">
            {campuses.map((c) => (
              <div className="campus-card" key={c.name}>
                <img src={c.img} alt={c.alt} />
                <div className="campus-card-body">
                  <div className="campus-role">{c.role}</div>
                  <h3>{c.name}</h3>
                  <div className="campus-line"><strong>Address:</strong> {c.address}</div>
                  <div className="campus-line"><strong>Service:</strong> {c.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="wrapper">
          <div className="blog-head">
            <span className="eyebrow">From the Journal</span>
            <h2 className="display">The church in Ethiopia</h2>
            <p>A closer look at the history, architecture, and living traditions that shape our faith community.</p>
          </div>

          <div className="blog-grid">
            {posts.map((p) => (
              <div className="blog-card" key={p.title}>
                <img src={p.img} alt={p.alt} />
                <div className="blog-card-body">
                  <div className="blog-tag">{p.tag}</div>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <button className="read-more">
                    Read more
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Church;