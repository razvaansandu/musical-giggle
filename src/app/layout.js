"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import SpotifyHeader from "components/SpotifyHeader";
import AppSidebar from "components/Sidebar";
import MiniCard from "components/MiniCard";
import styles from "./home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login" || pathname?.startsWith("/login/");

  return (
    <html lang="en">
      <body>
        {!isLogin ? (
          <div className={styles.container}>
            <SpotifyHeader />
            <div className={styles.content}>
              <aside className={styles.sidebar}>
                <AppSidebar />
              </aside>
              <main className={styles.mainContent}>{children}</main>
            </div>
            <div className={styles.playerBar}> 
              <MiniCard />
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
