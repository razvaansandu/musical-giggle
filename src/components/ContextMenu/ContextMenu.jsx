"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ContextMenu.module.css";

export default function ContextMenu({
  visible,
  x,
  y,
  items = [],
  onClose,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return createPortal(
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        top: `${y}px`, 
        left: `${x}px`,
      }}
      role="menu"
    >
      {items.map((item, idx) => {
        if (item.divider) {
          return <div key={`divider-${idx}`} className={styles.divider} />;
        }

        return (
          <button
            key={item.id || idx}
            className={`${styles.menuItem} ${
              item.danger ? styles.danger : ""
            }`}
            onClick={() => {
              item.action?.();
              onClose();
            }}
            role="menuitem"
          >
            {item.icon && (
              <span className={styles.icon}>{item.icon}</span>
            )}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>,
    document.body
  );
} 