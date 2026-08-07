import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Heart, CheckCircle } from "lucide-react";
import clientApi from "../../api/clientAxios";
import ClientLayout from "../../components/client/ClientLayout";
import "./ClientEvents.css";

function ClientEventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interested, setInterested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await clientApi.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleInterest = async () => {
    const isLoggedIn = Boolean(localStorage.getItem("clientToken"));
    if (!isLoggedIn) {
      navigate("/client/login");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await clientApi.post(`/events/${id}/interest`);
      setInterested(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <ClientLayout>
        <p className="client-loading-text">Loading...</p>
      </ClientLayout>
    );
  if (!event)
    return (
      <ClientLayout>
        <p className="client-loading-text">Event not found.</p>
      </ClientLayout>
    );

  return (
    <ClientLayout>
      <div className="client-detail-page">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="client-detail-image"
          />
        ) : (
          <div className="client-detail-image-placeholder">
            <Calendar size={40} />
          </div>
        )}

        <div className="client-detail-body">
          <h1>{event.name}</h1>

          <div className="client-detail-meta">
            <span>
              <Calendar size={16} /> {event.date}
            </span>
            <span>
              <Clock size={16} /> {event.time}
            </span>
            <span>
              <MapPin size={16} /> {event.location}
            </span>
          </div>

          <p className="client-detail-description">
            {event.description || "No description provided."}
          </p>

          {message && <p className="client-interest-message">{message}</p>}

          {interested ? (
            <div className="client-interest-confirmed">
              <CheckCircle size={18} /> You're interested! The organizer will
              review your request.
            </div>
          ) : (
            <button
              className="client-interest-btn"
              onClick={handleInterest}
              disabled={submitting}>
              <Heart size={16} />{" "}
              {submitting ? "Submitting..." : "I'm Interested"}
            </button>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

export default ClientEventDetail;
