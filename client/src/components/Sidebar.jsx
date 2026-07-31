import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import ConfirmModal from "./ConfirmModal";
import "./Sidebar.css";
import { useToast } from "../context/ToastContext";

function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { showToast } = useToast();
  const confirmLogout = () => {
    logout();
    navigate("/login");
    showToast("Logged out");
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

      <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
        Logout
      </button>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}

export default Sidebar;
