import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Musical Giggle',
  description: 'App musicale con Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
