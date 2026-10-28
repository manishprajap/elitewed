"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // app/login/page.tsx — sirf handleSubmit ka success part change karo

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!form.email.trim() || !form.password) {
    setError("Please enter both email/mobile and password");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login_id: form.email.trim(),
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed. Please try again.");
      setLoading(false);
      return;
    }

    // ✅ FIX: full page reload instead of client-side navigation.
    // This remounts Header, so its useEffect re-fetches /api/users/me
    // with the fresh session cookie already set by the server.
    window.location.href = "/";
  } catch (err) {
    console.error("Login error:", err);
    setError("Something went wrong. Please try again.");
    setLoading(false);
  }
};

  return (
    <main className="login-page">
      <div className="login-container">
        {/* Left Panel */}
        <div className="login-left">
          <div className="left-content">
            <div className="brand">
              <span className="brand-heart">♡</span>
              <span className="brand-name">Elite<span>Wedding</span></span>
            </div>
            <h2 className="left-title">Welcome Back,<br />Your Journey Continues!</h2>
            <p className="left-sub">Your account is waiting for you. Log in and explore your latest matches today.</p>
            <div className="left-stats">
              <div className="l-stat"><span className="l-num">5L+</span><span className="l-lbl">Members</span></div>
              <div className="l-stat"><span className="l-num">50K+</span><span className="l-lbl">Marriages</span></div>
              <div className="l-stat"><span className="l-num">Daily</span><span className="l-lbl">New Matches</span></div>
            </div>
            <div className="left-deco">♡</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <form className="form-box" onSubmit={handleSubmit} noValidate>
            <h1 className="form-title">Welcome Back</h1>
            <p className="form-sub">Sign in to your account</p>

            {error && <div className="error-banner">{error}</div>}

            <div className="fields">
              <div className="field">
                <label>Email or Mobile Number</label>
                <input
                  name="email"
                  type="text"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com or 9876543210"
                  autoComplete="username"
                />
              </div>
              <div className="field">
                <label>Password</label>
                <div className="pass-wrap">
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div className="forgot-row">
                <Link href="#" className="forgot-link">Forgot your password?</Link>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>

            <div className="divider"><span>or</span></div>

            <button type="button" className="google-btn">
              <span className="g-icon">G</span> Continue with Google
            </button>

            <p className="register-prompt">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="register-link">Register Free!</Link>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-page { font-family: 'Lato', sans-serif; min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; background: #fff8f0; padding: 40px 16px; }
        .login-container { display: grid; grid-template-columns: 1fr 1fr; max-width: 960px; width: 100%; border-radius: 28px; overflow: hidden; box-shadow: 0 24px 80px rgba(44,24,16,0.15); }
        .login-left { background: linear-gradient(145deg, #2c1810, #7a2418); padding: 60px 40px; position: relative; overflow: hidden; display: flex; align-items: center; }
        .left-content { position: relative; z-index: 1; }
        .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 40px; }
        .brand-heart { font-size: 24px; color: #e74c3c; }
        .brand-name { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; color: #fff8f0; }
        .brand-name span { color: #e74c3c; }
        .left-title { font-family: 'Playfair Display', Georgia, serif; font-size: 30px; font-weight: 700; color: white; line-height: 1.3; margin-bottom: 16px; }
        .left-sub { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 40px; }
        .left-stats { display: flex; gap: 24px; }
        .l-stat { display: flex; flex-direction: column; gap: 2px; }
        .l-num { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: #e74c3c; }
        .l-lbl { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .left-deco { position: absolute; right: -30px; bottom: -40px; font-size: 200px; color: rgba(255,255,255,0.04); line-height: 1; }
        .login-right { background: white; padding: 60px 48px; display: flex; align-items: center; }
        .form-box { width: 100%; }
        .form-title { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #2c1810; margin-bottom: 6px; }
        .form-sub { font-size: 14px; color: #7a5a50; margin-bottom: 32px; }
        .error-banner { background: #fdecea; border: 1.5px solid #f5c6cb; color: #c0392b; font-size: 13px; font-weight: 600; padding: 10px 14px; border-radius: 10px; margin-bottom: 18px; }
        .fields { display: flex; flex-direction: column; gap: 18px; margin-bottom: 8px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 13px; font-weight: 600; color: #5a3e36; }
        .field input { padding: 13px 16px; border: 1.5px solid #f0d9c8; border-radius: 12px; font-family: 'Lato', sans-serif; font-size: 14px; color: #2c1810; background: #fff8f0; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .field input:focus { border-color: #c0392b; background: white; }
        .pass-wrap { position: relative; }
        .pass-wrap input { padding-right: 48px; width: 100%; box-sizing: border-box; }
        .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 18px; padding: 0; }
        .forgot-row { text-align: right; }
        .forgot-link { font-size: 13px; color: #c0392b; text-decoration: none; font-weight: 600; }
        .forgot-link:hover { text-decoration: underline; }
        .login-btn { width: 100%; padding: 14px; margin-top: 24px; border: none; border-radius: 50px; background: linear-gradient(135deg, #c0392b, #e74c3c); color: white; font-family: 'Lato', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 20px rgba(192,57,43,0.35); transition: all 0.25s; }
        .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(192,57,43,0.45); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .divider { text-align: center; position: relative; margin: 24px 0; color: #c4a898; font-size: 13px; }
        .divider::before, .divider::after { content: ''; position: absolute; top: 50%; width: 43%; height: 1px; background: #f0d9c8; }
        .divider::before { left: 0; }
        .divider::after { right: 0; }
        .google-btn { width: 100%; padding: 13px; border: 1.5px solid #f0d9c8; border-radius: 50px; background: white; font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 600; color: #5a3e36; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.25s; }
        .google-btn:hover { border-color: #c0392b; background: #fff8f0; }
        .g-icon { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #ea4335, #fbbc05, #34a853, #4285f4); color: white; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .register-prompt { text-align: center; font-size: 14px; color: #7a5a50; margin-top: 24px; }
        .register-link { color: #c0392b; font-weight: 700; text-decoration: none; }
        .register-link:hover { text-decoration: underline; }
        @media (max-width: 720px) { .login-container { grid-template-columns: 1fr; } .login-left { display: none; } .login-right { padding: 40px 28px; } }
      `}</style>
    </main>
  );
}