"use client"
import { useState } from "react"
import Link from "next/link"
export default function IniciarSesion() {
  const [nombre, setNombre] = useState("")
  const [contraseña, setContraseña] = useState("")

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/fondoSesion.png')] flex items-center justify-center">
      
      
      <form className="bg-night bg-opacity-95 p-8 sm:p-14 rounded-3xl space-y-6 w-4/5 sm:w-[600px] lg:w-[700px]">
        
       
        <h1 className="text-white text-4xl sm:text-6xl font-medulaone font-bold -mt-8 mb-6 text-center">
  Iniciar sesión
</h1>

      
        <input type="text" placeholder="@ Usuario" value={nombre} onChange={(e)=> setNombre(e.target.value)} required className="w-full p-4 rounded-md text-black bg-white " />
        <p className="text-white self-start text-sm">{nombre.length > 0 ? "Usuario valido" : "Pon el usuario"}</p>

       
        <input type="password" placeholder="🔒 Contraseña" value={contraseña} onChange={(e)=> setContraseña(e.target.value)} required className="w-full p-4 rounded-md text-black bg-white " />
        <p className="text-white self-start text-sm">{contraseña.length > 7 ? "Contraseña valida" : "La contraseña debe tener al menos 8 caracteres"}</p>

        
        <div className="flex flex-col sm:flex-row gap-6 mt-6 w-full">
          
         <Link href="/listatarjetasjuegos" className="w-full sm:w-1/2">
          <button className="w-full bg-Lavanda py-3 rounded-full font-medulaone text-white font-bold text-xl hover:bg-purple-700 transition">
            Iniciar sesión
          </button>
        </Link>

        <Link href="/registrar" className="w-full sm:w-1/2">
          <button className="w-full bg-night border-2 border-Lavanda text-white py-3 rounded-full font-medulaone font-bold text-xl hover:bg-Lavanda hover:text-black transition">
            ¿No tienes cuenta?
          </button>
        </Link>

        </div>
      </form>
    </div>
  )
}
