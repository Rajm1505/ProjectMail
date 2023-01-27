import React from "react";
import "./spinner.css";

export default function LoadingSpinner() {
  return (
    <div className="d-flex m-5">

      <div className="spinner-container m-auto">
        <div className="loading-spinner">
        </div>
      </div>
    </div>
  );
}