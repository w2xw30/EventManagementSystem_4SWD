import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import EventList from "./pages/EventList";
import AttendeeList from "./pages/AttendeeList";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/events" />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/attendees" element={<AttendeeList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
