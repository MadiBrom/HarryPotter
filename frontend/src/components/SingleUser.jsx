import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleUser } from '../API/api'; // Ensure the path is correct

const SingleUser = ({ token }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { userId } = useParams(); // Use the userId from the URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getSingleUser(userId, token);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [userId, token]);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : user ? (
        <div>          
          <h1>{user.username}</h1>
          <img
                src={user.profilePicUrl && user.profilePicUrl !== "null" && user.profilePicUrl.trim() !== "" ? user.profilePicUrl : "http://localhost:3000/uploads/default_pic.jpg"}
                alt="Profile"
                onError={(e) => e.target.src = "/uploads/default_pic.jpg"}
                style={{ width: "125px", height: "125px", borderRadius: "50%", marginRight: "10px" }}
              />
          <p>Email: {user.email}</p>
          <p>Admin Status: {user.isAdmin ? 'Yes' : 'No'}</p>
          {user && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
          <p>
            <strong>House:</strong>{" "}
            {user.testResults?.[0]?.houseResult || "No test taken yet"}
          </p>
          <p>
            <strong>Wand:</strong>{" "}
            {user.wandTestResults?.[0]?.result || "No test taken yet"}
          </p>
        </div>
      )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default SingleUser;
