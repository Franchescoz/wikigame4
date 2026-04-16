"use client"

import { useEffect, useState } from "react"
import { supabaseURL } from "@/lib/supabase"

export default function VistaJuego({ params }) {
  const [editar, setEditar] = useState(false)
  const [juegoN, setJuegoN] = useState({})
  const [fotoPrincipal, setFotoPrincipal] = useState(0)
  const [esFavorito, setEsFavorito] = useState(false)
  const [userId, setUserId] = useState(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [usuario, setUsuario] = useState(null)

  const { id } = params

  useEffect(() => {
    cargarDatosUsuario()
    juegoFetch()
  }, [])

  async function cargarDatosUsuario() {
    try {
      const res = await fetch("/api/sesion")

      if (!res.ok) {
        setUsuario(null)
        setUserId(null)
        setEsAdmin(false)
        return
      }

      const datos = await res.json()
      setUsuario(datos)
      setUserId(datos.id)
      setEsAdmin(datos.admin === true)

      if (datos?.id) {
        verificarFavorito(datos.id)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function verificarFavorito(idUsuario) {
    try {
      const responseFav = await fetch(
        `/api/favorito/favoritoid?userId=${idUsuario}`
      )

      if (responseFav.ok) {
        const favs = await responseFav.json()
        const existe = favs.some(f => f.id_juego == id)
        if (existe) setEsFavorito(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function toggleFavorito() {
    if (!userId) return alert("Debes iniciar sesión")

    try {
      const response = await fetch("/api/favorito", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          juegoId: id,
          esFavorito: esFavorito
        })
      })

      const data = await response.json()

      if (response.ok) {
        setEsFavorito(data.estado)
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function juegoFetch() {
    const response = await fetch("/api/juegos/juegoid?id=" + id)
    const juego = await response.json()
    setJuegoN(juego)
  }

  function cancelarEdicion() {
    juegoFetch()
    setEditar(false)
  }

  async function handleModificar(juegoid, e) {
    e.preventDefault()

    const juegoParaActualizar = {
      titulo: juegoN.titulo,
      consolas: juegoN.consolas,
      tipo_juego: juegoN.tipo_juego,
      descripcion: juegoN.descripcion
    }

    await fetch("/api/juegos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: juegoid, juego: juegoParaActualizar })
    })

    setEditar(!editar)
  }

  async function handleUploadImage(e) {
    const file = e.target.files[0]
    if (!file) return
    if ((juegoN.image_juego?.length || 0) >= 4)
      return alert("Máximo 4 imágenes")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("id_juego", juegoN.id)

    try {
      const response = await fetch("/api/image_juego", {
        method: "PUT",
        body: formData
      })

      const nuevaImagen = await response.json()

      if (response.ok) {
        setJuegoN({
          ...juegoN,
          image_juego: [...(juegoN.image_juego || []), nuevaImagen]
        })
      } else {
        alert("Error: " + nuevaImagen.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (editar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
        <form
          className="relative bg-night w-[95%] max-w-screen-xl rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl"
          onSubmit={(e) => handleModificar(juegoN.id, e)}
        >
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <img
              src={`${supabaseURL}/storage/v1/object/public/images/${juegoN.image_juego?.[0]?.image_url}`}
              className="w-56 h-80 object-cover rounded-lg border-2"
            />
            <input
              type="file"
              id="uploadImage"
              accept="image/*"
              className="hidden"
              onChange={handleUploadImage}
            />
            <button
              type="button"
              onClick={() => document.getElementById("uploadImage").click()}
            >
              Subir
            </button>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-2/3 text-white">
            <input
              value={juegoN.titulo}
              onChange={(e) =>
                setJuegoN({ ...juegoN, titulo: e.target.value })
              }
            />
            <input
              value={juegoN.consolas}
              onChange={(e) =>
                setJuegoN({ ...juegoN, consolas: e.target.value })
              }
            />
            <input
              value={juegoN.tipo_juego}
              onChange={(e) =>
                setJuegoN({ ...juegoN, tipo_juego: e.target.value })
              }
            />
            <textarea
              value={juegoN.descripcion}
              onChange={(e) =>
                setJuegoN({ ...juegoN, descripcion: e.target.value })
              }
            />
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
      <div className="relative bg-night w-[95%] max-w-screen-xl rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl min-h-[40rem] text-white">
        <div className="absolute top-3 right-3 flex flex-col sm:flex-row gap-2">
          <button onClick={toggleFavorito}>
            <img
              src={esFavorito ? "/heartFav.png" : "/heart.png"}
              className="w-8 h-8"
            />
          </button>

          {esAdmin && (
            <button onClick={() => setEditar(!editar)}>
              <img src="/pencil-square.png" className="w-8 h-8" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <img
            src={`${supabaseURL}/storage/v1/object/public/images/${juegoN.image_juego?.[fotoPrincipal]?.image_url}`}
            className="w-56 h-80 rounded-lg object-cover border-2 border-Lavanda"
          />

          <div className="grid grid-cols-4 gap-2 w-56">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                onClick={() =>
                  juegoN.image_juego?.[index] && setFotoPrincipal(index)
                }
              >
                {juegoN.image_juego?.[index] && (
                  <img
                    src={`${supabaseURL}/storage/v1/object/public/images/${juegoN.image_juego[index].image_url}`}
                    className="w-12 h-12 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-2/3">
          <h1>{juegoN.titulo}</h1>
          <p>
            <b>Consolas:</b> {juegoN.consolas}
          </p>
          <p>
            <b>Tipo:</b> {juegoN.tipo_juego}
          </p>
          <textarea readOnly value={juegoN.descripcion} />
        </div>
      </div>
    </div>
  )
}