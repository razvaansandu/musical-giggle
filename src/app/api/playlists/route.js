import express from 'express';
import { searchPlaylist, getPlaylistById } from '../services/spotifyService.js';

const router = express.Router();

router.get('/playlist', async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ error: 'Parametro "name" mancante' });
    }

    const playlists = await searchPlaylist(name);
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel server Spotify API' });
  }
});

router.get('/playlist/:id', async (req, res) => {
  try {
    const playlist = await getPlaylistById(req.params.id);
    res.json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel server Spotify API' });
  }
});

export default router;
