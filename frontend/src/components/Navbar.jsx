import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/"); // Redirect to the homepage after logging out
  };

  return (
    <nav style={{ position: "fixed", top: 0, right: 0, zIndex: 1000 }}>
      <button onClick={() => navigate("/")}>Home</button>
      {isLoggedIn && (
        <>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button onClick={() => setShowDropdown(!showDropdown)}>Tests ▼</button>
            {showDropdown && (
              <div style={{
                position: "absolute",
                backgroundColor: "white",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                padding: "10px",
                borderRadius: "5px",
                top: "100%",
                right: 0
              }}>
                <button onClick={() => navigate("/test")}>House</button>
                <button onClick={() => navigate("/wandtest")}>Wand</button>
              </div>
            )}
          </div>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/foryou")}>For You</button>
          {isAdmin && <button onClick={() => navigate("/admindash")}>Dashboard</button>}
          <button onClick={handleLogoutClick}>Logout</button>
        </>
      )}
      {!isLoggedIn && (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
