import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic";

export async function GET() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
            },
        }
    )
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return new Response(JSON.stringify({ error: "No hay sesión activa" }), { status: 401, headers: { "Content-Type": "application/json" } })
    }
    
    const { data: perfil, error: dbError } = await supabase
        .from('usuarios')
        .select('*') 
        .eq('id', user.id)
        .single()

    if (dbError) {
        return new Response(JSON.stringify({ error: "Error al obtener perfil" }), { status: 400, headers: { "Content-Type": "application/json" } })
    }

    const datosCompletos = {
        ...perfil,
        email: user.email 
    }

    return new Response(JSON.stringify(datosCompletos), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
}

export async function POST(request) {
    try {
        const cookieStore = await cookies()
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options)
                            })
                        } catch (error) {}
                    },
                },
            }
        )
        
        const { error } = await supabase.auth.signOut()

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } })
        }

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } })

    } catch (error) {
        console.error("Error al cerrar sesión:", error)
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500, headers: { "Content-Type": "application/json" } })
    }
}