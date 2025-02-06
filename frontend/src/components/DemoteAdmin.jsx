import React, { useState } from 'react';
import { demoteAdmin } from '../API/api';  // Import the demoteAdmin function

const DemoteAdmin = ({ token }) => {  // Accept token as a prop
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Handle input change
  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  // Handle form submission (demoting admin)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);  // Reset errors on each submit attempt
    setSuccessMessage(null);

    try {
      const result = await demoteAdmin(userId, token);  // Pass token here
      setSuccessMessage('Admin demoted successfully');

      // Refresh the page after successful submission
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fdf6e3', margin: '20px', maxWidth: '500px', textAlign: 'center' }}>
    <h2>Demote Admin</h2>
    <input type="text" placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)}
      style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%', marginBottom: '20px' }}
    />
    <button onClick={handleSubmit} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#6e4b3b', color: '#f1e6d8', cursor: 'pointer', fontSize: '16px' }}>
      Demote
    </button>      
    {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
  </div>
  );
};

export default DemoteAdmin;

