// 🎵 Endpoint per info artista
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('auth_code')?.value;

    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    return Response.json(data);

  } catch (err) {
    console.error('Errore top tracks:', err);
    return new Response(JSON.stringify({ error: 'Errore nel prendere top tracks artista' }), { status: 500 });
  }
}
