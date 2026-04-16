"use client"
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseURL } from "@/lib/supabase";

export default function Perfil({ params }) {
    const router = useRouter();
    const { id: perfilId } = use(params);

    const [loading, setLoading] = useState(true);
    const [editar, setEditar] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("Descripcion");
    const [fechaRegistro, setFechaRegistro] = useState("12/01/2004");
    const [imagenPerfil, setImagenPerfil] = useState(null);
    const [juegos, setJuegos] = useState([]);

    const [esMiPerfil, setEsMiPerfil] = useState(false);
    const [miUsuario, setMiUsuario] = useState(null);
    const [esAdmin, setEsAdmin] = useState(false);

    const perfilStorageUrl = `${supabaseURL}/storage/v1/object/public/perfil/`;
    const juegosStorageUrl = `${supabaseURL}/storage/v1/object/public/images/`;

    useEffect(() => {
        if (perfilId) {
            fetchDatosUsuario();
        }
    }, [perfilId]);

    useEffect(() => {
        async function cargarSesion() {
            try {
                const res = await fetch('/api/sesion');

                if (res.ok) {
                    const user = await res.json();
                    setMiUsuario(user);
                    setEsAdmin(user?.admin === true);
                    setEsMiPerfil(user?.id === perfilId);
                } else {
                    setMiUsuario(null);
                    setEsMiPerfil(false);
                    setEsAdmin(false);
                }
            } catch (error) {
                console.error(error);
            }
        }

        cargarSesion();
    }, [perfilId]);

    async function fetchDatosUsuario() {
        try {
            const response = await fetch(`/api/usuarios/perfilid?id=${perfilId}`);
            if (response.ok) {
                const data = await response.json();

                setNombre(data.nombre || "");
                setDescripcion(data.descripcion || "");

                const img = data.imagenPerfil || "";
                setImagenPerfil(
                    img.includes("http")
                        ? img
                        : `${perfilStorageUrl}${img}`
                );

                setFechaRegistro(
                    data.fecha_registro
                        ? new Date(data.fecha_registro).toLocaleDateString()
                        : "---"
                );
            }

            const resFavs = await fetch(`/api/favorito/favoritoid?userId=${perfilId}`);
            if (resFavs.ok) {
                const favs = await resFavs.json();

                setJuegos(
                    favs.map(f => ({
                        id: f.juego.id,
                        titulo: f.juego.titulo,
                        src: f.juego.image_juego?.[0]?.image_url
                            ? `${juegosStorageUrl}${f.juego.image_juego[0].image_url}`
                            : "/logo 3.jpg"
                    }))
                );
            }
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    }

    async function handleCerrarSesion() {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
            try {
                const res = await fetch('/api/sesion', { method: 'POST' });

                if (res.ok) {
                    window.location.href = "/iniciarsesion";
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function handleBanear() {
        if (window.confirm("¿Seguro que quieres eliminar a este usuario?")) {
            const response = await fetch("/api/usuarios", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: perfilId })
            });

            if (response.ok) router.push("/listatarjetasjuegos");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-night font-montserrat uppercase">
                Cargando...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
            <div className="relative bg-night w-[95%] max-w-screen-xl min-h-[40rem] rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl text-white">

                <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                    {imagenPerfil && (
                        <img
                            src={imagenPerfil}
                            className="w-80 h-80 object-cover rounded-full border-2 border-Lavanda"
                            onError={(e) => (e.target.src = "/logo 3.jpg")}
                        />
                    )}

                    <label>Fecha de registro : {fechaRegistro}</label>

                    {esMiPerfil && (
                        <button onClick={handleCerrarSesion}>
                            Cerrar Sesión
                        </button>
                    )}

                    {esAdmin && !esMiPerfil && (
                        <button onClick={handleBanear}>
                            Banear Usuario
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-3 w-full md:w-2/3">
                    <h1>{nombre}</h1>
                    <textarea value={descripcion} readOnly />
                </div>

                {esMiPerfil && (
                    <button onClick={() => setEditar(true)}>
                        Editar
                    </button>
                )}
            </div>
        </div>
    );
}