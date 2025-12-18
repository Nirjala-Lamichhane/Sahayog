import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#0d9488" }}>
      <Link to="/" style={{ marginRight: "20px", color: "white" }}>Home</Link>
      <Link to="/about" style={{ marginRight: "20px", color: "white" }}>About</Link>
      <Link to="/services" style={{ marginRight: "20px", color: "white" }}>Services</Link>
      <Link to="/departments" style={{ marginRight: "20px", color: "white" }}>Departments</Link>
      <Link to="/contact" style={{ color: "white" }}>Contact</Link>
    </nav>
  );
}
