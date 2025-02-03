import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/"); // Redirect to the homepage after logging out
  };

  return (
    <nav style={{ position: "fixed", top: 0, right: 0, zIndex: 1000 }}>
      <button onClick={() => navigate("/")}>Home</button>
      {isLoggedIn && (
        <>
          <button onClick={() => navigate("/test")}>House Test</button>
          <button onClick={() => navigate("/wandtest")}>Wand Test</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          {isAdmin && (
            <button onClick={() => navigate("/registeradmin")}>Register Admin</button>
            
          )}
                    {isAdmin && (
            <button onClick={() => navigate("/allusers")}>Users List</button>
            
          )}
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
