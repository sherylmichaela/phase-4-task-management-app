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
  const [signupSuccess, setSignupSuccess] = useState("");

  function signup(e) {
    e.preventDefault();

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
            </div>
            <div className="form-group mb-4 mt-4">
              <label>Email</label>
              <input
                type="email"
                value={email}
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label>Password</label>
              <input
                type="password"
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
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
