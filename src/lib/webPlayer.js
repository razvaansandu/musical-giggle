let player;
let deviceId = null;

export function initWebPlayer(getToken) {
  if (!window.Spotify) return;

  player = new Spotify.Player({
    name: "Musical Giggle Web Player",
    getOAuthToken: async (cb) => cb(await getToken()),
    volume: 0.5,
  });

  player.addListener("ready", ({ device_id }) => {
    console.log("🎧 Player Web pronto! Device:", device_id);
    deviceId = device_id;
  });

  player.addListener("not_ready", ({ device_id }) => {
    console.warn("⚠ Device offline:", device_id);
  });

  player.connect();
}

export function getDeviceId() {
  return deviceId;
}

export async function playTrack(uri) {
  if (!deviceId) return console.error("Player non pronto ancora!");

  console.log("▶ PLAY:", uri, "su device:", deviceId);

  await fetch(`/api/player/play?device_id=${deviceId}`, {
    method: "PUT",
    body: JSON.stringify({
      uris: [uri],
    }),
  });
}
