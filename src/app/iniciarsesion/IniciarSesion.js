"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function IniciarSesion() {
  const [email, setEmail] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.replace("/listatarjetasjuegos")
      }
    }

    checkSession()
  }, [router])

  async function handleLogin(e) {
    e.preventDefault()
    setCargando(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: contraseña,
      })

      if (error) {
        alert("Credenciales incorrectas")
        setCargando(false)
        return
      }

      if (data?.user) {
        router.refresh()
        router.replace("/listatarjetasjuegos")
      }
    } catch (err) {
      console.error(err)
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/fondoSesion.png')] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-night bg-opacity-95 p-8 sm:p-14 rounded-3xl space-y-6 w-4/5 sm:w-[600px] lg:w-[700px]"
      >
        <h1 className="text-white text-4xl sm:text-6xl font-medulaone font-bold -mt-8 mb-6 text-center">
          Iniciar sesión
        </h1>

        <input
          type="email"
          placeholder="@ Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-4 rounded-md text-black bg-white focus:outline-Lavanda"
        />
        <p className="text-white text-sm">
          {email.includes("@") ? "Correo válido" : "Introduce un correo electrónico"}
        </p>

        <input
          type="password"
          placeholder="🔒 Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
          className="w-full p-4 rounded-md text-black bg-white focus:outline-Lavanda"
        />
        <p className="text-white text-sm">
          {contraseña.length > 7 ? "Contraseña lista" : "Mínimo 8 caracteres"}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-6 w-full">
          <button
            type="submit"
            disabled={cargando}
            className="w-full sm:w-1/2 bg-Lavanda py-3 rounded-full font-medulaone text-white font-bold text-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {cargando ? "Cargando..." : "Iniciar sesión"}
          </button>

          <Link href="/registrar" className="w-full sm:w-1/2">
            <button
              type="button"
              className="w-full bg-night border-2 border-Lavanda text-white py-3 rounded-full font-medulaone font-bold text-xl hover:bg-Lavanda hover:text-black transition"
            >
              ¿No tienes cuenta?
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}