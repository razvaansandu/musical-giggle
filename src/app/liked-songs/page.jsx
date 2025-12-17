"use client";

import { useEffect, useState } from "react";
import styles from "../home/home.module.css"; 
import { Clock, Play, Heart } from "lucide-react";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";

export default function LikedSongs() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedSongs = async () => {
    try {
      const res = await fetch("/api/tracks/saved?limit=50");
      if (res.ok) {
        const data = await res.json();
        setTracks(data.items || []);
      }
    } catch (error) {
      console.error("Errore fetch liked songs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const playTrack = async (uri) => {
    try {
      await fetch("/api/player/play-track", { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri }) 
      });
    } catch (e) { console.error(e); }
  };

  const removeTrack = async (id) => {
    try {
      const res = await fetch("/api/tracks/saved", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }), 
      });
      if (res.ok) {
        setTracks((prev) => prev.filter((item) => item.track.id !== id));
      }
    } catch (e) { console.error(e); }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  if (loading) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#000' }}>
      
      <div style={{ height: '64px', width: '100%', zIndex: 20, flexShrink: 0 }}>
         <SpotifyHeader />
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px - 90px)' }}> 

        <div style={{ width: '300px', height: '100%', flexShrink: 0 }}>
           <Sidebar />
        </div>

        <div className={styles.mainContent} style={{ flex: 1, margin: '8px 8px 0 0', borderRadius: '8px', overflowY: 'auto', background: '#121212', position: 'relative' }}>
          
          <div className={styles.heroAlbumSection} style={{ background: 'linear-gradient(180deg, rgba(80, 56, 160, 0.5), transparent)', paddingTop: '20px' }}>
            <div className={styles.heroAlbumContainer}>
              <div className={styles.heroAlbumImage} style={{ boxShadow: '0 4px 60px rgba(0,0,0,0.5)' }}>
                <div style={{
                  width: '100%', height: '100%', 
                  background: 'linear-gradient(135deg, #450af5, #c4efd9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                   <Heart size={80} fill="white" color="white" />
                </div>
              </div>
              
              <div className={styles.heroAlbumText}>
                <span className={styles.heroAlbumType}>PLAYLIST</span>
                <h1 className={styles.heroAlbumTitle} style={{ fontSize: '5rem', marginBottom: '10px' }}>Brani che ti piacciono</h1>
                <div className={styles.heroAlbumMeta}>
                  <span style={{ fontWeight: 'bold', color: 'white' }}>Tu</span>
                  <span className={styles.heroAlbumDot}>•</span>
                  <span>{tracks.length} brani</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.playlistControls} style={{ padding: '24px 32px' }}>
             <button className={styles.playButton} style={{ 
                 width: '56px', height: '56px', borderRadius: '50%', 
                 background: '#1db954', border: 'none', display: 'flex', 
                 alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                 boxShadow: '0 8px 8px rgba(0,0,0,0.3)',
                 transition: 'transform 0.1s'
             }}>
                <Play fill="black" size={28} style={{ marginLeft: '4px' }} />
             </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '16px 6fr 4fr 3fr minmax(100px, 1fr)', 
            gridGap: '16px', 
            padding: '0 32px', 
            borderBottom: 'none', 
            marginBottom: '16px',
            color: '#b3b3b3',
            fontSize: '12px',
            textTransform: 'uppercase',
            height: '36px',
            alignItems: 'center',
            letterSpacing: '1px'
          }}>
            <div style={{ textAlign: 'center' }}>#</div>
            <div>Titolo</div>
            <div>Artista</div>
            <div>Album</div>
            <div style={{ textAlign: 'right', paddingRight: '30px' }}><Clock size={16} /></div>
          </div>

          <div className={styles.tracklist} style={{ padding: '0 16px 32px 16px' }}>
            {tracks.map((item, index) => {
              const track = item.track;
              if (!track) return null; 

              return (
                <div 
                  key={`${item.added_at}-${track.id}`} 
                  className={styles.tracklistItem} 
                  onDoubleClick={() => playTrack(track.uri)}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '16px 6fr 4fr 3fr minmax(100px, 1fr)', 
                    gridGap: '16px',
                    alignItems: 'center',
                    height: '56px', 
                    padding: '0 16px',
                    borderRadius: '4px',
                    color: '#b3b3b3',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ textAlign: 'center', fontSize: '16px' }}>{index + 1}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
                    {track.album?.images?.[2] && (
                      <img src={track.album.images[2].url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                       <span style={{ color: 'white', fontSize: '15px', fontWeight: '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                         {track.name}
                       </span>
                    </div>
                  </div>

                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ color: '#b3b3b3' }}>
                      {track.artists?.map(a => a.name).join(", ")}
                    </span>
                  </div>

                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.album?.name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px' }}>
                    <button 
                       onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }}
                       style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}
                       title="Rimuovi"
                    >
                       <Heart size={16} fill="#1db954" color="#1db954" />
                    </button>
                    <span style={{ fontVariantNumeric: 'tabular-nums', width: '40px', textAlign: 'right' }}>
                      {formatDuration(track.duration_ms)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ height: '90px', width: '100%', zIndex: 100, flexShrink: 0 }}>
        <Player />
      </div>

    </div>
  );
}
