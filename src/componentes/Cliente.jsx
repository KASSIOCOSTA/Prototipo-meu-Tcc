import { useState } from "react";
import imageCompression from "browser-image-compression";

function Cliente({ enviarExperiencia, voltar, idCliente }) {
//useStates
  const [fotoPrincipal, setFotoPrincipal] = useState(null);
  const [musica, setMusica] = useState("");
  const [fotosCarrossel, setFotosCarrossel] = useState([]);
  const [usarContador, setUsarContador] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [visualizando, setVisualizando] = useState(false);
  const [fotoAtual, setFotoAtual] = useState(0);
//useStates

// Funções
const enviarParaSupabase = async () => {
  try {
    const formData = new FormData();

    formData.append("token", idCliente);
    formData.append("musica", musica);
    formData.append("mensagem", mensagem);
    formData.append("usarContador", String(usarContador));
    formData.append("dataInicio", dataInicio);

    formData.append("fotoPrincipal", fotoPrincipal);

    fotosCarrossel.forEach((foto) => {
      formData.append("fotosCarrossel", foto);
    });

    const resposta = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enviar-experiencia`,
      {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: formData,
      },
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao enviar a experiência.");
    }

    console.log("Resposta da Edge Function:", resultado);
    alert("Dados enviados para a função com sucesso!");

  } catch (erro) {
    console.error("Erro ao enviar experiência:", erro);
    alert(erro.message || "Não foi possível enviar a experiência.");
  }
};

 const escolherFoto = async (evento) => {
  const arquivo = evento.target.files[0];

  if (!arquivo) return;

  const opcoes = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const fotoComprimida = await imageCompression(arquivo, opcoes);

    setFotoPrincipal(fotoComprimida);

    console.log("Tamanho original:", arquivo.size);
    console.log("Tamanho comprimido:", fotoComprimida.size);
  } catch (erro) {
    console.error("Erro ao comprimir a foto:", erro);
    alert("Não foi possível processar a imagem.");
  }
};// escolher a foto principal

  const escolherFotos = async (evento) => {
  const arquivos = Array.from(evento.target.files);

  if (arquivos.length < 3) {
    alert("Escolha no mínimo 3 fotos.");
    return;
  }

  if (arquivos.length > 10) {
    alert("Escolha no máximo 10 fotos.");
    return;
  }

  const opcoes = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const fotosComprimidas = await Promise.all(
      arquivos.map(async (arquivo) => {
        const fotoComprimida = await imageCompression(arquivo, opcoes);

        console.log(
          `${arquivo.name}: ${arquivo.size} → ${fotoComprimida.size} bytes`
        );

        return fotoComprimida;
      })
    );

    setFotosCarrossel(fotosComprimidas);
    setFotoAtual(0);

  } catch (erro) {
    console.error("Erro ao comprimir as fotos:", erro);
    alert("Não foi possível processar as imagens.");
  }
};// escolher as fotos do carrosel
//Funções


// Pré-visualização
  //Mostrar a Pagina que o Cliente preencheu
  if (visualizando) {
    return (
      <div>
        <h1>Pré-visualização</h1>

        {fotoPrincipal && (
          <>
            <p>Foto principal: {fotoPrincipal.name}</p>

            <img
              src={URL.createObjectURL(fotoPrincipal)}
              alt="Foto principal"
              width="300"
            />
          </>
        )}

        <p>Música: {musica}</p>

      {/* CARROSSEL */}
        <div>
          <p>Fotos do carrossel:</p>

          {fotosCarrossel.length > 0 && (
            <div>
              <img
                src={URL.createObjectURL(fotosCarrossel[fotoAtual])}
                alt={`Foto ${fotoAtual + 1}`}
                width="300"
              />

              <p>
                Foto {fotoAtual + 1} de {fotosCarrossel.length}
              </p>

              <button
                onClick={() => setFotoAtual(fotoAtual - 1)}
                disabled={fotoAtual === 0}
              >
                ← Anterior
              </button>

              <button
                onClick={() => setFotoAtual(fotoAtual + 1)}
                disabled={fotoAtual === fotosCarrossel.length - 1}
              >
                Próxima →
              </button>
            </div>
          )}
        </div>

        {/* CONTADOR */}

        {usarContador && <p>Data: {dataInicio}</p>}

        {/* MENSAGEM */}

        <p>Mensagem:</p>

        <p>{mensagem}</p>

        <button onClick={() => setVisualizando(false)}>
          Voltar para editar
        </button>
        <button onClick={enviarParaSupabase}
          
        //Botão que envia as informações
        >
          Enviar experiência
        </button>
        <button onClick={voltar}>Voltar ao painel</button>
      </div>
    );
  }

// Formulário que o cliente recebe pra preencher

  return (
    <div>
      <h1>Personalize sua experiência</h1>

      <p>Preencha os dados para criar sua experiência.</p>

{/* FOTO PRINCIPAL */}

      <div>
        <label htmlFor="fotoPrincipal">Escolha a foto principal</label>

        <input
          id="fotoPrincipal"
          type="file"
          accept="image/*"
          onChange={escolherFoto}
        />

        {fotoPrincipal && <p>Foto selecionada: {fotoPrincipal.name}</p>}
      </div>

{/* MÚSICA */}

      <div>
        <label htmlFor="musica">Escolha uma música</label>

        <select
          id="musica"
          value={musica}
          onChange={(evento) => setMusica(evento.target.value)}
        >
          <option value="">Selecione uma música</option>

          <option value="musica1">Música 1</option>

          <option value="musica2">Música 2</option>

          <option value="musica3">Música 3</option>
        </select>

        {musica && <p>Música selecionada: {musica}</p>}
      </div>

{/* CARROSSEL */}

      <div>
        <label htmlFor="fotosCarrossel">Escolha as fotos do carrossel</label>

        <input
          id="fotosCarrossel"
          type="file"
          accept="image/*"
          multiple
          onChange={escolherFotos}
        />

        {fotosCarrossel.length > 0 && (
          <p>{fotosCarrossel.length} fotos selecionadas</p>
        )}
      </div>

{/* CONTADOR */}

      <div>
        <label>
          <input
            type="checkbox"
            checked={usarContador}
            onChange={(evento) => setUsarContador(evento.target.checked)}
          />
          Quero mostrar o tempo juntos
        </label>

        {usarContador && (
          <div>
            <label htmlFor="dataInicio">Data de início</label>

            <input
              type="date"
              id="dataInicio"
              value={dataInicio}
              onChange={(evento) => setDataInicio(evento.target.value)}
            />
          </div>
        )}
      </div>

{/* MENSAGEM */}

      <div>
        <label htmlFor="mensagem">Mensagem final</label>

        <textarea
          id="mensagem"
          value={mensagem}
          onChange={(evento) => setMensagem(evento.target.value)}
          placeholder="Escreva uma mensagem especial"
          minLength={50}
          maxLength={1000}
        />

        <p>{mensagem.length}/1000 caracteres</p>
      </div>

{/* VISUALIZAÇÃO */}

      <button
        onClick={() => {
          if (fotoPrincipal === null) {
            alert("Escolha a foto principal");
            return;
          } else if (musica === "") {
            alert("Selecione uma musica");
            return;
          } else if (fotosCarrossel.length < 3) {
            alert("Adicione no mínimo 3 fotos");
            return;
          } else if (mensagem.length < 50) {
            alert("Digite no mínimo 50 caracteres");
            return;
          }
          setVisualizando(true);
        }}
      >
        Visualizar experiência
      </button>
    </div>
  );
}

export default Cliente;
