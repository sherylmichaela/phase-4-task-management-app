import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import CreateTask from "./CreateTask";

export default function CreateTaskButton(props) {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    CreateTask({ taskName, category, taskDueDate });
    props.onHide();
  };

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
                <Form.Group className="mb-3" controlId="formTaskName">
                  <Form.Label>What's your task?</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buy groceries"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    autoFocus
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Shopping"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    autoFocus
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formDueDate">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    autoFocus
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Form onSubmit={handleSubmit}>
          <Button variant="secondary" className="me-2" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Add task
          </Button>
        </Form>
      </Modal.Footer>
    </Modal>
  );
}
