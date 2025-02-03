import React, { useEffect, useState } from "react";
import { getUser, getWandTestResults } from "../API/api";

const Profile = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [wandData, setWandData] = useState(null);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);  // **Trigger state**

  // Fetch User Data
  const fetchUserData = async () => {
    try {
      const user = await getUser(token);
      if (user.error) {
        setError(user.error);
        return;
      }
      setUserData(user);

      // Fetch Wand Test Results (if user exists)
      if (user.id) {
        const wandResult = await getWandTestResults(token, user.id);
        setWandData(wandResult);
      }
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

      {/* Display House Result */}
      <h2>Your House Result</h2>
      <p>
        You belong to: {userData.testResults?.[0]?.houseResult || "No test taken yet"}
      </p>

      {/* Display Wand Test Result */}
      <h2>Your Wand Test Result</h2>
      <div>
        {wandData ? (
          <div>
            <p>Wand Description: {wandData.wandResult}</p>
            {/* Display additional details if needed */}
          </div>
        ) : (
          <p>No wand test taken yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
