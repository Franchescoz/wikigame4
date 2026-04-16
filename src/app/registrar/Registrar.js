"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function Registrar() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [contraseña, setContraseña] = useState("")

  async function registrarUsuario(e) {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: contraseña,
      options: {
        data: {
          display_name: nombre,
        },
      },
    })

    if (error) {
      alert("Error: " + error.message)
      return
    }

    if (data.user) {
      const { error: dbError } = await supabase.from("usuario").upsert([
        {
          id: data.user.id,
          nombre: nombre,
          imagenPerfil: "default.png"
        },
      ])

      if (dbError) {
        alert("Error al guardar datos de usuario: " + dbError.message)
      } else {
        alert("Usuario registrado con éxito 🎉")
        router.push("/iniciarsesion")
      }
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/fondoSesion.png')] flex items-center justify-center">
      <form onSubmit={registrarUsuario} className="bg-night bg-opacity-95 p-8 sm:p-14 rounded-3xl items-center space-y-6 w-4/5 sm:w-[600px] lg:w-[700px]">
        <h1 className="text-white text-4xl sm:text-6xl font-medulaone font-bold -mt-8 mb-6 text-center">
          Registrar
        </h1>

        <input 
          type="text" 
          placeholder="@ Usuario" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
          className="w-full p-4 rounded-md text-black bg-white outline-none" 
        />
        <p className="text-white text-sm">
          {nombre.length > 0 && nombre.length < 20
            ? "Usuario válido"
            : "El nombre debe tener menos de 20 caracteres"}
        </p>

        <input 
          type="email" 
          placeholder="✉️ Correo" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full p-4 rounded-md text-black bg-white outline-none" 
        />
        <p className="text-white text-sm">
          {email.includes("@") ? "Correo válido" : "Te falta el @"}
        </p>

        <input 
          type="password" 
          placeholder="🔒 Contraseña" 
          value={contraseña} 
          onChange={(e) => setContraseña(e.target.value)} 
          required 
          minLength={6} 
          pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}" 
          className="w-full p-4 rounded-md text-black bg-white outline-none" 
        />
        <p className="text-white text-sm">
          {contraseña.length >= 6
            ? "Contraseña válida"
            : "Mínimo 6 caracteres con letras y números"}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-6 w-full">
          <button 
            type="submit" 
            className="w-full sm:w-1/2 bg-Lavanda py-3 rounded-full font-medulaone text-white font-bold text-xl hover:bg-purple-700 transition"
          >
            Registrar
          </button>
          
          <Link href="/iniciarsesion" className="w-full sm:w-1/2">
            <button 
              type="button" 
              className="w-full bg-night border-2 border-Lavanda text-white py-3 rounded-full font-medulaone font-bold text-xl hover:bg-Lavanda hover:text-black transition"
            >
              ¿Ya tienes cuenta?
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}