"use client";
import { useState } from "react";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="hero-inner">
          <div className="section-label">We Are Here For You</div>
          <h1 className="hero-title">Get In <span className="red">Touch With Us</span></h1>
          <p className="hero-sub">Have a question or need help? We are always here. Helping you is our pleasure.</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="section-inner two-col">

          {/* Contact Info */}
          <div className="contact-info">
            <h2 className="info-title">Connect With Us</h2>
            <p className="info-sub">We are available every working day from 9 AM to 7 PM to assist you.</p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📞</div>
                <div>
                  <div className="info-label">Call Us</div>
                  <div className="info-value">+91-9217703975</div>
                  <div className="info-note">Mon–Sat, 9 AM – 7 PM</div>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">✉️</div>
                <div>
                  <div className="info-label">Email Us</div>
                  <div className="info-value">info@eliteweds.com</div>
                  <div className="info-note">Reply within 24 hours</div>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">💬</div>
                <div>
                  <div className="info-label">WhatsApp</div>
                  <div className="info-value">+91-9217703975</div>
                  <div className="info-note">Quick response guaranteed</div>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div>
                  <div className="info-label">Our Office</div>
                  <div className="info-value">Delhi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="form-container">
            {submitted ? (
              <div className="success-box">
                <div className="success-icon">✅</div>
                <h3 className="success-title">Thank You!</h3>
                <p className="success-msg">We have received your message and will get back to you within 24 hours.</p>
                <button className="btn-reset" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
             <div className="form-inner">
  <h2 className="form-title">Send Us a Message</h2>

  <div className="form-grid">
    <div className="field">
      <label>
        Your Full Name <span className="text-red-500">*</span>
      </label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="e.g. Rahul Sharma"
        required
      />
    </div>

    <div className="field">
      <label>
        Email Address <span className="text-red-500">*</span>
      </label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="email@example.com"
        required
      />
    </div>

    <div className="field">
      <label>
        Phone Number <span className="text-red-500">*</span>
      </label>
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="+91 XXXXX XXXXX"
        required
      />
    </div>

    <div className="field">
      <label>
        Subject <span className="text-red-500">*</span>
      </label>
      <select
        name="subject"
        value={form.subject}
        onChange={handleChange}
        required
      >
        <option value="">Select a topic</option>
        <option>Profile Related</option>
        <option>Membership / Plans</option>
        <option>Technical Issue</option>
        <option>Share a Success Story</option>
        <option>Other</option>
      </select>
    </div>

    <div className="field full">
      <label>
        Your Message <span className="text-red-500">*</span>
      </label>
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        rows={5}
        placeholder="Write your message here..."
        required
      />
    </div>
  </div>

  <button className="submit-btn" onClick={handleSubmit}>
    Send Message →
  </button>
</div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page { font-family: 'Lato', sans-serif; color: #2c1810; }
        .contact-hero { background: linear-gradient(145deg, #fff8f0, #fde8d8); padding: 80px 24px; text-align: center; }
        .hero-inner { max-width: 700px; margin: 0 auto; }
        .section-label { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #c0392b; margin-bottom: 12px; }
        .hero-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; color: #2c1810; margin-bottom: 16px; }
        .red { color: #c0392b; font-style: italic; }
        .hero-sub { font-size: 16px; color: #7a5a50; line-height: 1.7; }
        .contact-section { background: #fff8f0; }
        .section-inner { max-width: 1200px; margin: 0 auto; padding: 80px 24px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
        .info-title { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #2c1810; margin-bottom: 10px; }
        .info-sub { font-size: 15px; color: #7a5a50; line-height: 1.7; margin-bottom: 32px; }
        .info-cards { display: flex; flex-direction: column; gap: 16px; }
        .info-card { display: flex; align-items: flex-start; gap: 16px; background: white; border-radius: 14px; padding: 20px 22px; border: 1px solid #f0d9c8; transition: all 0.25s; }
        .info-card:hover { box-shadow: 0 8px 24px rgba(192,57,43,0.1); transform: translateX(4px); }
        .info-icon { font-size: 28px; flex-shrink: 0; }
        .info-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #c0392b; margin-bottom: 4px; }
        .info-value { font-size: 15px; font-weight: 600; color: #2c1810; margin-bottom: 2px; }
        .info-note { font-size: 12px; color: #7a5a50; }
        .form-container { background: white; border-radius: 24px; padding: 40px; border: 1px solid #f0d9c8; box-shadow: 0 10px 40px rgba(192,57,43,0.08); }
        .form-title { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 700; color: #2c1810; margin-bottom: 28px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 24px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field.full { grid-column: span 2; }
        .field label { font-size: 13px; font-weight: 600; color: #5a3e36; }
        .field input, .field select, .field textarea { padding: 12px 14px; border: 1.5px solid #f0d9c8; border-radius: 10px; font-family: 'Lato', sans-serif; font-size: 14px; color: #2c1810; background: #fff8f0; outline: none; transition: border-color 0.2s; resize: vertical; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: #c0392b; background: white; }
        .submit-btn { width: 100%; padding: 14px; border: none; border-radius: 50px; background: linear-gradient(135deg, #c0392b, #e74c3c); color: white; font-family: 'Lato', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 20px rgba(192,57,43,0.35); transition: all 0.25s; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(192,57,43,0.45); }
        .success-box { text-align: center; padding: 40px 20px; }
        .success-icon { font-size: 60px; margin-bottom: 20px; }
        .success-title { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #2c1810; margin-bottom: 12px; }
        .success-msg { font-size: 15px; color: #7a5a50; line-height: 1.7; margin-bottom: 28px; }
        .btn-reset { border: 1.5px solid #c0392b; color: #c0392b; background: none; padding: 10px 28px; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; }
        .btn-reset:hover { background: #c0392b; color: white; }
        @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
        @media (max-width: 540px) { .form-grid { grid-template-columns: 1fr; } .field.full { grid-column: span 1; } .form-container { padding: 24px 18px; } }
      `}</style>
    </main>
  );
}