
import { useState, useEffect, useRef } from "react";
import LogoEmpresa from "./LogoEmpresa";
import CriarExperiencia from "./CriarExperiencia";
import Cliente from "./Cliente";
import { supabase } from "../lib/supabase";
import { QRCodeCanvas } from "qrcode.react";


function Painel({ sair }) {
  const [criando, setCriando] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [idClienteAtual, setIdClienteAtual] = useState(null);
  const [verConfirmados, setVerConfirmados] = useState(false);
  const [verSolicitacoes, setVerSolicitacoes] = useState(false);
  const [mostraCliente, setMostrarCliente] = useState(false);
  const qrCodeRef = useRef(null);

  // Voltar para o painel
  const voltarPainel = () => {
    setCriando(false);
  };

  const voltarDoCliente = () => {
    setMostrarCliente(false);
  };

  // Adicionar solicitação
  const adicionarSolicitacoes = (solicitacao) => {
    setSolicitacoes((anteriores) => [...anteriores, solicitacao]);
  };

  // Atualizar experiência enviada
  const enviarExperiencia = (dadosExperiencia) => {
    setSolicitacoes((anteriores) =>
      anteriores.map((solicitacao) => {
        if (
          solicitacao.id === dadosExperiencia.idCliente ||
          solicitacao.token_cliente === dadosExperiencia.idCliente
        ) {
          return {
            ...solicitacao,
            status: "Confirmado",
            experiencia: dadosExperiencia,
          };
        }

        return solicitacao;
      }),
    );

    console.log("Experiência enviada");
  };

  // Buscar solicitações no Supabase
  const carregarSolicitacoes = async () => {
    try {
      const {
        data: { user },
        error: erroUsuario,
      } = await supabase.auth.getUser();

      if (erroUsuario || !user) {
        console.error("Usuário não autenticado:", erroUsuario);
        return;
      }

      const { data, error } = await supabase
        .from("solicitacoes")
        .select("id, token_cliente, nome_cliente, status, criado_em")
        .eq("empresa_id", user.id)
        .order("criado_em", { ascending: false });

      if (error) {
        throw error;
      }

      const solicitacoesFormatadas = data.map((solicitacao) => ({
        id: solicitacao.id,
        token_cliente: solicitacao.token_cliente,
        nome: solicitacao.nome_cliente,
        status:
          solicitacao.status === "Pendente"
            ? "Personalização pendente"
            : solicitacao.status,
      }));

      setSolicitacoes(solicitacoesFormatadas);
    } catch (erro) {
      console.error("Erro ao carregar solicitações:", erro);
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  // Gerar link exclusivo do cliente
  function gerarLinkCliente(solicitacao) {
    if(solicitacaoSelecionada.status === 'Personalização pendente'){
      return `${window.location.origin}/p/${solicitacao.token_cliente}`;
    }else{
      return `${window.location.origin}/presente/${solicitacao.token_cliente}`;
    }
  }

  

  // Copiar link
  async function copiarLink(link) {
  try {
    // Tenta usar a API moderna do navegador
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link);
    } else {
      // Alternativa para endereços HTTP na rede local
      const campo = document.createElement("textarea");

      campo.value = link;
      campo.style.position = "fixed";
      campo.style.opacity = "0";

      document.body.appendChild(campo);

      campo.select();

      const copiou = document.execCommand("copy");

      document.body.removeChild(campo);

      if (!copiou) {
        throw new Error("Falha ao copiar");
      }
    }

    alert("Link copiado com sucesso!");
  } catch (erro) {
    console.error("Erro ao copiar link:", erro);
    alert("Não foi possível copiar o link.");
  }
}

  // =====================================
  // VISUALIZAR SOLICITAÇÃO
  // =====================================

  if (solicitacaoSelecionada) {
    const linkCliente = gerarLinkCliente(solicitacaoSelecionada);
   
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-3xl">

          <button
            onClick={() => setSolicitacaoSelecionada(null)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Voltar às solicitações
          </button>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">

            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-600">
                Solicitação
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Visualizar solicitação
              </h1>
            </div>

            {/* Dados do cliente */}

            <div className="mb-6 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Cliente</p>

              <p className="mt-1 font-semibold text-slate-900">
                {solicitacaoSelecionada.nome}
              </p>

              <p className="mt-4 text-sm text-slate-500">Status</p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  solicitacaoSelecionada.status === "Confirmado"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {solicitacaoSelecionada.status}
              </span>
            </div>

            {/* Link do cliente */}

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">

              <h2 className="text-lg font-bold text-slate-900">
                Link de personalização
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Envie este endereço ao cliente para que ele personalize
                a experiência digital.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  readOnly
                  value={linkCliente}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                />

                <button
                  onClick={() => copiarLink(linkCliente)}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Copiar link
                </button>

              </div>
            </div>

            {/* QR Code */}

            <div className="mt-6 flex flex-col items-center rounded-xl bg-slate-50 p-6">

              <h2 className="mb-2 text-lg font-bold text-slate-900">
                QR Code
              </h2>

              <p className="mb-5 text-center text-sm text-slate-500">
                O cliente também pode acessar pelo QR Code.
              </p>

              {solicitacaoSelecionada.token_cliente ? (
                <div>
                <QRCodeCanvas
                  ref={qrCodeRef}
                  value={linkCliente}
                  size={220}
                  level="H"
                  includeMargin
                  
                />
                <button
  onClick={() => {
    const canvas = document.querySelector("#qrcode-presente");

    if (!canvas) {
      alert("QR Code não encontrado.");
      return;
    }

    const imagem = canvas.toDataURL("image/png");
    const linkDownload = document.createElement("a");

    linkDownload.href = imagem;
    linkDownload.download = `QR-Code-${solicitacaoSelecionada.nome}.png`;

    linkDownload.click();
  }}
  className="mt-5  rounded-xl m-auto bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
>
  Baixar QR Code
</button>
                </div>
                
              ) : (
                <p className="text-sm text-red-600">
                  Não foi possível gerar o QR Code: token não encontrado.
                </p>
              )}

              <p className="mt-4 text-center text-xs text-slate-500">
                Este QR Code corresponde ao link exclusivo desta solicitação.
              </p>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // TELA DO CLIENTE
  // =====================================

  if (mostraCliente) {
    return (
      <Cliente
        enviarExperiencia={enviarExperiencia}
        voltar={voltarDoCliente}
        idCliente={idClienteAtual}
        aoEnviarSucesso={carregarSolicitacoes}
      />
    );
  }

  // =====================================
  // CONFIGURAÇÕES
  // =====================================

  if (mostrarConfiguracoes) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-5xl">

          <button
            onClick={() => setMostrarConfiguracoes(false)}
            className="mb-6 rounded-lg bg-white px-4 py-2 shadow-sm"
          >
            ← Voltar ao painel
          </button>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">
              Configurações da empresa
            </h1>

            <LogoEmpresa />
          </div>

        </div>
      </div>
    );
  }

  // =====================================
  // CONTEÚDO PRINCIPAL
  // =====================================

  return (
    <div className="min-h-screen bg-slate-100">

      {criando ? (

        <CriarExperiencia
          voltar={voltarPainel}
          adicionarSolicitacoes={adicionarSolicitacoes}
        />

      ) : verSolicitacoes ? (

        // =====================================
        // SOLICITAÇÕES PENDENTES
        // =====================================

        <div className="min-h-screen px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-5xl">

            <button
              onClick={() => setVerSolicitacoes(false)}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              ← Voltar ao painel
            </button>

            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-600">
                Solicitações
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Solicitações pendentes
              </h1>

              <p className="mt-2 text-slate-500">
                Solicitações que ainda precisam ser preparadas.
              </p>
            </div>

            <div className="grid gap-4">

              {solicitacoes
                .filter(
                  (solicitacao) =>
                    solicitacao.status === "Personalização pendente",
                )
                .map((solicitacao) => (

                  <div
                    key={solicitacao.id}
                    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <p className="text-sm text-slate-500">
                        Cliente
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-slate-900">
                        {solicitacao.nome}
                      </h2>

                      <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        {solicitacao.status}
                      </span>
                    </div>

                    <button
                      onClick={() => setSolicitacaoSelecionada(solicitacao)}
                      className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Visualizar
                    </button>

                  </div>
                ))}

            </div>

            {solicitacoes.filter(
              (solicitacao) =>
                solicitacao.status === "Personalização pendente",
            ).length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="font-semibold text-slate-700">
                  Nenhuma solicitação pendente.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Quando houver novas solicitações, elas aparecerão aqui.
                </p>
              </div>
            )}

          </div>
        </div>

      ) : verConfirmados ? (

        // =====================================
        // CONFIRMADOS
        // =====================================

        <div className="min-h-screen px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-5xl">

            <button
              onClick={() => setVerConfirmados(false)}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              ← Voltar ao painel
            </button>

            <div className="mb-8">
              <p className="text-sm font-medium text-emerald-600">
                Experiências
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Confirmados
              </h1>

              <p className="mt-2 text-slate-500">
                Experiências que já estão prontas.
              </p>
            </div>

            <div className="grid gap-4">

              {solicitacoes
                .filter(
                  (solicitacao) => solicitacao.status === "Confirmado",
                )
                .map((solicitacao) => (

                  <div
                    key={solicitacao.id}
                    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <p className="text-sm text-slate-500">
                        Cliente
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-slate-900">
                        {solicitacao.nome}
                      </h2>

                      <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        {solicitacao.status}
                      </span>
                    </div>

                    <button
                      onClick={() => setSolicitacaoSelecionada(solicitacao)}
                      className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Visualizar
                    </button>

                  </div>
                ))}

            </div>

            {solicitacoes.filter(
              (solicitacao) => solicitacao.status === "Confirmado",
            ).length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="font-semibold text-slate-700">
                  Nenhuma experiência confirmada ainda.
                </p>
              </div>
            )}

          </div>
        </div>

      ) : (

        // =====================================
        // PAINEL PRINCIPAL
        // =====================================

        <div className="min-h-screen px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl">

            {/* Cabeçalho */}

            <div className="mb-10">
              <p className="text-sm font-medium text-indigo-600">
                Painel da floricultura
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Painel
              </h1>

              <p className="mt-2 text-slate-500">
                Gerencie suas experiências digitais.
              </p>
            </div>

            {/* Criar experiência */}

            <button
              onClick={() => setCriando(true)}
              className="mb-8 w-full rounded-2xl bg-indigo-600 p-6 text-left text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <p className="text-sm font-medium text-indigo-100">
                Nova experiência
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Criar experiência
              </h2>

              <p className="mt-2 text-sm text-indigo-100">
                Crie um novo link personalizado para seu cliente.
              </p>
            </button>

            {/* Cards */}

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Pendentes */}

              <button
                onClick={() => setVerSolicitacoes(true)}
                className="group rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Solicitações
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {
                        solicitacoes.filter(
                          (solicitacao) =>
                            solicitacao.status === "Personalização pendente",
                        ).length
                      }
                    </h2>
                  </div>

                  <div className="rounded-xl bg-amber-100 px-3 py-2 text-amber-700">
                    Pendentes
                  </div>

                </div>

                <p className="mt-5 text-sm font-medium text-slate-600 group-hover:text-indigo-600">
                  Ver solicitações →
                </p>
              </button>

              {/* Confirmados */}

              <button
                onClick={() => setVerConfirmados(true)}
                className="group rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Experiências
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {
                        solicitacoes.filter(
                          (solicitacao) => solicitacao.status === "Confirmado",
                        ).length
                      }
                    </h2>
                  </div>

                  <div className="rounded-xl bg-emerald-100 px-3 py-2 text-emerald-700">
                    Confirmados
                  </div>

                </div>

                <p className="mt-5 text-sm font-medium text-slate-600 group-hover:text-emerald-600">
                  Ver confirmados →
                </p>
              </button>

            </div>

            {/* Outros botões */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() => setMostrarConfiguracoes(true)}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Configurações da empresa
              </button>

              <button
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Minhas experiências
              </button>

              <button
                onClick={sair}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-red-50"
              >
                Sair
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Painel;
