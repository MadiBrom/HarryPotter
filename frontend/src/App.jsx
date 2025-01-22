import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./index";
import Houses from "./components/Houses";
import Navbar from "./components/Navbar";
import Register from "./components/Register";




function App() {
  return (
    <Router>
      <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/houses" element={<Houses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
