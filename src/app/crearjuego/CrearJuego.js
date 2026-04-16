"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CrearVistaJuego() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("Titulo del juego");
  const [consolas, setConsolas] = useState("Consolas");
  const [tipo, setTipo] = useState("Tipo de juego");
  const [descripcion, setDescripcion] = useState("descripcion");
  
  const [portadaFile, setPortadaFile] = useState(null);
  const [gameplayFiles, setGameplayFiles] = useState([]);
  const [previews, setPreviews] = useState({ portada: "/logo 3.jpg", gameplays: [] });



  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const selectedPortada = files[0];
      const selectedGameplays = files.slice(1, 4);
      setPortadaFile(selectedPortada);
      setGameplayFiles(selectedGameplays);
      setPreviews({
        portada: URL.createObjectURL(selectedPortada),
        gameplays: selectedGameplays.map(file => URL.createObjectURL(file))
      });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!portadaFile) {
      window.alert("Debes seleccionar al menos la foto de portada");
      return;
    }

    try {
      const resJuego = await fetch("/api/juegos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, consolas, tipo_juego: tipo, descripcion }),
      });

      const dataJuego = await resJuego.json();
      if (!resJuego.ok) throw new Error(dataJuego.error || "Error al crear juego");

      const nuevoJuegoId = dataJuego.id; 
      
      const todasLasFotos = [
        { file: portadaFile, principal: true },
        ...gameplayFiles.map(f => ({ file: f, principal: false }))
      ];

      for (const item of todasLasFotos) {
        const fileName = `${nuevoJuegoId}/${Date.now()}_${item.file.name.replace(/\s+/g, '_')}`;
        
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, item.file);

        if (!uploadError) {
          await supabase.from("image_juego").insert([
            { 
              id_juego: nuevoJuegoId, 
              image_url: fileName, 
              imagenPrincipal: item.principal 
            }
          ]);
        }
      }

      router.push("/listatarjetasjuegos");
      router.refresh();

    } catch (error) {
      window.alert(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
      <form onSubmit={handleSubmit} className="relative bg-night w-[95%] max-w-screen-xl rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl">
        
        <Link href="/listatarjetasjuegos">
          <button type="button" className="absolute top-3 left-3 border rounded-md p-1 hover:border-Lavanda transition sm:hidden">
            <img src="/volver.png" className="w-8 h-8 cursor-pointer"/>
          </button>
        </Link>

        <button type="submit" className="absolute top-3 right-3 border rounded-md p-1 hover:border-Lavanda transition sm:hidden">
          <img src="/check-square.png" className="w-8 h-8 cursor-pointer"/>
        </button>

        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <img src={previews.portada} alt="Portada" className="w-56 h-80 object-cover rounded-lg border-2 border-Lavanda"/>

          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-20 h-20 rounded border border-white/20 overflow-hidden bg-white/5">
                {previews.gameplays[i] ? (
                  <img src={previews.gameplays[i]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">+</div>
                )}
              </div>
            ))}
          </div>

          <input type="file" id="fileInput" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          
          <button type="button" onClick={() => document.getElementById('fileInput').click()}className="mt-2 border px-4 py-1 rounded hover:border-Lavanda transition flex flex-col items-center">
            <img src="upload.png" alt="Subir" className="w-6 h-6 mb-1"/>
            <span className="text-[10px] text-white/70 uppercase">Seleccionar 4 fotos</span>
          </button>

          <div className="hidden sm:flex gap-4 mt-4">
            <Link href="/listatarjetasjuegos">
              <button type="button" className="border border-Lavanda text-white px-6 py-2 rounded bg-Lavanda transition font-medulaone">
                Cancelar
              </button>
            </Link>
            <button type="submit" className="border border-Lavanda text-white px-6 py-2 rounded bg-night hover:bg-Lavanda transition font-medulaone">
              Crear
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-2/3 text-white">
          <label className="text-sm font-motserrat">Titulo del juego:</label>
          <input type="text" value={titulo} placeholder="Titulo del juego..." onChange={(e)=> setTitulo(e.target.value)} required maxLength={50} className="bg-white text-black rounded px-2 py-1 outline-none"/>

          <label className="text-sm font-motserrat">Consolas:</label>
          <input type="text" value={consolas} placeholder="Consolas..." onChange={(e)=> setConsolas(e.target.value)} required className="bg-white text-black rounded px-2 py-1 outline-none"/>
          <p className="text-xs">{consolas.length > 4 ? "Consolas validas" : "No tiene consolas"}</p>

          <label className="text-sm font-motserrat">Tipo de juego:</label>
          <input type="text" value={tipo} placeholder="Tipo de juegos.." onChange={(e)=> setTipo(e.target.value)} required className="bg-white text-black rounded px-2 py-1 outline-none"/>
          <p className="text-xs">{tipo.length > 4 ? "Tipos validos" : "No tiene tipos"}</p>

          <label className="text-sm font-motserrat">Descripcion:</label>
          <textarea value={descripcion} placeholder="Descripcion..." onChange={(e)=> setDescripcion(e.target.value)} required minLength={20} className="bg-white border text-black border-Lavanda rounded px-2 py-2 h-60 resize-none outline-none"/>
          <p className="text-xs">{descripcion.length > 19 ? "Descripcion valida" : "La descripcion es muy corta"}</p>
        </div>
      </form>
    </div>
  );
}