import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { fetchAllUsers } from "../API/api"; // Adjust import if necessary

const AllUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: "10px" }}>
            <Link to={`/users/${user.id}`} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
              <img
                src={user.profilePicUrl && user.profilePicUrl !== "null" && user.profilePicUrl.trim() !== "" ? user.profilePicUrl : "/uploads/default_pic.jpg"}
                alt="Profile"
                onError={(e) => e.target.src = "/uploads/default_pic.jpg"}
                style={{ width: "25px", height: "25px", borderRadius: "50%", marginRight: "10px" }}
              />
              <strong>{user.username}</strong> - {user.email} {user.isAdmin && "(Admin)"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
