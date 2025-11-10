export async function GET(request, { params }) {
  const { id } = params;

  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('auth_code')?.value;

    const response = await fetch(`${process.env.SPOTIFY_API_URL}/artists/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    return Response.json(data);

  } catch (err) {
    console.error('Errore nel prendere artista:', err);
    return new Response(JSON.stringify({ error: 'Errore nel prendere artista' }), { status: 500 });
  }
}
