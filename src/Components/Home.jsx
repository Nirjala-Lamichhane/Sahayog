import React from "react";
import "../Styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
     

      <main>
        <section className="hero">
          <h2>Welcome to My Website</h2>
          <p>This is a simple and clean home page template.</p>
          <button className="btn" onClick={() => navigate("/book")}>
            Book Appointment
          </button>
        </section>
</main>
        
    </div>
  );
};

export default Home;
