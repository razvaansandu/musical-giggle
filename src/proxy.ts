import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$|login).*)',
  ],
}
 
export async function proxy(request: NextRequest) {
  const cookiesStore = await cookies();
  const isAuth = cookiesStore.get('auth_code')?.value;
  console.log("Auth Token:", isAuth);
  if (!isAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
    return NextResponse.next()
}