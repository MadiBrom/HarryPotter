import React, { useEffect, useState } from "react";
import { getUser, uploadProfilePic, updateUserProfile } from "../API/api";

const Profile = ({ token, refreshProfile, setUser }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Editable fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return; // Make sure token exists
  
      try {
        const user = await getUser(token);
        if (user.error) {
          setError(user.error);
          return;
        }
  
        setUserData(user);
        setUser(user);
  
        // Handle possibly null profilePicUrl safely
        const cleanProfilePicUrl = user.profilePicUrl && user.profilePicUrl.startsWith("http")
          ? user.profilePicUrl 
          : `http://localhost:3000${user.profilePicUrl || '/default-profile.png'}`;
  
        setProfilePicUrl(cleanProfilePicUrl);
        setUsername(user.username);
        setEmail(user.email);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data.");
      }
    };
  
    fetchUserData();
  }, [token, setUser]);
  
    

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePicUrl(URL.createObjectURL(file)); // Preview immediately
    }
  };

  const handleSaveChanges = async () => {
    setIsUploading(true);
  
    try {
      let uploadedPicUrl = profilePicUrl;
  
      // Upload profile picture if a new file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePic", selectedFile);
  
        console.log("📤 Uploading file with name:", selectedFile.name);
        console.log("🔑 Token being used:", token);
  
        const result = await uploadProfilePic(formData, token);
        console.log("✅ Upload successful:", result);
  
        uploadedPicUrl = result.profilePicUrl.startsWith("http") 
          ? result.profilePicUrl 
          : `http://localhost:3000${result.profilePicUrl}`;
  
        setProfilePicUrl(uploadedPicUrl);
      }
  
      // Update user details (username, email, password)
      const updateData = {
        username,
        email,
        password: password.trim() !== "" ? password : undefined,
        profilePicUrl: uploadedPicUrl
      };
  
      const updateResult = await updateUserProfile(token, updateData);
      console.log("✅ Profile update successful:", updateResult);
  
      setUserData(updateResult);
      setUser(updateResult);
  
      // 🔄 Refetch full user data (including test results)
      const refreshedUser = await getUser(token);
      console.log("🔄 Refetched user data:", refreshedUser);
      setUserData(refreshedUser);
      setUser(refreshedUser);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setError("Failed to update profile.");
    } finally {
      setIsUploading(false);
      setIsEditing(false);
    }
  };
  
  if (!userData && !error) return <p>Loading...</p>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>

      <div>
        <h2>Your Profile Picture</h2>
        <img
          src={profilePicUrl || "http://localhost:3000/default_pic.jpeg"}
          alt="Profile"
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />

        {isEditing && <input type="file" onChange={handleFileChange} accept="image/*" />}
      </div>

      {/* Editable Username */}
      <div>
        {isEditing ? (
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        ) : (
          <p></p>
        )}
      </div>

      {/* Editable Email */}
      <div>

        {isEditing ? (
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        ) : (
          <p></p>
        )}
      </div>

      {/* Editable Password */}
      {isEditing && (
        <div>
          <label>New Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      )}

      <h2>Your House Result</h2>
      <p>{userData.testResults?.[0]?.houseResult || "No test taken yet"}</p>

      <h2>Your Wand Test Result</h2>
      <div>
        {userData.wandTestResults?.length > 0 ? (
          <p>{userData.wandTestResults[0].result}</p>
        ) : (
          "No wand test taken yet"
        )}
      </div>

      {/* Edit Profile Button */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}
      >
        {isEditing ? "Cancel Edit" : "Edit Profile"}
      </button>

      {/* Save Changes Button */}
      {isEditing && (
        <button
          onClick={handleSaveChanges}
          disabled={isUploading}
          style={{
            marginTop: "10px",
            padding: "10px",
            cursor: isUploading ? "not-allowed" : "pointer",
            opacity: isUploading ? 0.5 : 1
          }}
        >
          {isUploading ? "Saving..." : "Save Changes"}
        </button>
      )}
    </div>
  );
};

export default Profile;
