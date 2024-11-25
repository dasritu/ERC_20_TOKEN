import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

function Navbar() {
  return (
    <nav className="navbar" >
    <div className="logo">
        <Link to="/" className="navbar-link">ERC 20 Token</Link>
    </div>

      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Dashboard</Link>
        </li>
        <li className="navbar-item">
          <Link to="/erc20transfer" className="navbar-link">ERC20 Transfer</Link>
        </li>
        <li className="navbar-item">
          <Link to="/transferhistory" className="navbar-link">Transfer History</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
