import React, { useState } from 'react';
import { promoteUserToAdmin } from '../API/api'; // Adjust the path as necessary
import "./dash.css"


const PromoteAdmin = ({ authToken, isAdmin }) => {
  const [userId, setUserId] = useState('');

  const handlePromote = async () => {
    if (!isAdmin) {
      alert("You do not have permission to perform this action.");
      return;
    }

    try {
      const result = await promoteUserToAdmin(userId, authToken);
      alert(result.message);  // Assuming the backend sends back a meaningful message
      // Refresh the page on successful promotion
      window.location.reload();
    } catch (error) {
      alert('Error promoting user: ' + error.message);
    }
  };

  return (
    <div className='promote-admin'>
      <input 
        type="text" 
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handlePromote}>Promote to Admin</button>
    </div>
  );
}

export default PromoteAdmin;
