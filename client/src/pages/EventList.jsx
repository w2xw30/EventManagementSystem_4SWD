import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./EventList.css";

function EventList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchEvents();
  }, [search]);

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

      {!loading && !error && (
        <table className="event-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="4">No events found.</td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/events/${event.id}`} className="btn-view">
                        View
                      </Link>
                      <Link
                        to={`/events/${event.id}/edit`}
                        className="btn-edit">
                        Edit
                      </Link>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(event.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EventList;
