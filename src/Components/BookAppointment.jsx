import "../Styles/BookAppointment.css";

const BookAppointment = () => {
  return (

    <div className="container">
     <div className="header">
      <div className="left">
        <span className="back-arrow">←</span>
        <h2>Details For Booking Doctor</h2>
      </div>
      </div>
    <div className="appointment-wrapper">
      
      {/* <div className="header">
        <span className="back-arrow">←</span>
        <h2>Details For Booking Doctor</h2>
        <div className="header-icons">
          <span>⚙</span>
          <span>⋮</span>
        </div>
      </div> */}

      
      <div className="form-card">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="First and Last Name" />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" placeholder="Age" />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" placeholder="Address" />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input type="tel" placeholder="+977" />
        </div>

        <button className="book-btn">Book</button>
      </div>
    </div>
    </div>
  );
};

export default BookAppointment;
