import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import BackgroundImg from './assets/Background.jpg';
import { handleButtonClick } from "./utils/buttonAnimation";

import EmergencyMap from "./components/EmergencyMap";

function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [location, setLocation] = useState(null);

    // User information (in a real app, this would come from context/state management)
    const userInfo = {
        name: "Riya Adhikari",
        email: "riya.adhikari@example.com",
        phone: "9841234567",
    };

    const handleRequestAmbulance = (e) => {
        e.preventDefault();
        handleButtonClick(e);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitRequest = (e) => {
        e.preventDefault();
        // Handle ambulance request submission here
        alert("Ambulance request submitted successfully!");
        setIsModalOpen(false);
    };

    const formatLocation = () => {
        if (!location) return "Getting location...";
        return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
    };

    return (
        <>
            {/* MAIN CONTENT */}
            <main style={mainStyle}>
                <div style={backgroundImageStyle}></div>

                <div style={mainContent}>
                    {/* WELCOME MESSAGE */}
                    <div style={welcomeContainer}>
                        <div style={welcomeBox}>
                            <h2 style={welcomeText}>Welcome back, Riya</h2>
                            <p style={subText}>Let's take care of today together.</p>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div style={rightPanelWrapper}>
                        {/* EMERGENCY MAP */}
                        <div style={mapWrapper}>
                            <h3 style={calendarTitle}>Emergency Location</h3>

                            <div style={mapBox}>
                                <EmergencyMap onLocationChange={setLocation} />
                            </div>

                            <button onClick={handleRequestAmbulance} style={ambulanceBtn}>
                                🚑 Request Ambulance
                            </button>
                        </div>

                        {/* CALENDAR */}
                        <div style={calendarWrapper}>
                            <h3 style={calendarTitle}>Appointment Reminder</h3>
                            <div style={calendarBox}>
                                <FullCalendar
                                    plugins={[dayGridPlugin]}
                                    initialView="dayGridMonth"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* AMBULANCE REQUEST MODAL */}
            {isModalOpen && (
                <div style={modalOverlay} onClick={handleCloseModal}>
                    <div style={modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={modalHeader}>
                            <h2 style={modalTitle}>🚑 Request Ambulance</h2>
                            <button 
                                onClick={(e) => {
                                    handleButtonClick(e);
                                    handleCloseModal();
                                }} 
                                style={closeButton}
                                onMouseEnter={(e) => {
                                    e.target.style.background = "#f0f0f0";
                                    e.target.style.color = "#333";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "transparent";
                                    e.target.style.color = "#999";
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmitRequest} style={modalForm}>
                            <div style={formGroup}>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    value={userInfo.name}
                                    readOnly
                                    style={readOnlyInputStyle}
                                />
                            </div>

                            <div style={formGroup}>
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email"
                                    value={userInfo.email}
                                    readOnly
                                    style={readOnlyInputStyle}
                                />
                            </div>

                            <div style={formGroup}>
                                <label style={labelStyle}>Phone Number</label>
                                <div style={phoneInputWrapper}>
                                    <span style={countryCodeStyle}>+977</span>
                                    <input
                                        type="tel"
                                        value={userInfo.phone}
                                        readOnly
                                        style={readOnlyPhoneInputStyle}
                                    />
                                </div>
                            </div>

                            <div style={formGroup}>
                                <label style={labelStyle}>Emergency Location</label>
                                <input
                                    type="text"
                                    value={formatLocation()}
                                    readOnly
                                    style={readOnlyInputStyle}
                                />
                            </div>

                            <div style={formGroup}>
                                <label style={labelStyle}>Additional Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    placeholder="Describe the emergency situation..."
                                    style={textareaStyle}
                                />
                            </div>

                            <button 
                                type="submit" 
                                style={requestButton}
                                onClick={handleButtonClick}
                                onMouseEnter={(e) => {
                                    e.target.style.background = "#0f766e";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "#0d9488";
                                }}
                            >
                                Request Ambulance
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

/* ================= STYLES ================= */

const mainStyle = {
    position: "relative",
    width: "100%",
    height: "calc(100vh - 70px)",
    minHeight: "calc(100vh - 70px)",
};

const backgroundImageStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${BackgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: -1,
};

const mainContent = {
    position: "relative",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "40px",
};

const welcomeContainer = {
    width: "100%",
    maxWidth: "1200px",
    padding: "0 20px",
    marginBottom: "20px",
    marginTop: "-20px",
    marginLeft: "40px",
};

const welcomeBox = {
    background: "rgba(20, 184, 166, 0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: "14px",
    padding: "10px 459px",
    display: "inline-block",
};

const welcomeText = {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#000",
    marginBottom: "8px",
};

const subText = {
    margin: 0,
    fontSize: "16px",
    fontWeight: "500",
    color: "#000",
    opacity: 0.95,
};

const rightPanelWrapper = {
    display: "flex",
    gap: "20px",
    width: "100%",
    maxWidth: "1200px",
    flex: 1,
    padding: "0 20px 20px 20px",
    boxSizing: "border-box",
    margin: "0 auto",
};

const calendarWrapper = {
    flex: 2,
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(10px)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
};

const calendarTitle = {
    marginBottom: "10px",
    color: "#000",
    fontWeight: "600",
};

const calendarBox = {
    background: "#fff",
    borderRadius: "10px",
    padding: "8px",
    flex: 1,
    minHeight: 0,
};

const mapWrapper = {
    flex: 1,
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(10px)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
};

const mapBox = {
    flex: 1,
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "12px",
};

const ambulanceBtn = {
    textAlign: "center",
    padding: "12px",
    borderRadius: "10px",
    background: "#0d9488",
    color: "#000",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
    transition: "background 0.3s, transform 0.1s ease",
};

/* ================= MODAL STYLES ================= */

const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
};

const modalContent = {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    position: "relative",
};

const modalHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "2px solid #e0e0e0",
};

const modalTitle = {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
};

const closeButton = {
    background: "transparent",
    border: "none",
    fontSize: "32px",
    color: "#999",
    cursor: "pointer",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.3s, transform 0.1s ease",
    lineHeight: "1",
};

const modalForm = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
};

const formGroup = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
};

const labelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
};

const readOnlyInputStyle = {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "16px",
    backgroundColor: "#f5f5f5",
    color: "#666",
    cursor: "not-allowed",
    outline: "none",
};

const phoneInputWrapper = {
    display: "flex",
    alignItems: "center",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
};

const countryCodeStyle = {
    padding: "12px 16px",
    background: "#e0e0e0",
    borderRight: "2px solid #d0d0d0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#666",
    userSelect: "none",
};

const readOnlyPhoneInputStyle = {
    flex: 1,
    padding: "12px 16px",
    border: "none",
    fontSize: "16px",
    backgroundColor: "#f5f5f5",
    color: "#666",
    cursor: "not-allowed",
    outline: "none",
};

const textareaStyle = {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "16px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.3s",
};

const requestButton = {
    background: "#0d9488",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s, transform 0.1s ease",
    marginTop: "10px",
};

export default Dashboard;
