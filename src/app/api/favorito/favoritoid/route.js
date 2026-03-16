import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(JSON.stringify({ error: "Falta userId" }), { status: 400 });
    }

    const { data, error } = await supabase
        .from('favorito')
        .select(`id_juego, juego (id, titulo, image_juego (image_url))`)
        .eq('id_usuario', userId);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}