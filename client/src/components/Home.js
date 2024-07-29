import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

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

  function CreateTaskButton(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create a new task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <Row>
                <Col xs={12}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>What's your task?</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Buy groceries"
                      autoFocus
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Shopping"
                      autoFocus
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control type="date" autoFocus />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={props.onHide}>
            Add task
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
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
            {tasks.map((task) => {
              return (
                <Row>
                  <Col>
                    <h3>{task.task_name}</h3>
                  </Col>
                </Row>
              );
            })}
          </React.Fragment>
        ) : (
          <p>No tasks created!</p>
        )}
      </Row>
    </Container>
  );
}
