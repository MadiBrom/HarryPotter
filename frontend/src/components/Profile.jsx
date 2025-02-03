import React, { useEffect, useState } from "react";
import { getUser, uploadProfilePic } from "../API/api";

const Profile = ({ token, refreshProfile, setUser }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const user = await getUser(token);
        if (user.error) {
          setError(user.error);
        } else {
          setUserData(user);
          setUser(user);
          setProfilePicUrl(user.profilePicUrl);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [token]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePicUrl(URL.createObjectURL(file)); // Creates a URL for the selected file to preview it
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
        console.error("❌ No file selected for upload.");
        return;
    }

    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    console.log("📤 Uploading file with name:", selectedFile.name);
    console.log("🔑 Token being used:", token); // Debug log

    if (!token) {
        console.error("❌ No token available for upload!");
        return;
    }

    try {
        const result = await uploadProfilePic(formData, token);
        console.log("✅ Upload successful:", result);
    } catch (error) {
        console.error("❌ Error uploading file:", error);
    }
};



  

  if (!userData && !error) return <p>Loading...</p>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <div>      <h2>Your Profile Picture</h2>
      {userData.profilePicUrl ? (
        <img 
          src={`http://localhost:3000${userData.profilePicUrl}`} 
          alt="Profile" 
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
      ) : (
        <p>No profile picture uploaded</p>
      )}
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={handleSubmit}>Upload</button>
      </div>
      <p>Email: {userData.email}</p>
      <h2>Your House Result</h2>
      <p>
        {userData.testResults?.[0]?.houseResult || "No test taken yet"}
      </p>

      <h2>Your Wand Test Result</h2>
      <div>
        {userData.wandTestResults?.length > 0 ? (
          <p>{userData.wandTestResults[0].result}</p>
        ) : (
          "No wand test taken yet"
        )}
      </div>
    </div>
  );
};

export default Profile;
