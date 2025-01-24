import React, { useState, useEffect } from 'react';

const Profile = ({ formData, setFormData }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data only when component mounts
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      // Only update formData if it's not already populated
      if (!formData.username) {
        setFormData(parsedData); // Populate formData
      }
    } else {
      setError("No user data found. Please log in again.");
    }
  }, []); // Empty dependency array, run only once on mount

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!formData.username) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {loginResponse.username ||formData.username}!</h1>
      <p>Email: {formData.email}</p>
    </div>
  );
};

export default Profile;
