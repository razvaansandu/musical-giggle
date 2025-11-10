// src/components/ButtonHome.jsx
"use client";

import React from "react";
import "./buttonHome.css";

export default function ButtonHome({
  onClick,
  href, 
  title = "Home",
  ariaLabel = "Go to Home",
  className = "",
  variant = "flat" // "flat" | "ghost"
}) {
  const content = ( 
   <button className="btn-home"> 
    <span className="bh-inner">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
</svg> 
    </span> 
   </button> 
  );

  const commonProps = {
    className: `btn-home ${variant} ${className}`.trim(),
    title,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a {...commonProps} href={href} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps} type="button" onClick={onClick}>
      {content}
    </button>
  );
}
 