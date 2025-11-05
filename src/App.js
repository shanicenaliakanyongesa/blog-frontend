import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./components/BlogList";
import BlogDetails from "./components/BlogDetails";
import BlogForm from "./components/BlogForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from "./components/Navbar";


function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Navbar/>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/edit/:id" element={<BlogForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
