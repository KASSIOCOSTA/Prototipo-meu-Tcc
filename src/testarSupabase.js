
import { supabase } from "./lib/supabase";

export async function testarConexao() {
  const { data, error } = await supabase
    .from("teste_conexao")
    .select("*")
    .limit(1);

  if (error) {
    console.log("Resposta do Supabase:", error.message);
    return;
  }

  console.log("Conexão funcionando!", data);
}
