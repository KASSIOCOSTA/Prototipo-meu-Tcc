import { useState } from "react"
import CriarExperiencia from "./CriarExperiencia"

function Painel({sair}){
const[criando,setCriando]=useState(false)
const voltarPainel =()=>{
    setCriando(false)
}

     return(
<div>
    {criando?(<CriarExperiencia voltar={voltarPainel}/>):(<>
    <h1>Painel</h1>
    <button onClick={()=>{setCriando(true)}}>Criar experiências</button>
    <button>Minhas experiências</button>
    <button onClick={sair}>sair</button>
    </>)}
</div>
     )
}

export  default Painel