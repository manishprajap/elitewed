"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Jost', sans-serif;
          background: #0d0b0e;
          overflow: hidden;
          position: relative;
        }

        .login-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px;
          position: relative;
          background: linear-gradient(135deg, #1a0a0f 0%, #0d0b0e 60%);
        }

        .panel-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(180, 130, 80, 0.12) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(180, 100, 120, 0.08) 0%, transparent 70%);
        }

        .panel-lines {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              -30deg,
              transparent,
              transparent 60px,
              rgba(255,255,255,0.015) 60px,
              rgba(255,255,255,0.015) 61px
            );
        }

        .brand-block {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .brand-eyebrow {
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.4em;
          color: #b48250;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 5vw, 64px);
          font-weight: 300;
          color: #f5ece0;
          line-height: 1.1;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
        }

        .brand-divider {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #b48250, transparent);
          margin: 0 auto 24px;
        }

        .brand-tagline {
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: rgba(245, 236, 224, 0.4);
          text-transform: uppercase;
        }

        .panel-corner {
          position: absolute;
          width: 80px;
          height: 80px;
          border-color: rgba(180, 130, 80, 0.25);
          border-style: solid;
        }
        .panel-corner.tl { top: 32px; left: 32px; border-width: 1px 0 0 1px; }
        .panel-corner.br { bottom: 32px; right: 32px; border-width: 0 1px 1px 0; }

        .login-form-side {
          width: 440px;
          flex-shrink: 0;
          background: #faf8f5;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 48px;
        }

        .form-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          color: #1a1410;
          margin-bottom: 8px;
        }

        .form-subheading {
          font-size: 13px;
          color: #9a8878;
          margin-bottom: 44px;
        }

        .field-group { margin-bottom: 24px; }

        .field-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #6b5d52;
          margin-bottom: 10px;
          display: block;
        }

        .field-input {
          width: 100%;
          border: none;
          border-bottom: 1px solid #d8cfc7;
          padding: 10px 0;
          font-size: 15px;
          outline: none;
          background: transparent;
        }

        .field-input:focus { border-bottom-color: #b48250; }

        .error-msg {
          background: #fff0f0;
          border-left: 3px solid #c0392b;
          padding: 12px;
          margin-bottom: 24px;
          color: #c0392b;
          font-size: 13px;
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          background: #1a1410;
          color: #f5ece0;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-btn:hover { background: #2e2016; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-root">
        <div className="login-panel">
          <div className="panel-bg" />
          <div className="panel-lines" />
          <div className="panel-corner tl" />
          <div className="panel-corner br" />
          <div className="brand-block">
            <p className="brand-eyebrow">Admin Portal</p>
            <h1 className="brand-name">Elite<br />Wedding</h1>
            <div className="brand-divider" />
            <p className="brand-tagline">Crafting Timeless Moments</p>
          </div>
        </div>

        <div className="login-form-side">
          <h2 className="form-heading">Welcome back</h2>
          <p className="form-subheading">Sign in to your admin account</p>

          <form onSubmit={handleLogin}>
            {error && <div className="error-msg">{error}</div>}

            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                type="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                type="password"
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}