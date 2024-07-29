import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout({ user, setUser }) {
  useEffect(() => {
    fetch("/logout", {
      method: "DELETE",
    }).then((response) => setUser(null));
  }, [setUser]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return null;
}
