"use client"
import { use, useEffect, useState } from "react"

export default function VistaJuego({params}) {
  const [editar, setEditar] = useState(false); 
  const [juegoN, setJuegoN] = useState({}); 
  const{id}= use(params)

  useEffect(()=>{
    juegoFetch()
  },[])
  async function juegoFetch() {
    const response= await fetch("/api/juegos/juegoid?id="+id)
    const juego = await response.json()
    setJuegoN(juego)
  }
 async function handleModificar(juegoid) {
  const response = await fetch("/api/juegos",{
    method:"PUT",
    headers:{"Content-Type":"Application/json"},
    body:JSON.stringify({
                id:juegoid,
                videojuego:juegoN
            })
  })
  setEditar(!editar)
 }
  if (editar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">

        <form className="relative bg-night w-[95%] max-w-screen-xl rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl" onSubmit={()=>handleModificar(juegoN.id)}>
          <button type="button" onClick={cancelarEdicion}className="absolute top-3 left-3 border rounded-md p-1 hover:border-Lavanda transition sm:hidden">
            <img src="/volver.png" className="w-8 h-8"/>
          </button>
          <button type="submit" onClick={guardarEdicion}className="absolute top-3 right-3 border rounded-md p-1 hover:border-Lavanda transition sm:hidden" >
            <img src="/check-square.png" className="w-8 h-8"/>
          </button>
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <img  className="w-56 h-80 object-cover rounded-lg border-2"/>

            
            <button type="button" className="mt-2 border px-4 py-1 rounded hover:border-Lavanda transition">
              <img src="upload.png"/>
            </button>

           
            <div className="hidden sm:flex gap-4 mt-4">
              <button type="button" onClick={cancelarEdicion}className="border border-Lavanda bg-Lavanda text-white px-6 py-2 rounded font-medulaone">
                Cancelar
              </button>
              <button type="submit"   className="border border-Lavanda bg-night hover:bg-Lavanda text-white px-6 py-2 rounded font-medulaone">
                Guardar
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-2/3 text-white">
            <label className="font-motserrat">Titulo del juego:</label>
            <input value={juegoN.titulo} onChange={e=>setTitulo(e.target.value)} className="bg-white text-black rounded px-2 py-1"/>
              <p>{juegoN.titulo.length>0?juegoN.titulo.length<40?"Titulo valido":"El titulo es demasiado largo":"Pon el titulo"}</p>
            <label className="font-motserrat">Consolas:</label>
            <input value={juegoN.consolas} onChange={e=>setConsolas(e.target.value)} className="bg-white text-black rounded px-2 py-1"/>
              <p>{juegoN.consolas.length>4?"Consolas validas":"No tiene consolas"}</p>
            <label className="font-motserrat">Tipo de juego:</label>
            <input value={juegoN.tipo_juego} onChange={e=>setTipo(e.target.value)} className="bg-white text-black rounded px-2 py-1"/>
               <p>{juegoN.tipo_juego.length>4?"Tipos validos":"No tiene tipos"}</p>
            <label className="font-motserrat">Descripcion:</label>
            <textarea value={juegoN.descripcion} onChange={e=>setDescripcion(e.target.value)} className="bg-white text-black rounded px-2 py-2 h-60 "/>
               <p>{juegoN.descripcion.length!=0?"Descripcion valida":"La descripcion no puede estar vacia"}</p>
          </div>

        </form>
      </div>
    );
  }
 return (
  <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
    <div className="relative bg-night w-[95%] max-w-screen-xl rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl min-h-[40rem] text-white">
      <div className="absolute top-3 right-3 flex flex-col sm:flex-row gap-2">
  <button className="hover:border rounded-md p-1 hover:border-Lavanda transition">
    <img src="/heart.png" className="w-8 h-8"/>
  </button>


  <button onClick={ ()=>setEditar(!editar)}className="  hover:border p-1 hover:border-Lavanda rounded-md transition">
    <img src="/pencil-square.png" className="w-8 h-8"/>{/**Esto se pondra un hidden e el momento que la cuenta no sea de admin */}
  </button>

</div>
       <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
        <img  className="w-56 h-80 rounded-lg  object-cover"/>

        
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
