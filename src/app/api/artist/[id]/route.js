import fetch from 'node-fetch';
import { Buffer } from 'buffer';

const clientId = '3c80f6f31cfe41fbb1e3a02175af8c83';
const clientSecret = 'dc49d39e13dd49baac725c0d949fe8c0';

// 🔑 Funzione per ottenere il token Spotify
async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });

  const data = await response.json();
  return data.access_token;
}

// 🎵 Endpoint per info artista
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const token = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    return Response.json(data);

  } catch (err) {
    console.error('Errore artista:', err);
    return new Response(JSON.stringify({ error: 'Errore nel prendere info artista' }), { status: 500 });
  }
}
