import React, { useState } from 'react';
import { demoteAdmin } from '../API/api';  // Import the demoteAdmin function

const DemoteAdmin = () => {
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
      const result = await demoteAdmin(userId);
      setSuccessMessage('Admin demoted successfully');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Demote Admin</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">Enter User ID to Demote:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Demote Admin</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default DemoteAdmin;
