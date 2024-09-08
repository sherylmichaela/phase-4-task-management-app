import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CreateTaskButton from "./CreateTaskButton";
import "./Home.css";
import { Navigate } from "react-router-dom";

export default function Home({ user }) {
  const [tasks, setTasks] = useState([]);
  const [modalShowCreateTask, setModalShowCreateTask] = React.useState(false);

  // Fetches tasks
  useEffect(() => {
    fetch("/tasks")
      .then((response) => response.json())
      .then((json) => {
        if (json.length) {
          const tasksWithTags = json.map((task) =>
            fetch(`/tasks/${task.id}/tasktags`)
              .then((response) => response.json())
              .then((tags) => ({ ...task, tags }))
          );

          // Wait for all tasks to have their tags fetched
          Promise.all(tasksWithTags).then((updatedTasks) =>
            setTasks(updatedTasks)
          );
        }
      });
  }, []);

  // Deletes task
  function deleteTask(taskId) {
    fetch("/tasks/" + taskId, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
    });
  }

  // Edit task to change status to 'Complete' task
  function completeTask(taskId) {
    fetch("/tasks/" + taskId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_status: "completed",
      }),
    })
      .then((response) => response.json())
      .then(() => {
        // Update the tasks state to reflect the new task status
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, task_status: "completed" } : task
          )
        );
      })
      .catch((error) => console.error("Error completing task:", error));
  }

  // Checks if any user is signed in.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Not Yet Started, Pending and Completed Tasks
  const notYetStartedTasks = tasks.filter(
    (task) => task.task_status === "not yet started"
  );
  const pendingTasks = tasks.filter((task) => task.task_status === "pending");
  const completedTasks = tasks.filter(
    (task) => task.task_status === "completed"
  );

  return (
    <Container className="mt-5">
      <div className="top-row">
        <Row className="mb-4">
          <Col sm={10}>
            <h1>Welcome, {user.username}!</h1>
          </Col>
          <Col sm={2} className="d-flex justify-content-end">
            <div className="form-group">
              <Button
                variant="primary"
                onClick={() => setModalShowCreateTask(true)}
              >
                Create a new task
              </Button>
              <CreateTaskButton
                show={modalShowCreateTask}
                onHide={() => setModalShowCreateTask(false)}
                tasks={tasks}
                setTasks={setTasks}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Row>
        <Container>
          <Row>
            <Tabs
              defaultActiveKey="all-tasks"
              id="justify-tab-example"
              className="mb-3"
              justify
            >
              <Tab eventKey="all-tasks" title="All">
                {tasks.length > 0 ? (
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
                          <Card.Header>
                            <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end me-1"
                            >
                              {task.task_due_date.substring(0, 10)}
                            </Badge>
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>{task.task_name}</Card.Title>
                            <Card.Text>
                              {task.tags && task.tags.length > 0 ? (
                                task.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    pill
                                    bg="dark"
                                    className="me-2 mb-3"
                                  >
                                    {tag.tag_name}
                                  </Badge>
                                ))
                              ) : (
                                <p>No tags</p>
                              )}

                              <Row>
                                <Col md={6}>
                                  <div className="d-grid gap-2 mt-3 form-group">
                                    <Button
                                      variant="success"
                                      className="complete-task-button"
                                      onClick={() => completeTask(task.id)}
                                      disabled={
                                        task.task_status === "completed"
                                      }
                                    >
                                      {task.task_status === "completed"
                                        ? "Completed"
                                        : "Complete"}
                                    </Button>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="d-grid gap-2 mt-3">
                                    <Button
                                      variant="danger"
                                      onClick={() => deleteTask(task.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="notask">No task created yet</p>
                )}
              </Tab>
              <Tab eventKey="not-yet-started" title="Not Yet Started">
                {notYetStartedTasks.length > 0 ? (
                  <Row>
                    {notYetStartedTasks.map((task) => (
                      <Col
                        md={3}
                        className="mb-4 d-flex justify-content-center"
                      >
                        <Card
                          bg="secondary"
                          key="secondary"
                          style={{ width: "18rem" }}
                        >
                          <Card.Header>
                            <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end me-1"
                            >
                              {task.task_due_date.substring(0, 10)}
                            </Badge>
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>{task.task_name}</Card.Title>
                            <Card.Text>
                              {task.tags && task.tags.length > 0 ? (
                                task.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    pill
                                    bg="dark"
                                    className="me-2 mb-3"
                                  >
                                    {tag.tag_name}
                                  </Badge>
                                ))
                              ) : (
                                <p>No tags</p>
                              )}

                              <Row>
                                <Col md={6}>
                                  <div className="d-grid gap-2 mt-3 form-group">
                                    <Button
                                      variant="success"
                                      className="complete-task-button"
                                      onClick={() => completeTask(task.id)}
                                    >
                                      Complete
                                    </Button>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="d-grid gap-2 mt-3">
                                    <Button
                                      variant="danger"
                                      onClick={() => deleteTask(task.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="notask">No task created yet</p>
                )}
              </Tab>
              <Tab eventKey="pending" title="Pending">
                {pendingTasks.length > 0 ? (
                  <Row>
                    {pendingTasks.map((task) => (
                      <Col
                        md={3}
                        className="mb-4 d-flex justify-content-center"
                      >
                        <Card
                          bg="secondary"
                          key="secondary"
                          style={{ width: "18rem" }}
                        >
                          <Card.Header>
                            <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end me-1"
                            >
                              {task.task_due_date.substring(0, 10)}
                            </Badge>
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>{task.task_name}</Card.Title>
                            <Card.Text>
                              {task.tags && task.tags.length > 0 ? (
                                task.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    pill
                                    bg="dark"
                                    className="me-2 mb-3"
                                  >
                                    {tag.tag_name}
                                  </Badge>
                                ))
                              ) : (
                                <p>No tags</p>
                              )}

                              <Row>
                                <Col md={6}>
                                  <div className="d-grid gap-2 mt-3 form-group">
                                    <Button
                                      variant="success"
                                      className="complete-task-button"
                                      onClick={() => completeTask(task.id)}
                                    >
                                      Complete
                                    </Button>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="d-grid gap-2 mt-3">
                                    <Button
                                      variant="danger"
                                      onClick={() => deleteTask(task.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="notask">No task created yet</p>
                )}
              </Tab>
              <Tab eventKey="completed" title="Completed">
                {completedTasks.length > 0 ? (
                  <Row>
                    {completedTasks.map((task) => (
                      <Col
                        md={3}
                        className="mb-4 d-flex justify-content-center"
                      >
                        <Card
                          bg="secondary"
                          key="secondary"
                          style={{ width: "18rem" }}
                        >
                          <Card.Header>
                            <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end me-1"
                            >
                              {task.task_due_date.substring(0, 10)}
                            </Badge>
                          </Card.Header>
                          <Card.Body>
                            <Card.Title>{task.task_name}</Card.Title>
                            <Card.Text>
                              {task.tags && task.tags.length > 0 ? (
                                task.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    pill
                                    bg="dark"
                                    className="me-2 mb-3"
                                  >
                                    {tag.tag_name}
                                  </Badge>
                                ))
                              ) : (
                                <p>No tags</p>
                              )}

                              <Row>
                                <Col md={6}>
                                  <div className="d-grid gap-2 mt-3 form-group">
                                    <Button
                                      variant="success"
                                      className="complete-task-button"
                                      onClick={() => completeTask(task.id)}
                                      disabled
                                    >
                                      Complete
                                    </Button>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="d-grid gap-2 mt-3">
                                    <Button
                                      variant="danger"
                                      onClick={() => deleteTask(task.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="notask">No task created yet</p>
                )}
              </Tab>
            </Tabs>
          </Row>
        </Container>
      </Row>
    </Container>
  );
}
