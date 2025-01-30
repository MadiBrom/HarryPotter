import React, { useEffect, useState } from "react";
import { getUser } from "../API/api";

const Profile = ({ token, refreshProfile }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);  // **Trigger state**

  
  const fetchUserData = async () => {
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      return;
    }

    try {
      const user = await getUser(token);
      if (user.error) {
        setError(user.error);
        return;
      }
      setUserData(user);
    } catch (err) {
      setError("Failed to fetch user data. Please try again.");
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token, refreshTrigger]);  // **Re-run when refreshTrigger changes**


  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>

      <h2>Your House Result</h2>
      <p>
        You belong to: {userData.testResults?.[0]?.houseResult || "No test taken yet"}
      </p>
      <button onClick={refreshProfile}>Refresh</button>
    </div>
  );
};

export default Profile;
