import { useState } from "react";
import { supabase } from "../lib/supabase";

function Cadastro({ voltarLogin }) {
  //useStates
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [logo, setLogo] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  //useStates

  //funções
  async function verificacao() {
    setErro("");
    setSucesso("");
    if (nomeEmpresa.trim() === "") {
      setErro("Digite o nome da Empresa");
    } else if (responsavel.trim() === "") {
      setErro("Digite o nome do Responsavel");
    } else if (email == "") {
      setErro("E-mail vazio, por favor preencher o e-mail");
    } else if (!email.includes("@")) {
      setErro("O e-mail precisa conter @");
    } else if (!email.includes(".")) {
      setErro("O e-mail precisa conter um ponto");
    } else if (senha === "" || confirmarSenha === "") {
      setErro("Preencha as senhas");
    } else if (senha.length < 6) {
      setErro("Senha no minimo 6 caracteres");
    } else if (senha != confirmarSenha) {
      setErro("As senhas Precisam ser igual");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: {
          data: {
            nome_empresa: nomeEmpresa.trim(),
            responsavel: responsavel.trim(),
          },
        },
      });
      if (error) {
        setErro(error.message);
        return;
      }

      setSucesso("Conta criada! Confira seu e-mail para confirmar o cadastro.");
    }
  } //verificar se os campos foram preenchido

  //funções

 
return (
  <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg sm:p-10">

      {/* Cabeçalho */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600">
          Bem-vindo à plataforma
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Criar conta
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Cadastre sua empresa para começar a criar experiências especiais.
        </p>
      </div>

      {/* Mensagens */}
      {erro && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {sucesso}
        </div>
      )}

      {/* Formulário */}
      <div className="space-y-5">

        <div>
          <label htmlFor="nomeEmpresa" className="mb-2 block text-sm font-semibold text-slate-700">
            Nome da empresa
          </label>

          <input
            id="nomeEmpresa"
            type="text"
            placeholder="Digite o nome da empresa"
            value={nomeEmpresa}
            onChange={(evento) => {
              setNomeEmpresa(evento.target.value);
              setErro("");
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="responsavel" className="mb-2 block text-sm font-semibold text-slate-700">
            Nome do responsável
          </label>

          <input
            id="responsavel"
            type="text"
            placeholder="Digite o nome do responsável"
            value={responsavel}
            onChange={(evento) => {
              setResponsavel(evento.target.value);
              setErro("");
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            E-mail
          </label>

          <input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(evento) => {
              setEmail(evento.target.value);
              setErro("");
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="senha" className="mb-2 block text-sm font-semibold text-slate-700">
            Senha
          </label>

          <input
            id="senha"
            type="password"
            placeholder="Mínimo de 6 caracteres"
            value={senha}
            onChange={(evento) => {
              setSenha(evento.target.value);
              setErro("");
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="mb-2 block text-sm font-semibold text-slate-700">
            Confirmar senha
          </label>

          <input
            id="confirmarSenha"
            type="password"
            placeholder="Digite sua senha novamente"
            value={confirmarSenha}
            onChange={(evento) => {
              setConfirmarSenha(evento.target.value);
              setErro("");
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

      </div>

      {/* Botões */}
      <button
        type="button"
        onClick={verificacao}
        className="mt-7 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
      >
        Criar minha conta
      </button>

      <button
        type="button"
        onClick={voltarLogin}
        className="mt-4 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        Voltar para o login
      </button>

    </div>
  </main>
);
}

export default Cadastro;
