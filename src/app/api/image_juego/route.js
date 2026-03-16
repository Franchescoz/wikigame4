import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);

export async function PUT(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const idJuego = formData.get("id_juego");

        if (!file || !idJuego) {
            return new Response(JSON.stringify({ error: "Faltan datos" }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data, error: dbError } = await supabase
            .from("image_juego")
            .insert([{ id_juego: idJuego, image_url: fileName }])
            .select()
            .single();

        if (dbError) throw dbError;

        return new Response(JSON.stringify(data), { 
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}