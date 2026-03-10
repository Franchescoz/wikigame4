"use client"; // importante si vas a usar useState
import { useState } from "react";
import { Navbar } from "../layout";
import { Footer } from "../layout";
import ListaTarjetasJuegos from "./ListaTarjetasJuegos";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedTipo={selectedTipo} setSelectedTipo={setSelectedTipo} />
      <ListaTarjetasJuegos searchTerm={searchTerm} selectedTipo={selectedTipo}   />
      <Footer />
    </div>
  );
}