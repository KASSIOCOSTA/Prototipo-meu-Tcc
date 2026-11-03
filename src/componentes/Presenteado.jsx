import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function Presenteado() {
  const { token } = useParams();

  const [experiencia, setExperiencia] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
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
  const audioRef = useRef(null);

  const [tocando, setTocando] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [erroAudio, setErroAudio] = useState("");

  const controlarMusica = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (tocando) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setErroAudio("");
    } catch (erro) {
      console.error("Erro ao reproduzir música:", erro);
      setErroAudio("Não foi possível reproduzir esta música.");
    }
  };

  const formatarTempo = (valor) => {
    if (!Number.isFinite(valor)) return "0:00";

    const minutos = Math.floor(valor / 60);
    const segundos = Math.floor(valor % 60);

    return `${minutos}:${String(segundos).padStart(2, "0")}`;
  };

  function mudarFoto(novaDirecao) {
    if (virando) return;

    setDirecao(novaDirecao);
    setVirando(true);

    setTimeout(() => {
      setFotoAtual((atual) => {
        const total = experiencia.fotos_carrossel.length;

        if (novaDirecao === "direita") {
          return atual === total - 1 ? 0 : atual + 1;
        }

        return atual === 0 ? total - 1 : atual - 1;
      });

      setVirando(false);
    }, 500);
  }

  useEffect(() => {
    async function carregarPresente() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consultar-presente`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ token }),
          },
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.erro || "Não foi possível carregar o presente.",
          );
        }

        setExperiencia(resultado.experiencia);
      } catch (erro) {
        console.error("Erro ao carregar presente:", erro);
        setErro(erro.message || "Não foi possível carregar o presente.");
      } finally {
        setCarregando(false);
      }
    }

    if (token) {
      carregarPresente();
    } else {
      setErro("Link do presente inválido.");
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    if (!experiencia || experiencia.fotos_carrossel.length <= 1 || virando) {
      return;
    }

    const temporizador = setTimeout(() => {
      mudarFoto("direita");
    }, 5000);

    return () => clearTimeout(temporizador);
  }, [experiencia, fotoAtual, virando]);

  useEffect(() => {
    if (
      !experiencia ||
      !experiencia.contador_ativo ||
      !experiencia.data_contador
    ) {
      return;
    }

    function atualizarContador() {
      const inicio = new Date(experiencia.data_contador).getTime();
      const agora = Date.now();

      const diferenca = Math.max(0, agora - inicio);

      const segundosTotais = Math.floor(diferenca / 1000);

      const dias = Math.floor(segundosTotais / 86400);
      const horas = Math.floor((segundosTotais % 86400) / 3600);
      const minutos = Math.floor((segundosTotais % 3600) / 60);
      const segundos = segundosTotais % 60;

      setTempo({ dias, horas, minutos, segundos });
    }

    atualizarContador();

    const intervalo = setInterval(atualizarContador, 1000);

    return () => clearInterval(intervalo);
  }, [experiencia]);

  if (carregando) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-300">Preparando seu presente... 🎁</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <p className="text-center text-red-400">{erro}</p>
      </main>
    );
  }

  if (!experiencia) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <p className="text-center text-zinc-300">
          Não encontramos os dados deste presente.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-8 flex flex-col items-center gap-10">
      {/* Foto principal e música */}
      <section className="w-full max-w-sm flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-5">Trilha sonora 🎵</h2>

        <div className="w-full aspect-square rounded-2xl bg-zinc-800 shadow-lg overflow-hidden">
          <img
            src={experiencia.foto_principal}
            alt="Foto principal do presente"
            className="w-full h-full object-cover"
          />
        </div>

       <div className="w-full mt-5">
  <div className="mb-4">
    <h3 className="text-lg font-semibold">
      Uma escolha especial
    </h3>

    <p className="text-sm text-zinc-400">
      Uma melodia para acompanhar este momento.
    </p>
  </div>

  <audio
    ref={audioRef}
    src={
      experiencia.musica
        ? `/musicas/${experiencia.musica}`
        : undefined
    }
    preload="metadata"
    onTimeUpdate={() => {
      setTempoAtual(audioRef.current?.currentTime || 0);
    }}
    onLoadedMetadata={() => {
      setDuracao(audioRef.current?.duration || 0);
    }}
    onPlay={() => setTocando(true)}
    onPause={() => setTocando(false)}
    onEnded={() => {
      setTocando(false);
      setTempoAtual(0);
    }}
    onError={() => {
      setErroAudio("Não foi possível carregar esta música.");
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#FFFFFF"><path d="M5.5,18V6h2V18h-2Zm13,0l-9-6l9-6V18Zm-2-6Zm0,2.25V9.75L13.1,12l3.4,2.25Z"/></svg>
    </button>

    <button
      type="button"
      onClick={controlarMusica}
      className="w-14 h-14 rounded-full bg-white text-black text-2xl flex items-center justify-center"
      aria-label={tocando ? "Pausar música" : "Reproduzir música"}
    >
      {tocando ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#1f1f1f"><path d="M13,19V5h6V19H13ZM5,19V5h6V19H5Zm10-2h2V7H15V17ZM7,17H9V7H7V17ZM7,7V17V7Zm8,0V17V7Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#1f1f1f"><path d="M8,19V5l11,7L8,19Zm2-7Zm0,3.35L15.25,12L10,8.65v6.7Z"/></svg>}
    </button>

    <button
      type="button"
      disabled
      className="text-2xl text-zinc-600 cursor-not-allowed"
      aria-label="Próxima música"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#FFFFFF"><path d="M16.5,18V6h2V18h-2Zm-11,0V6l9,6l-9,6Zm2-6Zm0,2.25L10.9,12L7.5,9.75v4.5Z"/></svg>
    </button>
  </div>

  <div className="mt-5">
    <input
      type="range"
      min="0"
      max={duracao || 0}
      value={tempoAtual}
      onChange={(evento) => {
        const novoTempo = Number(evento.target.value);

        if (audioRef.current) {
          audioRef.current.currentTime = novoTempo;
          setTempoAtual(novoTempo);
        }
      }}
      className="w-full accent-white"
      aria-label="Progresso da música"
    />

    <div className="flex justify-between text-xs text-zinc-400">
      <span>{formatarTempo(tempoAtual)}</span>
      <span>{formatarTempo(duracao)}</span>
    </div>
  </div>

  {erroAudio && (
    <p className="mt-3 text-center text-sm text-red-400">
      {erroAudio}
    </p>
  )}
</div>
      </section>

      {/* Carrossel de fotos */}
      <section className="w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-5">
          Nossas lembranças 📸
        </h2>
        <p className="[font-variant-caps:small-caps] text-xs text-center">
          arraste para o lado
        </p>

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
          <img
            src={
              experiencia.fotos_carrossel[
                direcao === "direita"
                  ? (fotoAtual + 1) % experiencia.fotos_carrossel.length
                  : (fotoAtual - 1 + experiencia.fotos_carrossel.length) %
                    experiencia.fotos_carrossel.length
              ]
            }
            alt="Próxima lembrança"
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />

          <img
            src={experiencia.fotos_carrossel[fotoAtual]}
            alt={`Lembrança ${fotoAtual + 1}`}
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            style={{
              transformOrigin: "left center",
              transform: virando
                ? `rotateY(${direcao === "direita" ? "-180deg" : "180deg"})`
                : "rotateY(0deg)",
              transition: virando ? "transform 1000ms ease-in-out" : "none",
              backfaceVisibility: "hidden",
            }}
          />

          <button
            type="button"
            onClick={() => mudarFoto("esquerda")}
            disabled={virando}
            className="absolute left-3 w-10 h-10 rounded-full   text-white text-xl"
            aria-label="Foto anterior"
          >
            ❮
          </button>

          <button
            type="button"
            onClick={() => mudarFoto("direita")}
            disabled={virando}
            className="absolute right-3 w-10 h-10 rounded-full  text-white text-xl"
            aria-label="Próxima foto"
          >
            ❯
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {experiencia.fotos_carrossel.map((foto, indice) => (
            <span
              key={indice}
              className={`w-2 h-2 rounded-full ${
                fotoAtual === indice ? "bg-white" : "bg-zinc-600"
              }`}
            ></span>
          ))}
        </div>
      </section>

      {/* Contador */}

      {experiencia.contador_ativo && (
        <section className="w-full max-w-sm text-center">
          <p className="text-zinc-400 text-sm mb-2">
            Nossa história começou em...
          </p>

          <h2 className="text-2xl font-bold mb-4">
            {new Date(experiencia.data_contador).toLocaleDateString("pt-BR")}
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

      {/* Mensagem */}
      <section className="w-full max-w-sm pb-10">
        <h2 className="text-xl font-semibold text-center mb-5">
          Uma mensagem para você ❤️
        </h2>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-l break-words">
          <p className="text-zinc-300 leading-7 whitespace-pre-wrap">
            {experiencia.mensagem}
          </p>
        </div>
      </section>
    </main>
  );
}

export default Presenteado;
