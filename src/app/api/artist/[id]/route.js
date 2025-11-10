import { cookies } from "next/headers";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('auth_code')?.value;
    console.log('Token:', token);
    const response = await fetch(`${process.env.SPOTIFY_API_URL}/artists/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('Response status:', response.status);

    const data = await response.json();
    return Response.json(data);

  } catch (err) {
    console.error('Errore top tracks:', err);
    return new Response(JSON.stringify({ error: 'Errore nel prendere artista' }), { status: 500 });
  }
}
