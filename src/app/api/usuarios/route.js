import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);

export async function GET(request) {
    const { data, error } = await supabase
        .from("usuario")
        .select(`id, nombre, descripcion, imagenPerfil, fecha_registro`)
        .order("nombre", { ascending: true });


    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
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