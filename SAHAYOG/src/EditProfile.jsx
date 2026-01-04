import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pfp from "./assets/ProfileImg.png";
import BackgroundImg from "./assets/Background.jpg";
import { handleButtonClick } from "./utils/buttonAnimation";

function EditProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "Riya Adhikari",
        username: "riya_20634",
        email: "riya.adhikari@example.com",
        phone: "9841234567",
        dob: "1995-01-15",
        gender: "Female",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        alert("Profile updated successfully!");
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div style={containerStyle}>
            <div style={profileCardStyle}>
                <h2 style={titleStyle}>Edit Profile</h2>

                {/* PROFILE PICTURE */}
                <div style={profilePictureSection}>
                    <img src={Pfp} alt="Profile" style={profileImage} />
                    <button 
                        style={changePhotoBtn}
                        onClick={handleButtonClick}
                    >
                        Change Photo
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={formGroup}>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                            style={readOnlyInputStyle}
                        />
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Phone Number</label>
                        <div style={phoneInputWrapper}>
                            <span style={countryCodeStyle}>+977</span>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={phoneInputStyle}
                                placeholder="9841234567"
                            />
                        </div>
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={selectStyle}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div style={buttonGroup}>
                        <button 
                            type="submit" 
                            style={saveBtn}
                            onClick={handleButtonClick}
                        >
                            Save Changes
                        </button>
                        <button 
                            type="button" 
                            onClick={(e) => {
                                handleButtonClick(e);
                                handleCancel();
                            }} 
                            style={cancelBtn}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ================= STYLES ================= */

const containerStyle = {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    position: "relative",
    backgroundImage: `url(${BackgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
};

const profileCardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
};

const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#333",
    textAlign: "center",
};

const profilePictureSection = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
};

const profileImage = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginBottom: "15px",
    border: "4px solid #14b8a6",
};

const changePhotoBtn = {
    background: "#14b8a6",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background 0.3s, transform 0.1s ease",
};

const formStyle = {
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

const inputStyle = {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "16px",
    transition: "border-color 0.3s",
    outline: "none",
};

const readOnlyInputStyle = {
    ...inputStyle,
    backgroundColor: "#f5f5f5",
    color: "#666",
    cursor: "not-allowed",
    border: "2px solid #d0d0d0",
};

const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
    backgroundColor: "#fff",
};

const phoneInputWrapper = {
    display: "flex",
    alignItems: "center",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "border-color 0.3s",
};

const countryCodeStyle = {
    padding: "12px 16px",
    background: "#f5f5f5",
    borderRight: "2px solid #e0e0e0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#555",
    userSelect: "none",
};

const phoneInputStyle = {
    flex: 1,
    padding: "12px 16px",
    border: "none",
    fontSize: "16px",
    outline: "none",
};

const buttonGroup = {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
};

const saveBtn = {
    flex: 1,
    background: "#14b8a6",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s, transform 0.1s ease",
};

const cancelBtn = {
    flex: 1,
    background: "transparent",
    color: "#14b8a6",
    border: "2px solid #14b8a6",
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s, transform 0.1s ease",
};

export default EditProfile;

