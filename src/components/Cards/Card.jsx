import "./Card.css";
import PlayButton from "../buttons/PlayButton";
import { useState, useEffect } from "react";

function formatDuration(ms) {
  if (!ms) return "0:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function Card({ item, index }) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!item?.id) return;
    fetch(`/api/tracks/contains?ids=${item.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setIsLiked(data[0]);
      })
      .catch((err) => console.error("Error checking like status", err));
  }, [item?.id]);

  if (!item) return null;

  const title = item.name;
  const subtitle = item.artists 
    ? item.artists.map(artist => artist.name).join(", ") 
    : item.description || "Elemento"; 
  
  const duration = formatDuration(item.duration_ms);

  const handlePlay = async () => {
    if (!item.uri) return;
    try {
      await fetch("/api/player/start-resume-playback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uris: [item.uri] }),
      });
    } catch (err) {
      console.error("Errore play track:", err);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    const method = isLiked ? "DELETE" : "PUT";
    const newStatus = !isLiked;
    setIsLiked(newStatus);

    try {
      await fetch("/api/tracks/saved", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [item.id] }),
      });
    } catch (err) {
      console.error("Error toggling like", err);
      setIsLiked(!newStatus);
    }
  };

  const handleOptions = async (e) => {
    e.stopPropagation();
    if (!item.uri) return;
    try {
      await fetch(`/api/player/add-item-to-playback-queue?uri=${item.uri}`, {
        method: "POST",
      });
      // Optional: Add a toast notification here
      console.log("Added to queue");
    } catch (err) {
      console.error("Error adding to queue", err);
    }
  };

  return (
    <div className="card" onDoubleClick={handlePlay}> 
      {/* 1. Index / Play Button */}
      <div className="card-left">
        <span className="card-index">{index}</span>
        <div className="card-play-icon">
          <PlayButton onClick={handlePlay} />
        </div>
      </div>

      {/* 2. Title & Artist */}
      <div className="card-content">
        <div className="card-title-row">
          <span className={`card-title ${item.preview_url ? 'playable' : ''}`}>
            {title}
          </span>
        </div>
        <div className="card-artist-row">
          <span className="card-description">{subtitle}</span>
        </div>
      </div> 

      {/* 3. Actions: Heart, Duration, Options */}
      <div className="card-right">
        <button 
          className={`card-heart ${isLiked ? "liked" : ""}`} 
          title={isLiked ? "Remove from Your Library" : "Save to Your Library"}
          onClick={handleLike}
        >
          {isLiked ? (
            <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="#1ed760">
              <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-3.626-1.13 4.313 4.313 0 0 0-3.531 3.406c-.053.49-.053.99.0 1.48a5.235 5.235 0 0 0 .53 1.46l6.235 9.413a1.25 1.25 0 0 0 2.088 0l6.235-9.413a5.235 5.235 0 0 0 .53-1.46c.053-.49.053-.99.0-1.48zm-1.52 1.295-.003.027-.003.027-6.19 9.34a.25.25 0 0 1-.416 0L1.402 5.542l-.003-.027-.003-.027a3.314 3.314 0 0 1 .006-.647c.25-2.34 2.09-3.72 4.091-3.72h.002c1.324 0 2.51.736 3.13 1.85a1.25 1.25 0 0 0 2.152 0c.62-1.114 1.806-1.85 3.13-1.85h.002c2.001 0 3.84 1.38 4.091 3.72.024.221.029.433.006.647z"></path>
            </svg>
          ) : (
            <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.557h.002c2.001 0 3.84 1.38 4.091 3.72.024.221.029.433.006.647-.044.416-.19.818-.432 1.192l-6.19 9.34a.25.25 0 0 1-.416 0L2.752 6.116a4.45 4.45 0 0 1-.432-1.192 3.314 3.314 0 0 1-.006-.647C2.565 1.936 4.405.557 6.405.557h.002A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.557h.002c2.001 0 3.84 1.38 4.091 3.72.024.221.029.433.006.647-.044.416-.19.818-.432 1.192l-6.19 9.34a.25.25 0 0 1-.416 0L2.752 6.116a4.45 4.45 0 0 1-.432-1.192 3.314 3.314 0 0 1-.006-.647zM8 1.575A3.577 3.577 0 0 0 4.425 5.15c0 1.975 1.602 3.575 3.575 3.575S11.575 7.125 11.575 5.15 9.973 1.575 8 1.575z" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
            </svg>
          )}
        </button>

        <span className="card-duration">{duration}</span>

        <button 
          className="card-options" 
          title="Add to Queue"
          onClick={handleOptions}
        >
          <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
          </svg>
        </button> 
        
      </div>
    </div> 
  );
}

export default Card;