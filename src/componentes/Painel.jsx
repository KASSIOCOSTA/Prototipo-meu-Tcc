
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
  const [excluindoId, setExcluindoId] = useState(null);

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
  

async function excluirSolicitacao(solicitacao) {
  const confirmar = window.confirm(
    `Tem certeza que deseja excluir a solicitação de ${solicitacao.nome}? Esta ação não poderá ser desfeita.`
  );

  if (!confirmar) return;

  setExcluindoId(solicitacao.id);

  try {
    const { data, error } = await supabase.functions.invoke(
      "excluir-solicitacao",
      {
        body: {
          solicitacao_id: solicitacao.id,
        },
      }
    );

    if (error) throw error;

    if (data?.erro) throw new Error(data.erro);

    await carregarSolicitacoes();

    if (solicitacaoSelecionada?.id === solicitacao.id) {
      setSolicitacaoSelecionada(null);
    }

    alert("Solicitação excluída com sucesso!");

  } catch (erro) {
    console.error("Erro ao excluir:", erro);
    alert(erro.message || "Não foi possível excluir a solicitação.");

  } finally {
    setExcluindoId(null);
  }
}



  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  // Gerar link exclusivo do cliente
  function gerarLinkCliente(solicitacao) {
    if (solicitacaoSelecionada.status === "Personalização pendente") {
      return `${window.location.origin}/p/${solicitacao.token_cliente}`;
    } else {
      return `${window.location.origin}/presente/${solicitacao.token_cliente}`;
    }
  }

  // Copiar link
  async function copiarLink(link) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
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
      <div className="min-h-screen bg-slate-100 px-3 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-3xl">

          <button
            onClick={() => setSolicitacaoSelecionada(null)}
            className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            ← Voltar às solicitações
          </button>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-8">

            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-600">
                📋 Solicitação
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Visualizar solicitação
              </h1>
            </div>

            {/* Dados do cliente */}

            <div className="mb-6 rounded-xl bg-slate-50 p-4 sm:p-5">
              <p className="text-sm text-slate-500">👤 Cliente</p>

              <p className="mt-1 break-words font-semibold text-slate-900">
                {solicitacaoSelecionada.nome}
              </p>

              <p className="mt-4 text-sm text-slate-500">📌 Status</p>

              <span
                className={`mt-2 inline-flex max-w-full items-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                  solicitacaoSelecionada.status === "Confirmado"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {solicitacaoSelecionada.status === "Confirmado"
                  ? "✅ Confirmado"
                  : "⏳ Personalização pendente"}
              </span>
            </div>

            {/* Link do cliente */}

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:p-5">

              <h2 className="text-lg font-bold text-slate-900">
                🔗 Link de personalização
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Envie este endereço ao cliente para que ele personalize a experiência digital.
              </p>

              <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  readOnly
                  value={linkCliente}
                  className="min-w-0 w-full flex-1 rounded-xl border border-slate-300 bg-white px-3 py-3 text-xs text-slate-700 outline-none sm:px-4 sm:text-sm"
                />

                <button
                  onClick={() => copiarLink(linkCliente)}
                  className="w-full shrink-0 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
                >
                  📋 Copiar link
                </button>

              </div>
            </div>

            {/* QR Code */}

            <div className="mt-6 flex flex-col items-center rounded-xl bg-slate-50 p-4 sm:p-6">

              <h2 className="mb-2 text-lg font-bold text-slate-900">
                📱 QR Code
              </h2>

              <p className="mb-5 max-w-sm text-center text-sm leading-relaxed text-slate-500">
                Acesse a experiência digital através deste QR Code.
              </p>

              {solicitacaoSelecionada.token_cliente ? (
                <div className="flex w-full flex-col items-center">

                  <div className="max-w-full rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                    <QRCodeCanvas
                      ref={qrCodeRef}
                      value={linkCliente}
                      size={220}
                      level="H"
                      includeMargin
                      className="h-auto max-w-full"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const canvas = qrCodeRef.current;

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
                    className="mt-5 w-full max-w-xs rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    ⬇️ Baixar QR Code
                  </button>
                </div>

              ) : (
                <p className="text-sm text-red-600">
                  Não foi possível gerar o QR Code: token não encontrado.
                </p>
              )}

              <p className="mt-4 text-center text-xs text-slate-500">
                🎁 Este QR Code corresponde ao link exclusivo desta solicitação.
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
      <div className="min-h-screen bg-slate-100 px-3 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl">

          <button
            onClick={() => setMostrarConfiguracoes(false)}
            className="mb-6 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600"
          >
            ← Voltar ao painel
          </button>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h1 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
              ⚙️ Configurações da empresa
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

        <div className="min-h-screen px-3 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-5xl">

            <button
              onClick={() => setVerSolicitacoes(false)}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              ← Voltar ao painel
            </button>

            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-600">
                📋 Solicitações
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Solicitações pendentes
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
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
                    className="flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5"
                  >

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-500">
                        👤 Cliente
                      </p>

                      <h2 className="mt-1 break-words text-base font-semibold text-slate-900 sm:text-lg">
                        {solicitacao.nome}
                      </h2>

                      <span className="mt-2 inline-flex max-w-full items-center whitespace-nowrap rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        ⏳ Personalização pendente
                      </span>
                    </div>

                   
<div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">

  <button
    onClick={() => setSolicitacaoSelecionada(solicitacao)}
    className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
  >
    👁️ Visualizar
  </button>

 
<button
  onClick={() => excluirSolicitacao(solicitacao)}
  disabled={excluindoId !== null}
  className={`w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition sm:w-auto ${
    excluindoId === solicitacao.id
      ? "cursor-wait bg-slate-500"
      : excluindoId !== null
        ? "cursor-not-allowed bg-slate-300"
        : "bg-red-600 hover:bg-red-700"
  }`}
>
  {excluindoId === solicitacao.id
    ? "⏳ Excluindo..."
    : "🗑️ Excluir"}
</button>


</div>

                  </div>
                ))}

            </div>

            {solicitacoes.filter(
              (solicitacao) =>
                solicitacao.status === "Personalização pendente",
            ).length === 0 && (
              <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 sm:p-8">
                <p className="text-3xl">📭</p>

                <p className="mt-3 font-semibold text-slate-700">
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

        <div className="min-h-screen px-3 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-5xl">

            <button
              onClick={() => setVerConfirmados(false)}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              ← Voltar ao painel
            </button>

            <div className="mb-8">
              <p className="text-sm font-medium text-emerald-600">
                🎁 Experiências
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Experiências confirmadas
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
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
                    className="flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5"
                  >

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-500">
                        👤 Cliente
                      </p>

                      <h2 className="mt-1 break-words text-base font-semibold text-slate-900 sm:text-lg">
                        {solicitacao.nome}
                      </h2>

                      <span className="mt-2 inline-flex max-w-full items-center whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        ✅ Confirmado
                      </span>
                    </div>

                    
<div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">

  <button
    onClick={() => setSolicitacaoSelecionada(solicitacao)}
    className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
  >
    👁️ Visualizar
  </button>

  
<button
  onClick={() => excluirSolicitacao(solicitacao)}
  disabled={excluindoId !== null}
  className={`w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition sm:w-auto ${
    excluindoId === solicitacao.id
      ? "cursor-wait bg-slate-500"
      : excluindoId !== null
        ? "cursor-not-allowed bg-slate-300"
        : "bg-red-600 hover:bg-red-700"
  }`}
>
  {excluindoId === solicitacao.id
    ? "⏳ Excluindo..."
    : "🗑️ Excluir"}
</button>


</div>


                  </div>
                ))}

            </div>

            {solicitacoes.filter(
              (solicitacao) => solicitacao.status === "Confirmado",
            ).length === 0 && (
              <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 sm:p-8">
                <p className="text-3xl">🎁</p>

                <p className="mt-3 font-semibold text-slate-700">
                  Nenhuma experiência confirmada ainda.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Quando um cliente enviar sua experiência, ela aparecerá aqui.
                </p>
              </div>
            )}

          </div>
        </div>

      ) : (

        // =====================================
        // PAINEL PRINCIPAL
        // =====================================

        <div className="min-h-screen px-3 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">

            {/* Cabeçalho */}

            <div className="mb-8 sm:mb-10">
             
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Painel
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Gerencie suas experiências digitais.
              </p>
            </div>

            {/* Criar experiência */}

            <button
              onClick={() => setCriando(true)}
              className="mb-6 w-full rounded-2xl bg-indigo-600 p-5 text-left text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 sm:mb-8 sm:p-6"
            >
              <p className="text-sm font-medium text-indigo-100">
                ✨ Nova experiência
              </p>

              <h2 className="mt-1 text-lg font-bold sm:text-xl">
                Criar experiência
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-indigo-100">
                Crie um novo link personalizado para seu cliente.
              </p>

              <p className="mt-4 text-sm font-semibold">
                + Começar agora
              </p>
            </button>

            {/* Cards */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

              {/* Pendentes */}

              <button
                onClick={() => setVerSolicitacoes(true)}
                className="group min-w-0 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md sm:p-6"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      📋 Solicitações
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

                  <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-2 text-xs font-semibold text-amber-700 sm:px-3 sm:text-sm">
                    ⏳ Pendentes
                  </div>

                </div>

                <p className="mt-5 text-sm font-medium text-slate-600 transition group-hover:text-indigo-600">
                  Ver solicitações →
                </p>
              </button>

              {/* Confirmados */}

              <button
                onClick={() => setVerConfirmados(true)}
                className="group min-w-0 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md sm:p-6"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      🎁 Experiências
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {
                        solicitacoes.filter(
                          (solicitacao) => solicitacao.status === "Confirmado",
                        ).length
                      }
                    </h2>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-2 text-xs font-semibold text-emerald-700 sm:px-3 sm:text-sm">
                    ✅ Confirmados
                  </div>

                </div>

                <p className="mt-5 text-sm font-medium text-slate-600 transition group-hover:text-emerald-600">
                  Ver confirmados →
                </p>
              </button>

            </div>

            {/* Outros botões */}

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

              <button
                onClick={() => setMostrarConfiguracoes(true)}
                className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-indigo-600"
              >
                ⚙️ Configurações
              </button>

              <button
                className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-indigo-600"
              >
                🖼️ Minhas experiências
              </button>

              <button
                onClick={sair}
                className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-red-50"
              >
                🚪 Sair
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Painel;
