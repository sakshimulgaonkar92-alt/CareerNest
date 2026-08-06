// Usage: router.post('/jobs', protect, authorize('employer', 'recruiter'), createJob)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // Admin retains full override control across all modules (BR-09)
    if (req.user.role === "admin") return next();

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role permissions" });
    }
    next();
  };
};

module.exports = { authorize };
