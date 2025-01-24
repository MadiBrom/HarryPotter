import React, { useState } from "react";
import {loginUser} from "../API/api"
import createNewUser from "../API/api";
import { useNavigate } from "react-router-dom";

const Register = ({ formData, setFormData, onLogin }) => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    try {
      console.log("Register form data before submission:", formData);
  
      // Register the user
      const registrationResponse = await createNewUser(
        formData.username,
        formData.email,
        formData.password
      );
  
      if (registrationResponse.error) {
        setError(registrationResponse.error);
        return;
      }
  
      setSuccess("Registration successful!");
  
      // Automatically log in the user after registration
      const loginResponse = await loginUser({
        email: formData.email,
        password: formData.password,
      });
  
      if (loginResponse.token) {
        const userData = {
          username: registrationResponse.username || formData.username,
          email: formData.email,
          token: loginResponse.token,
        };
        onLogin(userData); // Store user data
        navigate("/profile");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error during registration or login:", error);
    }
  };
  
  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
