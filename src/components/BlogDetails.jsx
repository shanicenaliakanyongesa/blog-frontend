import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/blogs";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      navigate("/");
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

  if (!blog)
    return (
      <div className="text-center mt-5">
        <h4 className="text-danger">Blog not found!</h4>
        <Link to="/" className="btn btn-outline-secondary mt-3">← Back to Blogs</Link>
      </div>
    );

  return (
    <div className="container mt-5">
      <Link to="/" className="btn btn-sm btn-outline-secondary mb-4 mx-3">
        ← Back to Blogs
      </Link>

      <div className="card shadow-sm p-4 border-0  text-center mb-5">
        <h1 className="card-title mb-3 text-danger fw-bold fs-3 fs-md-1">{blog.title}</h1>
        <p className="text-muted fst-italic mb-2">{blog.snippet}</p>
        <p className="card-text mb-4 text-dark">{blog.body}</p>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-secondary">
            Created: {new Date(blog.createdAt).toLocaleString()}
          </small>

          <div>
            <button
              onClick={() => navigate(`/edit/${blog._id}`)}
              className="btn btn-outline-primary btn-sm me-2"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
