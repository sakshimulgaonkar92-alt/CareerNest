import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import './Auth.css';

const RESEND_COOLDOWN = 30; // seconds

export default function Signup({ onSignup, onNavigateLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Step 2: OTP verification (email preferred, falls back to mobile if no email... email is required though)
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [pendingIdentifier, setPendingIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function startResendCooldown() {
    setResendIn(RESEND_COOLDOWN);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendIn((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // Step 1: create the account, then kick off OTP verification for the email on file
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

    if (password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      // Register the account. The backend already logs the user in (returns a token),
      // but we hold off on committing that session until the OTP step confirms the
      // email/mobile, matching the "OTP verification" requirement end-to-end.
      await api.post('/auth/register', { name, email, mobile: mobile || undefined, password, role });

      const identifier = email; // verify via email; mobile can be added as a second factor later
      setPendingIdentifier(identifier);

      const otpRes = await api.post('/auth/otp', { identifier, purpose: 'signup' });
      setSubmitting(false);
      setStep('otp');
      startResendCooldown();
      setFeedback({
        type: 'success',
        message: otpRes.data?.devCode
          ? `Account created. Dev code: ${otpRes.data.devCode}` // only present outside production
          : 'Account created. Enter the code sent to your email to verify.',
      });
    } catch (err) {
      setSubmitting(false);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Signup failed. Try again.',
      });
    }
  }

  async function handleResendOtp() {
    if (resendIn > 0 || submitting) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const otpRes = await api.post('/auth/otp', { identifier: pendingIdentifier, purpose: 'signup' });
      startResendCooldown();
      setSubmitting(false);
      setFeedback({
        type: 'success',
        message: otpRes.data?.devCode ? `Dev code: ${otpRes.data.devCode}` : 'A new code was sent.',
      });
    } catch (err) {
      setSubmitting(false);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Could not resend code. Try again.',
      });
    }
  }

  // Step 2: verify the OTP, receive the real session token, and commit login
  async function handleVerify(e) {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setFeedback({ type: 'error', message: 'Enter the 6-digit code.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await api.post('/auth/verify', {
        identifier: pendingIdentifier,
        code: otp,
        purpose: 'signup',
      });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSubmitting(false);
      setFeedback({ type: 'success', message: 'Account verified successfully.' });
      onSignup?.(user);
    } catch (err) {
      setSubmitting(false);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Verification failed. Try again.',
      });
    }
  }

  function backToForm() {
    setStep('form');
    setOtp('');
    setFeedback(null);
    clearInterval(timerRef.current);
    setResendIn(0);
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
          <span className="lp-brand-name">CareerNest</span>
        </div>

        {step === 'form' ? (
          <>
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  type="tel"
                  placeholder="Mobile number (optional, for OTP login)"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  autoComplete="tel"
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
          </>
        ) : (
          <>
            {/* Step 2: OTP verification */}
            <h1 className="lp-h1">Verify your email</h1>
            <p className="lp-sub">
              We sent a 6-digit code to <strong>{pendingIdentifier}</strong>
            </p>

            {feedback && (
              <div className="lp-feedback" data-type={feedback.type}>
                {feedback.message}
              </div>
            )}

            <form className="lp-form" onSubmit={handleVerify}>
              <div className="lp-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  style={{ letterSpacing: '4px', fontWeight: 600 }}
                />
              </div>

              <button type="submit" className="lp-btn-primary" disabled={submitting}>
                {submitting ? 'Verifying…' : 'Verify & continue'}
              </button>
            </form>

            <div className="lp-otp-actions">
              <button
                type="button"
                className="lp-forgot"
                onClick={handleResendOtp}
                disabled={resendIn > 0 || submitting}
              >
                {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
              </button>
              <button type="button" className="lp-forgot" onClick={backToForm}>
                Edit details
              </button>
            </div>

            <button className="lp-switch" onClick={onNavigateLogin}>
              Already verified? <strong>Sign in</strong>
            </button>
          </>
        )}
      </div>
    </div>
  );
}