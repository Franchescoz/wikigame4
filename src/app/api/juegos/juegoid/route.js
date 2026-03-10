import { createClient } from "@supabase/supabase-js";
const supabaseURL=process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKEY=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabase = createClient(supabaseURL,supabaseKEY)
export  async function GET(request) {
   const {searchParams} = new URL(request.url)
   const id=  searchParams.get("id")
   

    const {data: juego,error}= await supabase.from("juego").select("*").eq("id",id).single()
    if(error){
        return new Response(JSON.stringify(error),{status:400,
        headers:{"Content-Type":"Application/json"}
    })
    }
    return new Response(JSON.stringify(juego),{status:200,
        headers:{"Content-Type":"Application/json"}
    })
    
}