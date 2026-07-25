import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
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
    </div>
  );
}

export default Sidebar;
