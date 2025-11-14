import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Musical Giggle",
  description: "Spotify Web Playback Integrated",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        {children}

        {/* Web Playback SDK */}
        <script src="https://sdk.scdn.co/spotify-player.js"></script>

      </body>
    </html>
  );
}
