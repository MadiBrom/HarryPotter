import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 1000 }}>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/houses')}>Houses</button>

      {isLoggedIn ? (
        <>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button
            onClick={() => {
              handleLogout();
              navigate('/'); // Redirect to home on logout
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
