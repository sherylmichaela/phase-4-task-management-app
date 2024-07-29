import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Outlet, Link } from "react-router-dom";
import React from "react";

export default function Index({ user }) {
  return (
    <React.Fragment>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Link to="/">
            <Navbar.Brand>Task Management App</Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {user ? (
              <React.Fragment>
                <Navbar.text>Signed in as: {user.username}</Navbar.text>
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
