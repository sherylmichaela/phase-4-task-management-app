import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import "./CreateTaskButton.css";

export default function CreateTaskButton(props) {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [radioValue, setRadioValue] = useState("not yet started");
  const [tags, setTags] = useState("");

  const radios = [
    {
      name: "Not Yet Started",
      value: "not yet started",
      variant: "outline-secondary",
    },
    { name: "Pending", value: "pending", variant: "outline-warning" },
    { name: "Completed", value: "completed", variant: "outline-success" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (taskName.trim() === "") {
      alert("Task name is required.");
      return;
    }

    const dueDate = taskDueDate
      ? taskDueDate
      : new Date().toISOString().split("T")[0];

    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_name: taskName,
        category: category,
        task_due_date: dueDate.toString(),
        task_status: radioValue,
      }),
    })
      .then((response) => response.json())
      .then((task) => {
        if (task.id) {
          // If the task was created successfully, submit each tag
          const tagRequests = tags
            .split(",")
            .map((tag) => tag.trim())
            .map((tag_name) =>
              fetch(`/tasks/${task.id}/tasktags`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ tag_name }),
              })
            );

          // Wait for all tag requests to finish
          Promise.all(tagRequests)
            .then(() =>
              // Refetch the task to get the updated tags
              fetch(`/tasks/${task.id}`)
            )
            .then((response) => response.json())
            .then((updatedTask) => {
              // Add the task with its tags to the task list in the parent component
              props.setTasks([...props.tasks, updatedTask]);
              setTaskName("");
              setCategory("");
              setTaskDueDate("");
              setTags(""); // Clear tags input after submit
              props.onHide();
            });
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
                  <Form.Label>What's your task?*</Form.Label>
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
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <br />
                  <ButtonGroup>
                    {radios.map((radio, idx) => (
                      <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={radio.variant}
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                      >
                        {radio.name}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formTags">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. urgent, work, personal"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
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
                />
              </Col>
              <Col>
                <input
                  type="button"
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
