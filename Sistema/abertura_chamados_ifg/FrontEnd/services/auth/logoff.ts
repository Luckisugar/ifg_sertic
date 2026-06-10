export async function logoff() {
   const token = localStorage.getItem("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logoff`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  
  if (!res.ok){
    throw { error: data.error };
  }
  localStorage.removeItem("token");
  localStorage.removeItem("tipoUsuario")
  
  
  return data;
  
}

