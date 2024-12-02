import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; 

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("token");
   
    navigate("/");
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/erc20/dashboard" className="navbar-link">Dashboard</Link>
        </li>
        <li className="navbar-item">
          <Link to="/erc20/erc20transfer" className="navbar-link">Transfer</Link>
        </li>
        <li className="navbar-item">
          <Link to="/erc20/transferhistory" className="navbar-link">History</Link>
        </li>
        <li className="navbar-item">
          <button onClick={handleLogout} className="navbar-link logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
