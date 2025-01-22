import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./index";




function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
