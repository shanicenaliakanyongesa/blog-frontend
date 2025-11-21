import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function BlogList({ user }) {
  // -------------------------------------
  // 1. STATE + CONSTANTS
  // -------------------------------------
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Centralized API constants
  const API_BASE_URL = "https://apiblog-bqb7.onrender.com/api";
  const BLOGS_ENDPOINT = `${API_BASE_URL}/blogs`;

  // -------------------------------------
  // 2. API FUNCTIONS
  // -------------------------------------
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BLOGS_ENDPOINT, { withCredentials: true });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      alert("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BLOGS_ENDPOINT}/${id}`, {
        data: { userId: user?._id },
      });
      fetchBlogs(); // refresh list after deletion
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(err.response?.data?.message || "Failed to delete blog.");
    }
  };

  // -------------------------------------
  // 3. SIDE EFFECTS
  // -------------------------------------
  useEffect(() => {
    fetchBlogs();
  }, []);

  // -------------------------------------
  // 4. CONDITIONAL RENDERING
  // -------------------------------------
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-muted">No blogs found.</h4>
        {user && (
          <Link to="/create" className="btn btn-danger btn-sm mt-3">
            + New Blog
          </Link>
        )}
      </div>
    );
  }

  // -------------------------------------
  // 5. JSX
  // -------------------------------------
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>All Blogs</h3>
        {user && (
          <Link to="/create" className="btn btn-danger btn-sm">
            + New Blog
          </Link>
        )}
      </div>

      <div className="row g-4">
        {blogs.map((blog, index) => {
          const isOwner = user?._id && blog.createdBy?._id === user._id;

          return (
            <div key={blog._id} className="col-12 col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={`https://picsum.photos/600/300?random=${index}`}
                  className="card-img-top"
                  alt="Blog"
                />

                <div className="card-body">
                  <h5>{blog.title}</h5>
                  <small>{blog.snippet}</small>

                  <div className="d-flex justify-content-between mt-2">
                    <Link to={`/blogs/${blog._id}`} className="btn btn-dark btn-sm">
                      Read More
                    </Link>
                    <span>
                      <i className="bi bi-eye"></i> {blog.views}
                    </span>
                  </div>

                  {isOwner && (
                    <div className="mt-2 d-flex gap-2">
                      <button
                        onClick={() => navigate(`/edit/${blog._id}`)}
                        className="btn btn-outline-warning btn-sm"
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
                  )}

                  <small className="text-muted d-block mt-2">
                    By {blog.createdBy?.name || "Unknown"} •{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogList;
