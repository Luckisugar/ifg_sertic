// Routes/testdb.ts
import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * @swagger
 * tags:
 *   name: Testes
 *   description: Testes de conexão com o banco de dados

 * /testDb:
 *   get:
 *     summary: Testar a conexão com o banco de dados
 *     tags: [Testes]
 *     responses:
 *       200:
 *         description: Conexão com o banco de dados bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       now:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-27T14:48:00.000Z"
 *       500:
 *         description: Erro ao consultar o banco de dados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Erro ao conectar ao banco de dados"
 */

const testDbRouter = Router();

testDbRouter.get("/testDb", async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    return res.status(200).json({ success: true, result });
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
});

export default testDbRouter;
