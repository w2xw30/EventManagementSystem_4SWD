import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Calendar } from "lucide-react";
import api from "../api/axios";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left panel — branding */}
      <div className="login-brand">
        <div className="login-brand-content">
          <Calendar size={40} strokeWidth={1.5} />
          <h1>Event Admin</h1>
          <p>Manage your events and attendees, all in one place.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-form-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="login-subtext">Sign in to manage your events</p>

          {error && <p className="login-error">{error}</p>}

          <label>Username</label>
          <div className="input-with-icon">
            <User size={18} className="input-icon" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <label>Password</label>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="login-switch">
            Looking for events?{" "}
            <Link to="/client/login">Go to client login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
