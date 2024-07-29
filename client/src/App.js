import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Index from "./components/Index";
import LoginPage from "./components/LoginPage";
import Logout from "./components/Logout";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/me")
      .then((response) => response.json())
      .then((json) => {
        if (json.id) {
          setUser(json);
        }
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index user={user} />}>
          <Route index element={<Home user={user} />} />
          <Route path="signup" />
          <Route
            path="login"
            element={<LoginPage user={user} setUser={setUser} />}
          />
          <Route
            path="logout"
            element={<Logout user={user} setUser={setUser} />}
          />
          <Route path="new_task" />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
