import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  // -------------------------------------
  // 1. CONSTANTS + DERIVED VALUES
  // -------------------------------------
  const navigate = useNavigate();

  //  Centralized API constant
  const API_BASE_URL = "https://apiblog-bqb7.onrender.com";

  const isLoggedIn = Boolean(user);
  const hasProfilePic = user?.profilePic;

  // -------------------------------------
  // 2. EVENT HANDLERS
  // -------------------------------------
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // -------------------------------------
  // 3. JSX
  // -------------------------------------
  return (
    <>
      <div className="container mt-4">
        <nav className="modern-nav">
          {/* Top Row */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            {/* Left Section */}
            <div className="d-flex align-items-center gap-4">
              <ul className="d-none d-md-flex list-unstyled mb-0 gap-4">
                <li>
                  <NavLink to="/" className="nav-link-modern">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/create" className="nav-link-modern">
                    Create Blog
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Right Section */}
            <div className="d-flex align-items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className="d-none d-md-inline fw-medium text-dark">
                    Welcome, <span className="text-danger">{user.name}</span>
                  </span>

                  <Link to="/profile" className="nav-avatar">
                    {hasProfilePic ? (
                      <img
                        src={`${API_BASE_URL}/${user.profilePic}`}
                        alt="Profile"
                      />
                    ) : (
                      <>
                        <span className="avatar-head"></span>
                        <span className="avatar-body"></span>
                      </>
                    )}
                  </Link>

                  <button onClick={handleLogout} className="btn-modern">
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="btn-outline-modern">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn-modern">
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="d-md-none mt-3 pt-3 border-top">
            <NavLink to="/" className="mobile-link">
              Home
            </NavLink>
            <NavLink to="/create" className="mobile-link">
              Create Blog
            </NavLink>
          </div>
        </nav>
      </div>

      {/* STYLES */}
      <style>{`
        .modern-nav {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          padding: 1.5rem 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .nav-link-modern {
          color: #1f2937;
          text-decoration: none;
          font-weight: 500;
          position: relative;
          transition: color 0.3s;
        }
        .nav-link-modern::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 2px;
          background: #dc3545;
          transition: width 0.3s;
        }
        .nav-link-modern:hover,
        .nav-link-modern.active {
          color: #dc3545;
        }
        .nav-link-modern:hover::after,
        .nav-link-modern.active::after {
          width: 100%;
        }

        .nav-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
        }
        .nav-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(220,53,69,0.4);
        }
        .nav-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-head {
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 8px;
        }
        .avatar-body {
          position: absolute;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          bottom: -8px;
        }

        .btn-modern {
          background: linear-gradient(135deg,#dc3545 0%,#c82333 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.375rem 1rem;
          font-size: 14px;
          transition: transform 0.3s, box-shadow 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-modern:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(220,53,69,0.4);
          color: white;
        }
        .btn-outline-modern {
          background: transparent;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.375rem 1rem;
          font-size: 14px;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-outline-modern:hover {
          border-color: #dc3545;
          color: #dc3545;
        }

        .mobile-link {
          display: block;
          color: #1f2937;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
        }
        .mobile-link:hover {
          color: #dc3545;
        }
      `}</style>
    </>
  );
}

export default Navbar;
