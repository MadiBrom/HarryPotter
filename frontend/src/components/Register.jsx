import React, { useState } from "react";
import createNewUser from "../API/api";
import { useNavigate } from "react-router-dom";

const Register = ({
  formData,
  setFormData,
  email,
  password,
  setEmail,
  setPassword,
}) => {
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
      const response = await createNewUser(
        formData.username,
        formData.email,
        formData.password
      );

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Registration successful!");

        // Pass user details as state while navigating
        navigate("/profile", {
          state: {
            username: formData.username,
            email: formData.email,
          },
        });

        // Clear the form after navigation
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
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
