import React, { useState, useEffect } from 'react';
import { loginUser } from '../API/api';

const Profile = () => {
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  // Handle the login logic if you need to trigger it in this component
  const login = async () => {
    try {
      const email = 'michael@gmail.com'; // Example email
      const password = 'michael'; // Example password
      const response = await loginUser({ email, password });

      console.log('Login successful:', response);
      // Set the user data (assuming response contains user data)
      setFormData(response.user);
    } catch (error) {
      console.error('Login or fetch user data failed:', error);
      setError(error.message); // Handle the error
    }
  };

  // Call login when component mounts or on some event
  useEffect(() => {
    login();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Hello, {formData.username}! Here's your profile.</p>
    </div>
  );
};

export default Profile;
