<<<<<<< HEAD
import { cookies } from 'next/headers';
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('auth_code')?.value;

    const response = await fetch(`${process.env.SPOTIFY_API_URL}/artists/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .catch(err => {
        throw new Error('Errore nella fetch dell\'artista: ' + err.message);
      });

    const data = await response.json();
    return Response.json(data);

  } catch (err) {
    console.error('Errore nel prendere artista:', err);
    return new Response(JSON.stringify({ error: 'Errore nel prendere artista' }), { status: 500 });
  }
=======
import { spotifyFetch } from "../../_lib/spotify";

export async function GET(_req, { params }) {
  const { id } = await params;
  return spotifyFetch(`/artists/${id}`);
>>>>>>> origin/development
}
