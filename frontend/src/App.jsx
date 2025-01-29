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
  const [testResults, setTestResults] = useState(null);
  const [user, setUser] = useState(null); // Global user state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
console.log(testResults);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleTestSubmit = (results) => {
    setTestResults(results); // Store results in state
    localStorage.setItem("testResults", JSON.stringify(results)); // Optionally save to localStorage
  };
  
  useEffect(() => {
    const savedTestResults = localStorage.getItem('testResults');
    if (savedTestResults) {
      setTestResults(JSON.parse(savedTestResults)); // Load from localStorage
    } else {
      console.log('No test results found in localStorage.');
    }
  }, []);
  
  

  const handleLogin = async (email, password) => {
    try {
      const { token, user } = await loginUser({ email, password });
      localStorage.setItem("token", token);  // Store the token
      setUser(user);  // Set user state after login
      setIsLoggedIn(true);  // Update login state to true
  
      // Ensure the app reacts to the new login state
      // No need for a page reload, React will re-render the components
    } catch (error) {
      console.error("Login failed:", error.message);
    }
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
                formData={formData}
                setFormData={setFormData}
                onLogin={handleLogin}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                formData={formData}
                setUser={setUser}
                onLogin={handleLogin}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                testResults={testResults}
              />
            }
          />
          <Route path="/houses" element={<Houses />} />
          <Route path="/test" element={<Test onSubmit={handleTestSubmit} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;