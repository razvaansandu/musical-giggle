'use client';
import React from 'react';
import './login.css';

export default function LoginPage() {
  const handleSpotifyLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/callback';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img id="logo" src="Untitled.png" alt="Spotify Logo" />
          <h1 className="logo">Spotify</h1>
          <div className="tabs">
            <button className="tab active">Login</button>
          </div>
        </div>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Email</label>
            <input type="text" placeholder="example@gmail.com" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="password" />
          </div>

          <div className="form-options">
            <label className="checkbox">
              <input type="checkbox" />
              Stay signed in
            </label>
            <a href="#forgetPassword" className="forgot">
              Forgot Password?
            </a>
          </div>

          <button type="button" onClick={handleSpotifyLogin} className="btn-submit">
            Login con Spotify
          </button>
        </form>
      </div>
    </div>
  );
}
