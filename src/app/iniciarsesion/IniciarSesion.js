"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function IniciarSesion() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [cargando, setCargando] = useState(false)
    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setCargando(true)

        try {
          
            await supabase.auth.signOut()

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            if (authError) {
                setError("Correo o contraseña incorrectos.")
                setCargando(false)
                return
            }

            const userId = data.user.id

            const { data: datosUsuario, error: dbError } = await supabase
                .from("usuario")
                .select("*")
                .eq("id", userId)
                .single()

            if (dbError || !datosUsuario) {
                setError("Error al obtener usuario.")
                setCargando(false)
                return
            }

            setCargando(false)

            router.push("/listatarjetasjuegos")

        } catch (err) {
            setError("Error inesperado en el login.")
            setCargando(false)
        }
    }

    return (
        <div className="min-h-screen bg-cover bg-center bg-[url('/fondoSesion.png')] flex items-center justify-center">

            <form onSubmit={handleLogin} className="bg-night bg-opacity-95 p-8 sm:p-14 rounded-3xl space-y-6 w-4/5 sm:w-[600px] lg:w-[700px]">

                <h1 className="text-white text-4xl sm:text-6xl font-medulaone font-bold -mt-8 mb-6 text-center">
                    Iniciar sesión
                </h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-md text-center">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="@ Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-4 rounded-md text-black bg-white"
                />

                <input
                    type="password"
                    placeholder="🔒 Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-4 rounded-md text-black bg-white"
                />

                <div className="flex flex-col sm:flex-row gap-6 mt-6 w-full">

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full sm:w-1/2 bg-Lavanda py-3 rounded-full font-medulaone text-white font-bold text-xl"
                    >
                        {cargando ? "Cargando..." : "Iniciar sesión"}
                    </button>

                    <Link href="/registrar" className="w-full sm:w-1/2">
                        <button
                            type="button"
                            className="w-full bg-night border-2 border-Lavanda text-white py-3 rounded-full font-medulaone font-bold text-xl"
                        >
                            ¿No tienes cuenta?
                        </button>
                    </Link>

                </div>

            </form>

        </div>
    )
  }