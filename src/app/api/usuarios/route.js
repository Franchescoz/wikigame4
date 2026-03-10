import { createClient } from "@supabase/supabase-js";
import next from "next";
const supabaseURL= NEXT_PUBLIC
const supabaseKEY= NEXT_PUBLIC
const supabase = createClient(supabaseURL,supabaseKEY)

export async function GET(request) {
    

    const {data: juego,error}= await supabase.from("juego").select("*").filter()

    return new Response (JSON.stringify(juego),{status:200, headers:{"Content-Type":"Application"}})
    
    
}
export async function DELETE(request) {
    const body = await request.json()
    const id = await body.id
    const {data: juego,error}= await supabase.from("juego").delete().eq("id",id)

    if(error){
        return new Response(JSON.stringify(error),{status:400, headers:{"Content-Type":"Application"}})
    }
    return new Response(JSON.stringify({success:"Eliminado con exito"}),{status:200, headers:{"Content-Type":"Application"}})
}

export async function PUT(request) {
    const body= await request.json()
    const id = await body.id
    const {data: juego,error}= await supabase.from("juego").update(body.producto).eq("id",id)

    if(error){
        return new Response(JSON.stringify(error),{status:400, headers:{"Content-Type":"Application"}})
    }
    return new Response(JSON.stringify({success:"Actualizado con exito"}),{status:200, headers:{"Content-Type":"Application"}})
}
export async function POST(request) {
    const body = await request.json()
    const producto = await body.producto
    const {data: juego,error}= await supabase.from("juego").insert(producto)
    if(error){
        return new Response(JSON.stringify(error),{status:400, headers:{"Content-Type":"Application"}})
    }
    return new Response(JSON.stringify({success:"Actualizado con exito"}),{status:200, headers:{"Content-Type":"Application"}})
}
