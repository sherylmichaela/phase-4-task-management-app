import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./SignupPage.css";

export default function SignupPage({ user, setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidUsername, setInvalidUsername] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [invalidPassword, setInvalidPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  function validateUsername(username) {
    const pattern = /^[a-zA-Z][a-zA-Z0-9_.]{2,18}[a-zA-Z0-9]$/;
    return pattern.test(username);
  }

  function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9_.-]+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,5}$/;
    return pattern.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function signup(e) {
    e.preventDefault();

    let valid = true;

    if (!validateUsername(username)) {
      setInvalidUsername("Invalid username");
      valid = false;
    }

    if (!validateEmail(email)) {
      setInvalidEmail("Invalid email address");
      valid = false;
    }

    if (!validatePassword(password)) {
      setInvalidPassword("Password must be at least 6 characters long");
      valid = false;
    }

    if (valid) {
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.id) {
            setUser(json);
            setUsername("");
            setEmail("");
            setPassword("");
            setSignupSuccess("User account has been created.");
          }
        });
    }
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="centered-container">
      <Row>
        <Col xs md="auto">
          <h1>Sign up here to get started</h1>
          <form onSubmit={signup}>
            <div className="form-group mb-4 mt-4">
              <label>Username</label>
              <input
                type="text"
                value={username}
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
              />
              <p>{invalidUsername}</p>
            </div>
            <div className="form-group mb-4 mt-4">
              <label>Email</label>
              <input
                type="email"
                value={email}
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
              <p>{invalidEmail}</p>
            </div>
            <div className="form-group mb-4">
              <label>Password</label>
              <input
                type="password"
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
              <p>{invalidPassword}</p>
            </div>
            <div className="form-group">
              <input
                type="submit"
                className="btn btn-primary btn-block mb-4"
                value="Sign Up"
              />
            </div>
          </form>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
          <p>{signupSuccess}</p>
        </Col>
      </Row>
    </Container>
  );
}
