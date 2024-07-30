import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CreateTaskButton from "./CreateTaskButton";

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
      <Container>
        <Row>
          <Col>Welcome to the app. Pls log in!</Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col sm={10}>
          <h1>Welcome back, {user.username}!</h1>
        </Col>
        <Col sm={2} className="d-flex justify-content-end">
          <div className="form-group">
            <Button variant="primary" onClick={() => setModalShow(true)}>
              Create a new task
            </Button>
            <CreateTaskButton
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </div>
        </Col>
      </Row>
      <Row>
        {tasks.length > 0 ? (
          <React.Fragment>
            {/* <Tab.Container
              id="list-group-tabs-example"
              defaultActiveKey="#link1"
            >
              <Row>
                <Col sm={4}>
                  <ListGroup>
                    {tasks.map((task, index) => (
                      <ListGroup.Item key={index} action href={`#link${index}`}>
                        {task.task_name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col sm={8}>
                  <Tab.Content>
                    {tasks.map((task, index) => (
                      <Tab.Pane key={index} eventKey={`#link${index}`}>
                        List of subtasks
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container> */}
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
                        <Card.Text>Test</Card.Text>
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
