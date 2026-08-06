// Simple in-memory OTP store for demo purposes.
// In production, replace with Redis (with TTL) so it works across server instances.
const otpStore = new Map(); // key: email/mobile, value: { code, expiresAt, attempts }

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3; // BR-08: max 3 attempts per 10 minutes
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;

const generateOtp = (identifier) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(identifier, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    windowStart: Date.now(),
  });
  return code;
};

const verifyOtp = (identifier, code) => {
  const record = otpStore.get(identifier);
  if (!record) return { success: false, message: "No OTP requested for this identifier" };

  // Reset attempt window if expired
  if (Date.now() - record.windowStart > ATTEMPT_WINDOW_MS) {
    record.attempts = 0;
    record.windowStart = Date.now();
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return { success: false, message: "Too many attempts. Try again later." };
  }

  record.attempts += 1;

  if (Date.now() > record.expiresAt) {
    otpStore.delete(identifier);
    return { success: false, message: "OTP expired" };
  }

  if (record.code !== code) {
    return { success: false, message: "Invalid OTP" };
  }

  otpStore.delete(identifier);
  return { success: true };
};

module.exports = { generateOtp, verifyOtp };
