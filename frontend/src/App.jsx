import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./index";
import Houses from "./components/Houses";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from './components/Login';
import Profile from "./components/Profile";
import Test from "./components/Test";

function App() {
  const [user, setUser] = useState(null); // Global user state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
    });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });


  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setFormData(userData); // Update formData with user details
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData)); // Persist user data
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFormData({ username: "", email: "", password: "" }); // Clear formData
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userData'); // Clear user data
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
      <Profile user={user} formData={formData} email={email} setEmail={setEmail} password={password} setPassword={setPassword} setFormData={setFormData}/>

  }
/>          
<Route path="/houses" element={<Houses />} />
<Route path="/test" element={<Test />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
