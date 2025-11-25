import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],});

export const metadata = {
  title: "Musical Giggle",
  description: "Discover and share your favorite tunes with Musical Giggle!",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        {children} 
      
      </body> 
    </html>
  );
} 