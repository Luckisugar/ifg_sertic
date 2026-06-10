import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import multer from "multer";

/**
 * @swagger
 * /uploadImagem:
 *   post:
 *     summary: Faz upload e salva uma nova imagem no banco de dados
 *     description: >
 *       Realiza o upload de uma imagem e salva no banco de dados junto com o nome informado.  
 *       O corpo da requisição deve ser enviado no formato `multipart/form-data`.
 *     tags:
 *       - Imagem
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - imagem
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da imagem
 *                 example: "foto_perfil_usuario"
 *               imagem:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo da imagem a ser enviado
 *     responses:
 *       201:
 *         description: Imagem salva com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 message:
 *                   type: string
 *                   example: "Imagem salva com sucesso"
 *       400:
 *         description: Requisição inválida (nome ou imagem ausente)
 *         content:
 *           application/json:
 *             example:
 *               error: "Nome e imagem são obrigatórios"
 *       500:
 *         description: Erro interno ao salvar imagem
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro ao salvar imagem"
 */

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/uploadImagem", upload.single("imagem"), async (req: Request, res: Response) => {
  try {
    const nome = req.body.nome;
    const file = req.file as Express.Multer.File;

    if (!nome || !file || !file.buffer || !file.mimetype) {
      return res.status(400).json({ error: "Nome e imagem são obrigatórios" });
    }

    const resultado = await prisma.imagemTeste.create({
      data: {
        nome,
        imagem: file.buffer,
        tipoMime: file.mimetype,  // aqui salva o tipo MIME
      },
    });

    return res.status(201).json({ id: resultado.id, message: "Imagem salva com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao salvar imagem" });
  }
});


export default router;