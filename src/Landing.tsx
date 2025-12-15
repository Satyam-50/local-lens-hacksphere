import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🔥</span>
            <span>Your Voice. Your Community.</span>
          </div>
          
          <h1 className="hero-title">
            Share Local Stories That <span className="gradient-text">Matter</span>
          </h1>
          
          <p className="hero-description">
            LocalLens empowers citizens to report, share, and engage with hyperlocal news.
            Be the voice your community needs.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Get Started Free
              <span className="btn-icon">→</span>
            </button>
            <button className="btn-secondary" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Stories Shared</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div className="stat-number">200+</div>
              <div className="stat-label">Communities</div>
            </div>
          </div>
        </div>

        {/* GIF Section */}
        <div className="hero-visual">
          <div className="gif-container">
            <img 
              src="https://i.redd.it/yalde3fr53wf1.gif" 
              alt="Celebration Animation" 
              className="hero-gif"
            />
            <div className="gif-glow"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose LocalLens?</h2>
          <p className="section-subtitle">
            Everything you need to be a citizen journalist
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3 className="feature-title">Easy Publishing</h3>
            <p className="feature-description">
              Share your stories in seconds. No technical knowledge required.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3 className="feature-title">Hyperlocal Focus</h3>
            <p className="feature-description">
              Connect with your immediate community. Your neighborhood, your news.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Real Engagement</h3>
            <p className="feature-description">
              Like, comment, and discuss stories that matter to you.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Safe & Secure</h3>
            <p className="feature-description">
              Your data is protected. Share with confidence and peace of mind.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Mobile Ready</h3>
            <p className="feature-description">
              Report news on the go. Works perfectly on any device.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Real-Time Updates</h3>
            <p className="feature-description">
              Stay informed with instant notifications about local happenings.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Make an Impact?</h2>
          <p className="cta-description">
            Join thousands of citizen journalists sharing stories that mainstream media misses.
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate("/signup")}>
              Start Sharing Today
            </button>
            <button className="btn-cta-secondary" onClick={() => navigate("/login")}>
              I Have an Account
            </button>
          </div>
        </div>
        <div className="cta-decorations">
          <div className="cta-circle"></div>
          <div className="cta-circle"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">LocalLens</h3>
            <p className="footer-tagline">Hyperlocal Citizen Journalism</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#demo">Demo</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#blog">Blog</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact</a>
              <a href="#terms">Terms</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 LocalLens. Built with ❤️ for HackSphere</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;