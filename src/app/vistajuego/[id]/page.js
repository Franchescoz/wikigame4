import { Navbar } from "@/app/Navbar";

import VistaJuego from "./VistaJuego";


export default function Home({ params }) {
  return (
    <div >
      <Navbar />
     <VistaJuego params={params}/>
     
    
    </div>
  );
}
