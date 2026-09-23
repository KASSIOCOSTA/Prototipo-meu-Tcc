import { useState } from "react"

function CriarExperiencia({voltar}){
    const[nomeCliente, setNomeCliente]= useState('')
    return(
        <div>
            <h1>Criar experiências</h1>
            <p>Aqui vamos montar a Experiencia</p>
            <label>Nome do Cliente</label>
            <input 
            type="text"
            value={nomeCliente}
            onChange={(evento)=>{setNomeCliente(evento.target.value)}} />
            <button onClick={voltar}>sair</button>
        </div>
    )
}

export default CriarExperiencia