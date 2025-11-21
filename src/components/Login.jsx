import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  // -------------------------------------
  // 1. STATE + CONSTANTS
  // -------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Centralized API constants
  const API_BASE_URL = "https://apiblog-bqb7.onrender.com/api";
  const AUTH_ENDPOINT = `${API_BASE_URL}/auth/login`;

  // -------------------------------------
  // 2. DERIVED VALUES
  // -------------------------------------
  const isFormValid = email && password;

  // -------------------------------------
  // 3. EVENT HANDLERS
  // -------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        AUTH_ENDPOINT,
        { email, password },
        { withCredentials: true }
      );

      const loggedUser = res.data;

      // Save user state and localStorage
      setUser(loggedUser);
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(loggedUser));

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials. Please try again.");
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
          <span className="visually-hidden">Logging in...</span>
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
            Welcome Back 👋
          </h3>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 rounded-pill fw-semibold mt-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0 text-secondary">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-danger fw-semibold text-decoration-none"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
