"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ListaTarjetasJuegos() {
  const searchParams = useSearchParams();
  const busqueda = searchParams.get("search") || "";
  const tipoQuery = searchParams.get("tipo") || "";

  const [videojuegos, setVideojuegos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [juegosFiltrado, setJuegosFiltrado] = useState([]);
  const [usuariosFiltrado, setUsuariosFiltrado] = useState([]);

  useEffect(() => {
    fetchJuegos();
    fetchUsuarios();
  }, []);

  async function fetchJuegos() {
    const response = await fetch("/api/juegos");
    const body = await response.json();
    setVideojuegos(body);
  }

  async function fetchUsuarios() {
    const response = await fetch("/api/usuarios");
    const body = await response.json();
    setUsuarios(body);
  }

  useEffect(() => {
    let fJuegos = videojuegos;
    let fUsuarios = usuarios;

    if (busqueda) {
      fJuegos = fJuegos.filter((juego) =>
        juego.titulo.toLowerCase().includes(busqueda.toLowerCase())
      );
      fUsuarios = fUsuarios.filter((user) =>
        user.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (tipoQuery) {
      fJuegos = fJuegos.filter((juego) => juego.tipo_juego === tipoQuery);
      fUsuarios = [];
    }

    setJuegosFiltrado(fJuegos);
    setUsuariosFiltrado(fUsuarios);
  }, [videojuegos, usuarios, busqueda, tipoQuery]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-7xl">
        {juegosFiltrado?.map((juego) => (
          <Juego key={juego.id} objeto={juego} />
        ))}
        {usuariosFiltrado?.map((usuario) => (
          <Usuario key={usuario.id} objeto={usuario} />
        ))}
      </div>
      {juegosFiltrado.length === 0 && usuariosFiltrado.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 w-full">
          <p className="text-gray-500 text-xl font-medium tracking-tight">
            No se encontraron datos
          </p>
        </div>
      )}
    </div>
  );
}

function Juego({ objeto }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    <div className="rounded-3xl shadow-md overflow-hidden p-4 hover:scale-105 transition bg-white border border-gray-100">
      <Link href={"/vistajuego/" + objeto.id}>
        <div className="flex justify-center">
          <img src={`${supabaseUrl}/storage/v1/object/public/images/${objeto.image_juego?.[0]?.image_url}`}  alt={objeto.titulo}  className="w-full h-32 sm:h-40 md:h-48 object-contain rounded-xl"  onError={(e) => e.target.src = "/logo 3.jpg"}/>
        </div>
        <p className="w-full mt-3 text-center font-semibold text-sm text-black truncate">{objeto.titulo}</p>
      </Link>
    </div>
  );
}

function Usuario({ objeto }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const foto = objeto.imagenPerfil ? `${supabaseUrl}/storage/v1/object/public/perfil/${objeto.imagenPerfil}` : "/logo 3.jpg";
  return (
    <div className="rounded-3xl shadow-md overflow-hidden p-4 hover:scale-105 transition bg-white border border-gray-100">
      <Link href={"/perfil/" + objeto.id}>
        <div className="flex justify-center">
          <img src={foto}  alt={objeto.nombre} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full shadow-inner border-2 border-Lavanda/20" onError={(e) => e.target.src = "/logo 3.jpg"}/>
        </div>
        <p className="w-full mt-3 text-center font-semibold text-sm text-black truncate">{objeto.nombre}</p>
      </Link>
    </div>
  );
}