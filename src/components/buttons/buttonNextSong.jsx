// src/components/buttonNextSong.jsx
"use client";

import React from "react";
import "./buttonNextSong.css";

export default function ButtonNextSong({ onNext, disabled = false, title = "Next", className = "" }) {
  return (
    <button
      type="button"
      className={`btn-next-flat ${disabled ? "disabled" : ""} ${className}`}
      onClick={() => !disabled && onNext && onNext()}
      aria-label="Next track"
      title={title}
      disabled={disabled}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6 18V6l8.5 6L6 18zM14.5 6v12h2V6h-2z" />
      </svg>
    </button>
  );
}
 