import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import BookAppointment from "./Components/BookAppointment";
import BookAppointmentDetail from "./Components/BookAppointmentDetail"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointment-detail" element={<BookAppointmentDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

