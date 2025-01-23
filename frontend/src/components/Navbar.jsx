import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Initialize login state based on localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'; // Check if the user is logged in from localStorage
  });

  const handleLogin = () => {
    // Simulate login (you'd replace this with actual authentication logic)
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Store login state in localStorage
  };

  const handleLogout = () => {
    // Simulate logout (clear authentication tokens or session here)
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false'); // Remove login state from localStorage
  };

  useEffect(() => {
    // If the page is refreshed, the state will be updated from localStorage
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []); // Empty array means this effect runs once when the component mounts

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/houses')}>Houses</button>

      {!isLoggedIn ? (
        <>
          <button onClick={() => navigate('/register')}>Register</button>
          <button onClick={() => navigate('/login')}>Login</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
