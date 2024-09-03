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
// import EditTaskButton from "./EditTaskButton";
import "./Home.css";

export default function Home({ user }) {
  const [tasks, setTasks] = useState([]);
  const [modalShowCreateTask, setModalShowCreateTask] = React.useState(false);
  // const [modalShowEditTask, setModalShowEditTask] = React.useState(false);

  // Fetches tasks
  useEffect(() => {
    fetch("/tasks")
      .then((response) => response.json())
      .then((json) => {
        const tasksWithTags = json.map((task) =>
          fetch(`/tasks/${task.id}/tasktags`)
            .then((response) => response.json())
            .then((tags) => ({ ...task, tags }))
        );

        // Wait for all tasks to have their tags fetched
        Promise.all(tasksWithTags).then((updatedTasks) =>
          setTasks(updatedTasks)
        );
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

  // Checks if any user is signed in.
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
        {tasks.length > 0 ? (
          <Container>
            <Row>
              <Tabs
                defaultActiveKey="profile"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey="all-tasks" title="All">
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
                            {/* <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end"
                            >
                              {task.task_status}
                            </Badge> */}
                            <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end me-1"
                            >
                              {task.task_due_date.substring(0, 10)}
                            </Badge>
                            <br />
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
                                      variant="primary"
                                      // onClick={() => setModalShowEditTask(true)}
                                    >
                                      Edit
                                    </Button>
                                    {/* <EditTaskButton
                                      show={modalShowEditTask}
                                      onHide={() => setModalShowEditTask(false)}
                                      tasks={tasks}
                                      setTasks={setTasks}
                                      // backdrop={false}
                                    /> */}
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
                </Tab>
                <Tab eventKey="not-yet-started" title="Not Yet Started">
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
                          {/* <Card.Header></Card.Header> */}
                          <Card.Body>
                            {/* <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end"
                            >
                              {task.task_status}
                            </Badge> */}
                            <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end me-1"
                            >
                              {task.task_due_date.substring(0, 10)}
                            </Badge>
                            <br />
                            <Card.Title>{task.task_name}</Card.Title>
                            <Card.Text>
                              {Array.isArray(task.tags) &&
                              task.tags.length > 0 ? (
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
                                      variant="primary"
                                      // onClick={() => setModalShowEditTask(true)}
                                    >
                                      Edit
                                    </Button>
                                    {/* <EditTaskButton
                                      show={modalShowEditTask}
                                      onHide={() => setModalShowEditTask(false)}
                                      // tasks={tasks}
                                      // setTasks={setTasks}
                                    /> */}
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
                </Tab>
                <Tab eventKey="pending" title="Pending">
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
                          {/* <Card.Header></Card.Header> */}
                          <Card.Body>
                            {/* <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end"
                            >
                              {task.task_status}
                            </Badge> */}
                            <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end me-1"
                            >
                              {task.task_due_date.substring(0, 10)}
                            </Badge>
                            <br />
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
                                      variant="primary"
                                      // onClick={() => setModalShowEditTask(true)}
                                    >
                                      Edit
                                    </Button>
                                    {/* <EditTaskButton
                                      show={modalShowEditTask}
                                      onHide={() => setModalShowEditTask(false)}
                                      // tasks={tasks}
                                      // setTasks={setTasks}
                                    /> */}
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
                </Tab>
                <Tab eventKey="completed" title="Completed">
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
                          {/* <Card.Header></Card.Header> */}
                          <Card.Body>
                            {/* <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end"
                            >
                              {task.task_status}
                            </Badge> */}
                            <Badge
                              pill
                              bg="info"
                              text="dark"
                              className="float-end me-1"
                            >
                              {task.task_due_date.substring(0, 10)}
                            </Badge>
                            <br />
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
                                      variant="primary"
                                      // onClick={() => setModalShowEditTask(true)}
                                    >
                                      Edit
                                    </Button>
                                    {/* <EditTaskButton
                                      show={modalShowEditTask}
                                      onHide={() => setModalShowEditTask(false)}
                                      // tasks={tasks}
                                      // setTasks={setTasks}
                                    /> */}
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
