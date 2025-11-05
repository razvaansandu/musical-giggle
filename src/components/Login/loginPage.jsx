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
    window.location.href = res.url; // Reindirizza l'utente all'URL di autenticazione di Spotify
    console.log('Response from login API:', res);
    /*if (res.ok) {
      router.push('/home'); 
    } else {
      alert('Login fallito!');
    }*/
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