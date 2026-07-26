import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import EventList from "./pages/EventList";
import AttendeeList from "./pages/AttendeeList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/events" />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/attendees" element={<AttendeeList />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
