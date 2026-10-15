import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function LogoEmpresa() {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [urlPublica, setUrlPublica] = useState("");

  useEffect(() => {
    async function buscarLogo() {
      const { data: sessaoData } = await supabase.auth.getSession();
      const usuario = sessaoData.session?.user;

      if (!usuario) return;

      const { data, error } = await supabase
        .from("empresas")
        .select("logo_url")
        .eq("id", usuario.id)
        .single();

      if (!error && data?.logo_url) {
        setUrlPublica(data.logo_url);
      }
    }

    buscarLogo();
  }, []);
  useEffect(() => {
    if (!logo) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(logo);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [logo]);

  async function enviarLogo() {
    setErro("");
    setMensagem("");

    if (!logo) {
      setErro("Selecione uma imagem primeiro.");
      return;
    }

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!tiposPermitidos.includes(logo.type)) {
      setErro("Selecione uma imagem JPG, PNG ou WEBP.");
      return;
    }

    if (logo.size > 2 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 2 MB.");
      return;
    }

    setCarregando(true);

    try {
      const { data: sessaoData, error: sessaoErro } =
        await supabase.auth.getSession();

      if (sessaoErro) {
        throw sessaoErro;
      }

      const usuario = sessaoData.session?.user;

      if (!usuario) {
        throw new Error("Sua sessão expirou. Entre novamente.");
      }

      const nomeArquivo = `${usuario.id}/logo`;

      // Envia ou substitui a logo no Storage.
      const { error: erroUpload } = await supabase.storage
        .from("logos-empresas")
        .upload(nomeArquivo, logo, {
          upsert: true,
          contentType: logo.type,
          cacheControl: "0",
        });

      if (erroUpload) {
        throw erroUpload;
      }

      // Obtém o endereço público da imagem.
      const { data: urlData } = supabase.storage
        .from("logos-empresas")
        .getPublicUrl(nomeArquivo);

      const urlPublica = `${urlData.publicUrl}?v=${Date.now()}`;

      // Salva o endereço da imagem no perfil da empresa.
      const { error: erroBanco } = await supabase
        .from("empresas")
        .update({ logo_url: urlPublica })
        .eq("id", usuario.id);

      if (erroBanco) {
        throw erroBanco;
      }

      setMensagem("Logo salva com sucesso!");
      setLogo(null);
    } catch (erroEnvio) {
      setErro("Não foi possível salvar a logo: " + erroEnvio.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-800">
        Logo da empresa
      </h2>

      {preview ? (
        <img
          src={preview}
          alt="Prévia da nova logo"
          className="mb-4 h-32 w-32 rounded-full border-2 border-gray-300 object-cover"
        />
      ) : urlPublica ? (
        <img
          src={urlPublica}
          alt="Logo da empresa"
          className="mb-4 h-32 w-32 rounded-full border-2 border-gray-300 object-cover"
        />
      ) : null}

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(evento) => {
          setLogo(evento.target.files?.[0] ?? null);
          setErro("");
          setMensagem("");
        }}
        className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold hover:file:bg-slate-200"
      />

      {erro && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {erro}
        </p>
      )}

      {mensagem && (
        <p className="mt-3 text-sm text-green-600" role="status">
          {mensagem}
        </p>
      )}

      <button
        type="button"
        onClick={enviarLogo}
        disabled={carregando}
        className="mt-4 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {carregando ? "Salvando..." : "Salvar logo"}
      </button>
    </div>
  );
}

export default LogoEmpresa;
