import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CreateTaskButton from "./CreateTaskButton";
import "./Home.css";

export default function Home({ user }) {
  const [tasks, setTasks] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    fetch("/tasks")
      .then((response) => response.json())
      .then((json) => setTasks(json));
  }, []);

  function deleteTask(taskId) {
    fetch("/tasks/" + taskId, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
    });
  }

  if (!user) {
    return (
      <div>
        <div className="background"></div>
        <div className="main">
          <Container>
            <Row>
              <Col>
                <div className="header">Welcome to Tasker!</div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <div className="top-row">
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
      </div>

      <Row>
        {tasks.length > 0 ? (
          <Container>
            <Row>
              <Tabs
                defaultActiveKey="profile"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey="not-yet-started" title="Not Yet Started">
                  <Row>
                    {tasks.map((task) => (
                      <Col
                        md={3}
                        className="mb-4 d-flex justify-content-center"
                      >
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
                              <Button
                                variant="danger"
                                className="mt-3 me-3"
                                onClick={() => deleteTask(task.id)}
                              >
                                Delete task
                              </Button>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab>
                <Tab eventKey="pending" title="Pending">
                  Tab content for Profile
                </Tab>
                <Tab eventKey="completed" title="Completed">
                  Tab content for Loooonger Tab
                </Tab>
              </Tabs>
            </Row>
          </Container>
        ) : (
          <p>No tasks created yet!</p>
        )}
      </Row>
    </Container>
  );
}
