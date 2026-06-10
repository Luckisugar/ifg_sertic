import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
interface DecodedToken {
  userId: number;
  tipoUsuario: string;
}

export async function buscaUsuarioLogado(token?: string) {
  if (!token) {
    throw new Error("Token não fornecido.");
  }

  const blacklisted = await prisma.tokenBlacklist.findUnique({ where: { token } });
  if (blacklisted) {
    throw new Error("Token inválido.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

  const usuario = await prisma.usuario.findUnique({
    where: { id: decoded.userId },
    select: { id: true, nome: true, tipoUsuario: true, matricula: true }
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  return usuario;
}
