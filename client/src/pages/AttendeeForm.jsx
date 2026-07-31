import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./AttendeeForm.css";
import { useToast } from "../context/ToastContext";

function AttendeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchAttendee = async () => {
        try {
          const response = await api.get(`/attendees/${id}`);
          setFormData(response.data);
        } catch (err) {
          setError("Failed to load attendee");
        } finally {
          setLoading(false);
        }
      };
      fetchAttendee();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isEditing) {
        await api.put(`/attendees/${id}`, formData);
      } else {
        await api.post("/attendees", formData);
      }
      navigate("/attendees");
      showToast(isEditing ? "Attendee updated!" : "Attendee created!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save attendee");
      showToast("Failed to save attendee", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="attendee-form-page">
      <h1>{isEditing ? "Edit Attendee" : "Add Attendee"}</h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="attendee-form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-primary">
          {isEditing ? "Save Changes" : "Create Attendee"}
        </button>
      </form>
    </div>
  );
}

export default AttendeeForm;
