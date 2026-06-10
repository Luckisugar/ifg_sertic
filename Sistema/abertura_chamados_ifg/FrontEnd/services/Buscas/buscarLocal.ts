export async function buscarLocal() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/local/buscaLocais`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (res.status != 200) {
    throw { error: data.error };
  }
  //const dataModificada = JSON.stringify(data, null, 2)
  return data;
}