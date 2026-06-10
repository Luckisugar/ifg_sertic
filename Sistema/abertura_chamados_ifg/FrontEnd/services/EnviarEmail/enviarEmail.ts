export async function enviaEmail(matricula: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = baseUrl + "/email/enviaEmail";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matricula }),
  });

  const data = await res.json();

  if (!res.ok){
    throw { error: data.error };
  }
  
  return data;
}
