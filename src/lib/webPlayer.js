let player;
let deviceId = null;

export function initWebPlayer(getToken) {
  if (!window.Spotify) return;

  player = new Spotify.Player({
    name: 'Musical Giggle Web Player',
    getOAuthToken: cb => getToken().then(token => cb(token)),
    volume: 0.5
  });

  player.addListener('ready', ({ device_id }) => {
    console.log("Player pronto! Device ID:", device_id);
    deviceId = device_id;
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.warn("Device offline:", device_id);
  });

  player.connect();
}

export function getDeviceId() {
  return deviceId;
}

export async function playTrack(uri) {
  const id = getDeviceId();
  if (!id) return console.error("Web Player non pronto!");

  await fetch(`/api/player/play?device_id=${id}`, {
    method: "PUT",
    body: JSON.stringify({
      uris: [uri]
    })
  });
}