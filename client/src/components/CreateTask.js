import { useState } from "react";

export default function CreateTask({ user }) {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [tasks, setTasks] = useState([]);

  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task_name: taskName,
      category: category,
      task_due_date: taskDueDate,
      task_status: "pending",
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.id) {
        setTasks([...tasks, json]);
        setTaskName("");
        setCategory("");
        setTaskDueDate("");
      }
    });
}
