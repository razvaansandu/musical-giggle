
function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Benvenuto su Spotify</h1>
        <p>Scopri la tua musica preferita</p>
      </header>

      <section className="home-content">
        <div className="playlist-card">
          <h2>Playlist consigliate</h2>
          {/* Puoi mappare qui le playlist dinamiche */}
          <div className="card">Top Hits Italia</div>
          <div className="card">Lo-Fi Chill</div>
          <div className="card">Workout Boost</div>
        </div>
      </section>
    </div> 
  );
}

export default Home;
 