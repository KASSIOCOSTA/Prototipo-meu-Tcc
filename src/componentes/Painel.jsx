import { useState } from "react"

import CriarExperiencia from "./CriarExperiencia"

function Painel({ sair }) {

    const [criando, setCriando] = useState(false)
    const [solicitacoes, setSolicitacoes] = useState([])
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null)
    const [verConfirmados, setVerConfirmados] = useState(false)
    const [verSolicitacoes, setVerSolicitacoes] = useState(false)
//useStates

    const voltarPainel = () => {
        setCriando(false)
    }


    const adicionarSolicitacoes = (solicitacao) => {
        setSolicitacoes([...solicitacoes, solicitacao])
    }
    

//funções


// Visualizar uma solicitação específica
    if (solicitacaoSelecionada) {
        return (
            <div className="min-h-screen bg-slate-100 px-4 py-8">

                <div className="mx-auto max-w-3xl">

                    <button
                        onClick={() => setSolicitacaoSelecionada(null)}
                        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        ← Voltar
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

                        <div className="space-y-4">

                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Cliente
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {solicitacaoSelecionada.nome}
                                </p>
                            </div>


                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Status
                                </p>

                                <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                                    {solicitacaoSelecionada.status}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        )
    }


    return (

        <div className="min-h-screen bg-slate-100">

            {criando ? (

                <CriarExperiencia
                    voltar={voltarPainel}
                    adicionarSolicitacoes={adicionarSolicitacoes}
                />

            ) : verSolicitacoes ? (

                // =========================
                // SOLICITAÇÕES PENDENTES
                // =========================

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
                                        solicitacao.status === "Personalização pendente"
                                )
                                .map((solicitacao, index) => (

                                    <div
                                        key={index}
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
                                            onClick={() =>
                                                setSolicitacaoSelecionada(solicitacao)
                                            }
                                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                                        >
                                            Visualizar
                                        </button>
                                        

                                    </div>

                                ))}

                        </div>

                    </div>

                </div>

            ) : verConfirmados ? (

                // =========================
                // CONFIRMADOS
                // =========================

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
                                    (solicitacao) =>
                                        solicitacao.status === "Confirmado"
                                )
                                .map((solicitacao, index) => (

                                    <div
                                        key={index}
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
                                            onClick={() =>
                                                setSolicitacaoSelecionada(solicitacao)
                                            }
                                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            Visualizar
                                        </button>

                                    </div>

                                ))}

                        </div>

                    </div>

                </div>

            ) : (

                // =========================
                // PAINEL PRINCIPAL
                // =========================

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
                                                        solicitacao.status ===
                                                        "Personalização pendente"
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
                                                    (solicitacao) =>
                                                        solicitacao.status ===
                                                        "Confirmado"
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
    )
}

export default Painel