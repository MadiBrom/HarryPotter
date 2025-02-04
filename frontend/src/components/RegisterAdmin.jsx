import React, { useState } from "react";
import { registerUser } from "../API/api";

const RegisterAdmin = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
    secretKey: ""
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      alert('Registration successful!');
      console.log(response);
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="register-admin-form" style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fdf6e3', margin: '20px', maxWidth: '500px', textAlign: 'center' }}>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%', marginBottom: '10px' }}
        />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%', marginBottom: '10px' }}
        />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%', marginBottom: '10px' }}
        />
        <br />
        <label style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
          Is Admin:
          <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <input type="text" name="secretKey" value={formData.secretKey} onChange={handleChange} placeholder="Secret Key"
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%', marginBottom: '20px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#6e4b3b', color: '#f1e6d8', cursor: 'pointer', fontSize: '16px' }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterAdmin;
