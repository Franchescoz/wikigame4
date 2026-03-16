import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);

export async function GET(request) {
    const { data, error } = await supabase
        .from("juego")
        .select(`id, titulo, consolas, tipo_juego, descripcion, image_juego ( image_url, imagenPrincipal )`)
        .order("titulo", { ascending: true });

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { titulo, consolas, tipo_juego, descripcion } = body;

        const { data: nuevoJuego, error: errorJuego } = await supabase
            .from("juego")
            .insert([{ titulo, consolas, tipo_juego, descripcion }])
            .select()
            .single();

        if (errorJuego) {
            return new Response(JSON.stringify({ error: errorJuego.message }), { status: 400 });
        }

        return new Response(JSON.stringify(nuevoJuego), { 
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: "Error en el servidor: " + err.message }), { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { error } = await supabase.from("juego").update(body.juego).eq("id", body.id);

        if (error) return new Response(JSON.stringify(error), { status: 400 });
        return new Response(JSON.stringify({ success: "Actualizado" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}