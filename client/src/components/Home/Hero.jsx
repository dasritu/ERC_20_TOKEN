import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 
import erc20Image from "../../assets/erc20-image.png";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <img src={erc20Image} alt="ERC20 Token" className="erc20-image" />
        <h1 className="home-heading">Welcome to the ERC20 Token Dashboard</h1>
        <div className="home-links">
          <Link to="/login" className="home-link">
            Login
          </Link>
          <span className="separator">|</span>
          <Link to="/register" className="home-link">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
