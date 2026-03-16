import { Navbar } from "@/app/Navbar";


import Perfil from "./Perfil";
export default function Home({params}) {
  return (
    <div >
      <Navbar/>
    <Perfil params={params} />
   
    </div>
  );
}
