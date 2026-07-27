import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import "./ViewEvent.css";

function ViewEvent() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, attendeesRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/events/${id}/attendees`),
        ]);
        setEvent(eventRes.data);
        setAttendees(attendeesRes.data);
      } catch (err) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="view-event-page">
      <div className="view-event-header">
        <h1>{event.name}</h1>
        <Link to={`/events/${event.id}/edit`} className="btn-secondary">
          Edit
        </Link>
      </div>

      <div className="event-details">
        <p>
          <strong>Description:</strong> {event.description || "—"}
        </p>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Time:</strong> {event.time}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
      </div>

      <h2>Registered Attendees</h2>

      {attendees.length === 0 ? (
        <p>No attendees registered yet.</p>
      ) : (
        <table className="attendee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id}>
                <td>{attendee.name}</td>
                <td>{attendee.email}</td>
                <td>{attendee.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewEvent;
