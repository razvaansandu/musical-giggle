import ArtistHero from "./components/ArtistHero";

const artist = {
    name: "Linkin Park",
    listeners: 53091814,
    image: "/images/linkinpark.jpg",
    spotify: "https://open.spotify.com/artist/6XyY86QOPPrYVGvF9ch6wz",
  };

export default function Page() {
    return (
        <main className="main grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            <ArtistHero
                name={artist.name}
                listeners={artist.listeners}
                image={artist.image}
                spotifyUrl={artist.spotify}
            />
            
        </main>
    );
}

