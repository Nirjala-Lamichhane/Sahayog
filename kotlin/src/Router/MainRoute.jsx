import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home";
import About from "../Pages/About";
import Services from "../Pages/Services";
import Departments from "../Pages/Departments";
import Contact from "../Pages/Contact";

export default function MainRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* use clean paths */}
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/contact" element={<Contact />} />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
