import React, { useEffect, useState } from "react";
import { getUser } from "../API/api";

const Profile = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);  // **Trigger state**

  
  const fetchUserData = async () => {
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
  }, [token, refreshTrigger]);


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
    </div>
  );
};

export default Profile;
