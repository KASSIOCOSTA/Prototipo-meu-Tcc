import { useEffect, useState } from "react";
import { testarConexao } from "./testarSupabase";
import Login from "./componentes/Login";
import Cliente from "./componentes/Cliente";

function App() {
  const [mostrarCliente, setMostrarCliente] = useState(false);
  
  useEffect(() => {
    testarConexao();
  }, []);

  return (
    <div>
      {mostrarCliente ? (
        <Cliente />
      ) : (
        <>
          <Login />
        </>
      )}
    </div>
  );
}

export default App;
