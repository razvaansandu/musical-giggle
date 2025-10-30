import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const clientId = '3c80f6f31cfe41fbb1e3a02175af8c83';
const clientSecret = 'dc49d39e13dd49baac725c0d949fe8c0';

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });
  const data = await response.json();
  return data.access_token;
}

router.get('/:id', async (req, res) => {
  const artistId = req.params.id;
  try {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel prendere info artista' });
  }
});

router.get('/:id/top-tracks', async (req, res) => {
  const artistId = req.params.id;
  try {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=IT`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel prendere top tracks artista' });
  }
});

export default router;
