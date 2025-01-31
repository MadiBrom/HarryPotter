import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import createNewUser from "../API/api"; // Ensure correct import
import { loginUser } from "../API/api"; // Import loginUser for auto-login after registration

const Register = ({ setUser, setToken }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      // Register the new user
      const response = await createNewUser(username, email, password);

      if (response.error) {
        setError(response.error);
        return;
      }

      // Auto-login the new user after registration
      const loginResponse = await loginUser({ email, password });

      if (loginResponse.token) {
        setToken(loginResponse.token); // Store token in state, NOT localStorage
        setUser(loginResponse.user); // Update the state with the new user data

        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          navigate("/profile"); // Redirect to profile page
        }, 1000);
      } else {
        setError("Auto-login failed. Please log in manually.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default Register;
