"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, supabaseURL } from "@/lib/supabase"; 

export function Navbar(props) {
  const router = useRouter();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localTipo, setLocalTipo] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("/iconoPerfil.png");
  const [userId, setUserId] = useState("");
  const [esAdmin, setEsAdmin] = useState(false); 

  const searchTerm = props.searchTerm ?? localSearchTerm;
  const setSearchTerm = props.setSearchTerm ?? setLocalSearchTerm;
  const selectedTipo = props.selectedTipo ?? localTipo;
  const setSelectedTipo = props.setSelectedTipo ?? setLocalTipo;

  const perfilStorageUrl = `${supabaseURL}/storage/v1/object/public/perfil/`;

  useEffect(() => {
    const initUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("usuario")
          .select("imagenPerfil, admin")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setEsAdmin(data.admin === true);

          if (data.imagenPerfil) {
            setFotoPerfil(
              data.imagenPerfil.includes("http")
                ? data.imagenPerfil
                : `${perfilStorageUrl}${data.imagenPerfil}`
            );
          }
        }
      } else {
        setUserId("");
        setEsAdmin(false);
        setFotoPerfil("/iconoPerfil.png");
      }
    };

    initUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (user) {
        setUserId(user.id);
      } else {
        setUserId("");
        setEsAdmin(false);
        setFotoPerfil("/iconoPerfil.png");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/listatarjetasjuegos?search=${encodeURIComponent(searchTerm)}&tipo=${encodeURIComponent(selectedTipo)}`);
  };

  return (
    <div className="w-full relative flex flex-row items-center justify-between bg-white text-white px-2 sm:px-6 py-2 sm:py-4">
      <div className="flex flex-col items-center">
        <Link href={"/listatarjetasjuegos?search=&tipo="}>
          <h1 className="text-2xl sm:text-5xl font-bold font-Gill text-Lavanda z-10">
            WIKIGAME
          </h1>
        </Link>
        {esAdmin && (
          <p className="block text-sm font-medium text-Lavanda">
            Modo Admin
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="absolute left-1/2 transform -translate-x-1/2 flex flex-row items-center gap-1 sm:static sm:flex-row"
      >
        <select
          value={selectedTipo}
          onChange={(e) => setSelectedTipo(e.target.value)}
          className="bg-Lavanda text-white px-2 sm:px-4 py-1 sm:py-2 rounded-l-lg border border-Lavanda text-sm sm:text-base"
        >
          <option value="">Tipo juego</option>
          <option value="SandBox">SandBox</option>
          <option value="Shooter">Shooter</option>
          <option value="Lucha">Lucha</option>
          <option value="Futbol">Futbol</option>
          <option value="Aventura">Aventura</option>
        </select>

        <input
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-2 sm:px-4 py-1 sm:py-2 rounded-r-lg bg-white text-Lavanda border border-Lavanda placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-Lavanda text-sm sm:text-base max-w-[120px] sm:max-w-xs"
        />
      </form>

      <div className="flex flex-row items-center justify-end w-full sm:w-auto gap-0">
        {esAdmin && (
          <Link href="/crearjuego">
            <button className="hover:scale-105 w-13 h-13 transition p-1 sm:p-2">
              <img src="/crear.png" alt="Crear" />
            </button>
          </Link>
        )}

        <Link href={userId ? `/perfil/${userId}` : "/iniciarsesion"}>
          <button className="hover:scale-105 w-13 h-13 transition p-1 sm:p-2 flex items-center justify-center">
            <img
              src={fotoPerfil}
              alt="Perfil"
              className="w-[45px] h-[45px] min-w-[45px] min-h-[45px] object-cover rounded-full border-2 border-Lavanda"
              onError={(e) => (e.target.src = "/iconoPerfil.png")}
            />
          </button>
        </Link>
      </div>
    </div>
  );
}