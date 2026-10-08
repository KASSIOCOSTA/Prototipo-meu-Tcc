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
    if (nomeEmpresa === "") {
      setErro("Digite o nome da Empresa");
    } else if (responsavel === "") {
      setErro("Digite o nome do Responsavel");
    } else if (email === "") {
      setErro("Digite seu E-mail");
    } else if (senha === "" || confirmarSenha === "") {
      setErro("Preencha as senhas");
    } else if (senha != confirmarSenha) {
      setErro("As senhas Precisam ser igual");
    } else if (logo === null) {
      setErro("Adicionar uma foto para o Logo");
    }
  } //verificar se os campos foram preenchido

//funções


  return (
    <main>
      <h1>Criar conta</h1>
      <p>{erro}</p>

      <input
        type="text"
        placeholder="Nome da Empresa"
        value={nomeEmpresa}
        onChange={(evento) => {
          setNomeEmpresa(evento.target.value);
          setErro("");
        }}
      />

      <input
        type="text"
        placeholder="Nome do Responsavel"
        value={responsavel}
        onChange={(evento) => {
          setResponsavel(evento.target.value);
          setErro("");
        }}
      />

      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(evento) => {
          setEmail(evento.target.value);
          setErro("");
        }}
      />

      <input
        type="password"
        placeholder="Digite sua senha"
        value={senha}
        onChange={(evento) => {
          setSenha(evento.target.value);
          setErro("");
        }}
      />

      <input
        type="password"
        placeholder="Confirmar sua senha"
        value={confirmarSenha}
        onChange={(evento) => {
          setConfirmarSenha(evento.target.value);
          setErro("");
        }}
      />

      <input
        type="file"
        onChange={(evento) => {
          setLogo(evento.target.files[0]);
        }}
      />
      <button type="submit" onClick={verificacao}>
        enviar
      </button>
    </main>
  );
}

export default Cadastro;
