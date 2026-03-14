"use client"
import { use, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
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

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    );

    const perfilStorageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/perfil/`;
    const juegosStorageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

    useEffect(() => {
        if (perfilId) {
            fetchDatosUsuario();
        }
    }, [perfilId]);

    async function fetchDatosUsuario() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        setUserId(user.id);
        try {
           
            const response = await fetch(`/api/usuarios/perfilid?id=${perfilId}`);
            
            if (!response.ok) {
                console.error("Error al obtener el perfil");
                setLoading(false);
                return;
            }

            const data = await response.json();

           
            setNombre(data.nombre || "");
            setDescripcion(data.descripcion || "");
            
            const img = data.imagenPerfil || "";
            setImagenPerfil(img.includes("http") ? img : `${perfilStorageUrl}${img}`);
            setFechaRegistro(data.fecha_registro ? new Date(data.fecha_registro).toLocaleDateString() : "---");

           
            const { data: favs, error } = await supabase
                .from('favorito')
                .select(`id_juego, juego (id, titulo, image_juego (image_url))`)
                .eq('id_usuario', perfilId);

            if (!error && favs) {
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
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, juegoId })
    });
    if (response.ok) setJuegos(juegos.filter(j => j.id !== juegoId));
}

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-night font-montserrat uppercase">Cargando...</div>;

    if (editar) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[url('/fondoSesion.png')] bg-cover bg-center font-montserrat">
                <form onSubmit={guardarEdicion} className="relative bg-night w-[95%] max-w-screen-xl min-h-[40rem] rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl text-white">
                    <div className="absolute top-2 left-0 right-0 flex justify-between px-4 md:hidden z-20">
                        <button type="button" onClick={() => setEditar(false)}><img src="/volver.png" className="w-6 h-6"/></button>
                        <button type="submit"><img src="/check-square.png" className="w-6 h-6"/></button>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                        {imagenPerfil && <img src={imagenPerfil} className="w-80 h-80 object-cover rounded-full border-2" onError={(e) => e.target.src = "/logo 3.jpg"}/>}
                        <input type="file" id="upload-photo" className="hidden" accept="image/*" onChange={handleUpload}/>
                        <button type="button" className="mt-2 border px-4 py-1 rounded hover:border-Lavanda transition" onClick={() => document.getElementById('upload-photo').click()}><img src="/upload.png"/></button>
                        <div className="flex gap-2 mt-4 w-full justify-between hidden md:flex">
                            <button type="button" onClick={() => setEditar(false)} className="border border-Lavanda bg-Lavanda text-white px-8 py-3 rounded font-medulaone text-lg">Cancelar</button>
                            <button type="submit" className="border border-Lavanda bg-night hover:bg-Lavanda text-white px-8 py-3 rounded font-medulaone text-lg">Guardar</button>
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
                                        <img src={juego.src} className="w-full h-full object-cover" onError={(e) => e.target.src = "/logo 3.jpg"}/>
                                        <button type="button" onClick={()=>eliminarJuego(juego.id)} className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-10"><img src="/quitar.png" className="w-8 h-8"/></button>
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
                    {imagenPerfil && <img src={imagenPerfil} className="w-80 h-80 object-cover rounded-full border-2 border-Lavanda" onError={(e) => e.target.src = "/logo 3.jpg"}/>}
                    <label>Fecha de registro : {fechaRegistro}</label>
                    
                
                    {userId === perfilId && (
                        <button onClick={handleCerrarSesion} className="mt-4 border border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded transition font-medulaone text-xl">Cerrar Sesión</button>
                    )}
                    {userId !== perfilId && (
                        <button onClick={handleBanear} className="mt-4 hidden md:block border border-red-500 bg-red-500 text-white px-8 py-2 rounded hover:bg-red-700 transition font-medulaone text-xl">Banear Usuario</button>
                    )}

                    
                    {userId !== perfilId && (
                        <button onClick={handleBanear} className="absolute top-3 right-3 block md:hidden">
                            <img src="/ban.png" className="w-8 h-8"/>
                        </button>
                    )}
                </div>
                
                <div className="flex flex-col gap-3 w-full md:w-2/3">
                    <h1 className="text-2xl font-bold font-motserrat">{nombre}</h1>
                    <label className="font-motserrat mt-4">Descripcion:</label>
                    <textarea value={descripcion} readOnly className="bg-night text-white border border-Lavanda rounded p-2 h-64 resize-none font-motserrat"/>
                    <div className="flex flex-col w-full mt-4">
                        <label className="font-motserrat mb-2">Favorito:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {juegos.map(juego => (
                                <div key={juego.id} className="relative w-28 h-36">
                                    <img src={juego.src} className="w-full h-full object-cover rounded shadow-md" onError={(e) => e.target.src = "/logo 3.jpg"} alt={juego.titulo}/>
                                    <p className="text-[10px] mt-1 text-center truncate">{juego.titulo}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {userId === perfilId && (
                    <button onClick={() => setEditar(true)} className="absolute right-3 top-0 md:top-3 hover:border p-1 hover:border-Lavanda rounded-md transition">
                        <img src="/pencil-square.png" className="w-8 h-8"/>
                    </button>
                )}
            </div>
        </div>
    )
}