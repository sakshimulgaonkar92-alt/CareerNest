const User = require("../models/User");
const JobSeeker = require("../models/JobSeeker");
const Employer = require("../models/Employer");
const Recruiter = require("../models/Recruiter");
const generateToken = require("../utils/generateToken");
const { generateOtp, verifyOtp } = require("../utils/otp");

// Public-facing role names (used by the frontend) mapped to internal role values
// (used everywhere else in the backend: permissions, models, etc.)
const ROLE_ALIASES = {
  student: "job_seeker",
  company: "employer",
  experienced: "recruiter",
};

// POST /api/auth/register
const signup = async (req, res, next) => {
  try {
    const { name, email, mobile, password, companyName, agencyName } = req.body;
    let { role } = req.body;

    // Translate public-facing role name to the internal role value, if needed
    if (role && ROLE_ALIASES[role]) {
      role = ROLE_ALIASES[role];
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password and role are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, mobile, password, role });

    // Create the role-specific profile document
    if (role === "job_seeker") {
      await JobSeeker.create({ userId: user._id });
    } else if (role === "employer") {
      await Employer.create({ userId: user._id, companyName: companyName || name });
    } else if (role === "recruiter") {
      await Recruiter.create({ userId: user._id, agencyName: agencyName || name });
    }

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/otp  { identifier: email or mobile }
const sendOtp = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: "identifier is required" });

    const code = generateOtp(identifier);

    // TODO: integrate real SMS/email gateway. Logging for local dev only.
    console.log(`OTP for ${identifier}: ${code}`);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/verify  { identifier, code }
const verify = async (req, res, next) => {
  try {
    const { identifier, code } = req.body;
    if (!identifier || !code) {
      return res.status(400).json({ message: "identifier and code are required" });
    }

    const result = verifyOtp(identifier, code);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    const user = await User.findOne({ $or: [{ email: identifier }, { mobile: identifier }] });
    if (!user) {
      return res.status(404).json({ message: "No account found for this identifier" });
    }

    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, sendOtp, verify };