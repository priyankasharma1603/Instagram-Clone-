import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css"; // Add styles for the sidebar

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to check if user is logged in

  useEffect(() => {
    // Check if the user is authenticated by checking if the JWT token exists
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token); // Update authentication state
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("jwt");
      setIsAuthenticated(false); // Update state to reflect logout
      navigate("/signin");
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar visibility
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="brand-container">
        <Link to="/" className="brand-logo">Instagram</Link>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isOpen ? "Collapse" : "Expand"}
        </button>
      </div>
      <ul className={`sidebar-items ${isOpen ? "show" : ""}`}>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/">
                <i className="material-icons">home</i> Home
              </Link>
            </li>
            <li>
              <Link to="/myfollowerpost">
                <i className="material-icons">image</i> My following posts
              </Link>
            </li>
            <li>
              <Link to="/Notification">
                <i className="material-icons">favorite</i> Notifications
              </Link>
            </li>
            <li>
              <Link to="/create">
                <i className="material-icons">create</i> Create
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <i className="material-icons">account_circle</i> Profile
              </Link>
            </li>
          </>
        ) : (
          <li>
            <p>Please sign in to access other pages.</p>
          </li>
        )}
        <li>
          <Link to="/signup">
            <i className="material-icons">person_add</i> New Account
          </Link>
        </li>
      </ul>
      <div className="logout">
        <button onClick={handleLogout}>
          <i className="material-icons">logout</i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
