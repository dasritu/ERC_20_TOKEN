import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../api/AxiosInstance";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './Registration.css';
import { useEffect } from "react";
export default function Registration() {
  const [fullName, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/erc20/dashboard");
    }
  }, [navigate]);
  const registerUser = async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/user/register/", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Something went wrong!";
    }
  };

  const validation = () => {
    const errors = {};
    if (!fullName) {
      errors.fullName = "Please Enter Full Name";
    }
    if (!email) {
      errors.email = "Please Enter Your Email";
    }
    if (!phone) {
      errors.phone = "Please Enter Phone Number";
    }
    if (!password) {
      errors.password = "Please Enter Password";
    } else {
      if (password.length < 8) {
        errors.password = "Password must contain at least 8 characters.";
      }
      if (!isNaN(password)) {
        errors.password = "Password cannot be entirely numeric.";
      }
      const commonPasswords = ["12345678", "password", "11111111", "1234"];
      if (commonPasswords.includes(password)) {
        errors.password = "This password is too common.";
      }
    }

    if (!confirmPass || password !== confirmPass) {
      errors.confirmPass =
        "Please Enter Password or Please Be sure your Password matches with this Password";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const err = validation();
    if (Object.keys(err).length > 0) {
      setError(err);
    } else {
      setError({});
      setLoading(true);
      console.log("Form Submitted");
      setMessage("Registration Successful");
      const requestData = {
        full_name: fullName,
        phone: phone,
        email: email,
        password: password,
        password2: confirmPass,
      };

      try {
        const data = await registerUser(requestData);
        console.log(data);
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setConfirmPass("");
        navigate("/login");
      } catch (error) {
        console.log("Registration Failed", error);
        setMessage("Error In Registration");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <Form className="form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label><strong>Full Name</strong></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              className="input-style"
              value={fullName}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!error.fullName}
            />
            <Form.Control.Feedback type="invalid">{error.fullName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicNumber">
            <Form.Label><strong>Phone Number</strong></Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Phone Number"
              className="input-style"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isInvalid={!!error.phone}
            />
            <Form.Control.Feedback type="invalid">{error.phone}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label><strong>Email address</strong></Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              className="input-style"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!error.email}
            />
            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            <Form.Control.Feedback type="invalid">{error.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label><strong>Password</strong></Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              className="input-style"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!error.password}
            />
            <Form.Control.Feedback type="invalid">{error.password}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label><strong>Confirm Password</strong></Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              className="input-style"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              isInvalid={!!error.confirmPass}
            />
            <Form.Control.Feedback type="invalid">{error.confirmPass}</Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="token-button">
            {loading ? "Registering ..." : "Register"}
          </Button>
        </Form>

        {loading && <Spinner animation="border" variant="primary" />}

        {message && (
          <div className="alert alert-success mt-3" role="alert">
            {message}
          </div>
        )}

        <div className="links-container">
          <Link to="/" className="link">Back to Home</Link>
          <span className="separator">|</span>
          <Link to="/login" className="link">Already registered? Login</Link>
        </div>
      </div>
    </div>
  );
}
