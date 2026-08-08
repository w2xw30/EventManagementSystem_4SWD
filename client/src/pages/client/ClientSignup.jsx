import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import { clientAuthApi } from "../../api/clientAxios";
import "./ClientAuth.css";

function ClientSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await clientAuthApi.post("/signup", {
        name,
        email,
        phoneNumber,
        password,
      });
      localStorage.setItem("clientToken", response.data.token);
      navigate("/client/events");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-auth-page">
      <div className="client-auth-hero">
        <div className="client-auth-hero-content">
          <h1>Discover events worth showing up for</h1>
          <p>
            Sign up to browse events and let organizers know you're interested.
          </p>
        </div>
      </div>

      <div className="client-auth-form-side">
        <form className="client-auth-form" onSubmit={handleSubmit}>
          <h2>Create your account</h2>
          <p className="client-auth-subtext">It only takes a minute</p>

          {error && <p className="client-auth-error">{error}</p>}

          <label>Full Name</label>
          <div className="client-input-wrap">
            <User size={18} className="client-input-icon" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <label>Phone Number</label>
          <div className="client-input-wrap">
            <Phone size={18} className="client-input-icon" />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="client-btn-primary"
            disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="client-auth-switch">
            Already have an account? <Link to="/client/login">Log in</Link>
          </p>

          <p className="client-auth-switch">
            Are you an organizer? <Link to="/login">Admin login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ClientSignup;
