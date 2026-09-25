import { useState } from "react"
import CriarExperiencia from "./CriarExperiencia"

function Painel({sair}){
const[criando,setCriando]=useState(false)
const[solicitacoes,setSolicitacoes] = useState([])
const[solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null)

const voltarPainel =()=>{
    setCriando(false)
}
const adicionarSolicitacoes =(solicitacao)=>{
    setSolicitacoes([...solicitacoes, solicitacao])
}
//function



     return(
<div>
    {criando?(<CriarExperiencia voltar={voltarPainel} adicionarSolicitacoes={adicionarSolicitacoes}/>):(<>
    <h1>Painel</h1>
    <button onClick={()=>{setCriando(true)}}>Criar experiências</button>
    <h2>Solicitações</h2>
    {solicitacoes.map((solicitacao,index)=>(
        <div key={index}>
            <p>Cliente: {solicitacao.nome}</p>
            <p>Status: {solicitacao.status}</p>
            <button onClick={()=>setSolicitacaoSelecionada(solicitacao)}>Visualizar</button>
        </div>
    ))}
    <button>Minhas experiências</button>
    <button onClick={sair}>sair</button>
    </>)}
</div>
     )
}

export  default Painel