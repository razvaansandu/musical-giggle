"use client";

import React from "react";
import "./buttonNews.css";

export default function ButtonNews({
  onClick,
  href,
  active = false,
  badge = 0,          
  title = "Novità",
  ariaLabel = "Vai alle novità",
  className = "",
}) {
  const inner = (
    <span className="bn-inner">
       <svg className="bb-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 1 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
      </svg> 

      {badge > 0 && <span className="bn-badge" aria-hidden="true">{badge > 99 ? "99+" : badge}</span>}
    </span>
  );

  const common = {
    className: `btn-novita ${active ? "active" : ""} ${className}`.trim(),
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
 