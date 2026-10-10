import { useState } from "react";

function Cadastro() {
  //useStates
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [logo, setLogo] = useState(null);
  const [erro, setErro] = useState("");
  //useStates

  //funções
  function verificacao() {
    setErro("");
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
    } else if (logo === null) {
      setErro("Adicionar uma foto para o Logo");
    } else {
      const dadosEmpresa = {
        nome: nomeEmpresa,
        responsavel: responsavel,
        email: email.toLowerCase(),
        senha:senha,
        logo:logo
      };
      console.log(dadosEmpresa)
    }

  } //verificar se os campos foram preenchido

  //funções

  return (
    <main>
      <h1>Criar conta</h1>
      <p>{erro}</p>
      <label htmlFor="nomeEmpresa">Nome da Empresa:</label>
      <input
        id="nomeEmpresa"
        type="text"
        placeholder="Digite o nome da Empresa"
        value={nomeEmpresa}
        onChange={(evento) => {
          setNomeEmpresa(evento.target.value);
          setErro("");
        }}
      />
      <label htmlFor="responsavel">Nome do Responsavel:</label>
      <input
        id="responsavel"
        type="text"
        placeholder="Digite o nome do Responsavel"
        value={responsavel}
        onChange={(evento) => {
          setResponsavel(evento.target.value);
          setErro("");
        }}
      />
      <label htmlFor="email">E-mail:</label>
      <input
        id="email"
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(evento) => {
          setEmail(evento.target.value);
          setErro("");
        }}
      />
      <label htmlFor="senha">Senha:</label>
      <input
        id="senha"
        type="password"
        placeholder="Digite sua senha"
        value={senha}
        onChange={(evento) => {
          setSenha(evento.target.value);
          setErro("");
        }}
      />
      <label htmlFor="confirmarSenha">Confirme sua senha:</label>
      <input
        id="confirmarSenha"
        type="password"
        placeholder="Confirmar sua senha"
        value={confirmarSenha}
        onChange={(evento) => {
          setConfirmarSenha(evento.target.value);
          setErro("");
        }}
      />
      <label htmlFor="perfil">Coloque sua logo:</label>
      <input
        id="perfil"
        type="file"
        onChange={(evento) => {
          setLogo(evento.target.files[0]);
          setErro("");
        }}
      />
      <button type="submit" onClick={verificacao}>
        enviar
      </button>
    </main>
  );
}

export default Cadastro;
