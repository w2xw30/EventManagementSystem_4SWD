import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import "./ViewEvent.css";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";

function ViewEvent() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [allAttendees, setAllAttendees] = useState([]);
  const [selectedAttendeeId, setSelectedAttendeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [unregisterTarget, setUnregisterTarget] = useState(null);
  const { showToast } = useToast();

  const confirmUnregister = async () => {
    try {
      await api.delete(`/events/${id}/attendees/${unregisterTarget}`);
      setUnregisterTarget(null);
      fetchData();
      showToast("Attendee unregistered");
    } catch (err) {
      setRegisterError("Failed to unregister attendee");
      showToast("Failed to unregister attendee", "error");
    }
  };

  const fetchData = async () => {
    try {
      const [eventRes, attendeesRes, allAttendeesRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/attendees`),
        api.get("/attendees"),
      ]);
      setEvent(eventRes.data);
      setAttendees(attendeesRes.data);
      setAllAttendees(allAttendeesRes.data);
    } catch (err) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    if (!selectedAttendeeId) return;

    try {
      await api.post(`/events/${id}/register`, {
        attendeeId: selectedAttendeeId,
      });
      setSelectedAttendeeId("");
      fetchData();
      showToast("Attendee registered!");
    } catch (err) {
      setRegisterError(
        err.response?.data?.error || "Failed to register attendee",
      );
      showToast("Failed to register attendee", "error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!event) return <p>Event not found.</p>;

  const registeredIds = attendees.map((a) => a.id);
  const availableAttendees = allAttendees.filter(
    (a) => !registeredIds.includes(a.id),
  );

  return (
    <div className="view-event-page">
      <div className="view-event-header">
        <h1>{event.name}</h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span
            className={`status-badge ${new Date(event.date) >= new Date().setHours(0, 0, 0, 0) ? "upcoming" : "past"}`}>
            {new Date(event.date) >= new Date().setHours(0, 0, 0, 0)
              ? "Upcoming"
              : "Past"}
          </span>
          <Link to={`/events/${event.id}/edit`} className="btn-secondary">
            Edit
          </Link>
        </div>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id}>
                <td>{attendee.name}</td>
                <td>{attendee.email}</td>
                <td>{attendee.phoneNumber}</td>
                <td>
                  <button
                    className="btn-unregister"
                    onClick={() => setUnregisterTarget(attendee.id)}>
                    Unregister
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Register an Attendee</h2>

      {registerError && <p className="error-text">{registerError}</p>}

      {availableAttendees.length === 0 ? (
        <p>All attendees are already registered to this event.</p>
      ) : (
        <form onSubmit={handleRegister} className="register-form">
          <select
            value={selectedAttendeeId}
            onChange={(e) => setSelectedAttendeeId(e.target.value)}
            required>
            <option value="">-- Select an attendee --</option>
            {availableAttendees.map((attendee) => (
              <option key={attendee.id} value={attendee.id}>
                {attendee.name} ({attendee.email})
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>
      )}

      <ConfirmModal
        isOpen={unregisterTarget !== null}
        title="Unregister Attendee"
        message="Remove this attendee from the event?"
        onConfirm={confirmUnregister}
        onCancel={() => setUnregisterTarget(null)}
      />
    </div>
  );
}

export default ViewEvent;
