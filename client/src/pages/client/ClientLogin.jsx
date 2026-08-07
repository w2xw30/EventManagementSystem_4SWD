import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { clientAuthApi } from "../../api/clientAxios";
import "./ClientAuth.css";

function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await clientAuthApi.post("/login", { email, password });
      localStorage.setItem("clientToken", response.data.token);
      navigate("/client/events");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-auth-page">
      <div className="client-auth-hero">
        <div className="client-auth-hero-content">
          <h1>Welcome back</h1>
          <p>Log in to see your event interests and discover what's new.</p>
        </div>
      </div>

      <div className="client-auth-form-side">
        <form className="client-auth-form" onSubmit={handleSubmit}>
          <h2>Log in</h2>
          <p className="client-auth-subtext">Glad to see you again</p>

          {error && <p className="client-auth-error">{error}</p>}

          <label>Email</label>
          <div className="client-input-wrap">
            <Mail size={18} className="client-input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="client-input-wrap">
            <Lock size={18} className="client-input-icon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="client-btn-primary"
            disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="client-auth-switch">
            Don't have an account? <Link to="/client/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ClientLogin;
