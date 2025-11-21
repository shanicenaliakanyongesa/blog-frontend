import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./components/BlogList";
import BlogDetails from "./components/BlogDetails";
import BlogForm from "./components/BlogForm";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import Navbar from "./components/Navbar";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<BlogList user={user} />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/create" element={<BlogForm user={user} />} />
          <Route path="/edit/:id" element={<BlogForm user={user} />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/profile"
            element={<UserProfile user={user} onUserUpdate={setUser} />}
          />
      
        </Routes>
      </div>
    </Router>
  );
}

export default App;
