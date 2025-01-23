import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // to handle redirects
import loginUser from "../API/api";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for redirecting after successful login

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await loginUser({ email, password });
      
      // If login is successful, redirect to dashboard (or another page)
      if (data.token) {
        navigate('/'); // You can change the route based on your needs
      }
    } catch (err) {
      setError(err.message); // Show error message if login fails
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
