"use client"
import { useState } from "react"
import Link from "next/link"

const array = [{ id: 1, nombre: "Pepi", correo: "pepi@gmail", contraseña: "1234" }]
let id = 1

export default function Registrar() {
  const [nuevoUsuario, setNuevoUsuario] = useState(array)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [contraseña, setContraseña] = useState("")

  function registrarUsuario(e) {
    e.preventDefault()
    const usuarioNuevo = [...nuevoUsuario, { id: id++, nombre, correo: email, contraseña }]
    setNuevoUsuario(usuarioNuevo)
    setNombre("")
    setEmail("")
    setContraseña("")
    alert("Usuario registrado con éxito 🎉")
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/fondoSesion.png')] flex items-center justify-center">
      <form onSubmit={registrarUsuario} className="bg-night bg-opacity-95 p-8 sm:p-14 rounded-3xl  items-center space-y-6 w-4/5 sm:w-[600px] lg:w-[700px]">
        <h1 className="text-white text-4xl sm:text-6xl font-medulaone font-bold -mt-8 mb-6 text-center">Registrar</h1>

        <input type="text" placeholder="@ Usuario" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full p-4 rounded-md text-black bg-white " />
        <p className="text-white self-start text-sm">{nombre.length > 0 && nombre.length < 20 ? "Usuario válido" : "El nombre debe tener menos de 20 caracteres"}</p>

        <input type="email" placeholder="✉️ Correo" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-4 rounded-md text-black bg-white " />
        <p className="text-white self-start text-sm">{email.includes("@") ? "Correo válido" : "Te falta el @ en el correo"}</p>

        <input type="password" placeholder="🔒 Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required minLength={6} pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}" className="w-full p-4 rounded-md text-black bg-white " />
        <p className="text-white self-start text-sm">{contraseña.length >= 6 ? "Contraseña válida" : "La contraseña debe tener al menos 6 caracteres y contener números y letras"}</p>
       
        <div className="flex flex-col sm:flex-row gap-6 mt-6 w-full">
            <Link href="/iniciarsesion" className="w-full sm:w-1/2">
          <button type="submit" className="w-full sm:w-1/2 bg-Lavanda py-3 rounded-full font-medulaone text-white font-bold text-xl hover:bg-purple-700 transition">Registrar</button>
          </Link>
          <Link href="/iniciarsesion" className="w-full sm:w-1/2">
          <button className="w-full bg-night border-2 border-Lavanda text-white py-3 rounded-full font-medulaone font-bold text-xl hover:bg-Lavanda hover:text-black transition">¿Ya tienes cuenta?</button>
          </Link>
        </div>
      </form>
    </div>
  )
}
