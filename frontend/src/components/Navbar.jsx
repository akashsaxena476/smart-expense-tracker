import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");

    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogoClick = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");

    setIsLoggedIn(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link
          to="/"
          className="logo"
          onClick={handleLogoClick}
        >
          <div className="logo-icon">₹</div>

          <span>
            Smart <strong>Expense Tracker</strong>
          </span>
        </Link>

        {/* Navigation */}
        <div className="nav-links">

          {!isLoggedIn && (
            <NavLink
              to="/"
              className={navLinkClass}
            >
              Home
            </NavLink>
          )}

          {isLoggedIn && (
            <>
              <NavLink
                to="/dashboard"
                className={navLinkClass}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/expenses"
                className={navLinkClass}
              >
                Expenses
              </NavLink>

              <NavLink
                to="/monthly-summary"
                className={navLinkClass}
              >
                Summary
              </NavLink>

              <NavLink
                to="/date-range"
                className={navLinkClass}
              >
                Date Range
              </NavLink>
            </>
          )}

          <NavLink
            to="/about"
            className={navLinkClass}
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={navLinkClass}
          >
            Contact
          </NavLink>

        </div>

        {/* Actions */}
        <div className="nav-actions">

          {!isLoggedIn ? (
            <>
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="btn-outline"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              className="btn-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;