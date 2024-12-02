import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../api/AxiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [errmsg, setMsg] = useState("");
  const [successmsg, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/erc20/dashboard");
    }
  }, [navigate]);

  const validation = (userdata) => {
    const newerror = {};
    if (!email) {
      newerror.email = "Please Enter EmailId";
    }
    if (!password) {
      newerror.password = "Please Enter Password";
    }
    return newerror;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userdata = { email, password };
    const errors = validation(userdata);
    if (Object.keys(errors).length > 0) {
      setError(errors);
    } else {
      try {
        const responsedata = { email, password };
        const response = await axiosInstance.post("/auth/user/login/", responsedata);
        setSuccess("Login Successful..");
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("username", response.data.email);
        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/erc20/dashboard");
        }, 1000);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const errorMessage = error.response.data?.msg || "Invalid Email Address";
          setMsg(errorMessage);
        } else {
          setError("Something went wrong");
        }
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-heading">Login</h2>
        <Form className="login-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="login-label">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!error.email}
            />
            <Form.Control.Feedback type="invalid">
              {error.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="login-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!error.password}
            />
            <Form.Control.Feedback type="invalid">
              {error.password}
            </Form.Control.Feedback>
          </Form.Group>

          {errmsg && (
            <div className="alert alert-danger" role="alert">
              {errmsg}
            </div>
          )}

          {successmsg && (
            <div className="alert alert-success" role="alert">
              {successmsg}
            </div>
          )}

          <Button variant="primary" type="submit" className="token-button">
            Login
          </Button>
        </Form>
        
       
        <div className="back-to-home">
          <Link to="/" className="back-to-home-link">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
