import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./index";
import Houses from "./components/Houses";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from './components/Login'
import Profile from "./components/Profile";


function App() {
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
    });
  return (
    <Router>
      <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register formData={formData} setFormData={setFormData} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile formData={formData}/>} />

          <Route path="/houses" element={<Houses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
