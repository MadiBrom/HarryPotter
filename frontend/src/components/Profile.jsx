import React, { useEffect, useState } from "react";
import { getUser, fetchTestResults } from "../API/api";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [testResults, setTestResults] = useState(null);
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

        // Fetching test results for the user after getting the user data
        const results = await fetchTestResults(token);
        if (results) {
          setTestResults(results);
        }
      } catch (err) {
        setError("Failed to fetch user data or test results. Please try again.");
        console.error("Error:", err);
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
        </div>
      )}
    </div>
  );
};

export default Profile;
