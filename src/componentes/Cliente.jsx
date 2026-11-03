import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";

function Cliente({ enviarExperiencia, voltar, idCliente, aoEnviarSucesso }) {
  // Estados
  const [fotoPrincipal, setFotoPrincipal] = useState(null);
  const [musica, setMusica] = useState("");
  const [fotosCarrossel, setFotosCarrossel] = useState([]);
  const [usarContador, setUsarContador] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [visualizando, setVisualizando] = useState(false);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [virando, setVirando] = useState(false);
  const [direcao, setDirecao] = useState("direita");
  const [inicioToque, setInicioToque] = useState(0);

  const [tempo, setTempo] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  const [tocando, setTocando] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracao, setDuracao] = useState(0);

  const [enviando, setEnviando] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState("");

  const audioRef = useRef(null);

  // Calcula o contador
  useEffect(() => {
    if (!usarContador || !dataInicio) return;

    const calcularTempo = () => {
      const inicio = new Date(`${dataInicio}T00:00:00`);
      const agora = new Date();

      const diferenca = Math.max(0, agora - inicio);

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
      const segundos = Math.floor((diferenca / 1000) % 60);

      setTempo({ dias, horas, minutos, segundos });
    };

    calcularTempo();

    const intervalo = setInterval(calcularTempo, 1000);

    return () => clearInterval(intervalo);
  }, [usarContador, dataInicio]);

  // Controla a música
  const controlarMusica = async () => {
    if (!audioRef.current) return;

    try {
      if (tocando) {
        audioRef.current.pause();
        setTocando(false);
      } else {
        await audioRef.current.play();
        setTocando(true);
      }
    } catch (erro) {
      console.error("Erro ao reproduzir música:", erro);
      setTocando(false);
    }
  };

  // Formata o tempo da música
  const formatarTempo = (tempo) => {
    const minutos = Math.floor(tempo / 60);
    const segundos = Math.floor(tempo % 60);

    return `${minutos}:${String(segundos).padStart(2, "0")}`;
  };

  // Muda a foto do carrossel
  function mudarFoto(novaDirecao) {
    if (virando || fotosCarrossel.length === 0) return;

    setDirecao(novaDirecao);
    setVirando(true);

    setTimeout(() => {
      setFotoAtual((atual) => {
        const total = fotosCarrossel.length;

        if (novaDirecao === "direita") {
          return atual === total - 1 ? 0 : atual + 1;
        }

        return atual === 0 ? total - 1 : atual - 1;
      });

      setVirando(false);
    }, 500);
  }

  // Envia a experiência para o Supabase
  const enviarParaSupabase = async () => {
    if (enviando || statusEnvio === "sucesso") return;

    setEnviando(true);
    setStatusEnvio("");

    try {
      const formData = new FormData();

      formData.append("token", idCliente);
      formData.append("musica", musica);
      formData.append("mensagem", mensagem);
      formData.append("usarContador", String(usarContador));
      formData.append("dataInicio", usarContador ? dataInicio : "");

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

      console.log("Status HTTP:", resposta.status);

      const textoResposta = await resposta.text();

      console.log("Resposta do servidor:", textoResposta);

      let resultado;

      try {
        resultado = JSON.parse(textoResposta);
      } catch {
        throw new Error(
          "O servidor retornou uma resposta inválida. Verifique sua conexão e tente novamente.",
        );
      }

      if (!resposta.ok) {
        throw new Error(
          resultado.erro || "Não foi possível enviar a experiência.",
        );
      }

      console.log("Experiência salva:", resultado);

      setStatusEnvio("sucesso");

      if (aoEnviarSucesso) {
        aoEnviarSucesso();
      }
    } catch (erro) {
      console.error("Erro ao enviar experiência:", erro);

      setStatusEnvio(
        erro.message || "Não foi possível enviar a experiência.",
      );
    } finally {
      setEnviando(false);
    }
  };

  // Escolhe e comprime a foto principal
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
  };

  // Escolhe e comprime as fotos do carrossel
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
            `${arquivo.name}: ${arquivo.size} → ${fotoComprimida.size} bytes`,
          );

          return fotoComprimida;
        }),
      );

      setFotosCarrossel(fotosComprimidas);
      setFotoAtual(0);
    } catch (erro) {
      console.error("Erro ao comprimir as fotos:", erro);
      alert("Não foi possível processar as imagens.");
    }
  };

  // Pré-visualização
  if (visualizando) {
    return (
      <main className="min-h-screen bg-zinc-950 w-full text-white px-8 py-8 flex flex-col items-center gap-10">
        <h1>Pré-visualização</h1>

        {fotoPrincipal && (
          <section className="w-full max-w-sm flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-5">Trilha sonora 🎵</h2>

            <div className="w-full aspect-square rounded-2xl bg-zinc-800 shadow-lg overflow-hidden">
              <img
                src={URL.createObjectURL(fotoPrincipal)}
                alt="Foto principal do presente"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full mt-5">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Uma escolha especial</h3>

                <p className="text-sm text-zinc-400">
                  Uma melodia para acompanhar este momento.
                </p>
              </div>

              <audio
                ref={audioRef}
                src={`/musicas/${musica}`}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setTempoAtual(audioRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setDuracao(audioRef.current.duration);
                  }
                }}
                onEnded={() => {
                  setTocando(false);
                }}
              />

              <div className="flex items-center justify-center gap-8">
                <button
                  type="button"
                  disabled
                  className="text-2xl text-zinc-600 cursor-not-allowed"
                  aria-label="Música anterior"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M5.5,18V6h2V18h-2Zm13,0l-9-6l9-6V18Zm-2-6Zm0,2.25V9.75L13.1,12l3.4,2.25Z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={controlarMusica}
                  className="w-14 h-14 rounded-full bg-white text-black text-2xl flex items-center justify-center"
                  aria-label={tocando ? "Pausar música" : "Reproduzir música"}
                >
                  {tocando ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      height="24px"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M13,19V5h6V19H13ZM5,19V5h6V19H5Zm10-2h2V7H15V17ZM7,17H9V7H7V17ZM7,7V17V7Zm8,0V17V7Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      height="24px"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M8,19V5l11,7L8,19Zm2-7Zm0,3.35L15.25,12L10,8.65v6.7Z" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  disabled
                  className="text-2xl text-zinc-600 cursor-not-allowed"
                  aria-label="Próxima música"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M16.5,18V6h2V18h-2Zm-11,0V6l9,6l-9,6Zm2-6Zm2.4,2.25V9.75L10.9,12l-3.4,2.25Z" />
                  </svg>
                </button>
              </div>

              <div className="mt-5">
                <input
                  type="range"
                  min="0"
                  max={duracao || 0}
                  value={tempoAtual}
                  onChange={(e) => {
                    const novoTempo = Number(e.target.value);

                    if (audioRef.current) {
                      audioRef.current.currentTime = novoTempo;
                    }

                    setTempoAtual(novoTempo);
                  }}
                  className="w-full accent-white"
                  aria-label="Progresso da música"
                />

                <div className="flex justify-between text-xs text-zinc-400">
                  <span>{formatarTempo(tempoAtual)}</span>
                  <span>{formatarTempo(duracao)}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CARROSSEL */}
        <section className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-center mb-5">
            Nossas lembranças 📸
          </h2>

          <p className="text-xs text-center text-zinc-400 mb-3">
            Arraste para o lado
          </p>

          {fotosCarrossel.length > 0 && (
            <>
              <div
                className="relative w-full aspect-[4/5] rounded-2xl bg-zinc-800 shadow-lg"
                style={{ perspective: "1200px" }}
                onTouchStart={(evento) => {
                  setInicioToque(evento.touches[0].clientX);
                }}
                onTouchEnd={(evento) => {
                  const fimToque = evento.changedTouches[0].clientX;
                  const distancia = fimToque - inicioToque;

                  if (Math.abs(distancia) < 50) return;

                  if (distancia < 0) {
                    mudarFoto("direita");
                  } else {
                    mudarFoto("esquerda");
                  }
                }}
              >
                {/* Foto que aparece por trás */}
                <img
                  src={URL.createObjectURL(
                    fotosCarrossel[
                      direcao === "direita"
                        ? (fotoAtual + 1) % fotosCarrossel.length
                        : (fotoAtual - 1 + fotosCarrossel.length) %
                          fotosCarrossel.length
                    ],
                  )}
                  alt="Próxima lembrança"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />

                {/* Foto que vira a página */}
                <img
                  src={URL.createObjectURL(fotosCarrossel[fotoAtual])}
                  alt={`Lembrança ${fotoAtual + 1}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  style={{
                    transformOrigin: "left center",
                    transform: virando
                      ? `rotateY(${direcao === "direita" ? "-180deg" : "180deg"})`
                      : "rotateY(0deg)",
                    transition: virando
                      ? "transform 500ms ease-in-out"
                      : "none",
                    backfaceVisibility: "hidden",
                  }}
                />

                {/* Foto anterior */}
                <button
                  type="button"
                  onClick={() => mudarFoto("esquerda")}
                  disabled={virando}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-white/50 text-xl disabled:opacity-30"
                  aria-label="Foto anterior"
                >
                  ❮
                </button>

                {/* Próxima foto */}
                <button
                  type="button"
                  onClick={() => mudarFoto("direita")}
                  disabled={virando}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-white/50 text-xl disabled:opacity-30"
                  aria-label="Próxima foto"
                >
                  ❯
                </button>
              </div>

              <p className="text-sm text-zinc-400 text-center mt-3">
                Foto {fotoAtual + 1} de {fotosCarrossel.length}
              </p>

              {/* Indicadores */}
              <div className="flex justify-center gap-2 mt-4">
                {fotosCarrossel.map((foto, indice) => (
                  <span
                    key={indice}
                    className={`w-2 h-2 rounded-full ${
                      fotoAtual === indice ? "bg-white" : "bg-zinc-600"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* CONTADOR */}
        {usarContador && (
          <section className="w-full max-w-sm text-center">
            <p className="text-zinc-400 text-sm mb-2">
              Nossa história começou em...
            </p>

            <h2 className="text-2xl font-bold mb-4">
              {new Date(`${dataInicio}T12:00:00`).toLocaleDateString("pt-BR")}
            </h2>

            <p className="text-zinc-400 text-sm mb-3">
              Você é especial para mim há ❤️
            </p>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-zinc-900 rounded-xl p-3">
                <span className="block text-2xl font-bold">{tempo.dias}</span>
                <span className="text-xs text-zinc-400">Dias</span>
              </div>

              <div className="bg-zinc-900 rounded-xl p-3">
                <span className="block text-2xl font-bold">
                  {String(tempo.horas).padStart(2, "0")}
                </span>
                <span className="text-xs text-zinc-400">Horas</span>
              </div>

              <div className="bg-zinc-900 rounded-xl p-3">
                <span className="block text-2xl font-bold">
                  {String(tempo.minutos).padStart(2, "0")}
                </span>
                <span className="text-xs text-zinc-400">Minutos</span>
              </div>

              <div className="bg-zinc-900 rounded-xl p-3">
                <span className="block text-2xl font-bold">
                  {String(tempo.segundos).padStart(2, "0")}
                </span>
                <span className="text-xs text-zinc-400">Segundos</span>
              </div>
            </div>
          </section>
        )}

        {/* MENSAGEM */}
        <section className="w-full max-w-sm pb-6">
          <h2 className="text-xl font-semibold text-center mb-5">
            Uma mensagem para você ❤️
          </h2>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <p className="text-zinc-300 leading-7 whitespace-pre-wrap break-words">
              {mensagem}
            </p>
          </div>
        </section>

        {/* BOTÕES */}
        <div className="w-full max-w-sm flex flex-col gap-3 pb-10">
          <button
            type="button"
            onClick={() => setVisualizando(false)}
            disabled={enviando || statusEnvio === "sucesso"}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            Voltar para editar
          </button>

          <button
            type="button"
            onClick={enviarParaSupabase}
            disabled={enviando || statusEnvio === "sucesso"}
            className="w-full rounded-xl bg-white px-6 py-4 font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando
              ? "Enviando experiência..."
              : statusEnvio === "sucesso"
                ? "Experiência enviada ❤️"
                : "Enviar experiência ❤️"}
          </button>

          {statusEnvio === "sucesso" && (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800">
              ❤️ Sua experiência foi enviada e confirmada com sucesso!
            </div>
          )}

          {statusEnvio && statusEnvio !== "sucesso" && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
              {statusEnvio}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Formulário que o cliente recebe
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:px-6">
      <header className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
          Personalize sua experiência
        </h1>

        <p className="mt-2 text-sm sm:text-base text-zinc-500">
          Preencha os dados abaixo para criar uma experiência especial.
        </p>
      </header>

      {/* FOTO PRINCIPAL */}
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-zinc-800">
          Foto principal
        </h2>

        <p className="mb-4 text-sm text-zinc-500">
          Escolha a foto que será a capa da sua experiência.
        </p>

        <label
          htmlFor="fotoPrincipal"
          className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm font-medium text-zinc-600 transition hover:border-zinc-500 hover:bg-zinc-100"
        >
          Escolher foto
        </label>

        <input
          id="fotoPrincipal"
          type="file"
          accept="image/*"
          onChange={escolherFoto}
          className="hidden"
        />

        {fotoPrincipal && (
          <div className="mt-4">
            <img
              src={URL.createObjectURL(fotoPrincipal)}
              alt="Prévia da foto principal"
              className="mx-auto aspect-[4/5] max-h-64 w-auto rounded-xl object-cover shadow-sm"
            />

            <p className="mt-2 truncate text-center text-xs text-zinc-400">
              {fotoPrincipal.name}
            </p>
          </div>
        )}
      </section>

      {/* MÚSICA */}
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-zinc-800">
          Música da experiência
        </h2>

        <p className="mb-4 text-sm text-zinc-500">
          Escolha uma música para acompanhar esse momento especial.
        </p>

        <select
          value={musica}
          onChange={(e) => setMusica(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
        >
          <option value="">Selecione uma música</option>
          <option value="things-to-do.mp3">Things to Do</option>
          <option value="leave-the-light-on.mp3">Leave the Light On</option>
          <option value="rain-in-my-city.mp3">Rain in My City</option>
          <option value="safe-with-you.mp3">Safe With You</option>
          <option value="set-me-down-soft.mp3">Set Me Down Soft</option>
        </select>

        {musica && (
          <div className="mt-4 rounded-xl bg-zinc-50 p-3">
            <p className="mb-2 text-sm font-medium text-zinc-700">
              Prévia da música
            </p>

            <audio
              controls
              autoPlay
              src={`/musicas/${musica}`}
              className="w-full"
            >
              Seu navegador não suporta áudio.
            </audio>
          </div>
        )}

        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs leading-relaxed text-blue-800">
            🎵 <strong>Sobre as músicas:</strong> As faixas desta biblioteca
            foram obtidas no Pixabay Music e são disponibilizadas conforme os
            termos de licença da plataforma.
          </p>
        </div>
      </section>

      {/* FOTOS DO CARROSSEL */}
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-zinc-800">
          Fotos das lembranças
        </h2>

        <p className="mb-4 text-sm text-zinc-500">
          Escolha de 3 a 10 fotos para aparecerem na sua experiência.
        </p>

        <label
          htmlFor="fotosCarrossel"
          className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm font-medium text-zinc-600 transition hover:border-zinc-500 hover:bg-zinc-100"
        >
          Adicionar fotos
        </label>

        <input
          id="fotosCarrossel"
          type="file"
          accept="image/*"
          multiple
          onChange={escolherFotos}
          className="hidden"
        />

        {fotosCarrossel.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {fotosCarrossel.map((foto, indice) => (
              <div key={indice} className="min-w-0">
                <img
                  src={URL.createObjectURL(foto)}
                  alt={`Lembrança ${indice + 1}`}
                  className="aspect-square w-full rounded-lg object-cover"
                />

                <p className="mt-1 truncate text-center text-xs text-zinc-400">
                  Foto {indice + 1}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs text-zinc-400">
          Fotos selecionadas: {fotosCarrossel.length}/10
        </p>
      </section>

      {/* CONTADOR */}
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-zinc-800">
          Contador de tempo
        </h2>

        <p className="mb-4 text-sm text-zinc-500">
          Se desejar, você pode mostrar há quanto tempo vocês estão juntos. O
          contador ficará visível na experiência do presenteado.
        </p>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={usarContador}
            onChange={(e) => setUsarContador(e.target.checked)}
            className="h-5 w-5 rounded border-zinc-300 accent-zinc-800"
          />

          <span className="text-sm font-medium text-zinc-700">
            Mostrar contador de tempo
          </span>
        </label>

        {usarContador && (
          <div className="mt-4">
            <label
              htmlFor="dataInicio"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Data de início
            </label>

            <input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </div>
        )}
      </section>

      {/* MENSAGEM */}
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-zinc-800">
          Mensagem especial
        </h2>

        <p className="mb-4 text-sm text-zinc-500">
          Escreva uma mensagem para acompanhar o presente. Use esse espaço para
          expressar o que você gostaria que a pessoa lesse.
        </p>

        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Escreva sua mensagem aqui..."
          rows={6}
          maxLength={1000}
          className="w-full resize-y rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
        />

        <p className="mt-2 text-right text-xs text-zinc-400">
          {mensagem.length}/1000 caracteres
        </p>
      </section>

      {/* VISUALIZAÇÃO */}
      <button
        type="button"
        onClick={() => {
          if (fotoPrincipal === null) {
            alert("Escolha a foto principal.");
            return;
          }

          if (musica === "") {
            alert("Selecione uma música.");
            return;
          }

          if (fotosCarrossel.length < 3) {
            alert("Adicione no mínimo 3 fotos.");
            return;
          }

          if (fotosCarrossel.length > 10) {
            alert("Adicione no máximo 10 fotos.");
            return;
          }

          if (usarContador && !dataInicio) {
            alert("Selecione a data de início do contador.");
            return;
          }

          if (mensagem.trim().length < 50) {
            alert("Digite no mínimo 50 caracteres.");
            return;
          }

          setStatusEnvio("");
          setVisualizando(true);
        }}
        className="w-full rounded-xl bg-zinc-900 px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-zinc-700 active:scale-[0.98]"
      >
        Visualizar experiência
      </button>
    </div>
  );
}

export default Cliente;
