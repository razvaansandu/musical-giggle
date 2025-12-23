🎧 Spotify Dashboard con Next.js

Questo progetto è una web app costruita con Next.js che si integra con la Spotify Web API per mostrare dati del profilo, brani in riproduzione e playlist personali.

​
Funzionalità principali
​

Visualizzazione del brano attualmente in riproduzione e dei top tracks/top artists dell’utente.

Lista delle playlist personali con link diretti all’app Spotify o al player web.

Interfaccia responsive ottimizzata per desktop e mobile.

Stack tecnologico
​
NextAuth.js come provider di autenticazione Spotify.

Spotify Web API per recuperare dati musicali e statistiche.

Tailwind CSS per lo styling veloce e modulare.
​
Requisiti

Account Spotify (gratuito o Premium) e app registrata su Spotify Developer Dashboar​
Node.js installato in locale.

Configurazione rapida
Clona il repository ed entra nella cartella del progetto.
Crea un file .env.local con le credenziali della tua app Spotify: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, NEXTAUTH_URL, NEXTAUTH_SECRET.
Installa le dipendenze con npm install e avvia l’ambiente di sviluppo con npm run dev.
Ora apri http://localhost:3000 per effettuare il login con Spotify e testare il tuo dashboard musicale.
​
