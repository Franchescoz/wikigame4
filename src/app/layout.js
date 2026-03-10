"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}







export function Navbar({ searchTerm, setSearchTerm, selectedTipo, setSelectedTipo }) {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/listatarjetasjuegos?search=${encodeURIComponent(searchTerm)}&tipo=${encodeURIComponent(selectedTipo)}`);
  };

  return (
    <div className="w-full relative flex flex-row items-center justify-between bg-white text-white px-2 sm:px-6 py-2 sm:py-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl sm:text-5xl font-bold font-Gill text-Lavanda z-10">WIKIGAME</h1>
        <p className="hidden text-sm font-medium text-Lavanda">Modo Admin</p>
      </div>

      <form onSubmit={handleSubmit} className="absolute left-1/2 transform -translate-x-1/2 flex flex-row items-center gap-1 sm:static sm:flex-row">
        <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)} className="bg-Lavanda text-white px-2 sm:px-4 py-1 sm:py-2 rounded-l-lg border border-Lavanda text-sm sm:text-base"><option value="">Tipo juego</option><option value="SandBox">SandBox</option><option value="Shooter">Shooter</option><option value="Lucha">Lucha</option></select>
        <input type="text" placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-2 sm:px-4 py-1 sm:py-2 rounded-r-lg bg-white text-Lavanda border border-Lavanda placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-Lavanda text-sm sm:text-base max-w-[120px] sm:max-w-xs" />
      </form>

      <div className="flex flex-row items-center justify-end w-full sm:w-auto gap-0">
        <Link href="/crear-juego"><button className="hover:scale-105 w-13 h-13 transition p-1 sm:p-2"><img src="/crear.png" alt="Crear" /></button></Link>
        <Link href="/perfil"><button className="hover:scale-105 w-13 h-13 transition p-1 sm:p-2"><img src="/iconoPerfil.png" alt="Perfil" /></button></Link>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <div className="bg-black text-white w-full flex justify-center items-center mt-auto py-4">
      <p className="text-center">
        Wikigame © 2025 - Contactos: fcorrom2907@g.educaand.es - 999999999 - C/ Blanca de los rios 1
      </p>
    </div>
  );
}