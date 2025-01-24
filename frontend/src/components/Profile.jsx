import React, { useState, useEffect } from 'react';

const Profile = ({ formData, setFormData }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data only when component mounts
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      console.log("Parsed Data:", parsedData);
      // Add username as a fallback if it is missing in the saved data
      if (!parsedData.username) {
        parsedData.username = '';  // Set default value if username is missing
      }
      // Only update formData if it's not already populated
      if (!formData.username) {
        setFormData(parsedData); // Populate formData if not already set
      }
    } else {
      setError("No user data found. Please log in again.");
    }
  }, []); // Empty dependency array, run only once on mount
  

  // Log formData state to track if it's being updated
  console.log("Form Data:", formData);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!formData.username) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {formData.username}!</h1>
      <p>Email: {formData.email}</p>
    </div>
  );
};

export default Profile;
