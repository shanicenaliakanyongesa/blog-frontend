import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

function BlogForm() {
  // -------------------------------------
  // 1. ROUTER + CONSTANTS
  // -------------------------------------
  const { id } = useParams();
  const navigate = useNavigate();

  //  Centralized API constants
  const API_BASE_URL = "https://apiblog-bqb7.onrender.com/api";
  const BLOGS_ENDPOINT = `${API_BASE_URL}/blogs`;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // -------------------------------------
  // 2. STATE
  // -------------------------------------
  const [form, setForm] = useState({ title: "", snippet: "", body: "" });
  const [loading, setLoading] = useState(false);

  // -------------------------------------
  // 3. DERIVED VALUES
  // -------------------------------------
  const isEditing = Boolean(id);

  // -------------------------------------
  // 4. EVENT HANDLERS
  // -------------------------------------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      alert("You must be logged in to submit a blog.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const payload = { ...form, createdBy: user._id };

      if (isEditing) {
        await axios.put(`${BLOGS_ENDPOINT}/${id}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Blog updated successfully!");
      } else {
        await axios.post(BLOGS_ENDPOINT, payload, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Blog created successfully!");
      }

      navigate("/");
    } catch (err) {
      console.error("Error saving blog:", err);
      alert(err.response?.data?.message || "Error saving blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  // 5. API FUNCTIONS
  // -------------------------------------
  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${BLOGS_ENDPOINT}/${id}`);
      const blog = res.data;

      // Only allow owner to edit
      const blogOwnerId = blog.createdBy?._id || blog.createdBy;
      if (String(blogOwnerId) !== String(user._id)) {
        alert("You are not authorized to edit this blog.");
        navigate("/");
        return;
      }

      setForm({
        title: blog.title,
        snippet: blog.snippet,
        body: blog.body,
      });
    } catch (err) {
      console.error("Error fetching blog:", err);
      alert("Error fetching blog. Redirecting...");
      navigate("/");
    }
  };

  // -------------------------------------
  // 6. SIDE EFFECTS
  // -------------------------------------
  useEffect(() => {
    if (!user?._id) {
      alert("Please log in to create or edit blogs.");
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (isEditing) fetchBlog();
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

  // -------------------------------------
  // 8. UI
  // -------------------------------------
  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 fw-bold text-center text-danger">
          {isEditing ? "Edit Blog" : "Create Blog"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              name="title"
              className="form-control"
              placeholder="Enter blog title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="snippet" className="form-label">
              Snippet
            </label>
            <input
              id="snippet"
              name="snippet"
              className="form-control"
              placeholder="Enter a short description"
              value={form.snippet}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="body" className="form-label">
              Body
            </label>
            <textarea
              id="body"
              name="body"
              className="form-control"
              rows="6"
              placeholder="Write the full blog content here..."
              value={form.body}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <Link to="/" className="btn btn-danger btn-sm rounded-pill">
              ← Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-dark text-light btn-sm rounded-pill"
            >
              {isEditing ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlogForm;
