"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
export default function ListaTarjetasJuegos() {
  const searchParams = useSearchParams();
  const busqueda = searchParams.get("search") || "";
  const tipoQuery = searchParams.get("tipo") || "";

  const [videojuegos, setVideojuegos] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    async function fetchJuegos() {
      const response = await fetch("/api/juegos");
      const body = await response.json();
      setVideojuegos(body);
    }
    fetchJuegos();
  }, []);

  useEffect(() => {
    let filtered = videojuegos;

    if (busqueda) {
      filtered = filtered.filter((juego) =>
        juego.titulo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (tipoQuery) {
      filtered = filtered.filter((juego) => juego.tipo === tipoQuery);
    }

    setFilteredGames(filtered);
  }, [videojuegos, busqueda, tipoQuery]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {filteredGames.map((juego) => (
          <Juego key={juego.id} objeto={juego} />
        ))}
      </div>
    </div>
  );
}

function Juego({ objeto }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="rounded-3xl shadow-lg overflow-hidden p-4 hover:scale-105 transition">
      <Link href={"http://localhost:3000/vistajuego/"+objeto.id}>
      <img src={`${supabaseUrl}/storage/v1/object/public/images/${objeto.imagen_url}`} alt={objeto.titulo} className="w-3/4 h-48 sm:h-56 md:h-64 lg:h-72 object-contain rounded-t-lg"/>
      <p className="w-full mt-2 text-center font-medium text-black">{objeto.titulo}</p>
      </Link>
    </div>
  );
}