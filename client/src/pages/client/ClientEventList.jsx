import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar } from "lucide-react";
import clientApi from "../../api/clientAxios";
import ClientLayout from "../../components/client/ClientLayout";
import "./ClientEvents.css";

function ClientEventList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await clientApi.get("/events", {
          params: search ? { search } : {},
        });
        setEvents(response.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [search]);

  return (
    <ClientLayout>
      <div className="client-hero-banner">
        <h1>Find your next great event</h1>
        <p>
          Browse what's happening and let organizers know you're interested.
        </p>

        <div className="client-search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="client-loading-text">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="client-loading-text">No events found.</p>
      ) : (
        <div className="client-event-grid">
          {events.map((event) => (
            <Link
              to={`/client/events/${event.id}`}
              key={event.id}
              className="client-event-card">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="client-event-image"
                />
              ) : (
                <div className="client-event-image-placeholder">
                  <Calendar size={28} />
                </div>
              )}
              <div className="client-event-card-body">
                <h3>{event.name}</h3>
                <div className="client-event-meta">
                  <span>
                    <Calendar size={13} /> {event.date}
                  </span>
                  <span>
                    <MapPin size={13} /> {event.location}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}

export default ClientEventList;
