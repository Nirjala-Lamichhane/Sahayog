import Logo from './assets/mainLogo.png'
function Dashboard() {
    return (
      <>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "70px",
            padding: "0 32px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <img
              src={Logo}
              alt="Logo"
              style={{
                height: "100px",
                width: "100px",
                objectFit: "contain",
              }}
            />
          </div>
  
          <div
            style={{
              display: "flex",
              gap: "42px",
            }}
          >
            <h4 style={{ margin: 0, cursor: "pointer", color: "#333" }}>
              Home
            </h4>
            <h4 style={{ margin: 0, cursor: "pointer", color: "#333" }}>
              Articles
            </h4>
            <h4 style={{ margin: 0, cursor: "pointer", color: "#333" }}>
              About Us
            </h4>
          </div>
  
          <div>
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: "200px",
                padding: "9px 16px",
                borderRadius: "999px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>
        </nav>
  
        <main
          style={{
            padding: "32px",
          }}
        >
          <h2>Dashboard Content</h2>
          <p>Your main content goes here.</p>
        </main>
      </>
    );
  }
  
  export default Dashboard;
  