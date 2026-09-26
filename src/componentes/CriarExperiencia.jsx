import { useState } from "react"

import { QRCodeCanvas } from "qrcode.react"

function CriarExperiencia({ voltar, adicionarSolicitacoes }) {

    const [nomeCliente, setNomeCliente] = useState("")

    const [erro, setErro] = useState("")

    const [link, setLink] = useState("")

    const [qrCode, setQrCode] = useState("")


    // Gerar link
    const gerarLink = () => {

        if (nomeCliente === "") {

            setErro("Digite o nome do Cliente")

        } else {

            setLink("https://nossoapp.com/p/7F82K9")

            setQrCode("https://nossoapp.com/p/7F82K9")

            adicionarSolicitacoes({
                nome: nomeCliente,
                status: "Personalização pendente"
            })
        }
    }


    // Baixar QR Code
    const baixarQRCode = () => {

        const canvas = document.querySelector("#qr-code")

        const imagem = canvas.toDataURL("image/png")

        const linkDownload = document.createElement("a")

        linkDownload.href = imagem

        linkDownload.download = `${nomeCliente}.png`

        linkDownload.click()
    }


    return (

        <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">

            <div className="mx-auto max-w-2xl">


                {/* Voltar */}

                <button
                    onClick={voltar}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    ← Voltar ao painel
                </button>


                {/* Card principal */}

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">


                    {/* Cabeçalho */}

                    <div className="mb-8">

                        <p className="text-sm font-medium text-indigo-600">
                            Nova experiência
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                            Criar experiência
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Crie uma solicitação e gere um link exclusivo para o cliente.
                        </p>

                    </div>


                    {/* Nome do cliente */}

                    <div className="space-y-2">

                        <label
                            htmlFor="nome"
                            className="block text-sm font-semibold text-slate-700"
                        >
                            Nome do cliente
                        </label>

                        <input
                            id="nome"
                            type="text"
                            value={nomeCliente}
                            placeholder="Ex.: Jadna"
                            onChange={(evento) => {
                                setNomeCliente(evento.target.value)
                                setErro("")
                            }}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />

                    </div>


                    {/* Erro */}

                    {erro && (

                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                            <p className="text-sm font-medium text-red-600">
                                {erro}
                            </p>

                        </div>

                    )}


                    {/* Botão gerar */}

                    <button
                        onClick={gerarLink}
                        className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99]"
                    >
                        Gerar link
                    </button>


                    {/* Resultado */}

                    {link && (

                        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">


                            <div className="mb-5">

                                <p className="text-sm font-medium text-emerald-600">
                                    Link criado
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Solicitação criada com sucesso
                                </h2>

                            </div>


                            {/* Link */}

                            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">

                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Link exclusivo
                                </p>

                                <p className="break-all text-sm text-slate-700">
                                    {link}
                                </p>

                            </div>


                            {/* Copiar */}

                            <button
                                onClick={() => navigator.clipboard.writeText(link)}
                                className="mt-4 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                            >
                                Copiar link
                            </button>


                            {/* QR Code */}

                            {qrCode && (

                                <div className="mt-6 flex flex-col items-center rounded-2xl bg-white p-6 ring-1 ring-slate-200">

                                    <p className="mb-4 text-sm font-semibold text-slate-700">
                                        QR Code
                                    </p>

                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <QRCodeCanvas
                                            id="qr-code"
                                            value={qrCode}
                                            size={220}
                                        />
                                    </div>


                                    <button
                                        onClick={baixarQRCode}
                                        className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Baixar QR Code
                                    </button>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}

export default CriarExperiencia