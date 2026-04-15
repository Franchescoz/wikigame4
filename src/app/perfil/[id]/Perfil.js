"use client"
import { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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
    const [userId, setUserId] = useState(null);
    const [esAdmin, setEsAdmin] = useState(false);

    const supabase = createClient();

    const perfilStorageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/perfil/`;
    const juegosStorageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

    useEffect(() => {
        const initUser = async () => {
            await supabase.auth.refreshSession();
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            if (user) {
                setUserId(user.id);
            }
        };

        initUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user;
            if (user) {
                setUserId(user.id);
            } else {
                setUserId(null);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (perfilId) {
            fetchDatosUsuario();
        }
    }, [perfilId]);

    async function fetchDatosUsuario() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (user) {
            setUserId(user.id);
        }

        try {
            if (user) {
                const resAdmin = await fetch(`/api/usuarios/perfilid?id=${user.id}`);
                if (resAdmin.ok) {
                    const dataAdmin = await resAdmin.json();
                    setEsAdmin(dataAdmin.admin === true);
                }
            }

            const response = await fetch(`/api/usuarios/perfilid?id=${perfilId}`);
            if (response.ok) {
                const data = await response.json();
                setNombre(data.nombre || "");
                setDescripcion(data.descripcion || "");
                const img = data.imagenPerfil || "";
                setImagenPerfil(img.includes("http") ? img : `${perfilStorageUrl}${img}`);
                setFechaRegistro(data.fecha_registro ? new Date(data.fecha_registro).toLocaleDateString() : "---");
            }

            const resFavs = await fetch(`/api/favorito/favoritoid?userId=${perfilId}`);
            if (resFavs.ok) {
                const favs = await resFavs.json();
                setJuegos(favs.map(f => ({
                    id: f.juego.id,
                    titulo: f.juego.titulo,
                    src: f.juego.image_juego?.[0]?.image_url 
                        ? `${juegosStorageUrl}${f.juego.image_juego[0].image_url}` 
                        : "/logo 3.jpg"
                })));
            }

        } catch (err) { 
            console.error("Error en la petición:", err); 
        }

        setLoading(false);
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

    async function handleCerrarSesion() {
        const { error } = await supabase.auth.signOut();
        if (!error) router.push("/iniciarsesion");
    }

    async function handleUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const filePath = `${userId}-${Math.random()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('perfil').upload(filePath, file);
        if (error) return alert("Error subiendo la imagen");
        setImagenPerfil(`${perfilStorageUrl}${filePath}`);
    }

    async function guardarEdicion(e) { 
        e.preventDefault();
        const nombreArchivo = imagenPerfil.split('/').pop();
        const response = await fetch("/api/usuarios", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: userId,
                usuario: { nombre, descripcion, imagenPerfil: nombreArchivo }
            })
        });
        if (response.ok) setEditar(false);
    }

    async function eliminarJuego(juegoId) {
        const response = await fetch("/api/favorito", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, juegoId: juegoId, esFavorito: true })
        });
        if (response.ok) setJuegos(juegos.filter(j => j.id !== juegoId));
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-night font-montserrat uppercase">Cargando...</div>;

    if (editar) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
                <form onSubmit={guardarEdicion} className="relative bg-night w-[95%] max-w-screen-xl min-h-[40rem] rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl text-white">
                    
                    <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                        {imagenPerfil && <img src={imagenPerfil} className="w-80 h-80 object-cover rounded-full border-2" onError={(e) => e.target.src = "/logo 3.jpg"}/>}
                        <input type="file" id="upload-photo" className="hidden" accept="image/*" onChange={handleUpload}/>
                        <button type="button" onClick={() => document.getElementById('upload-photo').click()}><img src="/upload.png"/></button>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-2/3 text-white">
                        <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} />
                        <textarea value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} />
                    </div>

                </form>
            </div>
        )
    }

    return (
        <div>
            {userId && perfilId && userId === perfilId && (
                <button onClick={() => setEditar(true)}>Editar</button>
            )}
        </div>
    )
}