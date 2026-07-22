import React from "react";
import "./Footer.css";

const footerColumns = [
  { title: "Visit", items: ["Service Times", "Directions", "What to Expect"] },
  { title: "Get Involved", items: ["Ministries", "Volunteer", "Give", "Missions"] },
  { title: "Connect", items: ["Facebook", "Instagram", "YouTube"] }
];

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="wrapper">
        <div className="footer-grid">
          <div>
            <h4 className="display footer-brand">Harbor Light Church</h4>
            <p className="footer-tagline">Sunday services at 9:00 & 11:00 AM. All are welcome, always.</p>
          </div>
          {footerColumns.map((col, i) => (
            <div key={i}>
              <h5 className="eyebrow footer-col-title">{col.title}</h5>
              {col.items.map((s, j) => (
                <p key={j} className="footer-link">{s}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p className="eyebrow footer-bottom-text">© 2026 Harbor Light Church</p>
          <p className="eyebrow footer-bottom-text">Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;