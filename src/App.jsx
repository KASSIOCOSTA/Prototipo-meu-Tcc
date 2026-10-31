import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

import Login from "./componentes/Login";
import Cliente from "./componentes/Cliente";
import Presenteado from "./componentes/Presenteado";


function PaginaCliente() {
  const { token } = useParams();

  return <Cliente idCliente={token} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/p/:token" element={<PaginaCliente />} />
        <Route path="/presente/:token" element={<Presenteado />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;