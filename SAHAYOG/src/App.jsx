import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Dashboard from "./Dashboard";
import Layout from "./components/Layout";
import EditProfile from "./EditProfile";
import Login from "./Login";

/* TEMP SIMPLE PAGES (replace later) */
function Articles() {
    return <h1 style={pageStyle}>Articles</h1>;
}

function AboutUs() {
    return <h1 style={pageStyle}>About Us</h1>;
}

function Notifications() {
    return <h1 style={pageStyle}>Notifications</h1>;
}



/* SIDEBAR PAGES */
function BookAppointment() {
    return <h1 style={pageStyle}>Book Appointment</h1>;
}
function BookCabin() {
    return <h1 style={pageStyle}>Book Cabin / Bed</h1>;
}
function Reports() {
    return <h1 style={pageStyle}>Reports</h1>;
}
function Pharmacy() {
    return <h1 style={pageStyle}>Pharmacy</h1>;
}
function Transactions() {
    return <h1 style={pageStyle}>Transactions</h1>;
}
function Ratings() {
    return <h1 style={pageStyle}>Ratings</h1>;
}

function App() {
    return (
        <Router>
            <Routes>
                {/* HOME = DASHBOARD */}
                <Route path="/" element={<Layout><Dashboard /></Layout>} />
                <Route path="/home" element={<Layout><Dashboard /></Layout>} />

                {/* NAVBAR */}
                <Route path="/articles" element={<Layout><Articles /></Layout>} />
                <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
                <Route path="/notifications" element={<Layout><Notifications /></Layout>} />

                {/* PROFILE */}
                <Route path="/edit-profile" element={<Layout><EditProfile /></Layout>} />

                {/* SIDEBAR */}
                <Route path="/book-appointment" element={<Layout><BookAppointment /></Layout>} />
                <Route path="/book-cabin" element={<Layout><BookCabin /></Layout>} />
                <Route path="/reports" element={<Layout><Reports /></Layout>} />
                <Route path="/pharmacy" element={<Layout><Pharmacy /></Layout>} />
                <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
                <Route path="/ratings" element={<Layout><Ratings /></Layout>} />

                {/* AUTH */}
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

const pageStyle = {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "32px",
    fontWeight: "600",
};

export default App;
