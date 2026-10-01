import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Login failed. Please check your credentials."
        );
      }

      // Store login session
      sessionStorage.setItem(
        "access_token",
        data.access_token
      );

      // Store logged-in user information
      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Update navbar login state
      setIsLoggedIn(true);

      setUsername("");
      setPassword("");

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-icon">
            ₹
          </div>

          <h1>Welcome Back</h1>

          <p>
            Login to manage your expenses with
            Smart Expense Tracker.
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          <div className="form-group">

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-footer">

          Don't have an account?

          <span
            onClick={() =>
              navigate("/register")
            }
          >
            Create Account
          </span>

        </p>

      </div>

    </div>
  );
}

export default Login;