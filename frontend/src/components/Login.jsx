import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { loginUser } from "../API/api"; // Ensure correct import

const Login = ({setToken, setUser}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const data = await loginUser({ email, password });
  
      if (data.token) {
        setToken(data.token); // Store token in state/context
        setUser(data.user);   // Ensure user object is stored, including isAdmin
  
        console.log("🔹 User data after login:", data.user); // Debugging
        console.log("🔹 isAdmin:", data.user.isAdmin); // Check if it's being stored
  
        navigate("/profile"); // Redirect after login
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
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
