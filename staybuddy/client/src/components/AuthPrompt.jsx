import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthPrompt = () => {
  const [activeTab, setActiveTab] = useState("welcome");

  if (activeTab === "login") {
    return <LoginForm />;
  }

  if (activeTab === "signup") {
    return <SignupForm />;
  }

  return (
    <div className="auth-landing">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <h1 className="auth-hero-title">🏠 Welcome to StayBuddy</h1>
          <p className="auth-hero-subtitle">
            Discover amazing places to stay around Kenya and host your own space
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">🏖️</div>
              <h3>Beautiful Destinations</h3>
              <p>From Diani Beach to Mount Kenya, find the perfect getaway</p>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">💰</div>
              <h3>Affordable Prices</h3>
              <p>Great stays at competitive prices in Kenyan Shillings</p>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">📸</div>
              <h3>Host Your Space</h3>
              <p>Upload photos and earn money by hosting travelers</p>
            </div>
          </div>

          <div className="auth-actions">
            <h2 className="auth-prompt-title">Get Started Today</h2>
            <p className="auth-prompt-subtitle">
              Join our community of travelers and hosts
            </p>

            <div className="auth-buttons">
              <button
                onClick={() => setActiveTab("signup")}
                className="btn btn-primary btn-large auth-signup-btn"
              >
                Sign Up Free
              </button>

              <button
                onClick={() => setActiveTab("login")}
                className="btn btn-secondary btn-large auth-login-btn"
              >
                Log In
              </button>
            </div>

            <div className="auth-demo-info">
              <p className="auth-demo-text">
                <strong>🧪 Want to try it first?</strong>
                <br />
                Use demo credentials: <code>demo@example.com</code> /{" "}
                <code>password123</code>
              </p>
              <button
                onClick={() => setActiveTab("login")}
                className="auth-demo-link"
              >
                Try Demo Account →
              </button>
            </div>
          </div>
        </div>

        <div className="auth-hero-image">
          <div className="auth-image-placeholder">
            <div className="auth-image-icon">🏡</div>
            <p>Your next adventure awaits</p>
          </div>
        </div>
      </div>

      <div className="auth-footer">
        <div className="auth-footer-content">
          <div className="auth-stats">
            <div className="auth-stat">
              <div className="auth-stat-number">1000+</div>
              <div className="auth-stat-label">Happy Travelers</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-number">500+</div>
              <div className="auth-stat-label">Amazing Stays</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-number">50+</div>
              <div className="auth-stat-label">Kenyan Cities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
