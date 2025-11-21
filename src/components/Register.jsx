import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  // -------------------------------------
  // 1. STATE + CONSTANTS
  // -------------------------------------
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Centralized API constant
  const API_BASE_URL = "https://apiblog-bqb7.onrender.com/api";
  const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;

  // -------------------------------------
  // 2. DERIVED VALUES
  // -------------------------------------
  const isFormValid = form.name && form.email && form.password;

  // -------------------------------------
  // 3. EVENT HANDLERS
  // -------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        REGISTER_ENDPOINT,
        { ...form },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  // 4. CONDITIONAL RENDERING
  // -------------------------------------
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Registering...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------
  // 5. UI
  // -------------------------------------
  return (
    <div
      className="container d-flex justify-content-center align-items-center mb-5"
      style={{ minHeight: "80vh" }}
    >
      <div className="col-md-6">
        <div className="card shadow-sm border-0 p-4 rounded-4">
          <h3 className="text-center mb-4 fw-bold text-danger">
            Create Your Account
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 rounded-pill fw-semibold mt-2"
              disabled={loading || !isFormValid}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0 text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-danger fw-semibold text-decoration-none"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
