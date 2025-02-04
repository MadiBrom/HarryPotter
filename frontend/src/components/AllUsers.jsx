import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { fetchAllUsers } from "../API/api";

const AllUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleTooltipId, setVisibleTooltipId] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    const getUsers = async () => {
      try {
        const data = await fetchAllUsers(token);
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [token]);

  const handleTooltipClick = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      alert("User ID copied to clipboard!");
      setVisibleTooltipId(null);
    });
  };

  if (loading) return <p style={{ textAlign: 'center', fontSize: '16px', color: '#888' }}>Loading users...</p>;
  if (error) return <p style={{ color: '#ff6347', textAlign: 'center', fontSize: '16px' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', backgroundColor: '#fdf6e3', margin: '20px', maxWidth: '1000px' }}>
      <h2 style={{ color: '#555', fontFamily: 'Georgia, serif', marginBottom: '15px' }}>All Users</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.map(user => (
          <li key={user.id} style={{ background: '#fffaec', border: '1px solid #ddd', borderRadius: '5px', padding: '10px 20px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Link to={`/users/${user.id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#6e4b3b', flexGrow: 1 }}>
                <img
                  src={user.profilePicUrl && user.profilePicUrl !== "null" && user.profilePicUrl.trim() !== "" ? user.profilePicUrl : "/uploads/default_pic.jpg"}
                  alt="Profile"
                  onError={(e) => { e.target.src = "/uploads/default_pic.jpg"; }}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '15px' }}
                />
                <strong>{user.username}</strong>
              </Link>
              {user.isAdmin && <span style={{ color: '#888', fontSize: '14px', marginLeft: '10px' }}>(Admin)</span>}
            </div>
            <button onClick={() => setVisibleTooltipId(user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px' }}>
              ⓘ
            </button>
            {visibleTooltipId === user.id && (
              <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '10px', cursor: 'pointer', zIndex: 1000 }}
                   onClick={() => handleTooltipClick(user.id)}>
                {user.id}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
