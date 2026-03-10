"use client"
import { useState } from "react";

const array = [
    {id:1 , src:"portadadb3.jpg"},
    {id:2 , src:"portadaIE.jpg"},
    {id:3 , src:"portadaTS.jpeg"},
    {id:4 , src:"portadaM.jpeg"},
]

export default function Perfil() {
    const [editar,setEditar]= useState(false);
    const [nombre, setNombre] = useState("Fran el largo");
    const [descripcion, setDescripcion] = useState("Descripcion");
    const [juegos, setJuegos] = useState(array);

    function activarEdicion(e) { 
        e.preventDefault()
        setEditar(true); 
    }
    function cancelarEdicion() { 
        setEditar(false); 
    }
    function guardarEdicion() { 
        setEditar(false);
    }
    function eliminarJuego(id) {
        setJuegos(juegos.filter(juego => juego.id !== id));
    }

    if (editar) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
                <form onSubmit={guardarEdicion} className="relative bg-night w-[95%] max-w-screen-xl min-h-[40rem] rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl text-white">

                    
                    <div className="absolute top-2 left-0 right-0 flex justify-between px-4 md:hidden z-20">
                        <button type="button" onClick={cancelarEdicion}>
                            <img src="/volver.png" className="w-6 h-6"/>
                        </button>
                        <button type="submit">
                            <img src="/check-square.png" className="w-6 h-6"/>
                        </button>
                    </div>

                 
                    <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                        <img src="/logo 3.jpg" className="w-80 h-80 object-cover rounded-full border-2"/>

                       
                        <button type="button" className="mt-2 border px-4 py-1 rounded hover:border-Lavanda transition">
                            <img src="/upload.png"/>
                        </button>

                       
                        <div className="flex gap-2 mt-4 w-full justify-between hidden md:flex">
                            <button type="button" onClick={cancelarEdicion} className="border border-Lavanda bg-Lavanda text-white px-8 py-3 rounded font-medulaone text-lg">
                                Cancelar
                            </button>
                            <button type="submit" className="border border-Lavanda bg-night hover:bg-Lavanda text-white px-8 py-3 rounded font-medulaone text-lg">
                                Guardar
                            </button>
                        </div>
                    </div>

                    
                    <div className="flex flex-col gap-3 w-full md:w-2/3 text-white">
                        <label className="font-motserrat">Usuario:</label>
                        <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="bg-white text-black rounded px-2 py-1"/>
                        <p>{nombre.length<20?"Límite correcto":"El nombre es demasiado grande"}</p>

                        <label className="font-motserrat">Descripcion:</label>
                        <textarea value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} className="bg-white text-black border border-Lavanda rounded px-2 py-2 h-64 resize-none"/>
                        <p>{descripcion.length>19?"Descripcion válida":"La descripcion es muy corta"}</p>

                       
                        <div className="flex flex-col w-full mt-4">
                            <label className="font-motserrat mb-2">Favorito:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {juegos.map(juego => (
                                    <div key={juego.id} className="relative w-28 h-36">
                                        <img src={juego.src} className="w-full h-full "/>
                                        <button type="button"  onClick={()=>eliminarJuego(juego.id)} className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-10">
                                            <img src="/quitar.png" className="w-8 h-8"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    
    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
            <div className="relative bg-night w-[95%] max-w-screen-xl min-h-[40rem] rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl text-white">
                
              
                <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                    <img src="/logo 3.jpg" className="w-80 h-80 object-cover rounded-full border-2"/>

                    
                    <button className="mt-12 px-8 py-4 rounded-lg border-2 border-Lavanda bg-Lavanda text-white font-bold text-xl hidden font-medulaone">
                        Banear
                    </button>

                   
                    <button className="absolute top-3 right-3 hidden">
                        <img src="/ban.png" className="w-8 h-8"/>
                    </button>
                </div>

                
                <div className="flex flex-col gap-3 w-full md:w-2/3">
                    <h1 className="text-2xl font-bold font-motserrat">{nombre}</h1>
                    <label>Fecha de registro : 12/01/2004</label>

                    <label className="font-motserrat mt-4">Descripcion:</label>
                    <textarea value={descripcion} readOnly className="bg-night text-white border border-Lavanda rounded p-2 h-64 resize-none font-motserrat"/>

                  
                    <div className="flex flex-col w-full mt-4">
                        <label className="font-motserrat mb-2">Favorito:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {juegos.map(juego => (
                                <div key={juego.id} className="relative w-28 h-36">
                                    <img src={juego.src} className="w-full h-full "/>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                
               <button onClick={activarEdicion} className="absolute right-3 top-0 md:top-3 hover:border p-1 hover:border-Lavanda rounded-md transition">
    <img src="/pencil-square.png" className="w-8 h-8"/>
</button>

            </div>
        </div>
    )
}
