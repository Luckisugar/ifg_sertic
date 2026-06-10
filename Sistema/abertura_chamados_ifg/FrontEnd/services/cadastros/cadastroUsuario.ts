export async function register(nome: string, matricula: string, email: string, tipoUsuario: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuario/cadastraUsuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, matricula, email, tipoUsuario })
  });
  const data = await res.json();
  if (res.status !== 201) {
    throw { error: data.error };
  }
  return data;
}
