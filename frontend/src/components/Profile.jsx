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
      {/* Display Wand Test Result if available */}
      <h2>Your Wand Test Result</h2>
      <div>
      {userData.wandTestResults?.length > 0 ? (
    <div>
      <p>Wand Description: {userData.wandTestResults[0].result}</p>
            {/* Display more details if needed */}
          </div>
        ) : (
          "No wand test taken yet"
        )}
      </div>
    </div>
  );
};

export default Profile;
