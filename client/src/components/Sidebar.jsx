import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Event Admin</h2>

      <nav className="sidebar-nav">
        <NavLink to="/events" className="sidebar-link">
          Events
        </NavLink>
        <NavLink to="/attendees" className="sidebar-link">
          Attendees
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
