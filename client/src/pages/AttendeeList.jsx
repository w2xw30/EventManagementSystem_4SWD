import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./AttendeeList.css";

function AttendeeList() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/attendees");
      setAttendees(response.data);
    } catch (err) {
      setError("Failed to load attendees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attendee?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/attendees/${id}`);
      fetchAttendees();
    } catch (err) {
      setError("Failed to delete attendee");
    }
  };

  return (
    <div className="attendee-list-page">
      <div className="attendee-list-header">
        <h1>Attendees</h1>
        <Link to="/attendees/new" className="btn-primary">
          + Add Attendee
        </Link>
      </div>

      {loading && <p>Loading attendees...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <table className="attendee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length === 0 ? (
              <tr>
                <td colSpan="4">No attendees found.</td>
              </tr>
            ) : (
              attendees.map((attendee) => (
                <tr key={attendee.id}>
                  <td>{attendee.name}</td>
                  <td>{attendee.email}</td>
                  <td>{attendee.phoneNumber}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/attendees/${attendee.id}/edit`}
                        className="btn-edit">
                        Edit
                      </Link>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(attendee.id)}>
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

export default AttendeeList;
