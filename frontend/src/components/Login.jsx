import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // to handle redirects
import { loginUser } from "../API/api";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for redirecting after successful login

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
  
    try {
      console.log("Login attempt with:", { email, password }); // Debug log
      const data = await loginUser({ email, password }); // Ensure this function works correctly
  
      if (data.token) {
        console.log("Login successful:", data); // Debug log
        navigate('/profile'); // Redirect on success
      } else {
        setError("Invalid credentials, please try again."); // If no token, show error
      }
    } catch (err) {
      console.error("Login failed:", err.message); // Debug log
      setError(err.message); // Set the error message
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '0.5rem', width: '100%' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
