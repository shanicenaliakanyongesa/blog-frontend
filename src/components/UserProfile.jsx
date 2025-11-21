import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserProfile({ user, onUserUpdate }) {
  // -----------------------------
  // 1. STATE + CONSTANTS
  // -----------------------------
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
    preview: null,
  });

  const navigate = useNavigate();

  // Centralized API constants
  const API_BASE_URL = "https://apiblog-bqb7.onrender.com/api";
  const IMAGE_BASE_URL = "https://apiblog-bqb7.onrender.com";
  const USER_ENDPOINT = `${API_BASE_URL}/user`;

  // -----------------------------
  // 2. DERIVED VALUES
  // -----------------------------
  const isLoggedIn = Boolean(user);
  const hasProfilePic = form.preview;

  // -----------------------------
  // 3. EFFECTS
  // -----------------------------
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      preview: user.profilePic ? `${IMAGE_BASE_URL}/${user.profilePic}` : null,
    }));
  }, [user]);

  // -----------------------------
  // 4. HANDLERS
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        profilePic: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      if (form.password) fd.append("password", form.password);
      if (form.profilePic) fd.append("profilePic", form.profilePic);

      const res = await axios.put(`${USER_ENDPOINT}/${user._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUserUpdate(res.data); // update global state
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your account?")) return;
    setLoading(true);
    try {
      await axios.delete(`${USER_ENDPOINT}/${user._id}`);
      onUserUpdate(null);
      navigate("/register");
    } catch (err) {
      console.error("Account deletion failed:", err);
      alert("Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 5. CONDITIONAL RENDERING
  // -----------------------------
  if (!isLoggedIn)
    return <p className="text-center mt-5">Please login first.</p>;

  // -----------------------------
  // 6. JSX
  // -----------------------------
  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-lg rounded-4">
        <div className="card-header text-center bg-danger text-white py-4">
          {hasProfilePic ? (
            <img
              src={form.preview}
              width="100"
              height="100"
              className="rounded-circle border border-light"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <i className="bi bi-person-circle fs-1"></i>
          )}
          <h4 className="fw-bold mt-2">{form.name}</h4>
        </div>

        <div className="card-body p-4">
          <label className="fw-bold">Profile Picture</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            disabled={!editing || loading}
          />

          <label className="fw-bold mt-3">Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing || loading}
          />

          <label className="fw-bold mt-3">Email</label>
          <input
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editing || loading}
          />

          <label className="fw-bold mt-3">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New password"
            disabled={!editing || loading}
          />

          <hr />

          {editing ? (
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-success w-45"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-secondary w-45"
                onClick={() => setEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-primary w-45"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-danger w-45"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
