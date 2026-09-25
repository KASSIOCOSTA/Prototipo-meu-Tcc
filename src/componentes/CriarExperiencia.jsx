import { useState } from "react"
import { QRCodeCanvas } from 'qrcode.react'

function CriarExperiencia({voltar,adicionarSolicitacoes}){
    const[nomeCliente, setNomeCliente]= useState('')
    const[erro, setErro]= useState('')
    const[link, setLink] = useState('')
    const[qrCode, setQrCode]= useState('')
//users States

    const gerarLink =()=>{
        if(nomeCliente===""){
            setErro('Digite o nome do Cliente')
        }else{
             setLink('https://nossoapp.com/p/7F82K9')
             setQrCode('https://nossoapp.com/p/7F82K9')
             adicionarSolicitacoes({
                nome:nomeCliente,
                status:'Personalização pendente'
             })
        }

    }
    const baixarQRCode =()=>{
        const canvas = document.querySelector('#qr-code')
        const imagem = canvas.toDataURL('image/png')
        const linkDownload = document.createElement('a')

        linkDownload.href =imagem
        linkDownload.download=`${nomeCliente}.png`
        linkDownload.click()
    }
//funtion
    return(
        <div>
            <h1>Criar experiências</h1>
            <p>Aqui vamos montar a Experiencia</p>
            <label htmlFor="nome">Nome do Cliente</label>

            <input 
            id="nome"
            type="text"
            value={nomeCliente}
            onChange={(evento)=>{setNomeCliente(evento.target.value)
            setErro('')}} />
            <button onClick={gerarLink}>gerar</button>
            {erro && <p>{erro}</p>}
            {link&& (<button onClick={()=>navigator.clipboard.writeText(link)}>
                 Copiar link
            </button>)}
            {qrCode&&(
            <>
            <QRCodeCanvas id="qr-code" value={qrCode}/>
            <button onClick={baixarQRCode}>Baixar QR Code</button>
            </>)}

            <button onClick={voltar}>Voltar</button>
        </div>
    )
}

export default CriarExperiencia