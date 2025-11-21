import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function BlogDetails() {
  // -------------------------------------
  // 1. ROUTER + CONSTANTS
  // -------------------------------------
  const { id } = useParams();
  const navigate = useNavigate();

  //  Centralized API URL variable
  const API_BASE_URL = "https://apiblog-bqb7.onrender.com/api";
  const BLOGS_ENDPOINT = `${API_BASE_URL}/blogs`;

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // -------------------------------------
  // 2. STATE
  // -------------------------------------
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);

  // -------------------------------------
  // 3. DERIVED VALUES
  // -------------------------------------
  const isOwner = currentUser && blog?.createdBy?._id === currentUser._id;

  // -------------------------------------
  // 4. EVENT HANDLERS
  // -------------------------------------
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BLOGS_ENDPOINT}/${id}`, {
        data: { userId: currentUser._id },
        headers: { "Content-Type": "application/json" },
      });

      alert("Blog deleted successfully!");
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete blog.";
      alert(message);
    }
  };

  // -------------------------------------
  // 5. API CALL FUNCTION
  // -------------------------------------
  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${BLOGS_ENDPOINT}/${id}`);
      setBlog(res.data);
      setViews(res.data.views + 1);
    } catch (err) {
      alert("Failed to fetch blog.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  // 6. API CALL (useEffect)
  // -------------------------------------
  useEffect(() => {
    fetchBlog();
  }, [id]);

  // -------------------------------------
  // 7. CONDITIONAL RENDERING
  // -------------------------------------
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
        <Link to="/" className="btn btn-outline-secondary mt-3">
          ← Back to Blogs
        </Link>
      </div>
    );

  // -------------------------------------
  // 8. UI (JSX)
  // -------------------------------------
  return (
    <div className="container mt-3" style={{ maxWidth: "750px" }}>
      <Link to="/" className="btn btn-sm btn-outline-secondary mb-4">
        ← Back to Blogs
      </Link>

      <div className="card shadow-lg border-0 mb-5">
        <img
          src={`https://picsum.photos/750/300?random=${id}`}
          alt="Blog Cover"
          className="card-img-top"
          style={{ objectFit: "cover", height: "300px" }}
        />

        <div className="card-body px-4 py-3">
          <h1 className="card-title mb-2 text-danger fw-bold fs-3">
            {blog.title}
          </h1>
          <p className="text-muted fst-italic fs-6 mb-3">{blog.snippet}</p>

          <div
            className="card-text mb-4"
            style={{ lineHeight: "1.7", fontSize: "0.95rem" }}
          >
            {blog.body.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 border-top pt-3">
            <small className="text-secondary">
              {new Date(blog.createdAt).toLocaleString()} |{" "}
              <i className="bi bi-eye"></i> {blog.views || views}
            </small>

            {isOwner && (
              <div className="d-flex gap-2">
                <button
                  onClick={() => navigate(`/edit/${blog._id}`)}
                  className="btn btn-outline-primary btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-outline-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
