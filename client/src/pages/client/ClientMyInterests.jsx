import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Hourglass,
} from "lucide-react";
import clientApi from "../../api/clientAxios";
import ClientLayout from "../../components/client/ClientLayout";
import "./ClientEvents.css";

function ClientMyInterests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await clientApi.get("/my-interests");
        setInterests(response.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  const statusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="interest-status approved">
          <CheckCircle size={14} /> Approved
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="interest-status rejected">
          <XCircle size={14} /> Not Approved
        </span>
      );
    }
    return (
      <span className="interest-status pending">
        <Hourglass size={14} /> Pending Review
      </span>
    );
  };

  return (
    <ClientLayout>
      <div className="client-hero-banner" style={{ paddingTop: "20px" }}>
        <h1>My Interests</h1>
        <p>Track the events you've shown interest in.</p>
      </div>

      {loading ? (
        <p className="client-loading-text">Loading...</p>
      ) : interests.length === 0 ? (
        <div className="client-empty-state">
          <p>You haven't expressed interest in any events yet.</p>
          <Link
            to="/client/events"
            className="client-btn-primary"
            style={{
              display: "inline-block",
              textDecoration: "none",
              marginTop: "12px",
            }}>
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="client-interest-list">
          {interests.map((interest) => (
            <Link
              to={`/client/events/${interest.eventId}`}
              key={interest.id}
              className="client-interest-row">
              {interest.imageUrl ? (
                <img
                  src={interest.imageUrl}
                  alt={interest.name}
                  className="client-interest-thumb"
                />
              ) : (
                <div className="client-interest-thumb-placeholder">
                  <Calendar size={20} />
                </div>
              )}

              <div className="client-interest-info">
                <h3>{interest.name}</h3>
                <div className="client-event-meta">
                  <span>
                    <Calendar size={13} /> {interest.date}
                  </span>
                  <span>
                    <Clock size={13} /> {interest.time}
                  </span>
                  <span>
                    <MapPin size={13} /> {interest.location}
                  </span>
                </div>
              </div>

              {statusBadge(interest.status)}
            </Link>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}

export default ClientMyInterests;
