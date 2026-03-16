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
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        
                    }
                },
            },
        }
    )

  
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return new Response(JSON.stringify({ error: "No hay sesión activa" }), { 
            status: 401,
            headers: { "Content-Type": "application/json" }
        })
    }


    const { data: perfil, error: dbError } = await supabase
        .from('usuario') 
        .select('*') 
        .eq('id', user.id)
        .single()

    if (dbError) {
        console.error("Error DB:", dbError.message)
        return new Response(JSON.stringify({ error: "Perfil no encontrado en la tabla usuario" }), { 
            status: 404,
            headers: { "Content-Type": "application/json" }
        })
    }

    
    const datosCompletos = {
        ...perfil,
        email: user.email,
        last_sign_in: user.last_sign_in_at
    }

    return new Response(JSON.stringify(datosCompletos), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
}