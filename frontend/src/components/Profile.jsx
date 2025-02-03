import React, { useEffect, useState } from "react";
import { getUser } from "../API/api";
import WandTest from "./WandTest"; // Import WandTest component
import Test from "./Test"; // Import House Test component

const Profile = ({ token, refreshProfile }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, [token]); // Only fetch when token changes

  const fetchUserData = async () => {
    if (!token) return;
    try {
      const user = await getUser(token);
      if (user.error) {
        setError(user.error);
      } else {
        setUserData(user);
      }
    } catch (err) {
      setError("Failed to fetch user data. Please try again.");
      console.error("Error:", err);
    }
  };

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

      <h2>Your Wand Test Result</h2>
      <div>
        {userData.wandTestResults?.length > 0 ? (
          <div>
            <p>Wand Description: {userData.wandTestResults[0].result}</p>
          </div>
        ) : (
          "No wand test taken yet"
        )}
      </div>

      {/* Pass refreshProfile to test components */}
      <WandTest token={token} refreshProfile={refreshProfile} />
      <Test token={token} refreshProfile={refreshProfile} />
    </div>
  );
};

export default Profile;
