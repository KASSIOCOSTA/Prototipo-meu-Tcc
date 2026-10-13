import { useState } from "react";
import { supabase } from "../lib/supabase";

function LogoEmpresa() {
  const [logo, setLogo] = useState(null);
  async function enviarLogo() {
    if (!logo) {
      alert("Selecione uma imagem primeiro.");
      return;
    }

    const { data: sessaoData, error: sessaoErro } =
      await supabase.auth.getSession();

    if (sessaoErro || !sessaoData.session) {
      alert("Você precisa estar conectado para enviar a logo.");
      return;
    }

    const usuario = sessaoData.session.user;

    const extensao = logo.name.split(".").pop().toLowerCase();
    const nomeArquivo = `${usuario.id}/logo.${extensao}`;

    const { error: erroUpload } = await supabase.storage
      .from("logos-empresas")
      .upload(nomeArquivo, logo, {
        upsert: true,
        contentType: logo.type,
      });

    if (erroUpload) {
      alert("Erro ao enviar a logo: " + erroUpload.message);
      return;
    }

    alert("Logo enviada com sucesso!");
  }

  return (
    <div>
      <h2>Logo da empresa</h2>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(evento) => {
          setLogo(evento.target.files[0] ?? null);
        }}
      />
    </div>
  );
}

export default LogoEmpresa;
