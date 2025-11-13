"use client";
import React, { useEffect, useState } from "react";
import "./buttonLoop.css";

// mode: 'off' | 'context' | 'track'
export default function ButtonLoop({ mode: controlledMode, onChange, className = "", title = "Repeat" }) {
  const [mode, setMode] = useState(controlledMode ?? "off");

  useEffect(() => {
    if (controlledMode !== undefined && controlledMode !== mode) setMode(controlledMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledMode]);

  const nextMode = (m) => (m === "off" ? "context" : m === "context" ? "track" : "off");

  function handleClick() {
    const next = nextMode(mode);
    if (controlledMode === undefined) setMode(next);
    if (onChange) onChange(next);
  }

  const ariaLabel = mode === "off" ? "Repeat off" : mode === "context" ? "Repeat all" : "Repeat one";

  return (
    <button
      type="button"
      className={`btn-loop ${mode !== "off" ? "active" : ""} ${mode === "track" ? "one" : ""} ${className}`.trim()}
      onClick={handleClick}
      aria-pressed={mode !== "off"}
      aria-label={ariaLabel}
      title={title + (mode !== "off" ? ` (${ariaLabel})` : "")}
    >
      {/* Repeat icon */}
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path
          d="M7 7h10l-2.5-2.5 1.06-1.06L20.12 6 15.56 10.56 14.5 9.5 17 7H7v2zm10 10H7l2.5 2.5-1.06 1.06L3.88 18 8.44 13.44 9.5 14.5 7 17h10v-2z"
          fill="currentColor"
        />
      </svg>

      {/* small 1 overlay when in 'track' mode */}
      {mode === "track" && <span className="one">1</span>}
    </button>
  );
}
