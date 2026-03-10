"use client"

import { useState } from "react"
import Link from "next/link"
const imagenes=[
    {id:1,src:"fornite.png", alt:"fortnite"},
    {id:2,src:"gta.jpeg" ,alt:"gta"},
    {id:3,src:"minecraft.jpeg", alt:"fortnite"}

]
export default function Landing(){
const [index,setIndex] = useState(1)

function continuar(){
    if(index<imagenes.length-1){
        setIndex(index+1)
    }else{
        setIndex(0)
    }
}
function anterior(){
    if(index>0){
        setIndex(index-1)
    }else{
        setIndex(imagenes.length-1)
    }
}
const arrayImagenes=[imagenes[index]]
    return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="sm:bg-[url('/fondoPC.png')] bg-[url('/movil.png')] bg-cover bg-center min-h-screen flex-1 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-6xl sm:text-8xl font-Gill font-bold text-center text-shadow-black -mt-16 sm:-mt-24 mb-8 sm:mb-12">
  WIKIGAME
</h1>

       
<div className="grid grid-cols-1 sm:grid-cols-8 grid-rows-1 sm:grid-rows-2 gap-y-8 sm:gap-y-16 gap-x-4 w-full max-w-6xl">
  
  
  <p className="bg-night text-xl sm:text-2xl p-6 rounded-4xl font-motserrat text-center col-span-1 sm:col-span-4 row-start-1 flex items-center justify-center">
    El portal de información de videojuegos que ve desde estos juegos
  </p>

  <img className="hidden sm:block w-40 h-40 sm:w-48 sm:h-48 border-2 border-white justify-self-center col-span-2 row-start-1" src="needforspeed.jpg" alt="needforspeed" />
  <img className="hidden sm:block w-40 h-40 sm:w-48 sm:h-48 border-2 border-white justify-self-center col-span-2 row-start-1" src="glicht.jpg" alt="glicht" />

  
  <img className="hidden sm:block w-40 h-40 sm:w-48 sm:h-48 border-2 border-white justify-self-center col-span-2 row-start-2" src="pokemon.jpg" alt="pokemon" />
  <img className="hidden sm:block w-40 h-40 sm:w-48 sm:h-48 border-2 border-white justify-self-center col-span-2 row-start-2" src="toyStory3.jpg" alt="toy story" />

  <p className="hidden sm:flex bg-night text-lg sm:text-2xl p-6 rounded-4xl font-motserrat text-center col-span-4 row-start-2 items-center justify-center">
    Hasta incluso estos juegos de Nintendo
  </p>
</div>

       <div className="flex flex-col sm:flex-row justify-center gap-6 mt-20 sm:mt-32">
  
  <Link href="/registrar">
  <button className="bg-Lavanda py-4 px-8 rounded-full font-medulaone text-white font-bold text-xl hover:bg-Lavanda transition">
    Registrarse
  </button>
</Link>

<Link href="/iniciarsesion">
  <button className="bg-night border-2 border-Lavanda text-white py-4 px-8 rounded-full font-medulaone font-bold text-xl hover:bg-Lavanda hover:text-black transition">
    Iniciar sesión
  </button>
</Link>
  
</div>


      </div>

    
      <div className="bg-night p-8 flex justify-center items-center gap-4">
  {imagenes.map((img, i) => {
    const offset = i - index;
    const isCenter = offset === 0;
    return <img key={img.id} src={img.src} alt={img.alt} className={`object-cover transition-all duration-500 rounded-2xl ${isCenter ? "w-64 sm:w-96 h-48 sm:h-80 blur-0 scale-100" : "w-40 sm:w-64 h-32 sm:h-48 blur-sm opacity-50 scale-90"}`} />

  })}
</div>

<div className="flex justify-center gap-4 mt-4">
  <button className="px-4 py-2 bg-gray-700 text-white rounded-full font-medulaone hover:scale-105 duration-300" onClick={anterior}>Anterior</button>
  <button className="px-4 py-2 bg-gray-700 text-white rounded-full font-medulaone hover:scale-105 duration-300" onClick={continuar}>Siguiente</button>
</div>

    </div>
  )
}