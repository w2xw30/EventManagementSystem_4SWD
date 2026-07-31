import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./EventForm.css";
import { useToast } from "../context/ToastContext";

function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const { showToast } = useToast();

  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          const response = await api.get(`/events/${id}`);
          setFormData(response.data);
          if (response.data.imageUrl) {
            setImagePreview(`http://localhost:3000${response.data.imageUrl}`);
          }
        } catch (err) {
          setError("Failed to load event");
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description || "");
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("location", formData.location);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (isEditing) {
        await api.put(`/events/${id}`, data);
      } else {
        await api.post("/events", data);
      }
      navigate("/events");
      showToast(isEditing ? "Event updated!" : "Event created!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save event");
      showToast("Failed to save event", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="event-form-page">
      <h1>{isEditing ? "Edit Event" : "Add Event"}</h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="event-form">
        <label>Event Image</label>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="image-preview" />
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <label>Event Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="4"
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Time</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-primary">
          {isEditing ? "Save Changes" : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default EventForm;
