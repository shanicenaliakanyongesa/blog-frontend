import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/blogs";

  const fetchBlogs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (blogs.length === 0)
    return (
      <div className="text-center mt-5">
        <h4 className="text-secondary">No blogs yet</h4>
        <Link to="/create" className="btn btn-primary mt-3">
          Create Your First Blog
        </Link>
      </div>
    );

  return (
    <div className="container mt-5">
    
     
  <div className="text-end mb-4 mx-3">
    <Link to="/create" className="btn btn-danger btn-sm rounded-pill px-4">
    + New Blog
  </Link>

  </div>



      <div className="row g-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <h6 className="card-title fw-semibold">{blog.title}</h6>
                <p className="text-muted fst-italic flex-grow-1">{blog.snippet}</p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="btn btn-dark text-light rounded-pill btn-sm"
                  >
                    View
                  </Link>
                  <div>
                    <button
                      onClick={() => navigate(`/edit/${blog._id}`)}
                      className="btn btn-outline-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <small className="text-secondary mt-2 d-block">
                  Created: {new Date(blog.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
