
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
      <button className="button"
        
        
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pc-display" viewBox="0 0 16 16">
  <path d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0m2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0M9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5M1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2z"/>
</svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "56px",
            background: "#282828",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.6)",
           display: "flex",
           gap: "8px",
            
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
