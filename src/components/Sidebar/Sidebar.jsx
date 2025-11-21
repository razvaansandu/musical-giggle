"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Logo / titolo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>♪</div>
        <span className={styles.logoText}>Musical Giggle</span>
      </div>

      {/* Navigazione principale */}
      <nav className={styles.navSection}>
        <Link href="/home" className={styles.navItem}>
          <span className={styles.icon}>🏠</span>
          <span>Home</span>
        </Link>

        <Link href="/search" className={styles.navItem}>
          <span className={styles.icon}>🔍</span>
          <span>Search</span>
        </Link>

        <button type="button" className={styles.navItemGhost}>
          <span className={styles.icon}>📚</span>
          <span>Your Library</span>
        </button>
      </nav>

      {/* Sezione playlist */}
      <div className={styles.navSectionSecondary}>
        <div className={styles.navTitle}>Playlists</div>
        <button type="button" className={styles.navItemGhost}>
          <span className={styles.icon}>＋</span>
          <span>Create playlist</span>
        </button>
        <button type="button" className={styles.navItemGhost}>
          <span className={styles.icon}>💚</span>
          <span>Liked songs</span>
        </button>
      </div>

      <div className={styles.footer}>
        <span>© {new Date().getFullYear()} Giggle</span>
      </div>
    </aside>
  );
}
