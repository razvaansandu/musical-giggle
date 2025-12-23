"use client";

import { useState, useRef } from "react";
import styles from "./CreatePlaylistModal.module.css";
import { X, Upload, Music } from "lucide-react";

export default function CreatePlaylistModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const convertToJpeg = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      
      img.onload = () => {
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
       
        let width = img.width;
        let height = img.height;
        const maxSize = 300;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
       
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(jpegDataUrl);
      };
      
      img.onerror = reject;
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    if (!file.type.startsWith("image/")) {
      setError("Il file deve essere un'immagine");
      return;
    }

    setError("");

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    try {
      const jpegDataUrl = await convertToJpeg(file);
      
      const base64Length = jpegDataUrl.split(',')[1].length;
      const sizeInBytes = (base64Length * 3) / 4;
      
      console.log("Compressed size:", sizeInBytes);

      if (sizeInBytes > 256 * 1024) {
        setError("L'immagine è ancora troppo grande dopo la compressione.");
        setImagePreview(null);
        return;
      }
    
      setImage(jpegDataUrl); 
      
    } catch (err) {
      setError("Errore nel caricamento dell'immagine: " + err.message);
      console.error(err);
      setImagePreview(null);
    } finally {
      e.target.value = ""; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Inserisci un nome per la playlist");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/playlists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          public: isPublic,
          image: image,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore nella creazione");
      }

      const playlist = await res.json();
      
      setName("");
      setDescription("");
      setIsPublic(true);
      setImage(null);
      setImagePreview(null);

      if (onCreated) onCreated(playlist);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setError("");
    setImage(null);
    setImagePreview(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>

        <h2 className={styles.title}>Crea Playlist</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.imageSection}>
            <div 
              className={styles.imageUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <Music size={48} />
                  <span>Scegli foto</span>
                </div>
              )}
              <div className={styles.uploadOverlay}>
                <Upload size={24} />
                <span>Cambia foto</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/jpg"
              style={{ display: "none" }}
            />
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome della playlist"
                className={styles.input}
                maxLength={100}
              />
            </div>

            <div className={styles.field}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Aggiungi una descrizione (opzionale)"
                className={styles.textarea}
                maxLength={300} 
                rows={3}
              />
            </div>

            <div className={styles.toggleField}>
              <label className={styles.toggleLabel}>
                <span>Playlist pubblica</span>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.toggle}></span>
              </label>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading || !name.trim()}
          >
            {loading ? "Creazione..." : "Crea"}
          </button>
        </form>
      </div>
    </div>
  ); 
}
