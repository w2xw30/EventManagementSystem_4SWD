import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";
import "./EventList.css";

function EventList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

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

  const confirmDelete = async () => {
    try {
      await api.delete(`/events/${deleteTarget}`);
      setDeleteTarget(null);
      fetchEvents();
      showToast("Event deleted");
    } catch (err) {
      setError("Failed to delete event");
      showToast("Failed to delete event", "error");
    }
  };

  const getEventStatus = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(eventDate);
    return eventDay >= today ? "Upcoming" : "Past";
  };

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "date-desc":
        return new Date(b.date) - new Date(a.date);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="event-list-page">
      <div className="event-list-header">
        <h1>Events</h1>
        <Link to="/events/new" className="btn-primary">
          + Add Event
        </Link>
      </div>

      <div className="filters-row">
        <input
          type="text"
          placeholder="Search events by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select">
          <option value="date-asc">Date (Soonest first)</option>
          <option value="date-desc">Date (Latest first)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading &&
        !error &&
        (sortedEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="event-grid">
            {sortedEvents.map((event) => (
              <div key={event.id} className="event-card">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
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
                      onClick={() => setDeleteTarget(event.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Event"
        message="Are you sure you want to delete this event? This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default EventList;
