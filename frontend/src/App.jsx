import { useState } from "react";
import Navegacion from "./components/Navegacion";
import Resultados from "./components/Resultados";

function App() {
  const [busqueda, setBusqueda] = useState('');

  const handleInput = (evt) => {
    setBusqueda(evt.target.value);
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Navegacion onInput={handleInput}/>
      <Resultados de={busqueda} />
    </div>
  )
}

export default App;
