import express from 'express';
import fetch from 'node-fetch';
import querystring from 'querystring';

const router = express.Router();
const clientId = 'f05d7fc2d5a64364ae97b290691ca86d';
const clientSecret = '8bfa81dddb8c4e698969a9d47f3044e2';
const redirectUri = 'http://localhost:3000/callback';


router.get('/login', (req, res) => {
  const scope = 'user-read-email user-read-private';
  const url = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri
    });
  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });
  const data = await response.json()
  res.json(data);
});

export default router;


