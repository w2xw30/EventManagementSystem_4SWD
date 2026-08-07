import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventList from "./pages/EventList";
import EventForm from "./pages/EventForm";
import ViewEvent from "./pages/ViewEvent";
import AttendeeList from "./pages/AttendeeList";
import AttendeeForm from "./pages/AttendeeForm";
import Profile from "./pages/Profile";
import ClientSignup from "./pages/client/ClientSignup";
import ClientLogin from "./pages/client/ClientLogin";
import ClientEventList from "./pages/client/ClientEventList";
import ClientEventDetail from "./pages/client/ClientEventDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/client/signup" element={<ClientSignup />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/events" element={<ClientEventList />} />
        <Route path="/client/events/:id" element={<ClientEventDetail />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/events" element={<EventList />} />
                  <Route path="/events/new" element={<EventForm />} />
                  <Route path="/events/:id/edit" element={<EventForm />} />
                  <Route path="/events/:id" element={<ViewEvent />} />
                  <Route path="/attendees" element={<AttendeeList />} />
                  <Route path="/attendees/new" element={<AttendeeForm />} />
                  <Route
                    path="/attendees/:id/edit"
                    element={<AttendeeForm />}
                  />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
