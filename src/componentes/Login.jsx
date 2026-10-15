import { useState, useEffect } from "react";
import Painel from "./Painel";
import Cadastro from "./Cadastro";
import { supabase } from "../lib/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [logado, setLogado] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const menuLogin = () => {
    setLogado(false);
    setErro("");
  };
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === "SIGNED_IN" || evento === "INITIAL_SESSION") {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session && evento !== "PASSWORD_RECOVERY") {
      setLogado(true);
    }
  });
}
      if (evento === "PASSWORD_RECOVERY") {
        setMostrarRecuperacao(false);
        setMostrarNovaSenha(true);
        setErro("");
        setMensagem("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  async function recuperarSenha(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");
    if (!email.trim()) {
      setErro("Digite seu e-mail para recuperar a senha.");
      return;
    }
    setCarregando(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/` },
      );
      if (error) {
        setErro("Não foi possível enviar o e-mail. Tente novamente.");
        return;
      }
      setMensagem(
        "Se esse e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
      );
    } catch {
      setErro("Ocorreu um erro. Verifique sua conexão e tente novamente.");
    } finally {
      setCarregando(false);
    }
  }
  async function atualizarSenha(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");
    if (!novaSenha || !confirmarNovaSenha) {
      setErro("Preencha os dois campos de senha.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      setErro("As senhas não são iguais.");
      return;
    }
    setCarregando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
     if (error) {
  console.error("Erro do Supabase:", error);
  setErro("Não foi possível enviar o e-mail. Tente novamente.");
  return;
}
      setMensagem(
        "Senha alterada com sucesso! Você já pode entrar com a nova senha.",
      );
      setNovaSenha("");
      setConfirmarNovaSenha("");
    } catch {
      setErro("Ocorreu um erro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#fff8fa] flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {mostrarCadastro ? (
          <Cadastro voltarLogin={() => setMostrarCadastro(false)} />
        ) : mostrarRecuperacao ? (
          <div>
            {" "}
            <h1 className="mb-4 text-2xl font-bold text-[#6c233d]">
              {" "}
              Recuperar senha{" "}
            </h1>{" "}
            <p className="mb-6 text-sm text-gray-500">
              {" "}
              Digite seu e-mail para receber as instruções de recuperação.{" "}
            </p>{" "}
            <form onSubmit={recuperarSenha} className="space-y-4">
              {" "}
              {erro && (
                <p className="text-sm text-red-600" role="alert">
                  {" "}
                  {erro}{" "}
                </p>
              )}{" "}
              {mensagem && (
                <p className="text-sm text-green-600" role="status">
                  {" "}
                  {mensagem}{" "}
                </p>
              )}{" "}
              <label
                htmlFor="emailRecuperacao"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                E-mail cadastrado{" "}
              </label>{" "}
              <input
                id="emailRecuperacao"
                type="email"
                autoComplete="email"
                placeholder="Digite seu e-mail"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6c233d] focus:ring-2 focus:ring-[#6c233d]/20"
                value={email}
                onChange={(evento) => {
                  setEmail(evento.target.value);
                  setErro("");
                  setMensagem("");
                }}
              />{" "}
              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-lg bg-[#6c233d] py-3 font-semibold text-white transition hover:bg-[#8a3455] disabled:opacity-60"
              >
                {" "}
                {carregando ? "Enviando..." : "Enviar instruções"}{" "}
              </button>{" "}
              <button
                type="button"
                onClick={() => {
                  setMostrarRecuperacao(false);
                  setErro("");
                  setMensagem("");
                }}
                className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                {" "}
                Voltar para o login{" "}
              </button>{" "}
            </form>{" "}
          </div>
        ) : mostrarNovaSenha ? (
          <div>
            {" "}
            <h1 className="mb-4 text-2xl font-bold text-[#6c233d]">
              {" "}
              Criar nova senha{" "}
            </h1>{" "}
            <p className="mb-6 text-sm text-gray-500">
              {" "}
              Digite sua nova senha e confirme para atualizar seu acesso.{" "}
            </p>{" "}
            <form onSubmit={atualizarSenha} className="space-y-4">
              {" "}
              {erro && (
                <p className="text-sm text-red-600" role="alert">
                  {" "}
                  {erro}{" "}
                </p>
              )}{" "}
              {mensagem && (
                <p className="text-sm text-green-600" role="status">
                  {" "}
                  {mensagem}{" "}
                </p>
              )}{" "}
              <div>
                {" "}
                <label
                  htmlFor="novaSenha"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Nova senha{" "}
                </label>{" "}
                <input
                  id="novaSenha"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  value={novaSenha}
                  onChange={(evento) => {
                    setNovaSenha(evento.target.value);
                    setErro("");
                    setMensagem("");
                  }}
                  placeholder="Digite a nova senha"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6c233d] focus:ring-2 focus:ring-[#6c233d]/20"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label
                  htmlFor="confirmarNovaSenha"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Confirmar nova senha{" "}
                </label>{" "}
                <input
                  id="confirmarNovaSenha"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  value={confirmarNovaSenha}
                  onChange={(evento) => {
                    setConfirmarNovaSenha(evento.target.value);
                    setErro("");
                    setMensagem("");
                  }}
                  placeholder="Digite novamente a senha"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6c233d] focus:ring-2 focus:ring-[#6c233d]/20"
                />{" "}
              </div>{" "}
              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-lg bg-[#6c233d] py-3 font-semibold text-white transition hover:bg-[#8a3455] disabled:opacity-60"
              >
                {" "}
                {carregando ? "Salvando..." : "Salvar nova senha"}{" "}
              </button>{" "}
            </form>{" "}
          </div>
        ) : logado ? (
          <>
            {" "}
            <Painel sair={menuLogin} />{" "}
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#6c233d]">
                Nosso presente
              </h1>
              <p className="mt-2 text-gray-500 ">
                Crie experiências especias para acompanhar seus presentes
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={async (evento) => {
                evento.preventDefault();

                if (email === "" && senha === "") {
                  setErro("E-mail & senha vazio");
                } else if (email === "") {
                  setErro("E-mail vazio");
                } else if (senha === "") {
                  setErro("Senha vazia");
                } else if (senha.length < 6) {
                  setErro("Senha invalida Min 6 caracteres");
                } else {
                  const { error } = await supabase.auth.signInWithPassword({
                    email: email.trim().toLowerCase(),
                    password: senha,
                  });

                  if (error) {
                    setErro("E-mail ou senha inválidos.");
                  } else {
                    setLogado(true);
                    setErro("");
                  }
                }
              }}
            >
              {erro && <p>{erro}</p>}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  id="email"
                  placeholder="Digite seu e-mail"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6c233d] focus:ring-2 focus:ring-[#6c233d]/20"
                  value={email}
                  onChange={(evento) => {
                    setEmail(evento.target.value);
                    setErro("");
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6c233d] focus:ring-2 focus:ring-[#6c233d]/20"
                  value={senha}
                  minLength={6}
                  onChange={(evento) => {
                    setSenha(evento.target.value);
                    setErro("");
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#6c233d] py-3 font-semibold text-white transition hover:bg-[#8a3455]"
              >
                Entrar
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <a
                href="#"
                className="text-[#6c233d] hover:underline"
                onClick={(evento) => {
                  evento.preventDefault();
                  setMostrarRecuperacao(true);
                  setErro("");
                  setMensagem("");
                }}
              >
                {" "}
                Esqueci minha senha{" "}
              </a>
            </div>
            <div className="mt-5 border-t border-gray-200 pt-5 text-center text-sm">
              <span>Ainda não possui uma conta?</span>
              <a
                href="#"
                className="ml-1 font-semibold text-[#6c233d] hover:underline"
                onClick={(evento) => {
                  evento.preventDefault();
                  setMostrarCadastro(true);
                }}
              >
                Criar conta
              </a>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
export default Login;
