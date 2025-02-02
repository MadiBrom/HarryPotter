import React, { useEffect, useState } from "react";
import { getUser, fetchWandResults } from "../API/api";

const Profile = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [wandResults, setWandResults] = useState([]);
  const [error, setError] = useState("");

  // Fetch user data, including house results
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

  // Fetch wand results separately
  const fetchUserWandResults = async () => {
    try {
      const results = await fetchWandResults(token);
      setWandResults(results);
    } catch (err) {
      console.error("Error fetching wand results:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchUserWandResults();
    }
  }, [token]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>

      <h2>Your House Result</h2>
      <p>
        You belong to:{" "}
        {userData.houseResults?.length > 0
          ? userData.houseResults[0].result
          : "No test taken yet"}
      </p>

      <h2>Your Wand Test Results</h2>
      {wandResults.length > 0 ? (
        wandResults.map((result, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>Wand Result:</strong> {result.result}
            </p>
          </div>
        ))
      ) : (
        <p>No wand test taken yet.</p>
      )}
    </div>
  );
};

export default Profile;
