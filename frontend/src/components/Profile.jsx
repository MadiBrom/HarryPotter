import React, { useEffect, useState } from "react";
import { getUser } from "../API/api";

const Profile = ({ testResults }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }

      try {
        const user = await getUser(token);
        if (user.error) {
          setError(user.error);
        } else {
          setUserData(user);
        }
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return (
      <div style={{ color: "red" }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>

      {testResults && (
        <div>
          <h2>Your Test Results</h2>
          <p>Most Likely House: {testResults.houseResult}</p>
          {/* Optionally, display more detailed answers */}
        </div>
      )}
    </div>
  );
};

export default Profile;
