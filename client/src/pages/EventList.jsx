import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./EventList.css";

function EventList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getEventStatus = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(eventDate);
    return eventDay >= today ? "Upcoming" : "Past";
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events", {
        params: search ? { search } : {},
      });
      setEvents(response.data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  return (
    <div className="event-list-page">
      <div className="event-list-header">
        <h1>Events</h1>
        <Link to="/events/new" className="btn-primary">
          + Add Event
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search events by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {loading && <p>Loading events...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading &&
        !error &&
        (events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                {/* Show the uploaded image, or a plain placeholder block if there isn't one */}
                {event.imageUrl ? (
                  <img
                    src={`http://localhost:3000${event.imageUrl}`}
                    alt={event.name}
                    className="event-card-image"
                  />
                ) : (
                  <div className="event-card-placeholder">No Image</div>
                )}

                <div className="event-card-body">
                  <div className="event-card-top">
                    <h3 className="event-card-title">{event.name}</h3>
                    <span
                      className={`status-badge ${getEventStatus(event.date) === "Upcoming" ? "upcoming" : "past"}`}>
                      {getEventStatus(event.date)}
                    </span>
                  </div>
                  <p className="event-card-meta">
                    {event.date} · {event.location}
                  </p>

                  <div className="event-card-actions">
                    <Link to={`/events/${event.id}`} className="btn-view">
                      View
                    </Link>
                    <Link to={`/events/${event.id}/edit`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(event.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default EventList;
