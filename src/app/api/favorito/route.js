import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);



export async function PUT(request) {
    try {
        const { userId, juegoId, esFavorito } = await request.json();
        if (!userId || !juegoId) return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });

        if (esFavorito) {
            const { error } = await supabase.from("favorito").delete().eq("id_usuario", userId).eq("id_juego", juegoId);
            if (error) throw error;
            return new Response(JSON.stringify({ estado: false }), { status: 200 });
        } else {
            const { error } = await supabase.from("favorito").insert([{ id_usuario: userId, id_juego: juegoId }]);
            if (error) throw error;
            return new Response(JSON.stringify({ estado: true }), { status: 200 });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}


export async function DELETE(request) {
    try {
        const { userId, juegoId } = await request.json();
        const { error } = await supabase.from("favorito").delete().eq("id_usuario", userId).eq("id_juego", juegoId);
        if (error) throw error;
        return new Response(JSON.stringify({ success: "Favorito eliminado" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}