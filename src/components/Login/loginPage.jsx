'use client';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const handleSpotifyLogin = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
      method: 'POST'
    }).then(res => res.json());
    window.location.href = res.url; 
    console.log('Response from login API:', res);
  } catch (err) {
    console.error('Errore durante login:', err);
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img id="logo" src="Untitled.png" alt="Spotify Logo" />
          <h1 className="logo">Spotify</h1>    
        </div>
          <button type="button" onClick={handleSpotifyLogin} className="btn-submit">
            Login con Spotify
          </button>
        
      </div>
    </div>
  );
}