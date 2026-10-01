import { useState } from "react"

function Cliente() {
    const [fotoPrincipal, setFotoPrincipal] = useState(null)
    const [musica, setMusica] = useState("")
    const [fotosCarrossel, setFotosCarrossel] = useState([])
    const [usarContador,setUsarContador]= useState(false)
    const [dataInicio,setDataInicio] = useState('')
    const [mensagem, setMensagem]= useState('')
    const[visualizando,setVisualizando]=useState(false)
//States ^

    const escolherFoto = (evento) => {
        setFotoPrincipal(evento.target.files[0])
    }

    const escolherFotos = (evento) => {
        const arquivos = Array.from(evento.target.files)

        if (arquivos.length < 3) {
            alert("Escolha no mínimo 3 fotos.")
            return
        }

        if (arquivos.length > 10) {
            alert("Escolha no máximo 10 fotos.")
            return
        }

        setFotosCarrossel(arquivos)
    }
//Funções
if (visualizando) {
        return (
            <div>
                <h1>Pré-visualização</h1>

                {fotoPrincipal && (
                    <p>
                        Foto principal: {fotoPrincipal.name}
                    </p>
                )}

                <p>
                    Música: {musica}
                </p>

                <p>
                    Fotos do carrossel: {fotosCarrossel.length}
                </p>

                {usarContador && (
                    <p>
                        Data: {dataInicio}
                    </p>
                )}

                <p>Mensagem:</p>

                <p>
                    {mensagem}
                </p>

                <button
                    onClick={() => setVisualizando(false)}
                >
                    Voltar para editar
                </button>
            </div>
        )
    }

    return (
        <div>
            <h1>Personalize sua experiência</h1>

            <p>
                Preencha os dados para criar sua experiência.
            </p>

            {/* FOTO PRINCIPAL */}

            <div>
                <label htmlFor="fotoPrincipal">
                    Escolha a foto principal
                </label>

                <input
                    id="fotoPrincipal"
                    type="file"
                    accept="image/*"
                    onChange={escolherFoto}
                />

                {fotoPrincipal && (
                    <p>
                        Foto selecionada: {fotoPrincipal.name}
                    </p>
                )}
            </div>

            {/* MÚSICA */}

            <div>
                <label htmlFor="musica">
                    Escolha uma música
                </label>

                <select
                    id="musica"
                    value={musica}
                    onChange={(evento) =>
                        setMusica(evento.target.value)
                    }
                >
                    <option value="">
                        Selecione uma música
                    </option>

                    <option value="musica1">
                        Música 1
                    </option>

                    <option value="musica2">
                        Música 2
                    </option>

                    <option value="musica3">
                        Música 3
                    </option>
                </select>

                {musica && (
                    <p>
                        Música selecionada: {musica}
                    </p>
                )}
            </div>

            {/* CARROSSEL */}

            <div>
                <label htmlFor="fotosCarrossel">
                    Escolha as fotos do carrossel
                </label>

                <input
                    id="fotosCarrossel"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={escolherFotos}
                />

                {fotosCarrossel.length > 0 && (
                    <p>
                        {fotosCarrossel.length} fotos selecionadas
                    </p>
                )}
            </div>
            <div>
                <label >
                    <input type="checkbox"
                    checked={usarContador}
                    onChange={(evento)=>{
                        setUsarContador(evento.target.checked)
                    }} />
                    Quero mostrar o tempo juntos
                </label>
                {usarContador&&(
                    <div>
                        <label htmlFor="dataInicio">
                            Data de Início
                        </label>
                        <input 
                        type="date" id="dataInicio"
                        value={dataInicio}
                        onChange={(evento)=>{
                            setDataInicio(evento.target.value)
                        }} />

                    </div>
                    
                )}

            </div>

            <div>
                <label htmlFor="mensagem">
                    mensagem final

                </label>
                <textarea 
                id="mensagem"
                value={mensagem}
                onChange={(evento)=>{
                    setMensagem(evento.target.value)
                }}
                placeholder="Escreva uma mensagem especial"
                min={50}
                maxLength={1000}
                ></textarea>
                <p>{mensagem.length}/1000 caracteres</p>
            </div>
            <button
            onClick={()=>setVisualizando(true)}>
                Vizualizador
            </button>
        </div>
        //fim
    )
}

export default Cliente