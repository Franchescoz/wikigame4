import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response(JSON.stringify({ error: "ID requerido" }), { 
            status: 400, 
            headers: { "Content-Type": "application/json" } 
        });
    }

    const { data: usuario, error } = await supabase
        .from("usuario")
        .select(`id, nombre, contraseña, email, descripcion, imagenPerfil, admin, fecha_registro`)
        .eq("id", id)
        .single();

    if (error) {
        return new Response(JSON.stringify(error), { 
            status: 400, 
            headers: { "Content-Type": "application/json" } 
        });
    }

    return new Response(JSON.stringify(usuario), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
    });
}