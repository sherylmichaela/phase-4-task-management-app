import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CreateTaskButton from "./CreateTaskButton";
import backgroundImage from "../assets/main-bg.jpg";
import "./Home.css";

export default function Home({ user }) {
  const [tasks, setTasks] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    fetch("/tasks")
      .then((response) => response.json())
      .then((json) => setTasks(json));
  }, []);

  if (!user) {
    return (
      <div>
        <div className="background"></div>
        <Container>
          <Row>
            <Col>Welcome to the app. Pls log in!</Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col sm={10}>
          <h1>Welcome, {user.username}!</h1>
        </Col>
        <Col sm={2} className="d-flex justify-content-end">
          <div className="form-group">
            <Button variant="primary" onClick={() => setModalShow(true)}>
              Create a new task
            </Button>
            <CreateTaskButton
              show={modalShow}
              onHide={() => setModalShow(false)}
              tasks={tasks}
              setTasks={setTasks}
            />
          </div>
        </Col>
      </Row>
      <Row>
        {tasks.length > 0 ? (
          <React.Fragment>
            <Container>
              <Row>
                {tasks.map((task) => (
                  <Col md={3} className="mb-4 d-flex justify-content-center">
                    <Card
                      bg="secondary"
                      key="secondary"
                      style={{ width: "18rem" }}
                    >
                      {/* <Card.Header></Card.Header> */}
                      <Card.Body>
                        <Card.Title>{task.task_name}</Card.Title>
                        <Card.Text>
                          Test <br />
                          <Button variant="primary" className="mt-3 me-3">
                            Edit task
                          </Button>
                          <Button variant="danger" className="mt-3 me-3">
                            Delete task
                          </Button>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </React.Fragment>
        ) : (
          <p>No tasks created!</p>
        )}
      </Row>
    </Container>
  );
}
