import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
const router = Router();

/**
 * @swagger
 * /imagem/{id}:
 *   get:
 *     summary: Retorna uma imagem pelo ID
 *     description: Busca e retorna a imagem correspondente ao ID informado.  
 *       A resposta contém o conteúdo binário da imagem, com o tipo MIME original.
 *     tags:
 *       - Imagem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da imagem a ser recuperada
 *         example: 5
 *     responses:
 *       200:
 *         description: Imagem retornada com sucesso
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Imagem não encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: "Imagem não encontrada"
 *       500:
 *         description: Erro interno ao buscar imagem
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao buscar imagem"
 */

router.get("/imagem/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const imagem = await prisma.imagemTeste.findUnique({
      where: { id: Number(id) },
    });

    if (!imagem || !imagem.imagem) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    const buffer = Buffer.isBuffer(imagem.imagem)
      ? imagem.imagem
      : Buffer.from(imagem.imagem as any);

    res.setHeader("Content-Type", imagem.tipoMime);
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar imagem" });
  }
});

export default router;
