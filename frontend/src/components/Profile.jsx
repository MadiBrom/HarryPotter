import React, { useEffect, useState } from "react";
import { getUser, uploadProfilePic, updateUserProfile } from "../API/api";
import "./css/profile.css";

const Profile = ({ token, refreshProfile, setUser }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bodyColor, setBodyColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#000000"); // Default black text

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const user = await getUser(token);
        if (user.error) {
          setError(user.error);
          return;
        }

        setUserData(user);
        setUser(user);
        setBodyColor(user.bodyColor || "#FFFFFF");
        setUsername(user.username);
        setEmail(user.email);

        const cleanProfilePicUrl = user.profilePicUrl && user.profilePicUrl.startsWith("http")
          ? user.profilePicUrl
          : `http://localhost:3000${user.profilePicUrl || '/uploads/default_pic.jpg'}`;

        setProfilePicUrl(cleanProfilePicUrl);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [token, setUser]);

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

    const isDarkColor = calculateBrightness(bodyColor) < 128;
    setTextColor(isDarkColor ? "#FFFFFF" : "#000000");

    console.log("Updated Body Color:", bodyColor, "Updated Text Color:", textColor);
  }, [bodyColor, userData?.bodyColor]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    setIsUploading(true);

    try {
      let uploadedPicUrl = profilePicUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePic", selectedFile);

        const result = await uploadProfilePic(formData, token);
        uploadedPicUrl = result.profilePicUrl.startsWith("http")
          ? result.profilePicUrl
          : `http://localhost:3000${result.profilePicUrl}`;
      }

      const updateData = {
        username,
        email,
        password: password.trim() !== "" ? password : undefined,
        profilePicUrl: uploadedPicUrl,
        bodyColor
      };

      const updateResult = await updateUserProfile(token, updateData);
      setUserData(updateResult);
      setUser(updateResult);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    } finally {
      setIsUploading(false);
      setIsEditing(false);
    }
  };

  if (!userData && !error) return <p>Loading...</p>;
  if (error) return <div className="errorMessage">{error}</div>;

  return (
    <div className="profileContainer" style={{ backgroundColor: bodyColor, color: textColor }}>
      <h1 className="profileHeader" style={{ color: textColor }}>Welcome, {userData ? userData.username : "User"}!</h1>
      <div className="profileImageContainer">
        <img src={profilePicUrl || "http://localhost:3000/uploads/default_pic.jpg"} alt="Profile" className="profileImage" />
        {isEditing && (
          <input type="file" className="profileImageUpload" onChange={handleFileChange} accept="image/*" />
        )}
      </div>

      {isEditing ? (
        <div className="profileInfo">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="inputField" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="inputField" />
          <input type="password" placeholder="New Password (leave blank to keep current)" value={password} onChange={(e) => setPassword(e.target.value)} className="inputField" />
          <label className="colorPickerLabel" style={{ color: textColor }}>Choose your profile color:</label>
          <input type="color" value={bodyColor} onChange={(e) => setBodyColor(e.target.value)} className="colorPicker" />
        </div>
      ) : (
        <div className="profileInfo">
          <p style={{ color: textColor }}><strong>Username:</strong> {username}</p>
          <p style={{ color: textColor }}><strong>Email:</strong> {email}</p>
        </div>
      )}

      <h2 style={{ color: textColor }}>Your House Result</h2>
      <p style={{ color: textColor }}>{userData.testResults?.[0]?.houseResult || "No test taken yet"}</p>

      <h2 style={{ color: textColor }}>Your Wand Test Result</h2>
      <div>
        {userData.wandTestResults?.length > 0 ? (
          <p style={{ color: textColor }}>{userData.wandTestResults[0].result}</p>
        ) : (
          <p style={{ color: textColor }}>No wand test taken yet</p>
        )}
      </div>
      <div className="profileActions">
        <button onClick={() => setIsEditing(!isEditing)} className="button">
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
        {isEditing && (
          <button onClick={handleSaveChanges} disabled={isUploading} className="button">
            {isUploading ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
