import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function BlogForm() {
  const [form, setForm] = useState({ title: "", snippet: "", body: "" });
  const navigate = useNavigate();
  const { id } = useParams(); // If editing
  const API_URL = "http://localhost:5000/api/blogs";

  // Fetch blog if editing
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const res = await fetch(`${API_URL}/${id}`);
          const data = await res.json();
          setForm({
            title: data.title,
            snippet: data.snippet,
            body: data.body,
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_URL}/${id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save blog");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error saving blog. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 fw-bold text-center text-danger">{id ? "Edit Blog" : "Create Blog"}</h3>

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
            <button type="submit" className="btn btn-dark text-light btn-sm rounded-pill">
              {id ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlogForm;
