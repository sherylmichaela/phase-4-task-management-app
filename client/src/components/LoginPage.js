import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./LoginPage.css";

export default function LoginPage({ user, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setLoginError("");
    setLoginSuccess("");

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.id) {
          setUser(json);
          setLoginSuccess("Login successful!");
        } else {
          setLoginError("Invalid username or password. Pls try again.");
        }
      });
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="background"></div>
      <Container className="centered-container">
        <Row>
          <Col xs md="auto">
            <h1>Please log in to get started:</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4 mt-4">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  className="form-control"
                  onChange={(e) => setUsername(e.target.value)}
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
                  value="Login"
                />
              </div>
            </form>
            <p>
              First time here? <Link to="/signup">Sign up here</Link>
            </p>
            <p className="error">{loginError}</p>
            <p>{loginSuccess}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
