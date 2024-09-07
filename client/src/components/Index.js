import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Outlet, Link } from "react-router-dom";
import React from "react";
import "./Index.css";
import logo from "../assets/tasker-logo.png";

export default function Index({ user }) {
  return (
    <React.Fragment>
      <Navbar className="navbar-custom">
        <Container>
          <Link to="/login">
            <Navbar.Brand>
              <img
                src={logo}
                className="d-inline-block align-top navbar-logo"
                alt="Tasker Logo"
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {user ? (
              <React.Fragment>
                <Navbar.Text className="me-3">
                  Signed in as: {user.username}
                </Navbar.Text>
                <Link to="/logout">
                  <button className="btn btn-danger">Logout</button>
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Link to="/login">
                  <button className="btn btn-default">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="btn btn-default">Signup</button>
                </Link>
              </React.Fragment>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </React.Fragment>
  );
}
