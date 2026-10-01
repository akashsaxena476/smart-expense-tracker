import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-badge">
            ⚡ Track&nbsp; • &nbsp;Manage&nbsp; • &nbsp;Save
          </span>

          <h1>
            Take Control of Your
            <span> Expenses</span>
          </h1>

          <p>
            Smart Expense Tracker helps you manage your money better.
            Track your spending, manage your expenses, and stay in control
            of your finances — all in one place.
          </p>

          <div className="hero-buttons">

            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

            <button
              className="btn-outline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

          </div>

          <div className="hero-features">

            <div className="hero-feature">
              <div className="feature-icon green">✓</div>

              <div>
                <h3>Secure</h3>
                <p>Your data is safe with us</p>
              </div>
            </div>

            <div className="hero-feature">
              <div className="feature-icon purple">▮</div>

              <div>
                <h3>Easy to Use</h3>
                <p>Simple and clean interface</p>
              </div>
            </div>

            <div className="hero-feature">
              <div className="feature-icon blue">⚡</div>

              <div>
                <h3>Track Anywhere</h3>
                <p>Access from any device</p>
              </div>
            </div>

          </div>
        </div>

        <div className="hero-illustration">

          <div className="illustration-glow"></div>

          <div className="phone-card">

            <div className="phone-header">
              <span>Expenses</span>
              <span>⌕</span>
            </div>

            <div className="total-card">
              <small>Total Expenses</small>
              <strong>₹12,500</strong>
              <span>↗ 12%</span>
            </div>

            <div className="expense-row">
              <span className="category-icon food">🍴</span>
              <span>Food</span>
              <strong>₹2,500</strong>
            </div>

            <div className="expense-row">
              <span className="category-icon transport">🚗</span>
              <span>Transport</span>
              <strong>₹1,200</strong>
            </div>

            <div className="expense-row">
              <span className="category-icon shopping">🛍</span>
              <span>Shopping</span>
              <strong>₹3,800</strong>
            </div>

            <div className="expense-row">
              <span className="category-icon bills">▣</span>
              <span>Bills</span>
              <strong>₹2,300</strong>
            </div>

            <div className="mini-chart">
              <small>Monthly Overview</small>

              <div className="bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

          </div>

          <div className="wallet">
            <div className="money"></div>
            <div className="money second"></div>
          </div>

          <div className="coins">
            <span>₹</span>
            <span>₹</span>
            <span>₹</span>
          </div>

          <div className="growth-card">
            <div className="growth-line"></div>

            <div className="growth-bars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="plant">🌿</div>

        </div>

      </section>
    </main>
  );
}

export default Home;