// pages/buscar-imagem.tsx ou em algum componente
import { useState } from "react";
import Image from "next/image";

export default function BuscarImagemPorId() {
  const [id, setId] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [erro, setErro] = useState("");

  const handleBuscar = async () => {
    if (!id) {
      setErro("Digite um ID");
      setImagemUrl("");
      return;
    }

    try {
      const url = `http://localhost:3001/buscaImagem/imagem/${id}`;
      const res = await fetch(url);

      if (!res.ok) {
        setErro("Imagem não encontrada");
        setImagemUrl("");
        return;
      }

      const blob = await res.blob();
      const localUrl = URL.createObjectURL(blob);
      setImagemUrl(localUrl);
      setErro("");
    } catch (error) {
      setErro("Erro ao buscar imagem"+error);
      setImagemUrl("");
    }
  };

  return (
    <div>
      <h2>Buscar Imagem por ID</h2>
      <input
        type="number"
        placeholder="Digite o ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleBuscar}>Buscar</button>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {imagemUrl && (
        <div>
          <h3>Imagem:</h3>
          <Image
           key={imagemUrl}
            src={imagemUrl}
            alt="Imagem buscada"
            width={300}
            height={300}
            unoptimized // necessário para blobs, senão o Next espera uma URL otimizada
          />
        </div>
      )}
    </div>
  );
}
