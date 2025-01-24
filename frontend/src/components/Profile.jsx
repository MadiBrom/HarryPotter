import React, { useState, useEffect } from 'react';

const Profile = ({ formData, setFormData }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      setFormData(parsedData); // Populate formData
    } else {
      setError("No user data found. Please log in again.");
    }
  }, [setFormData]);

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
