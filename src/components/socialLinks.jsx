import React from "react";
import { FaYoutube, FaEnvelope } from "react-icons/fa";

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => <FaYoutube aria-hidden="true" size={size} />;
const EmailIcon = ({ size = 18 }) => <FaEnvelope aria-hidden="true" size={size} />;

// Single source of truth: used by Navbar and Footer.
const socialLinks = [
  {
    key: "facebook",
    label: "Facebook",
    href:
      "https://web.facebook.com/people/\u12E8\u12A1\u12F5\u1294-\u12F0\u1265\u1228-\u1230\u120B\u121D-\u12A3\u1261\u1290-\u1308\u1265\u1228\u1218\u1295\u1348\u1235-\u1245\u12F1\u1235/pfbid0Gmvo48jeTiFVEBNUrfDAoHVAWFydhpuaSCWFxp6hpd7rCoUJci6sUJRBDVtn3g7Ql/",
    Icon: FacebookIcon,
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@aklesiazetewahdoudine92",
    Icon: YoutubeIcon,
  },
  {
    key: "email",
    label: "Email",
    href: "mailto:abunegebremenfeskidus@gmail.com",
    Icon: EmailIcon,
  },
];

export default socialLinks;
