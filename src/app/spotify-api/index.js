const fetch = require('node-fetch'); // invece di import

const clientId = "5979d3795e394bfaa968cd6e39f409d5";
const clientSecret = "523b87864be745b3b693b2ee08bfe144";

async function getToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  return data.access_token;
}

async function getArtist() {
  const token = await getToken();
  const res = await fetch('https://api.spotify.com/v1/artists/1uNFoZAHBGtllmzznpCI3s', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  console.log(data);
}

getArtist();
