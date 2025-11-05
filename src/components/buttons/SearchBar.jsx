// src/components/SearchBar.jsx
"use client";

import React from "react";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Cerca brani, artisti, album...", className = "" }) {
  return (
    <div className={`search-bar ${className}`}> 
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      

      <input 
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="Cerca"
      />
    </div>
  );
}
 