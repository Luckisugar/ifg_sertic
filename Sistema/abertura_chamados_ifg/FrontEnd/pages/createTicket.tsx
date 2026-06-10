import FormTicket from "../components/formTicket";
import MenuAdmin from "../components/menuAdmin";
import Topo from "../components/topo";
import useTicket from "../hooks/useTicket";
import Component from "../../FrontEnd/styles/createTicket.styles";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { ImTicket } from "react-icons/im";
import useAuth from "../services/auth/useAuth";

import {  Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Alert from "@mui/material/Alert";
export default function CreateTicket() {
  const {
    camposDinamicos,
    local,
    chamados,
    dataAtual,
    dataSolicitacao,
    editChamadoIndex,
    editSubChamadoIndex,
    error,
    fileInputRef,
    valores,
    equipamentos,
    handleSaveDraft,
    formatarCampo,
    handleAddChamado,
    handleAddSubChamado,
    handleClick,
    handleDeleteSubChamado,
    handleEditSubChamado,
    handleUpdateSubChamado,
    handleSubmit,
    viewSubChamado,
    onChange,
    validateForm,
    resetForm,
    mensagem,
    setMensagem,
  } = useTicket();

  const [tiposSolicitacao, setTiposSolicitacao] =
    useState<any>(dataSolicitacao);
  const { usuario } = useAuth();
  // const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTiposSolicitacao(dataSolicitacao);
  }, []);

  return (
    <>
      <MenuAdmin user={usuario?.nome} matricula={usuario?.matricula} />
      <Topo
        name="Novo chamado"
        icon={
          <i>
            <ImTicket />
          </i>
        }
      />
      <Component>
        {viewSubChamado ? (
          <div className="box-container">
            <h3 className="title-ticket"># Chamado nº{valores.id}</h3>
            <div className="box">
              {valores.chamados && valores.chamados.length > 0
                ? valores.chamados.map((chamado: any, index: number) => (
                  <h3 className="title-box" key={index}>
                    {chamado.assunto}
                  </h3>
                ))
                : null}
            </div>
            <>
              {viewSubChamado && (
                <>
                  <h3 className="text-title">
                    <i>
                      <FaPlus />
                    </i>{" "}
                    Sub Chamados
                  </h3>
                  <FormTicket
                    validateForm={validateForm}
                    handleClick={handleClick}
                    local={local}
                    equipamento={equipamentos}
                    camposDinamicos={camposDinamicos}
                    valores={valores}
                    chamados={chamados}
                    dataAtual={dataAtual}
                    editChamadoIndex={editChamadoIndex}
                    editSubChamadoIndex={editSubChamadoIndex}
                    error={error}
                    mensagem={mensagem}
                    fileInputRef={fileInputRef}
                    formatarCampo={formatarCampo}
                    handleSaveDraft={handleSaveDraft}
                    handleAddChamado={handleAddChamado}
                    handleDeleteSubChamado={handleDeleteSubChamado}
                    handleEditSubChamado={handleEditSubChamado}
                    handleUpdateSubChamado={handleUpdateSubChamado}
                    handleAddSubChamado={handleAddSubChamado}
                    handleSubmit={handleSubmit}
                    onChange={onChange}
                    viewSubChamado={viewSubChamado}
                    dataSolicitacao={dataSolicitacao}
                    resetForm={resetForm}
                    select1={{
                      value: chamados.tipo || "",
                      onChange,
                      options: tiposSolicitacao,
                    }}
                    select2={{
                      value: chamados,
                      handleSubmit,
                      options: tiposSolicitacao,
                    }}
                    select3={{
                      value: chamados.local || "",
                      onChange,
                      options: local,
                    }}
                    select4={{
                      value: chamados.equipamento || "",
                      onChange,
                      options: equipamentos
                    }}
                    // select5={{
                    //   value: chamados.local || "",
                    // }}
                    input1={{
                      value: chamados.assunto || "",
                      onChange,
                    }}
                    input2={{
                      value: chamados,
                      handleSubmit,
                    }}
                    textarea1={{
                      value: chamados.descricao || "",
                      onChange,
                    }}
                    input3={{
                      value: chamados,
                      handleSubmit,
                    }}
                  ></FormTicket>
                </>
              )}
            </>

            {valores.chamados && valores.chamados.length > 0 ? (
              valores.chamados.map(
                (chamado: any, index: any) =>
                  chamado.subChamados &&
                  chamado.subChamados.length > 0 && (
                    <>
                      <div className="divider"/>
                      <h3 className="table-title-sub">
                        Sub Chamados cadastrados
                      </h3>
                     
                      <div className="table-sub">

                       <Table>
                         <TableHead>
                          <TableRow>
                            <TableCell>ASSUNTO</TableCell>
                            <TableCell>DATA</TableCell>
                            <TableCell>LOCAL</TableCell>
                            <TableCell>EQUIPAMENTO</TableCell>
                            <TableCell>TIPO DE CHAMADO</TableCell>
                            <TableCell>AÇÕES</TableCell>
                          </TableRow>
                         </TableHead>
                         <TableBody>
                          {chamado.subChamados.map(
                            (sub: any, subIndex: any) => (
                              <TableRow key={sub.id}>
                                <TableCell>{sub.assunto}</TableCell>
                                <TableCell>{sub.data}</TableCell>
                                <TableCell>{sub.local}</TableCell>  
                                {sub.equipamento ? (
                                  <TableCell>{sub.equipamento}</TableCell>
                                ) : (
                                  <TableCell>-</TableCell>
                                )}
                                <TableCell>{sub.tipo}</TableCell>
                                <TableCell>
                                  <button
                                    className="button edit"
                                    onClick={() =>
                                      handleEditSubChamado(
                                        index,
                                        subIndex
                                      )
                                    }
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="button delete"
                                    onClick={() =>
                                      handleDeleteSubChamado(
                                        index,
                                        subIndex
                                      )
                                    }
                                  > 
                                    Excluir
                                  </button>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                         </TableBody>
                      </Table>
                        <button className="button-register-sub" >

                          Registrar
                        </button>
                        <button className="button-save-sub" onClick={handleSaveDraft}>
                          Salvar como rascunho
                        </button>
                      </div>
                    </>
                  )
              )
            ) : (
              <p>Nenhum chamado registrado.</p>
            )}
          </div>
        ) : (
          <>
            <FormTicket
              validateForm={validateForm}
              handleClick={handleClick}
              camposDinamicos={camposDinamicos}
              valores={valores}
              local={local}
              equipamento={equipamentos}
              chamados={chamados}
              dataAtual={dataAtual}
              editChamadoIndex={editChamadoIndex}
              editSubChamadoIndex={editSubChamadoIndex}
              error={error}
              mensagem={mensagem}
              fileInputRef={fileInputRef}
              handleSaveDraft={handleSaveDraft}
              formatarCampo={formatarCampo}
              handleAddChamado={handleAddChamado}
              handleDeleteSubChamado={handleDeleteSubChamado}
              handleEditSubChamado={handleEditSubChamado}
              handleUpdateSubChamado={handleUpdateSubChamado}
              handleAddSubChamado={handleAddSubChamado}
              handleSubmit={handleSubmit}
              onChange={onChange}
              viewSubChamado={viewSubChamado}
              dataSolicitacao={dataSolicitacao}
              resetForm={resetForm}
              select1={{
                value: chamados.tipo || "",
                onChange,
                options: tiposSolicitacao,
              }}
              select2={{
                value: chamados,
                handleSubmit,
                options: tiposSolicitacao,
              }}
              select3={{
                value: chamados.local || "",
                onChange,
                options: local,
              }}
              select4={{
                value: chamados.equipamento || "",
                onChange,
                options: equipamentos,
              }}
              // select5={{
              //   value: chamados.local || "",
              // }}
              input1={{
                value: chamados.assunto || "",
                onChange,
              }}
              input2={{
                value: chamados,
                handleSubmit,
              }}
              textarea1={{
                value: chamados.descricao || "",
                onChange,
              }}
              input3={{
                value: chamados,
                handleSubmit,
              }}
            ></FormTicket>
          </>
        )}
      </Component>
    </>
  );
}
