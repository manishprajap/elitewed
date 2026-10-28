"use client";

const team = [
  { name: "Rajesh Sharma", role: "Founder & CEO", emoji: "👨‍💼", city: "Lucknow" },
  { name: "Priya Mehta", role: "Head of Matchmaking", emoji: "👩‍💼", city: "Delhi" },
  { name: "Amit Verma", role: "Tech Lead", emoji: "👨‍💻", city: "Bengaluru" },
  { name: "Sunita Gupta", role: "Customer Relations", emoji: "👩‍🤝‍👨", city: "Mumbai" },
];

const values = [
  { icon: "🙏", title: "Trust", desc: "Every profile is manually verified. Your trust is our greatest responsibility." },
  { icon: "❤️", title: "Respect", desc: "We honor every relationship — regardless of caste, religion, or background." },
  { icon: "🔒", title: "Privacy", desc: "Your personal information is 100% safe. Privacy is our promise to you." },
  { icon: "🌟", title: "Hope", desc: "Every member's happiness is our success. We don't just connect profiles — we connect dreams." },
];

export default function AboutUsPage() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="hero-inner">
          <div className="section-label">Our Story</div>
          <h1 className="about-title">One Dream — Every Heart Finds <span className="red">Its Perfect Match</span></h1>
          <p className="about-sub">
            BandhanSaathi began with a simple idea — that technology and the tradition of relationships could walk hand in hand.
            Today, we are India's most trusted matrimonial platform.
          </p>
        </div>
        <div className="about-hero-deco">♡</div>
      </section>

      {/* Mission */}
      <section className="mission-section">
        <div className="section-inner two-col">
          <div className="mission-text">
            <div className="section-label">Our Mission</div>
            <h2 className="sec-title">Why Are We Here?</h2>
            <p>When BandhanSaathi launched in 2009, online matrimony was a brand new concept in India. Our mission was to build a platform that was not just digital — but heartfelt.</p>
            <p style={{ marginTop: "16px" }}>15 years later, with 50,000+ successful marriages and 5 lakh registered members, we are proud that our efforts have truly made a difference.</p>
            <div className="mission-stats">
              <div className="m-stat"><span className="m-num">2009</span><span className="m-label">Founded</span></div>
              <div className="m-stat"><span className="m-num">50K+</span><span className="m-label">Marriages</span></div>
              <div className="m-stat"><span className="m-num">200+</span><span className="m-label">Communities</span></div>
            </div>
          </div>
          <div className="mission-visual">
            <div className="visual-card">
              <div className="visual-emoji">💑</div>
              <p className="visual-quote">"We don't just connect profiles —<br />we build relationships."</p>
              <span className="visual-sign">— BandhanSaathi Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="section-inner">
          <div className="section-label">What We Stand For</div>
          <h2 className="sec-title">Our Core Values</h2>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="v-icon">{v.icon}</div>
                <h3 className="v-title">{v.title}</h3>
                <p className="v-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="section-inner">
          <div className="section-label">The People Behind</div>
          <h2 className="sec-title">Meet Our Team</h2>
          <div className="team-grid">
            {team.map((t, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar">{t.emoji}</div>
                <h3 className="team-name">{t.name}</h3>
                <p className="team-role">{t.role}</p>
                <p className="team-city">📍 {t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page { font-family: 'Lato', sans-serif; color: #2c1810; }
        .about-hero { background: linear-gradient(145deg, #fff8f0, #fde8d8); padding: 80px 24px; position: relative; overflow: hidden; text-align: center; }
        .hero-inner { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
        .about-hero-deco { position: absolute; right: 10%; top: 50%; transform: translateY(-50%); font-size: 200px; color: rgba(192,57,43,0.06); line-height: 1; }
        .section-label { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #c0392b; margin-bottom: 12px; }
        .about-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(28px, 4vw, 48px); font-weight: 700; color: #2c1810; line-height: 1.25; margin-bottom: 20px; }
        .red { color: #c0392b; font-style: italic; }
        .about-sub { font-size: 16px; color: #7a5a50; line-height: 1.8; max-width: 640px; margin: 0 auto; }
        .section-inner { max-width: 1200px; margin: 0 auto; padding: 80px 24px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .sec-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(24px, 3vw, 36px); font-weight: 700; color: #2c1810; margin-bottom: 20px; }
        .mission-text p { font-size: 15px; color: #7a5a50; line-height: 1.8; }
        .mission-stats { display: flex; gap: 32px; margin-top: 32px; }
        .m-stat { display: flex; flex-direction: column; gap: 4px; }
        .m-num { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #c0392b; }
        .m-label { font-size: 12px; color: #7a5a50; font-weight: 600; letter-spacing: 0.5px; }
        .mission-visual { display: flex; justify-content: center; }
        .visual-card { background: linear-gradient(135deg, #2c1810, #5a2418); border-radius: 24px; padding: 48px 36px; text-align: center; color: white; box-shadow: 0 20px 60px rgba(44,24,16,0.2); }
        .visual-emoji { font-size: 64px; margin-bottom: 20px; }
        .visual-quote { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-style: italic; line-height: 1.5; color: #fde8d8; margin-bottom: 16px; }
        .visual-sign { font-size: 12px; color: rgba(255,255,255,0.5); }
        .values-section { background: #fff8f0; }
        .values-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; margin-top: 48px; }
        .value-card { background: white; border-radius: 16px; padding: 32px 24px; border: 1px solid #f0d9c8; text-align: center; transition: all 0.3s; }
        .value-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(192,57,43,0.12); }
        .v-icon { font-size: 40px; margin-bottom: 16px; }
        .v-title { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: #2c1810; margin-bottom: 10px; }
        .v-desc { font-size: 14px; color: #7a5a50; line-height: 1.6; }
        .team-section { background: white; }
        .team-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; margin-top: 48px; }
        .team-card { text-align: center; padding: 32px 20px; border-radius: 16px; border: 1px solid #f0d9c8; transition: all 0.3s; }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(192,57,43,0.1); background: #fff8f0; }
        .team-avatar { font-size: 52px; margin-bottom: 16px; }
        .team-name { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: #2c1810; margin-bottom: 6px; }
        .team-role { font-size: 13px; color: #c0392b; font-weight: 600; margin-bottom: 6px; }
        .team-city { font-size: 12px; color: #7a5a50; }
        @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } .values-grid { grid-template-columns: repeat(2,1fr); } .team-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .values-grid, .team-grid { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}