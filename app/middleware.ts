import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Lee la sesión desde las cookies
  const hasSession = request.cookies.get('sb-access-token')?.value || 
                     request.cookies.get('supabase-auth-token')?.value

  // Si NO hay sesión y quiere entrar a /dashboard → lo envía a /login
  if (!hasSession && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}