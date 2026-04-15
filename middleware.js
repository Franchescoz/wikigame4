import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, {
              ...options,
              sameSite: "lax",
              secure: true,
            })
          })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  const rutasPublicas = ['/', '/iniciarsesion', '/registrar']
  const esRutaPublica = rutasPublicas.some(ruta => pathname.startsWith(ruta))

  if (!user && !esRutaPublica) {
    url.pathname = '/iniciarsesion'
    return NextResponse.redirect(url)
  }

  if (user && (pathname === '/iniciarsesion' || pathname === '/registrar')) {
    url.pathname = '/listatarjetasjuegos'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}