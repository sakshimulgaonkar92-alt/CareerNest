import { useState } from 'react';
import api from '../api/axios';
import './Auth.css';

export default function Signup({ onSignup, onNavigateLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setFeedback({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSubmitting(false);
      setFeedback({ type: 'success', message: 'Account created successfully.' });
      onSignup?.(user);
    } catch (err) {
      setSubmitting(false);
     setFeedback({
        type: 'error',
        message: err.response?.data?.error || 'Signup failed. Try again.',
      });
    }
  }

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
          <span className="lp-brand-name">MyProject</span>
        </div>

        {/* Heading */}
        <h1 className="lp-h1">Create Account</h1>
        <p className="lp-sub">Create an account so you can explore all the existing jobs</p>

        {/* Feedback */}
        {feedback && (
          <div className="lp-feedback" data-type={feedback.type}>
            {feedback.message}
          </div>
        )}

        <form className="lp-form" onSubmit={handleSubmit}>
          <div className="lp-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="lp-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 6 12 13 2 6" />
              <path d="M2 6h20v12H2z" />
            </svg>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="lp-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="lp-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="lp-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="experienced">Experienced vetern</option>
            </select>
          </div>

          <button type="submit" className="lp-btn-primary" disabled={submitting} style={{ marginTop: 4 }}>
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="lp-divider">Or continue with</p>

        <button className="lp-switch" onClick={onNavigateLogin}>
          Already have an account? <strong>Sign in</strong>
        </button>
      </div>
    </div>
  );
}