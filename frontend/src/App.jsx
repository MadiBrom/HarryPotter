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
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null); // Global user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUser();  // Fetch user only when there's a valid token
    }
  }, [token]);
  
  const fetchUser = async () => {
    if (!token) return; // Prevent fetching when there's no token
  
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

  useEffect(() => {
    fetchUser();
  }, [token]);

  const refreshProfile = () => {
    fetchUser();
  };

  
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await logoutUser(token);
        localStorage.removeItem("token"); // Clear token from localStorage
        localStorage.removeItem("testResults"); // Clear test results from localStorage
        setUser(null);
        setIsLoggedIn(false);
      } catch (error) {
        console.error("Logout failed:", error.message);
      }
    }
  };


  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/register"
            element={
              <Register
              setToken={setToken}
              token={token}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
              setToken={setToken}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
              token={token}
              refreshProfile={refreshProfile}
              />
            }
          />
          <Route path="/houses" element={<Houses />} />
          <Route path="/test" element={<Test token={token} refreshProfile={refreshProfile}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;