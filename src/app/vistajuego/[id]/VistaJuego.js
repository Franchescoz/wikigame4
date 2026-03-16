"use client"
import { use, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js";

export default function VistaJuego({params}) {
  const [editar, setEditar] = useState(false); 
  const [juegoN, setJuegoN] = useState({}); 
  const [fotoPrincipal, setFotoPrincipal] = useState(0);
  const [esFavorito, setEsFavorito] = useState(false);
  const [userId, setUserId] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false); 
  
  const{id}= use(params)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY 
  );

  useEffect(()=>{
    checkUserAndFav();
    juegoFetch();
  },[])

 async function checkUserAndFav() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        setUserId(user.id);

        try {
          
            const responseUser = await fetch(`/api/usuarios/perfilid?id=${user.id}`);
            if (responseUser.ok) {
                const userData = await responseUser.json();
                setEsAdmin(userData.admin === true);
            }

           
            const responseFav = await fetch(`/api/favorito/favoritoid?userId=${user.id}`);
            if (responseFav.ok) {
                const favs = await responseFav.json();
                
                
                const existe = favs.some(f => f.id_juego == id); 
                if (existe) setEsFavorito(true);
            }

        } catch (error) {
            console.error("Error al verificar usuario/favoritos:", error);
        }
    }
}

  async function toggleFavorito() {
    if (!userId) return alert("Debes iniciar sesión");

    try {
        const response = await fetch("/api/favorito", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userId,
                juegoId: id,
                esFavorito: esFavorito
            })
        });

        const data = await response.json();

        if (response.ok) {
            setEsFavorito(data.estado);
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error en favoritos:", error);
    }
  }

  async function juegoFetch() {
    const response= await fetch("/api/juegos/juegoid?id="+id)
    const juego = await response.json()
    setJuegoN(juego)
  }

  function cancelarEdicion(){
    juegoFetch()
    setEditar(false)
  }

  async function handleModificar(juegoid,e) {
    e.preventDefault()
    const juegoParaActualizar = {titulo: juegoN.titulo, consolas: juegoN.consolas, tipo_juego: juegoN.tipo_juego, descripcion: juegoN.descripcion};
    await fetch("/api/juegos",{method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:juegoid, juego:juegoParaActualizar})});
    setEditar(!editar)
  }

  async function handleUploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    if ((juegoN.image_juego?.length || 0) >= 4) return alert("Máximo 4 imágenes");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_juego", juegoN.id);

    try {
        const response = await fetch("/api/image_juego", {
            method: "PUT",
            body: formData 
        });

        const nuevaImagen = await response.json();

        if (response.ok) {
            setJuegoN({
                ...juegoN,
                image_juego: [...(juegoN.image_juego || []), nuevaImagen]
            });
        } else {
            alert("Error: " + nuevaImagen.error);
        }
    } catch (error) {
        console.error("Error al subir:", error);
    }
  }

  if (editar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
        <form className="relative bg-night w-[95%] max-w-screen-xl rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl" onSubmit={(e)=>handleModificar(juegoN.id,e)}>
          <button type="button" onClick={cancelarEdicion} className="absolute top-3 left-3 border rounded-md p-1 hover:border-Lavanda transition sm:hidden"><img src="/volver.png" className="w-8 h-8"/></button>
          <button type="submit" className="absolute top-3 right-3 border rounded-md p-1 hover:border-Lavanda transition sm:hidden" ><img src="/check-square.png" className="w-8 h-8"/></button>
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <img src={`${supabaseUrl}/storage/v1/object/public/images/${juegoN.image_juego?.[0]?.image_url}`} className="w-56 h-80 object-cover rounded-lg border-2"/>
            <div className="mt-2">
              <input type="file" id="uploadImage" accept="image/*" className="hidden" onChange={handleUploadImage} />
              {(juegoN.image_juego?.length || 0) < 4 ? (
                <button type="button" className="border px-4 py-1 rounded hover:border-Lavanda transition flex items-center gap-2 text-white" onClick={() => document.getElementById("uploadImage").click()}><img src="/upload.png" className="w-5 h-5" /><span className="text-xs">Añadir imagen ({juegoN.image_juego?.length || 0}/4)</span></button>
              ) : <p className="text-xs text-gray-400 italic">Límite alcanzado</p>}
            </div>
            <div className="hidden sm:flex gap-4 mt-4">
              <button type="button" onClick={cancelarEdicion} className="border border-Lavanda bg-Lavanda text-white px-6 py-2 rounded font-medulaone text-lg">Cancelar</button>
              <button type="submit" className="border border-Lavanda bg-night hover:bg-Lavanda text-white px-6 py-2 rounded font-medulaone text-lg">Guardar</button>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-2/3 text-white">
            <label className="font-motserrat">Titulo:</label>
            <input value={juegoN.titulo} onChange={e=>setJuegoN({...juegoN,titulo:e.target.value})} className="bg-white text-black rounded px-2 py-1"/>
            <label className="font-motserrat">Consolas:</label>
            <input value={juegoN.consolas} onChange={e=>setJuegoN({...juegoN,consolas:e.target.value})} className="bg-white text-black rounded px-2 py-1"/>
            <label className="font-motserrat">Tipo:</label>
            <input value={juegoN.tipo_juego} onChange={e=>setJuegoN({...juegoN,tipo_juego:e.target.value})} className="bg-white text-black rounded px-2 py-1"/>
            <label className="font-motserrat">Descripcion:</label>
            <textarea value={juegoN.descripcion} onChange={e=>setJuegoN({...juegoN,descripcion:e.target.value})} className="bg-white text-black rounded px-2 py-2 h-60 "/>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
      <div className="relative bg-night w-[95%] max-w-screen-xl rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl min-h-[40rem] text-white">
        <div className="absolute top-3 right-3 flex flex-col sm:flex-row gap-2">
          <button onClick={toggleFavorito} className="hover:border rounded-md p-1 hover:border-Lavanda transition">
            <img src={esFavorito ? "/heartFav.png" : "/heart.png"} className="w-8 h-8"/>
          </button>
         
          {esAdmin && (
            <button onClick={()=>setEditar(!editar)} className="hover:border p-1 hover:border-Lavanda rounded-md transition">
              <img src="/pencil-square.png" className="w-8 h-8"/>
            </button>
          )}
        </div>
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <img src={`${supabaseUrl}/storage/v1/object/public/images/${juegoN.image_juego?.[fotoPrincipal]?.image_url}`} className="w-56 h-80 rounded-lg object-cover border-2 border-Lavanda shadow-lg" />
          <div className="grid grid-cols-4 gap-2 w-56">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} onClick={() => juegoN.image_juego?.[index] && setFotoPrincipal(index)} className={`w-12 h-12 rounded border cursor-pointer overflow-hidden ${fotoPrincipal === index ? 'border-Lavanda' : 'border-gray-600'}`}>
                {juegoN.image_juego?.[index] ? <img src={`${supabaseUrl}/storage/v1/object/public/images/${juegoN.image_juego[index].image_url}`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">+</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full md:w-2/3">
          <h1 className="text-2xl font-bold font-motserrat">{juegoN.titulo}</h1>
          <p className=" font-motserrat"><b>Consolas:</b> {juegoN.consolas}</p>
          <p className=" font-motserrat"><b>Tipo:</b> {juegoN.tipo_juego}</p>
          <textarea readOnly value={juegoN.descripcion} className="bg-night text-white border border-Lavanda rounded p-2 h-60 resize-none font-motserrat"/>
        </div>
      </div>
    </div>
  );
}