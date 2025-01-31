import React, { useEffect, useState } from "react";
import { logoutUser, getUser } from "./API/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./components/index";
import Houses from "./components/Houses";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from './components/Login';
import Profile from "./components/Profile";
import Test from "./components/Test";

function App() {
  const [token, setToken] = useState("");  // Initially empty
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch user only when there's a token
  useEffect(() => {
    console.log("Current token state in App.js:", token); // Debugging
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    if (!token) return;  // Ensure we only call if there's a valid token

    try {
      const userData = await getUser(token);
      if (userData && userData.username) {
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsLoggedIn(false);
    }
  };

  const refreshProfile = () => {
    fetchUser();
  };

  const handleLogout = async () => {
    if (!token) return; // Prevent unnecessary logout calls
    try {
      await logoutUser(token);
      setUser(null);
      setIsLoggedIn(false);
      setToken(""); // Clear token from state
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/profile"
            element={<Profile token={token} refreshProfile={refreshProfile} />}
          />
          <Route path="/houses" element={<Houses />} />
          <Route path="/test" element={<Test token={token} refreshProfile={refreshProfile}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
