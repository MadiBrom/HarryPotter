import React, { useState } from "react";
import { registerUser } from "../API/api"; // Assume you have this function implemented

const RegisterAdmin = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
    secretKey: ""  // Optional: For additional security
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call your API to register the user
    const response = await registerUser(formData);
    console.log(response); // Handle response appropriately
  };

  return (
    <div className="register-admin-form">
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <label>
        Is Admin:
        <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={() => setFormData({...formData, isAdmin: !formData.isAdmin})} />
      </label>
      <input type="text" name="secretKey" value={formData.secretKey} onChange={handleChange} placeholder="Secret Key" />
      <button type="submit">Register</button>
    </form></div>
  );
};

export default RegisterAdmin;
