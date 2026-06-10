import express, { Request, Response } from "express";
import cors from "cors";

//Rotas
import uploadImagem from "./Routes/uploadImagem";
import buscaImagem from "./Routes/getImagem";

import cadastraSolicitacao from "./Routes/Solicitacao/cadastraSolicitacao";
import buscaSolicitacao from "./Routes/Solicitacao/buscaSolicitacao";
import buscaSolicitacaoPorId from "./Routes/Solicitacao/buscaSolicitacaoPorId";
import atualizaSolicitacaoAdm from "./Routes/Solicitacao/atualizaSolicitacaoAdm";
import devolveSolicitacao from "./Routes/Solicitacao/devolveSolicitacao";
import atualizaSolicitacao from "./Routes/Solicitacao/atualizaSolicitacao";
import buscaSolicitacaoPai from "./Routes/Solicitacao/buscaSolicitacaoPai";
import buscaSolicitacaoPaiPorIdUsuarioSolicitante from "./Routes/Solicitacao/buscaSolicitacaoPaiPorIdUsuarioSolicitante";
import buscaSolicitacaoPaiPorIdUsuarioResponsavel from "./Routes/Solicitacao/buscaSolicitacaoPaiPorIdUsuarioResponsavel";
import atualizaStatusSolicitacaoNovo from "./Routes/Solicitacao/atualizaStatusSolicitacaoNovo";
import atualizaTodosSolicitacao from "./Routes/Solicitacao/atualizaTodosSolicitacao";
import apagaSolicitacaoFilha from  "./Routes/Solicitacao/apagaSolicitacaoFilha";
import retornaChamadoPaiFiltro from "./Routes/Solicitacao/retornaChamadoPaiFiltro";
import apagaSolicitacaoRascunho from "./Routes/Solicitacao/apagaSolicitacaoRascunho";
import enviaSolicitacaoEncarregada from "./Routes/Solicitacao/enviaEncarregada";
import atualizaSolicitacaoEnvia from "./Routes/Solicitacao/atualizaSolicitacaoEnvia";

import cadastraLocal from "./Routes/Local/cadastraLocal";
import buscaLocais from "./Routes/Local/buscaLocal";
import atualizaLocal from "./Routes/Local/atualizaLocal";
import buscaLocalAtivo from "./Routes/Local/buscaLocalAtivo";

import cadastraEquipamento from "./Routes/Equipamento/cadastraEquipamento";
import buscaEquipamentos from "./Routes/Equipamento/buscaEquipamento";
import atualizaEquipamento from "./Routes/Equipamento/atualizaEquipamento";
import buscaEquipamentoAtivo from "./Routes/Equipamento/buscaEquipamentoAtivo";

import cadastraTipoSolicitacao from "./Routes/tipoSolicitacao/cadastraTipoSolicitacao";
import buscaTipoSolicitacoes from "./Routes/tipoSolicitacao/buscaTipoSolicitacao";
import atualizaTipoSolicitacao from "./Routes/tipoSolicitacao/atualizaTipoSolicitacao";
import buscaTipoSolicitacoesAtiva from "./Routes/tipoSolicitacao/buscaTipoSolicitacaoAtiva";

import cadastraUsuario from "./Routes/Usuario/cadastraUsuario";
import buscaUsuarios from "./Routes/Usuario/buscaUsuario";

import login from "./Routes/auth/login";
import retornaUsuario from "./Routes/auth/retornaUsuario";
import validaToken from "./Routes/auth/validaToken";
import logoff from "./Routes/auth/logoff";

import alteraSenha from "./Routes/AlteraSenha/alteraSenha";

import enviaEmail from "./Routes/EnviaEmail/enviaEmail";

//teste BD
import testeDb from "./Routes/testeDb";

//Swagger
import swaggerDoc from "./swagger";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import updateStatusRouter from "./Routes/Solicitacao/atualizaStatusSolicitacao";


// Inicializa o app Express
export const app = express();
app.use(express.json());
app.use(cors());

// test BD
app.use('/testBD', testeDb);
// test BD

app.use('/uploadImagem',uploadImagem);
app.use("/buscaImagem", buscaImagem);
//Swagger
const specs = swaggerJSDoc(swaggerDoc);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs)); 
//Swagger

//Solicitação
app.use('/solicitacao', cadastraSolicitacao);
app.use('/solicitacao', buscaSolicitacao);
app.use('/solicitacao', buscaSolicitacaoPorId);
app.use('/solicitacao', atualizaSolicitacaoAdm);
app.use('/solicitacao', devolveSolicitacao);
app.use('/solicitacao', atualizaSolicitacao);
app.use('/solicitacao', buscaSolicitacaoPai);
app.use('/solicitacao', buscaSolicitacaoPaiPorIdUsuarioSolicitante);
app.use('/solicitacao', buscaSolicitacaoPaiPorIdUsuarioResponsavel);
app.use('/solicitacao',atualizaStatusSolicitacaoNovo);
app.use('/solicitacao', atualizaTodosSolicitacao);
app.use('/solicitacao',apagaSolicitacaoFilha);
app.use('/solicitacao',retornaChamadoPaiFiltro);
app.use('/solicitacao', updateStatusRouter);
app.use('/solicitacao', apagaSolicitacaoRascunho);
app.use('/solicitacao', enviaSolicitacaoEncarregada);
app.use('/solicitacao', atualizaSolicitacaoEnvia);


//Local
app.use('/local', cadastraLocal);
app.use('/local', buscaLocais);
app.use('/local', atualizaLocal);
app.use('/local', buscaLocalAtivo);

//Equipamento
app.use('/equipamento', cadastraEquipamento);
app.use('/equipamento', buscaEquipamentos);
app.use('/equipamento', atualizaEquipamento);
app.use('/equipamento', buscaEquipamentoAtivo);

//TipoSolicitacao
app.use('/solicitacao', cadastraTipoSolicitacao);
app.use('/solicitacao', buscaTipoSolicitacoes);
app.use('/solicitacao', atualizaTipoSolicitacao);
app.use('/solicitacao', buscaTipoSolicitacoesAtiva);

//Usuario
app.use('/usuario', cadastraUsuario);
app.use('/usuario', buscaUsuarios);


//Auth
app.use('/auth', login);
app.use('/auth', retornaUsuario);
app.use('/auth', validaToken);
app.use('/auth', logoff);

//Senha
app.use('/senha', alteraSenha);

//EnviaEmail
app.use('/email', enviaEmail);


// Rota inicial
app.get("/", (req: Request, res: Response) => {
  res.send("Servidor Express rodando na porta 3001!");
});
