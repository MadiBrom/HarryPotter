import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { loginUser } from "../API/api"; // Ensure correct import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Pass email and password directly to loginUser
      const data = await loginUser({ email, password });

      // Save token to localStorage
      localStorage.setItem("token", data.token);

      // Show success message and navigate to /profile
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/profile"); // Redirect to /profile
      }, 1000);
    } catch (err) {
      // Handle error and display error message
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default Login;
