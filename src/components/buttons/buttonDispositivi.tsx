
"use client";


import { useState } from "react";

interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
}

export default function SpotifyDevicesButton() {
  const [devices, setDevices] = useState<SpotifyDevice[]>([]); 
  const [open, setOpen] = useState(false);

  async function fetchDevices() {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SPOTIFY_TOKEN}`,
        },
      });

      if (!res.ok) throw new Error("Errore nel recupero dispositivi");
      const data = await res.json();
      setDevices(data.devices || []);
      setOpen(!open);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={fetchDevices}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "24px",
          backgroundColor: "#1DB954",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
        }}
      >
        🎵 Dispositivi
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            background: "#282828",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.6)",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {devices.length > 0 ? (
              devices.map((d) => (
                <li
                  key={d.id}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  {d.name} ({d.type})
                </li>
              ))
            ) : (
              <li>Nessun dispositivo trovato</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
