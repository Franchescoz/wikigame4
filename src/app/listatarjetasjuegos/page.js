"use client"; 
import { useState, Suspense } from "react";
import { Navbar } from "@/app/Navbar";
import { Footer } from "../layout";
import ListaTarjetasJuegos from "./ListaTarjetasJuegos";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");

  return (
    <div>
      <Navbar searchTerm={searchTerm}  setSearchTerm={setSearchTerm} selectedTipo={selectedTipo} setSelectedTipo={setSelectedTipo} />

      <Suspense fallback={<div>Cargando...</div>}>
        <ListaTarjetasJuegos searchTerm={searchTerm} selectedTipo={selectedTipo}   />
      </Suspense>

      <Footer /> 
    </div>
  );
}