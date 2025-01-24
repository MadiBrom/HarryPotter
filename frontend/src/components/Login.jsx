import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../API/api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Ensure formData has email and password
    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const loginResponse = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse.token) {
        const userData = {
          username: loginResponse.username || formData.username,
          email: formData.email,
          token: loginResponse.token,
        };
        onLogin(userData); // Store user data
        navigate("/profile");
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
