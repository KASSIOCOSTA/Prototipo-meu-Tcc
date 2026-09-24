import { useState } from "react"
import CriarExperiencia from "./CriarExperiencia"

function Painel({sair}){
const[criando,setCriando]=useState(false)
const[solicitacoes,setSolicitacoes] = useState([])

const voltarPainel =()=>{
    setCriando(false)
}
const adicionarSolicitacoes =(solicitacao)=>{
    setSolicitacoes([...solicitacoes, solicitacao])
}
//function



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