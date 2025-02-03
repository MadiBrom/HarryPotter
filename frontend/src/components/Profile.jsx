import React, { useEffect, useState } from "react";
import { getUser } from "../API/api";

const Profile = ({ token, refreshProfile, setUser }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      
      try {
        console.log("🔵 Fetching user data with token:", token);
        const user = await getUser(token);
        
        if (user.error) {
          setError(user.error);
          setUserData(null);
        } else {
          console.log("🟢 User data received:", user);
          setUserData(user);
          setUser(user);
        }
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setError("Failed to fetch user data.");
        setUserData(null);
      }
    };
  
    fetchUserData();
  }, [token]); // ✅ Only runs when `token` changes
  

  // ✅ Handle loading state
  if (!userData && !error) {
    return <p>Loading...</p>;
  }

  // ✅ Handle errors
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>

      <h2>Your House Result</h2>
      <p>
        {userData.testResults?.[0]?.houseResult || "No test taken yet"}
      </p>

      <h2>Your Wand Test Result</h2>
      <div>
        {userData.wandTestResults?.length > 0 ? (
          <p>{userData.wandTestResults[0].result}</p>
        ) : (
          "No wand test taken yet"
        )}
      </div>
    </div>
  );
};

export default Profile;
