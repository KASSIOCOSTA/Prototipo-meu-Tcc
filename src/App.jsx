import { useState } from "react"
import Login from "./componentes/Login"
import Cliente from "./componentes/Cliente"

function App() {
    const [mostrarCliente, setMostrarCliente] = useState(false)

    return (
        <div>
            {mostrarCliente ? (
                <Cliente />
            ) : (
                <>
                <Login />
                <button onClick={() => setMostrarCliente(true)}>
                     Testar tela do cliente
                </button>
                </>
            )}
        </div>
    )
}

export default App