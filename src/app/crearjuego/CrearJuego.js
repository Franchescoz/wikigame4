"use client"
import { useState } from "react";
import Link from "next/link";

export default function CrearVistaJuego() {
  const [titulo, setTitulo] = useState("Titulo del juego");
  const [consolas, setConsolas] = useState("Consolas");
  const [tipo, setTipo] = useState("Tipo de juego");
  const [descripcion, setDescripcion] = useState("descripcion");
  const portada = "portadadb3.jpg";
  const gameplays = ["gameplaydb3s.jpeg","gameplaydb3s.jpeg","gameplaydb3s.jpeg"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">

      <form className="relative bg-night w-[95%] max-w-screen-xl rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl">

        
       <Link href="/listatarjetasjuegos">
  <button className="absolute top-3 left-3 border rounded-md p-1 hover:border-Lavanda transition sm:hidden">
    <img src="/volver.png" className="w-8 h-8 cursor-pointer"/>
  </button>
</Link>

<Link href="/listatarjetasjuegos">
  <button type="submit" className="absolute top-3 right-3 border rounded-md p-1 hover:border-Lavanda transition sm:hidden">
    <img src="/check-square.png" className="w-8 h-8 cursor-pointer"/>
  </button>
</Link>

        
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <img src={portada} alt="Portada" className="w-56 h-80 object-cover rounded-lg border-2"/>

          <div className="flex gap-2">
            {gameplays.map((imagen, index) => (
              <img key={index} src={imagen} alt="Gameplay" className="w-20 h-20 object-cover rounded border"/>
            ))}
          </div>

          <button type="button" className="mt-2 border px-4 py-1 rounded hover:border-Lavanda transition">
            <img src="upload.png" alt="Subir"/>
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
          <input type="text" value={titulo} placeholder="Titulo del juego..." onChange={(e)=> setTitulo(e.target.value)} required maxLength={50} className="bg-white text-black rounded px-2 py-1"/>

          <label className="text-sm font-motserrat">Consolas:</label>
          <input type="text" value={consolas} placeholder="Consolas..." onChange={(e)=> setConsolas(e.target.value)} required className="bg-white text-black rounded px-2 py-1"/>
          <p className="text-xs ">{consolas.length>4?"Consolas validas":"No tiene consolas"}</p>

          <label className="text-sm font-motserrat">Tipo de juego:</label>
          <input type="text" value={tipo} placeholder="Tipo de juegos.."onChange={(e)=> setTipo(e.target.value)} required className="bg-white text-black rounded px-2 py-1"/>
          <p className="text-xs ">{tipo.length>4?"Tipos validos":"No tiene tipos"}</p>

          <label className="text-sm font-motserrat">Descripcion:</label>
          <textarea value={descripcion} placeholder="Descripcion..." onChange={(e)=> setDescripcion(e.target.value)} required minLength={20} className="bg-white border text-black border-Lavanda rounded px-2 py-2 h-60 "/>
          <p className="text-xs ">{descripcion.length>19?"Descripcion valida":"La descripcion es muy corta"}</p>
        </div>

      </form>
    </div>
  );
}
