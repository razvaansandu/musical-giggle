import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const token = (await cookies()).get('auth_code')?.value;

    const response = await fetch(`${process.env.SPOTIFY_API_URL}/artists/${id}/top-tracks?market=IT`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    return Response.json(data);

  } catch (err) {
    console.error('Errore top tracks:', err);
    return new Response(JSON.stringify({ error: 'Errore nel prendere top tracks artista' }), { status: 500 });
  }
}