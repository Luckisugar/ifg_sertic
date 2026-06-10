import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { buscaUsuarioLogado } from "../../Services/funcoes/buscaUsuarioLogado";

/**
 * @swagger
 * /retornaChamadoPaiFiltro:
 *   get:
 *     summary: Retorna a lista de chamados pai com filtros aplicados
 *     description: >
 *       Retorna os chamados principais (`chamadoPaiId: null`) de acordo com o tipo de usuário autenticado (`ADMIN`, `ENCARREGADO` ou `USUÁRIO COMUM`), aplicando filtros opcionais de status, prioridade, solicitante, data, assunto, local, tipo de solicitação e tipo de exibição (andamento ou pendente).
 *       ADMIN: vê todos os chamados (exceto rascunhos de outros usuários).
 *       ENCARREGADO: vê chamados enviados para encarregada (`enviadoEncarregada = true`).
 *       USUÁRIO COMUM: vê apenas chamados próprios.
 *     tags:
 *       - Chamados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 'Número da página (paginação, 5 registros por página).'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 'Filtra por status do chamado (ex: NOVO, EXECUÇÃO, RASCUNHO, DEVOLVIDO, etc.).'
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: 'Filtra pela prioridade atual do chamado (ex: ALTA, MÉDIA, BAIXA).'
 *       - in: query
 *         name: applicant
 *         schema:
 *           type: string
 *         description: Filtra pelo nome do solicitante.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-10-15"
 *         description: 'Filtra pela data de solicitação (AAAA-MM-DD).'
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filtra pelo assunto do chamado.
 *       - in: query
 *         name: location
 *         schema:
 *           type: integer
 *         description: ID do local associado ao chamado.
 *       - in: query
 *         name: request
 *         schema:
 *           type: integer
 *         description: ID do tipo de solicitação.
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [andamento, pendente]
 *         description: 'Define o tipo de filtro de status: andamento = EXECUÇÃO, pendente = NOVO.'
 *     responses:
 *       200:
 *         description: Lista paginada de chamados retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               chamados:
 *                 - id: 12
 *                   status: "EXECUÇÃO"
 *                   prioridadeAtual: "ALTA"
 *                   dataSolicitacao: "2025-10-14T10:35:00.000Z"
 *                   applicant:
 *                     id: 5
 *                     nome: "Maria Souza"
 *                   request:
 *                     id: 3
 *                     nome: "Manutenção elétrica"
 *                   location:
 *                     id: 2
 *                     nome: "Bloco B"
 *                   chamadosFilhos:
 *                     - id: 15
 *                       status: "NOVO"
 *                       prioridadeAtual: "BAIXA"
 *                       applicant:
 *                         id: 6
 *                         nome: "João Pereira"
 *               totalChamados: 42
 *               pagina: 1
 *               totalPaginas: 9
 *       400:
 *         description: Erro de validação ou erro desconhecido.
 *         content:
 *           application/json:
 *             examples:
 *               erroValidacao:
 *                 summary: Erro conhecido
 *                 value:
 *                   error: "Token inválido"
 *               erroDesconhecido:
 *                 summary: Erro inesperado
 *                 value:
 *                   error: "Erro desconhecido, contate o administrador"
 *       401:
 *         description: Token JWT ausente ou inválido.
 *         content:
 *           application/json:
 *             example:
 *               error: "Não autorizado, token ausente ou inválido"
 */

const retornaChamadoPaiFiltro = Router();

retornaChamadoPaiFiltro.get("/retornaChamadoPaiFiltro", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];


  const pagina = parseInt(req.query.page as string) || 1;
  const limitePorPagina = 5;
  const registrosParaPular = (pagina - 1) * limitePorPagina;

  const {
    status,
    priority,
    applicant,
    date,
    subject,
    location,
    request,
    tipo, // 'andamento' ou 'pendente'
  } = req.query;

  try {
    const usuario = await buscaUsuarioLogado(token);
    const ordenarChamados = (lista: any[]) => {
      const prioridade = ["DEVOLVIDO", "RASCUNHO"];
      return lista.sort((a, b) => {
        const aPrioritario = prioridade.includes(a.status);
        const bPrioritario = prioridade.includes(b.status);

        if (aPrioritario && !bPrioritario) return -1;
        if (!aPrioritario && bPrioritario) return 1;
        return 0; // mantém ordem por dataSolicitacao já trazida do banco
      });
    };

    if (usuario.tipoUsuario === "ADMIN") {
      const where: Prisma.ChamadoWhereInput = {
        chamadoPaiId: null,
        OR: [
          {
            status: { not: "RASCUNHO" }
          },
          {
            AND: [
              { status: "RASCUNHO" },
              { solicitanteId: usuario.id }
            ]
          }
        ],
      };

      if (status) {
        where.status = {
          contains: status as string,
          mode: "insensitive",
        };
      }

      if (priority) {
        where.prioridadeAtual = {
          contains: priority as string,
          mode: "insensitive",
        };
      }

      if (applicant) {
        where.solicitante = {
          nome: {
            contains: applicant as string,
            mode: "insensitive",
          },
        };
      }

      if (date) {
        const [ano, mes, dia] = (date as string).split("-").map(Number);

        const inicioDoDia = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
        const fimDoDia = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

        where.dataSolicitacao = {
          gte: inicioDoDia,
          lte: fimDoDia,
        };
      }

      if (subject) {
        where.assunto = {
          contains: subject as string,
          mode: "insensitive",
        };
      }

      if (location) {
        where.localId = parseInt(location as string);
      }

      if (request) {
        where.tipoSolicitacaoId = parseInt(request as string);
      }

      if (tipo === "andamento") {
        where.status = "EXECUÇÃO";
      } else if (tipo === "pendente") {
        where.status = "NOVO";
      }

      console.log("Filtro aplicado:", where);

      const [chamados, totalChamados] = await Promise.all([
        prisma.chamado.findMany({
          skip: registrosParaPular,
          take: limitePorPagina,
          orderBy: { dataSolicitacao: "desc" },
          where,
          include: {
            solicitante: true,
            equipamento: true,
            tipoSolicitacao: true,
            local: true,
            alteracoes: true,
            chamadosFilhos: {
              include: {
                solicitante: true,
                equipamento: true,
                tipoSolicitacao: true,
                local: true,
                alteracoes: true
              }
            }

          },
        }),
        prisma.chamado.count({ where }),
      ]);

      const chamadosOrdenados = ordenarChamados(chamados);

      const chamadosFormatados = chamadosOrdenados.map((chamado) => ({
        ...chamado,
        applicant: chamado.solicitante,
        request: chamado.tipoSolicitacao,
        location: chamado.local,
        subject: chamado.assunto,
        chamadosFilhos: chamado.chamadosFilhos,
        // Remove os campos indesejados
        solicitante: undefined,
        tipoSolicitacao: undefined,
        local: undefined,
        assunto: undefined,
        equipamento: undefined,
      }));

      return res.status(200).json({
        chamados: chamadosFormatados,
        totalChamados,
        pagina,
        totalPaginas: Math.ceil(totalChamados / limitePorPagina),
      });
    } else if (usuario.tipoUsuario === "ENCARREGADO") {
      const where: Prisma.ChamadoWhereInput = {
        chamadoPaiId: null,
        enviadoEncarregada: true,
        OR: [
          {
            status: { not: "RASCUNHO" }
          },
          {
            AND: [
              { status: "RASCUNHO" },
              { solicitanteId: usuario.id }
            ]
          }
        ],
      };

      if (status) {
        where.status = {
          contains: status as string,
          mode: "insensitive",
        };
      }

      if (priority) {
        where.prioridadeAtual = {
          contains: priority as string,
          mode: "insensitive",
        };
      }

      if (applicant) {
        where.solicitante = {
          nome: {
            contains: applicant as string,
            mode: "insensitive",
          },
        };
      }

      if (date) {
        const [ano, mes, dia] = (date as string).split("-").map(Number);

        const inicioDoDia = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
        const fimDoDia = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

        where.dataSolicitacao = {
          gte: inicioDoDia,
          lte: fimDoDia,
        };
      }

      if (subject) {
        where.assunto = {
          contains: subject as string,
          mode: "insensitive",
        };
      }

      if (location) {
        where.localId = parseInt(location as string);
      }

      if (request) {
        where.tipoSolicitacaoId = parseInt(request as string);
      }

      if (tipo === "andamento") {
        where.status = "EXECUÇÃO";
      } else if (tipo === "pendente") {
        where.status = "NOVO";
      }

      console.log("Filtro aplicado:", where);

      const [chamados, totalChamados] = await Promise.all([
        prisma.chamado.findMany({
          skip: registrosParaPular,
          take: limitePorPagina,
          orderBy: { dataSolicitacao: "desc" },
          where,
          include: {
            solicitante: true,
            equipamento: true,
            tipoSolicitacao: true,
            local: true,
            alteracoes: true,
            chamadosFilhos: {
              include: {
                solicitante: true,
                equipamento: true,
                tipoSolicitacao: true,
                local: true,
                alteracoes: true
              }
            }

          },
        }),
        prisma.chamado.count({ where }),
      ]);

      const chamadosOrdenados = ordenarChamados(chamados);

      const chamadosFormatados = chamadosOrdenados.map((chamado) => ({
        ...chamado,
        applicant: chamado.solicitante,
        request: chamado.tipoSolicitacao,
        location: chamado.local,
        subject: chamado.assunto,
        chamadosFilhos: chamado.chamadosFilhos,
        // Remove os campos indesejados
        solicitante: undefined,
        tipoSolicitacao: undefined,
        local: undefined,
        assunto: undefined,
        equipamento: undefined,
      }));

      return res.status(200).json({
        chamados: chamadosFormatados,
        totalChamados,
        pagina,
        totalPaginas: Math.ceil(totalChamados / limitePorPagina),
      });
    } else {
      const where: Prisma.ChamadoWhereInput = {
        chamadoPaiId: null,
        solicitanteId: usuario.id
      };

      if (status) {
        where.status = {
          contains: status as string,
          mode: "insensitive",
        };
      }

      if (priority) {
        where.prioridadeAtual = {
          contains: priority as string,
          mode: "insensitive",
        };
      }

      if (applicant) {
        where.solicitante = {
          nome: {
            contains: applicant as string,
            mode: "insensitive",
          },
        };
      }

      if (date) {
        const [ano, mes, dia] = (date as string).split("-").map(Number);

        const inicioDoDia = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
        const fimDoDia = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

        where.dataSolicitacao = {
          gte: inicioDoDia,
          lte: fimDoDia,
        };
      }

      if (subject) {
        where.assunto = {
          contains: subject as string,
          mode: "insensitive",
        };
      }

      if (location) {
        where.localId = parseInt(location as string);
      }

      if (request) {
        where.tipoSolicitacaoId = parseInt(request as string);
      }

      if (tipo === "andamento") {
        where.status = "EXECUÇÃO";
      } else if (tipo === "pendente") {
        where.status = "NOVO";
      }

      console.log("Filtro aplicado:", where);

      const [chamados, totalChamados] = await Promise.all([
        prisma.chamado.findMany({
          skip: registrosParaPular,
          take: limitePorPagina,
          orderBy: { dataSolicitacao: "desc" },
          where,
          include: {
            solicitante: true,
            equipamento: true,
            tipoSolicitacao: true,
            local: true,
            alteracoes: true,
            chamadosFilhos: {
              include: {
                solicitante: true,
                equipamento: true,
                tipoSolicitacao: true,
                local: true,
                alteracoes: true
              }
            }

          },
        }),
        prisma.chamado.count({ where }),
      ]);

      const chamadosOrdenados = ordenarChamados(chamados);

      const chamadosFormatados = chamadosOrdenados.map((chamado) => ({
        ...chamado,
        applicant: chamado.solicitante,
        request: chamado.tipoSolicitacao,
        location: chamado.local,
        subject: chamado.assunto,
        chamadosFilhos: chamado.chamadosFilhos,
        // Remove os campos indesejados
        solicitante: undefined,
        tipoSolicitacao: undefined,
        local: undefined,
        assunto: undefined,
        equipamento: undefined,
      }));

      return res.status(200).json({
        chamados: chamadosFormatados,
        totalChamados,
        pagina,
        totalPaginas: Math.ceil(totalChamados / limitePorPagina),
      });
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Erro desconhecido, contate o administrador" });
    }
  }
});

export default retornaChamadoPaiFiltro;