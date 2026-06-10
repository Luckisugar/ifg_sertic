import React, { useState } from "react";

function UploadForm() {
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagem || !nome) {
      alert("Preencha nome e selecione uma imagem");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("imagem", imagem);

    try {
      const res = await fetch("http://localhost:3001/uploadImagem/uploadImagem", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Imagem enviada com sucesso! ID: " + data.id);
      } else {
        alert("Erro: " + data.error);
      }
    } catch (error) {
      alert("Erro no envio: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagem(e.target.files[0])}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default UploadForm;
