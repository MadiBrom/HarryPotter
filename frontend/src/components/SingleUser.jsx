import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleUser } from '../API/api';
import './user.css'; // Ensure the CSS path is correct

const SingleUser = ({ token }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [textColor, setTextColor] = useState('#000000'); // Default black text
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getSingleUser(userId, token);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [userId, token]);

  useEffect(() => {
    // Function to calculate brightness and adjust text color
    const calculateBrightness = (hex) => {
      if (!hex) return 255; // Default to white background

      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);

      let brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness;
    };

    // Set text color based on brightness
    const isDarkColor = calculateBrightness(user?.bodyColor || '#f0f0f0') < 128;
    setTextColor(isDarkColor ? '#FFFFFF' : '#000000');

    console.log("Updated Body Color:", user?.bodyColor, "Updated Text Color:", textColor);
  }, [user?.bodyColor]);

  return (
    <div className="container" style={{ backgroundColor: user?.bodyColor || '#f0f0f0', color: textColor }}>
      {error ? (
        <p className="error-message" style={{ color: textColor }}>Error: {error}</p>
      ) : user ? (
        <div>
          <div className="profile-header">
            <h1 style={{ color: textColor }}>{user.username}</h1>
            <img
              className="profile-img"
              src={user.profilePicUrl && user.profilePicUrl !== "null" && user.profilePicUrl.trim() !== "" ? user.profilePicUrl : "http://localhost:3000/uploads/default_pic.jpg"}
              alt="Profile"
              onError={(e) => e.target.src = "http://localhost:3000/uploads/default_pic.jpg"}
            />
          </div>
          {user.isAdmin && <span style={{ color: textColor ,fontSize: '14px', marginLeft: '10px' } }>Admin</span>}          <div className="details">
            <p className="detail-item" style={{ color: textColor }}>
              <strong style={{ color: textColor }}>House:</strong> {user.testResults?.[0]?.houseResult || "No test taken yet"}
            </p>
            <p className="detail-item" style={{ color: textColor }}>
              <strong style={{ color: textColor }}>Wand:</strong> {user.wandTestResults?.[0]?.result || "No test taken yet"}
            </p>
          </div>
        </div>
      ) : (
        <p className="loading" style={{ color: textColor }}>Loading user data...</p>
      )}
    </div>
  );
};

export default SingleUser;
