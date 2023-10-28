import React from "react";
import { Button } from "react-bootstrap";

export default function LogoutButton() {
const logout = () => {
    localStorage.removeItem("jwt");
    window.location.replace("../login");
}

  return (
    <Button className="btn btn-danger rounded-0 ms-1" onClick={logout}>
                Logout
    </Button>
  );
}