import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/mainLogo.png";
import Pfp from "../assets/ProfileImg.png";
import { Search } from 'lucide-react';
import { handleButtonClick } from "../utils/buttonAnimation";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = () => {
        // Add your search functionality here
        console.log("Search clicked");
    };

    return (
        <>
            {/* NAVBAR */}
            <nav style={navbarStyle}>
                {/* LEFT */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div onClick={() => setMenuOpen(true)} style={{ cursor: "pointer" }}>
                        <div style={lineStyle}></div>
                        <div style={lineStyle}></div>
                        <div style={lineStyle}></div>
                    </div>
                    <img src={Logo} alt="Logo" style={logoStyle} />
                </div>

                {/* CENTER LINKS */}
                <div style={navLinks}>
                    <span 
                        style={navLink} 
                        onClick={() => navigate("/")}
                        onMouseEnter={(e) => {
                            e.target.style.fontSize = "18px";
                            e.target.style.textDecoration = "underline";
                            e.target.style.textDecorationColor = "#14b8a6";
                            e.target.style.textUnderlineOffset = "4px";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.fontSize = "16px";
                            e.target.style.textDecoration = "none";
                        }}
                    >
                        Home
                    </span>
                    <span 
                        style={navLink} 
                        onClick={() => navigate("/articles")}
                        onMouseEnter={(e) => {
                            e.target.style.fontSize = "18px";
                            e.target.style.textDecoration = "underline";
                            e.target.style.textDecorationColor = "#14b8a6";
                            e.target.style.textUnderlineOffset = "4px";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.fontSize = "16px";
                            e.target.style.textDecoration = "none";
                        }}
                    >
                        Articles
                    </span>
                    <span 
                        style={navLink} 
                        onClick={() => navigate("/about-us")}
                        onMouseEnter={(e) => {
                            e.target.style.fontSize = "18px";
                            e.target.style.textDecoration = "underline";
                            e.target.style.textDecorationColor = "#14b8a6";
                            e.target.style.textUnderlineOffset = "4px";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.fontSize = "16px";
                            e.target.style.textDecoration = "none";
                        }}
                    >
                        About Us
                    </span>
                </div>

                {/* RIGHT */}
                <div style={navRight}>
                    <div style={searchContainer}>
                        <input type="text" placeholder="Search..." style={searchStyle} />
                        <button 
                            style={searchButton} 
                            onClick={(e) => {
                                handleButtonClick(e);
                                handleSearch();
                            }} 
                            title="Search"
                        >
                            <Search size={18} color="#fff" />
                        </button>
                    </div>

                    <button
                        style={notificationBtn}
                        onClick={(e) => {
                            handleButtonClick(e);
                            navigate("/notifications");
                        }}
                        title="Notifications"
                    >
                        🔔
                        <span style={notificationCount}>3</span>
                    </button>
                </div>
            </nav>

            {/* OVERLAY */}
            {menuOpen && <div onClick={() => setMenuOpen(false)} style={overlayStyle} />}

            {/* SIDEBAR */}
            <div
                style={{
                    ...sidebarStyle,
                    transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
                }}
            >
                <span onClick={() => setMenuOpen(false)} style={closeBtn}>✕</span>

                {/* PROFILE */}
                <div style={{ ...profileContainer, ...translucentBar }}>
                    <img src={Pfp} alt="Profile" style={profileImage} />

                    <div style={profileTextWrapper}>
                        <h3 style={{ margin: 0 }}>Riya Adhikari</h3>
                        <p style={profileUsername}>riya_20634</p>

                        <button 
                            style={editBtn} 
                            onClick={(e) => {
                                handleButtonClick(e);
                                navigate("/edit-profile");
                                setMenuOpen(false);
                            }}
                        >
                            Edit Profile ✎
                        </button>
                    </div>
                </div>

                {/* MENU */}
                <ul style={menuList}>
                    {[
                        { label: "Book Appointment", path: "/book-appointment" },
                        { label: "Book Cabin / Bed", path: "/book-cabin" },
                        { label: "View Report", path: "/reports" },
                        { label: "Pharmacy", path: "/pharmacy" },
                        { label: "Transaction History", path: "/transactions" },
                        { label: "Ratings / Review", path: "/ratings" },
                    ].map((item) => (
                        <li key={item.label} style={translucentBar}>
                            <button
                                style={menuBtn}
                                onClick={(e) => {
                                    handleButtonClick(e);
                                    navigate(item.path);
                                    setMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <div style={logoutWrapper}>
                    <button 
                        style={logoutBtn} 
                        onClick={(e) => {
                            handleButtonClick(e);
                            navigate("/login");
                        }}
                    >
                        Log out →
                    </button>
                </div>
            </div>
        </>
    );
}

/* ================= STYLES ================= */

const navbarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "70px",
    padding: "0 32px",
    backgroundColor: "#ffffff",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
};

const navLinks = {
    display: "flex",
    gap: "42px",
    fontWeight: "700",
    marginLeft: "120px",
};

const navLink = {
    cursor: "pointer",
    color: "#000",
    fontSize: "16px",
    transition: "font-size 0.3s ease, text-decoration 0.3s ease",
    textDecoration: "none",
};

const navRight = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
};

const logoStyle = { height: "40px", width: "100px" };
const lineStyle = { width: "24px", height: "3px", background: "#333", margin: "4px 0" };

const searchContainer = {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '999px',
    overflow: 'hidden',
    border: '1px solid #ccc',
};

const searchStyle = {
    flex: 1,
    padding: "9px 16px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    minWidth: "180px",
};

const searchButton = {
    padding: '9px 12px',
    background: '#0d9488',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s ease, transform 0.1s ease',
};

const notificationBtn = {
    position: "relative",
    background: "transparent",
    border: "1px solid #ccc",
    borderRadius: "50%",
    width: "38px",
    height: "38px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "transform 0.1s ease",
};

const notificationCount = {
    position: "absolute",
    top: "-6px",
    right: "-10px",
    background: "#0d9488",
    color: "#000",
    borderRadius: "50%",
    fontSize: "11px",
    padding: "2px 6px",
};

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 1000,
};

const sidebarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "320px",
    height: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",

    /* 🌊 TRANSLUCENT CYAN */
    background: "rgba(6, 182, 212, 0.25)", // cyan glass
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",

    zIndex: 1001,
    transition: "transform 0.3s ease-in-out",
};

const closeBtn = {
    cursor: "pointer",
    fontSize: "20px",
    alignSelf: "flex-end",
};

const profileContainer = {
    display: "flex",
    gap: "14px",
    alignItems: "center",
};

const profileTextWrapper = {
    display: "flex",
    flexDirection: "column",
};

const profileUsername = {
    margin: "4px 0",
    color: "#333",
    fontSize: "14px",
};

const profileImage = {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
};

const editBtn = {
    background: "#f97316", // 🟧 orange
    color: "#000",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "6px",
    width: "100%",
    fontWeight: "600",
    transition: "transform 0.1s ease",
};

const menuBtn = {
    width: "100%",
    background: "rgba(255,255,255,0.45)",
    color: "#000",
    border: "none",
    textAlign: "left",
    padding: "14px 16px",
    fontSize: "15px",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "transform 0.1s ease",
};

const translucentBar = {
    width: "95%",
    padding: "10px",
    background: "rgba(255,255,255,0.45)",
    borderRadius: "12px",
    marginBottom: "10px",
};

const menuList = { listStyle: "none", padding: 0 };

const logoutWrapper = { marginTop: "auto" };
const logoutBtn = { 
    background: "transparent", 
    border: "none", 
    cursor: "pointer",
    transition: "transform 0.1s ease",
};

export default Navbar;