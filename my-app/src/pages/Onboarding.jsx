import './Auth.css';

export default function Onboarding({ onLogin, onRegister }) {
  return (
    <div className="lp-root">
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />

      <div className="lp-card">
        {/* Brand */}
        <div className="lp-brand">
          <div className="lp-brand-icon">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="#fff">
              <path d="M10 2L3 6v7l5 3 7-3.5L3 8.5V15l7 3.5 5-3V4z" />
            </svg>
          </div>
          <span className="lp-brand-name">CareerNest</span>
        </div>

        {/* Illustration */}
        <div className="lp-illustration">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#E8890C" strokeWidth="1.5">
            <path d="M20 7h-3V6a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v1H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM9 6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9V6Z" />
          </svg>
        </div>

        <h1 className="lp-h1">Discover Your<br />Dream Job Here</h1>
        <p className="lp-sub">
          Explore all the existing job roles based on your interest and study major
        </p>

        <div className="lp-actions">
          <button className="lp-btn-primary" onClick={onLogin}>
            Login
          </button>
          <button className="lp-btn-outline" onClick={onRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}