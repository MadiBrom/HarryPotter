import React, { useEffect, useState } from "react";
import { getUser, fetchTestResults } from "../API/api";

const Profile = ({testResults}) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
console.log(testResults);

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
          <h2>Your House Result</h2>
      {testResults && (
        <div>

          <p>You belong to: {testResults.houseResult}</p>
        </div>
      )}
    </div>
  );
};


export default Profile;