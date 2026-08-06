import { useState } from "react";
import {
  GraduationCap,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";
import "./Login.css";

const ROLES = [
  {
    key: "student",
    label: "Student",
    icon: GraduationCap,
    idLabel: "Student ID / email",
    idPlaceholder: "you@university.edu",
    cta: "Enter as student",
  },
  {
    key: "company",
    label: "Company",
    icon: Building2,
    idLabel: "Company Email",
    idPlaceholder: "recruiter@company.com",
    cta: "Enter as staff",
  },
  {
    key: "Vetern",
    label: "Vetern",
    icon: Briefcase,
    idLabel: "Staff ID / email",
    idPlaceholder: "staff.id@CareerNest.in",
    cta: "Enter as Vetern",
  },
];

export default function Login({ onLogin, onNavigate }) {
  const [active, setActive] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const role = ROLES.find((r) => r.key === active);
  const Icon = role.icon;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setFeedback({
        type: "error",
        message: "Please fill in both fields.",
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSubmitting(false);
      setFeedback({
        type: "success",
        message: "Signed in successfully.",
      });

      onLogin?.(user);
    } catch (err) {
      setSubmitting(false);
      setFeedback({
        type: "error",
        message:
          err.response?.data?.error || "Login failed. Try again.",
      });
    }
  }

  return (
    <div className="lp-page">
      <div className="lp-wrap">
        <div className="lp-wordmark-row">
          <div className="lp-logo-circle">
            <span className="lp-logo-letter">CN</span>
          </div>
          <p className="lp-wordmark">CareerNest</p>
        </div>

        <div className="lp-lanyard-row">
          <div className="lp-lanyard">
            <div className="lp-lanyard-hole" />
          </div>
        </div>

        <div className="lp-card">
          <div className="lp-tabs-row">
            {ROLES.map((r) => {
              const RIcon = r.icon;
              const isActive = r.key === active;

              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => {
                    setActive(r.key);
                    setFeedback(null);
                  }}
                  className={`lp-tab-button${isActive ? " active" : ""}`}
                >
                  <RIcon size={15} strokeWidth={2} />
                  {r.label}
                </button>
              );
            })}
          </div>

          <div className="lp-card-body">
            <div className="lp-heading-row">
              <div className="lp-seal">
                <Icon
                  size={18}
                  color="#C9A227"
                  strokeWidth={2}
                />
              </div>

              <div>
                <p className="lp-heading-title">Sign in</p>
                <p className="lp-heading-subtitle">
                  Access your {role.label.toLowerCase()} dashboard
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="lp-field-group">
                <label className="lp-label">
                  {role.idLabel}
                </label>

                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role.idPlaceholder}
                  className="lp-input"
                />
              </div>

              <div className="lp-field-group">
                <div className="lp-label-row">
                  <label className="lp-label">
                    Password
                  </label>

                  <a href="#" className="lp-forgot-link">
                    Forgot password?
                  </a>
                </div>

                <div className="lp-password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="lp-input lp-input-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="lp-eye-button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {feedback && (
                <div className={`lp-feedback ${feedback.type}`}>
                  {feedback.message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="lp-submit-button"
              >
                {submitting
                  ? "Signing in..."
                  : role.cta}

                {!submitting && (
                  <ArrowRight size={15} />
                )}
              </button>
            </form>

            <div className="lp-footer">
              New to CareerNest?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.("signup");
                }}
                className="lp-footer-link"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>

        <p className="lp-helper-text">
          Choosing the wrong tab? Switch above — each role sees a
          different dashboard after sign in.
        </p>
      </div>
    </div>
  );
}