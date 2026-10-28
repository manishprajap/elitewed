"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Top Wave */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#2c1810" />
        </svg>
      </div>

      <div className="footer-body">
        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="brand-heart">♡</span>
              <span className="brand-name">Elite<span>Wedding</span></span>
            </div>
            
            <div className="social-links">
              <a href="https://www.facebook.com/Fortunatewedding121#" className="social-btn" aria-label="Facebook">f</a>
              <a href="#" className="social-btn" aria-label="Instagram">✦</a>
              <a href="#" className="social-btn" aria-label="WhatsApp">◉</a>
              <a href="#" className="social-btn" aria-label="YouTube">▷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="col-title">Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/testimonials">Success Stories</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="footer-col">
            <h4 className="col-title">Community</h4>
            <ul>
              <li><Link href="#">Hindu Matrimony</Link></li>
              <li><Link href="#">Muslim Matrimony</Link></li>
              <li><Link href="#">Sikh Matrimony</Link></li>
              <li><Link href="#">Christian Matrimony</Link></li>
              <li><Link href="#">Jain Matrimony</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <ul>
              <li><Link href="/contact-us">Contact Us</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Safety Tips</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
		<div className="footer-bottom">
		  <p>
			© {new Date().getFullYear()} Elite Wedding. All rights reserved. Made by ♡{" "}
			<a
			  href="https://aarnatechxperts.in/"
			  target="_blank"
			  rel="noopener noreferrer"
			  className="text-blue-500 hover:underline"
			>
			  Aarna Tech Xperts
			</a>
			.
		  </p>
		</div>
      </div>

      <style jsx>{`
        .footer {
          margin-top: auto;
        }
        .footer-wave {
          line-height: 0;
          overflow: hidden;
          height: 50px;
        }
        .footer-wave svg {
          width: 100%;
          height: 60px;
          display: block;
        }
        .footer-body {
          background: #2c1810;
          color: #f5e6d9;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 32px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .brand-heart {
          font-size: 26px;
          color: #e74c3c;
        }
        .brand-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff8f0;
        }
        .brand-name span {
          color: #e74c3c;
        }
        .brand-tagline {
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #c4a898;
          line-height: 1.6;
          margin-bottom: 20px;
          font-style: italic;
        }
        .social-links {
          display: flex;
          gap: 10px;
        }
        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #5a3e36;
          color: #c4a898;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.25s;
        }
        .social-btn:hover {
          background: #c0392b;
          border-color: #c0392b;
          color: white;
          transform: translateY(-2px);
        }
        .col-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff8f0;
          margin-bottom: 18px;
          letter-spacing: 0.5px;
        }
        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-col ul li a {
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #c4a898;
          text-decoration: none;
          transition: color 0.2s;
          display: inline-block;
        }
        .footer-col ul li a:hover {
          color: #e74c3c;
          transform: translateX(4px);
        }
        .footer-bottom {
          border-top: 1px solid #3d2218;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 24px;
          text-align: center;
        }
        .footer-bottom p {
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #7a5a50;
        }
        .footer-sub {
          margin-top: 4px;
          font-size: 12px !important;
          color: #5a3e36 !important;
        }
        @media (max-width: 900px) {
          .footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .footer-brand {
            grid-column: span 2;
          }
        }
        @media (max-width: 540px) {
          .footer-inner {
            grid-template-columns: 1fr;
          }
          .footer-brand {
            grid-column: span 1;
          }
        }
      `}</style>
    </footer>
  );
}