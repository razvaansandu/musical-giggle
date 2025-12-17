"use client";

import { useEffect, useState } from "react";
import styles from "../home/home.module.css";
import { Clock, Play, Heart, Trash2 } from "lucide-react";

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
    } catch (e) {
      console.error("Errore play", e);
    }
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
      } else {
        console.error("Errore rimozione brano");
      }
    } catch (error) {
      console.error("Errore API remove track", error);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) return <div className={styles.loading}>Caricamento...</div>; // Assicurati di avere .loading nel css o rimuovilo

  return (
    // Usa .mainContent invece di .container per coerenza con la tua struttura home
    <div className={styles.mainContent}>
      
      {/* HEADER SECTION (Adattato con le classi .hero... del tuo CSS) */}
      <div className={styles.heroAlbumSection}>
        <div className={styles.heroAlbumContainer}>
          <div className={styles.heroAlbumImage}>
            {/* Icona cuore grande */}
            <div style={{
              width: '100%', height: '100%', 
              background: 'linear-gradient(135deg, #450af5, #8e8e8e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
               <Heart size={80} fill="white" color="white" />
            </div>
          </div>
          
          <div className={styles.heroAlbumText}>
            <span className={styles.heroAlbumType}>Playlist</span>
            <h1 className={styles.heroAlbumTitle} style={{ fontSize: '4rem' }}>Brani che ti piacciono</h1>
            <div className={styles.heroAlbumMeta}>
              <span style={{ fontWeight: 'bold', color: 'white' }}>Tu</span>
              <span className={styles.heroAlbumDot}>•</span>
              <span>{tracks.length} brani</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className={styles.filterButtons} style={{ padding: '24px 0' }}>
         <button className={styles.roundButton} style={{ width: '56px', height: '56px' }}>
            <Play fill="black" size={28} style={{ marginLeft: '4px' }} />
         </button>
      </div>

      {/* TRACKLIST HEADER - Modificato per supportare colonne extra */}
      {/* Nota: Il tuo CSS usa grid-template-columns specifico in .tracklistHeader. 
          Potremmo dover sovrascrivere lo stile inline per questa pagina specifica se le colonne non matchano. */}
      <div className={styles.tracklistHeader} style={{ gridTemplateColumns: '40px 4fr 3fr 2fr 40px 60px' }}>
        <div className={styles.tracklistNumber}>#</div>
        <div className={styles.tracklistTitle}>Titolo</div>
        <div className={styles.tracklistTitle}>Album</div>
        <div className={styles.tracklistTitle}>Data agg.</div>
        <div></div> {/* Spazio vuoto per action */}
        <div className={styles.tracklistDuration}><Clock size={16} /></div>
      </div>

      {/* TRACKLIST */}
      <div className={styles.tracklist}>
        {tracks.map((item, index) => {
          const track = item.track;
          if (!track) return null; 

          return (
            <div 
              key={`${item.added_at}-${track.id}`} 
              className={styles.tracklistItem}
              onDoubleClick={() => playTrack(track.uri)}
              // Sovrascriviamo display flex con grid per allineamento colonne perfetto in questa vista
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '40px 4fr 3fr 2fr 40px 60px',
                gap: '16px',
                alignItems: 'center'
              }}
            >
              {/* Indice */}
              <div className={styles.tracklistNumber} style={{ textAlign: 'center' }}>
                {index + 1}
              </div>
              
              {/* Titolo + Img + Artista */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                {track.album?.images?.[2] && (
                  <img src={track.album.images[2].url} alt="" className={styles.tracklistImage} />
                )}
                <div className={styles.tracklistInfo}>
                  <div className={styles.tracklistTitle} style={{ fontSize: '15px', color: 'white' }}>{track.name}</div>
                  <div className={styles.tracklistArtist}>{track.artists?.map(a => a.name).join(", ")}</div>
                </div>
              </div>

              {/* Album */}
              <div className={styles.tracklistArtist} style={{ color: '#b3b3b3' }}>
                {track.album?.name}
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

              {/* Action (Remove) */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }}
                  title="Rimuovi"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                   <Heart size={18} fill="#1db954" color="#1db954" />
                </button>
              </div>

              {/* Durata */}
              <div className={styles.tracklistDuration}>
                {formatDuration(track.duration_ms)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
