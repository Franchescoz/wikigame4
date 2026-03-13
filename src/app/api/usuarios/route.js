import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const { data: usuario, error } = await supabase
                .from("usuario")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !usuario) {
                return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
            }

            return new Response(JSON.stringify(usuario), { status: 200 });
        } else {
            const { data: usuarios, error } = await supabase
                .from("usuario")
                .select("id, nombre, imagenPerfil")
                .order("nombre", { ascending: true });

            if (error) {
                return new Response(JSON.stringify({ error: error.message }), { status: 400 });
            }

            return new Response(JSON.stringify(usuarios), { status: 200 });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: "Error en el servidor" }), { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        const id = body.id;
        const { error } = await supabase.from("usuario").delete().eq("id", id);
        if (error) return new Response(JSON.stringify(error), { status: 400 });
        return new Response(JSON.stringify({ success: "Usuario eliminado" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Error al procesar delete" }), { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const id = body.id;
        const { error } = await supabase.from("usuario").update(body.usuario).eq("id", id);
        if (error) return new Response(JSON.stringify(error), { status: 400 });
        return new Response(JSON.stringify({ success: "Usuario actualizado" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Error al procesar update" }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const datosUsuario = body.usuario; 
        const { error } = await supabase.from("usuario").insert(datosUsuario);
        if (error) return new Response(JSON.stringify(error), { status: 400 });
        return new Response(JSON.stringify({ success: "Usuario creado" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Error al procesar post" }), { status: 500 });
    }
}