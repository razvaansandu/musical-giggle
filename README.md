🎧 Spotify Dashboard con Next.js

Questo progetto è una web app costruita con Next.js che si integra con la Spotify Web API per mostrare dati del profilo, brani in riproduzione e playlist personali.
Funzionalità principali

    Visualizzazione del brano attualmente in riproduzione e dei top tracks/top artists dell’utente.

    Lista delle playlist personali con link diretti all’app Spotify o al player web.

    Interfaccia responsive ottimizzata per desktop e mobile.

Stack tecnologico

    Next.js per il frontend e il routing.

    NextAuth.js come provider di autenticazione Spotify.

    Spotify Web API per recuperare dati musicali e statistiche.

    Tailwind CSS per lo styling veloce e modulare.

Requisiti

    Account Spotify (gratuito o Premium) e app registrata su Spotify Developer Dashboard.

    Node.js installato in locale.

Configurazione rapida

    Clona il repository ed entra nella cartella del progetto.

    Crea un file .env.local con le credenziali della tua app Spotify:

       SPOTIFY_CLIENT_ID=*************************************
       SPOTIFY_CLIENT_SECRET=***********************************
       NEXT_PUBLIC_BASE_URL="http://localhost:3000"
       SPOTIFY_REDIRECT_URI="http://127.0.0.1:3000/api/auth/callback"
       SPOTIFY_API_URL="https://api.spotify.com/v1" 
       SPOTIFY_ACCOUNTS_URL="https://accounts.spotify.com"

    Installa le dipendenze:
    
Installa le dipendenze:

bash
npm install

Avvia l’ambiente di sviluppo:

bash
npm run dev

Apri http://localhost:3000 nel browser per effettuare il login con Spotify e testare il tuo dashboard musicale.

