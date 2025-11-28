// src/components/buttonPrevSong.jsx
"use client";

import React from "react";
import "./buttonNextSong.css"; // riusa gli stessi stili del btn piatto

export default function ButtonPrevSong({ onPrev, disabled = false, title = "Previous", className = "" }) {
  return ( 
    <> 
    <button
      type="button"
      className={`btn-next-flat ${disabled ? "disabled" : ""} ${className}`}
      onClick={() => !disabled && onPrev && onPrev()}
      aria-label="Previous track"
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
        {/* icon: rewind / previous */}
        <path d="M18 6v12l-8.5-6L18 6zM9.5 6v12h-2V6h2z" />
      </svg>
    </button> 
     </>
  );
}
 