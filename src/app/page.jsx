import ArtistHero from "./components/ArtistHero";
import Card from "./components/Card";
import { songs } from "./components/data.ts";

export default function Page() {
    return (
        <main className="main grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            <ArtistHero
                name={artist.name}
                listeners={artist.listeners}
                image={artist.image}
                spotifyUrl={artist.spotify}
            />
            {songs.map((song, index) => (
                <Card
                    key={index}
                    title={song.title}
                    description={song.description}
                    imageUrl={song.imageUrl}
                    numOfViews={song.numOfViews}
                    time={song.time}
                />
            ))}
        </main>
    );
}

