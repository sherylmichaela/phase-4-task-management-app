import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import CreateTask from "./CreateTask";
import "./CreateTaskButton.css";

export default function CreateTaskButton(props) {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  // const [tasks, setTasks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // CreateTask({ taskName, category, taskDueDate });

    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_name: taskName,
        category: category,
        task_due_date: taskDueDate.toString(),
        task_status: "pending",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.id) {
          props.setTasks([...props.tasks, json]);
          setTaskName("");
          setCategory("");
          setTaskDueDate("");
          props.onHide();
        }
      });
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
          <Form onSubmit={handleSubmit}>
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

            <Row className="mt-3">
              <Col>
                <input
                  type="submit"
                  className="btn btn-primary btn-block"
                  value="Add task"
                  onClick={props.onHide}
                />
              </Col>
              <Col>
                <input
                  type="submit"
                  className="btn btn-secondary btn-block"
                  value="Close"
                  onClick={props.onHide}
                />
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
