import { NavLink, useNavigate } from "react-router-dom";
import { Calendar, Heart, LogOut, User } from "lucide-react";
import "./ClientNav.css";

function ClientNav() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("clientToken"));

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    navigate("/client/login");
  };

  return (
    <nav className="client-nav">
      <div className="client-nav-brand">
        <Calendar size={22} />
        <span>Eventify</span>
      </div>

      <div className="client-nav-links">
        <NavLink to="/client/events" className="client-nav-link">
          Browse Events
        </NavLink>
        {isLoggedIn && (
          <NavLink to="/client/my-interests" className="client-nav-link">
            <Heart size={16} /> My Interests
          </NavLink>
        )}
        {isLoggedIn && (
          <NavLink to="/client/profile" className="client-nav-link">
            <User size={16} /> Account
          </NavLink>
        )}
      </div>

      <div className="client-nav-actions">
        {isLoggedIn ? (
          <button className="client-nav-logout" onClick={handleLogout}>
            <LogOut size={16} /> Log Out
          </button>
        ) : (
          <>
            <NavLink to="/client/login" className="client-nav-btn-outline">
              Log In
            </NavLink>
            <NavLink to="/client/signup" className="client-nav-btn-filled">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default ClientNav;
