import React, { useState } from 'react';
import { promoteUserToAdmin } from '../API/api';

const PromoteAdmin = ({ authToken, isAdmin }) => {
  const [userId, setUserId] = useState('');

  const handlePromote = async () => {
    if (!isAdmin) {
      alert("You do not have permission to perform this action.");
      return;
    }

    try {
      const result = await promoteUserToAdmin(userId, authToken);
      alert(result.message);
      window.location.reload();
    } catch (error) {
      alert('Error promoting user: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fdf6e3', margin: '20px', maxWidth: '500px', textAlign: 'center' }}>
      <input type="text" placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)}
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%', marginBottom: '20px' }}
      />
      <button onClick={handlePromote} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#6e4b3b', color: '#f1e6d8', cursor: 'pointer', fontSize: '16px' }}>
        Promote to Admin
      </button>
    </div>
  );
};

export default PromoteAdmin;
