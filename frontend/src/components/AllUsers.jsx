import React, { useEffect, useState } from "react";
import { fetchAllUsers, getUser } from "../API/api"; // Ensure you have fetchUserDetails in your API file

const AllUsers = ({token}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleUserClick = async (userId) => {
    try {
      const userDetails = await getUser(userId, token);
      setSelectedUser(userDetails);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user.id)} style={{ cursor: "pointer" }}>
            <img
              src={user.profilePicUrl || "http://localhost:3000/uploads/default_pic.jpg"}
              alt="Profile"
              style={{ width: "25px", height: "25px", borderRadius: "50%", marginRight: "10px" }}
            />
            <strong>{user.username}</strong> - {user.email} {user.isAdmin && "(Admin)"}
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
          <h3>{selectedUser.username}'s Details</h3>
          <p>
            <strong>House:</strong>{" "}
            {selectedUser.testResults?.[0]?.houseResult || "No test taken yet"}
          </p>
          <p>
            <strong>Wand:</strong>{" "}
            {selectedUser.testResults?.[0]?.wandResult || "No test taken yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
