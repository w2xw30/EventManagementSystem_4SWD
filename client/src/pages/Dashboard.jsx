import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Dashboard.css";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, attendeesRes] = await Promise.all([
          api.get("/events"),
          api.get("/attendees"),
        ]);
        setEvents(eventsRes.data);
        setAttendees(attendeesRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingCount = events.filter((e) => new Date(e.date) >= today).length;

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{events.length}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{attendees.length}</span>
          <span className="stat-label">Total Attendees</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{upcomingCount}</span>
          <span className="stat-label">Upcoming Events</span>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Upcoming Events</h2>
          <Link to="/events" className="btn-view-all">
            View all →
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <ul className="upcoming-list">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <Link to={`/events/${event.id}`}>{event.name}</Link>
                <span className="upcoming-date">
                  {event.date} · {event.location}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
