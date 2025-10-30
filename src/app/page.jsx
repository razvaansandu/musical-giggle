import ArtistHero from "./components/ArtistHero";

export default function Page() {
  const artist = {
    name: "Linkin Park",
    listeners: 53091814,
    image: "/images/linkinpark.jpg",
    spotify: "https://open.spotify.com/artist/6XyY86QOPPrYVGvF9ch6wz",
  };

  return (
    <main style={{ padding: 24, background: "#0b0b0b", minHeight: "100vh" }}>
      <ArtistHero
        name={artist.name}
        listeners={artist.listeners}
        image={artist.image}
        spotifyUrl={artist.spotify}
      />
    </main>
  );
}