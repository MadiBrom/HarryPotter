import React, { useEffect, useState } from "react";
import { logoutUser, getUser } from "./API/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./components/index";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from './components/Login';
import Profile from "./components/Profile";
import Test from "./components/Test";
import WandTest from "./components/WandTest";
import RegisterAdmin from "./components/RegisterAdmin";
import AllUsers from "./components/AllUsers";

// ✅ Function to get stored token
const getAuthToken = () => {
  return sessionStorage.getItem("token") || "";
};

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(getAuthToken()); // ✅ Initialize token from storage

  // ✅ Fetch user details when token is available
  const fetchUser = async () => {
    if (!token) return;
  
    try {
      console.log("🔵 Fetching user with token:", token);
      const userData = await getUser(token);
  
      if (userData && userData.id) {  // ✅ Ensure `id` exists in the response
        console.log("🟢 User data received:", userData);
        setUser(userData);
        setIsAdmin(userData.isAdmin || false);  // ✅ Set admin state
        setIsLoggedIn(true);
      } else {
        console.warn("⚠️ No valid user data received.");
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("❌ Error in fetchUser:", error);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // ✅ Fetch user when token changes
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  // ✅ Store token in sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token"); // Clear when logging out
    }
  }, [token]);

  // ✅ Handle logout properly
  const handleLogout = async () => {
    if (!token) return;
    try {
      await logoutUser(token);
      setUser(null);
      setIsLoggedIn(false);
      setToken("");
      sessionStorage.removeItem("token"); // Clear session
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} isAdmin={user?.isAdmin} />
      <div>
        <Routes>
          <Route path="/" element={<Index isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
          <Route path="/registeradmin" element={<RegisterAdmin setToken={setToken} setUser={setUser} />} />
          <Route path="/allusers" element={user?.isAdmin ? <AllUsers token={token} /> : <p>Access Denied</p>} />

          <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
          <Route
  path="/profile"
  element={<Profile token={token} refreshProfile={fetchUser} setUser={setUser} />}
/>

          <Route path="/wandtest" element={<WandTest token={token} refreshProfile={fetchUser} user={user} />} />
          <Route path="/test" element={<Test token={token} refreshProfile={fetchUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
