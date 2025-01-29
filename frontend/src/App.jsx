import React, { useEffect, useState } from "react";
import { loginUser, logoutUser, getUser } from "./API/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./index";
import Houses from "./components/Houses";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from './components/Login';
import Profile from "./components/Profile";
import Test from "./components/Test";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null); // Global user state


  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [isLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        try {
          const userData = await getUser(token); // Fetch user data
          if (userData && userData.username) {
            setUser(userData); // Set user data if token is valid
            setIsLoggedIn(true); // Update login state to true
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setIsLoggedIn(false);
        }
      };

      fetchUser();
    }
  }, []);

  
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        try {
          const userData = await getUser(token);
          if (userData && userData.username) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        } catch (error) {
          setIsLoggedIn(false);
        }
      };
      fetchUser();
    }
  }, []);

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
                setUser={setUser}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
              
              />
            }
          />
          <Route path="/houses" element={<Houses />} />
          <Route path="/test" element={<Test token={token}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;