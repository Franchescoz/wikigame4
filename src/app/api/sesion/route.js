import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic";

export async function GET() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch (err) {}
                },
            },
        }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return Response.json(
            { error: "No hay sesión activa" },
            { status: 401 }
        )
    }

    const { data: perfil, error: dbError } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', user.id)
        .single()

    if (dbError) {
        return Response.json(
            { error: "Perfil no encontrado" },
            { status: 404 }
        )
    }

    return Response.json({
        id: user.id,
        nombre: perfil.nombre,
        foto_perfil: perfil.imagenPerfil,
        admin: perfil.admin,
        email: user.email
    })
}