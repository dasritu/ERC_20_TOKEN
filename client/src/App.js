import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Registration/Registration";
import Login from "./components/Login/Login";
import ERC20 from "./components/ERC20";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./Navbar"; // Import Navbar
import Home from "./components/Home/Hero.jsx"; // Home component
import Dashboard from "./components/Dashboard"; // Add the Dashboard component
import { Navigate } from "react-router-dom";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="erc20/dashboard" /> : <Home />} 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>
                <Navbar /> {/* Navbar appears for protected routes */}
                <Dashboard /> {/* Protected component for Dashboard */}
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/erc20/*"
          element={
            <ProtectedRoute>
              <div>
                <Navbar /> {/* Navbar appears for protected routes */}
                <ERC20 /> {/* Protected component */}
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
