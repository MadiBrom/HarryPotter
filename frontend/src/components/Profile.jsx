import React, { useEffect, useState } from "react";
import { getUser } from "../API/api";

const Profile = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);  // To trigger refresh

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
  }, [token, refreshTrigger]);  // Depend on token and a refresh trigger

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  // Displaying user information along with any test results
  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>

      {/* Display Wand Test Result if available */}
      <h2>Your Wand Test Result</h2>
      <p>
        {userData.testResults?.length > 0 ? (
          <div>
            <p>Wand Description: {userData.testResults[0].wandResult}</p>
            {/* Display more details if needed */}
          </div>
        ) : (
          "No wand test taken yet"
        )}
      </p>
    </div>
  );
};

export default Profile;
