// src/components/ButtonAddToPlaylist.jsx
"use client";

import React from "react";
import "./ButtonAddToPlaylist.css"; 

export default function ButtonAddToPlaylist({
  onClick,
  href,
  title = "Aggiungi alla playlist",
  ariaLabel = "Aggiungi alla playlist",
  className = "",
  compact = false,
  active = false,
}) {
  const inner = (
    <span className={`bap-inner ${compact ? "compact" : ""}`}>
      <svg
        className="bap-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );

  const common = {
    className: `btn-add-playlist ${compact ? "compact" : ""} ${active ? "active" : ""} ${className}`.trim(),
    title,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a {...common} href={href} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button {...common} type="button" onClick={onClick}>
      {inner}
    </button>
  );
}
 