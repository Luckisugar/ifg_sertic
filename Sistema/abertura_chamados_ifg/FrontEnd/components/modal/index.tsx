import React, { useEffect, useState } from "react";
import Component from "./styleModal.styles";
import { BsFillTrashFill } from "react-icons/bs";
import { FaEdit, FaSave } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";
import { Slider, SliderProps, Slide } from "../../components/slider";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { Navigation } from "swiper/modules";
import { MdCancel } from "react-icons/md";
import ConfirmModal from "./confirmModal";
import { FiCornerDownLeft } from "react-icons/fi";
import { boolean, set } from "zod";
import Alert from "@mui/material/Alert";
import { Box, Collapse, Table, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import useChamado from "../../services/hook/useChamados/useChamados";

type Props = {
  onClose: () => void;
  item: any;
  visible: any;
  statusColors: any;
  priorityColors: any;
};

const ModalChamado: React.FC<Props> = ({
  onClose,
  item,
  visible,
  statusColors,
  priorityColors,
}) => {
  const [image, setImage] = useState<string[]>([]);
  const [items, setItems] = useState<any>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  // NOVO ESTADO: Para controlar a visibilidade do alerta de "Devolvido"
  const [showDevolvidoAlert, setShowDevolvidoAlert] = useState(false);
  useEffect(() => {
    if (item.image) {
      setImage(Array.isArray(item.image) ? item.image : [item.image]);
    }
  }, [item.image]);

  useEffect(() => {
    if (item) {
      setItems(Array.isArray(item) ? item : [item]);
    }
  }, [item]);

  // useEffect para gerenciar o timer do alerta
  useEffect(() => {
    let timer: NodeJS.Timeout; // Tipo para o timer

    if (editedItem.status === 'Devolvido') {
      setShowDevolvidoAlert(true); // Exibe o alerta
      // Define um timer para esconder o alerta após 3 segundos
      timer = setTimeout(() => {
        setShowDevolvidoAlert(false);
      }, 3000); // 3000 milissegundos = 3 segundos
    } else {
      // Se o status não for 'Devolvido', garante que o alerta esteja escondido
      setShowDevolvidoAlert(false);
    }

    // Função de limpeza: É crucial para limpar o timer
    // Garante que o timer seja limpo se o componente for desmontado
    // ou se o 'editedItem.status' mudar novamente antes do timer expirar.
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [editedItem.status]); // Dependência: o efeito roda quando editedItem.status muda

  const settings = {
    spaceBetween: 80,
    slidesToShow: 1,
    navigation: { nextEl: ".next", prevEl: ".prev" },
    modules: [Navigation],
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedItem((prev: any) => ({ ...prev, [name]: value }));
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //         const file = e.target.files[0];
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //             setEditedItem((prev: any) => ({ ...prev, image: reader.result }));
  //         };
  //         reader.readAsDataURL(file);
  //     }
  // };

  const handleSave = async (e: any) => {
    e.preventDefault();

    /*try {
            const response = await fetch('/api/chamados', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedItem)
            });

            if (!response.ok) throw new Error('Erro ao salvar');

            setIsEditing(false);
        } catch (error) {
            console.error('Erro:', error);
        }*/
    setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    /*try {
            const response = await fetch('/api/chamados', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: item.id })
            });

            if (!response.ok) throw new Error('Erro ao excluir');

            setIsConfirmVisible(false);
            onClose();
        } catch (error) {
            console.error('Erro:', error);
        }*/
    setIsConfirmVisible(false);
  };

  const handleReturn = (e: any) => {
    e.preventDefault();
    setIsReturn(false);
    setEditedItem((prev: any) => ({
      ...prev,
      status: "Devolvido",
    }));
  };
  // console.log(editedItem);

  return (
    <Component>
      {/* {isConfirmVisible && (
        // Renderiza o modal de confirmação de exclusão
        <ConfirmModal
          message="Tem certeza que deseja excluir este chamado?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmVisible(false)}
        />
      )} */}

      {isEditing ? (
        <form action="" onSubmit={handleSave}>
          <div className="container">
            <button className="btn-close" onClick={onClose} type="button">
              <i>
                <IoCloseOutline />
              </i>
            </button>

            <h2>Editar Chamado</h2>
            <h4>Abertura</h4>
            <p>{editedItem.date}</p>
            <h4>Local</h4>
            <input
              type="text"
              className="input-disabled"
              value={editedItem.location}
              disabled
            />
            <h4>Descrição</h4>
            <textarea
              className="texteare-disabled"
              value={editedItem.description}
              disabled
              placeholder=""
            />
            <h4>Tipo de solicitação</h4>
            <input
              type="text"
              className="input-disabled"
              value={editedItem.request}
              disabled
              placeholder=""
            />
            <h4>Equipamento</h4>
            <input
              type="text"
              className="input-disabled"
              value={editedItem.equipament}
              disabled
              placeholder=""
            />

            <div className="container-edit">
              <h4>Status</h4>
              <select
                className="select"
                name="status"
                value={editedItem.status}
                onChange={(e) =>
                  setEditedItem((prev: any) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="progresso">Progresso</option>
                <option value="aberto">Aberto</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              {editedItem.status == "cancelado" ? (
                <>
                  <h4>Justificativa</h4>
                  <textarea
                    placeholder="Digite uma justificativa..."
                    required
                    value={editedItem.justificativa}
                    name="justificativa"
                    onChange={(e) => {
                      setEditedItem((prev: any) => ({
                        ...prev,
                        justificativa: e.target.value,
                      }));
                    }}
                  ></textarea>
                </>
              ) : null}
              <h4>Prioridade</h4>
              <select
                name="priority"
                className="select"
                value={editedItem.priority}
                onChange={(e) =>
                  setEditedItem((prev: any) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
              <h4>Responsável</h4>
              <input
                className="input"
                type="text"
                name="resposible"
                value={editedItem.resposible}
                onChange={handleChange}
              />
              <h4>Data prevista para resolução</h4>
              <input
                className="input"
                type="date"
                name="dataPrevista"
                value={editedItem.dataPrevista}
                onChange={handleChange}
              />
            </div>

            <div className="buttons">
              <button className="btn-save" type="submit">
                <i>
                  <FaSave />
                </i>
                Salvar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
                type="button"
              >
                <i>
                  <MdCancel />
                </i>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      ) : (
        // Renderiza os dados em modo visualização
        <>
          <div className="container">
            <button className="btn-close" onClick={onClose} type="button">
              <i>
                <IoCloseOutline size={20} />
              </i>
            </button>

            <div className="text-container">
              <h2>Detalhes do Chamado</h2>

              {/* Seção com 2 colunas */}
              <div className="info-grid">
                <div className="info-col">
                  <h3>Abertura</h3>
                  <p>{editedItem.date}</p>

                  <h3>Local</h3>
                  <p>{editedItem.location}</p>

                  <h3>Status</h3>
                  <p>{editedItem.status}</p>

                  <h3>Tipo de solicitação</h3>
                  <p>{editedItem.request}</p>

                  <h3>Equipamento</h3>
                  <p>{editedItem.equipament}</p>
                </div>

                <div className="info-col">
                  <h3>Prioridade</h3>
                  <p>{editedItem.priority}</p>

                  <h3>Responsável</h3>
                  <p>{editedItem.resposible}</p>

                  <h3>Descrição</h3>
                  <p className="text-description">{editedItem.description}</p>
                </div>
              </div>

              {/* Mídia */}
              {item.image && (
                <>
                  <h3>Mídia</h3>
                  <div className="slider-container">
                    <button className="prev" type="button">
                      <MdArrowBackIos size={30} />
                    </button>
                    <Slider settings={settings}>
                      {image.map((item: any, index) => (
                        <Slide key={index}>
                          <Image
                            src={item}
                            alt=""
                            width={150}
                            height={200}
                            className="image"
                          />
                        </Slide>
                      ))}
                    </Slider>
                    <button className="next" type="button">
                      <MdArrowForwardIos size={30} />
                    </button>
                  </div>
                </>
              )}

              {/* Subchamados */}
              {editedItem.child && editedItem.child.length > 0 && (
                <>
                  <h3>Sub Chamados</h3>
                  <Table className="table-subchamados">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>DATA</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell>ASSUNTO</TableCell>
                      </TableRow>
                    </TableHead>
                    {editedItem.child.map((sub: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{sub.id}</TableCell>
                        <TableCell>{sub.date}</TableCell>
                        <TableCell>{sub.status}</TableCell>
                        <Tooltip title={sub.subject} suppressHydrationWarning>
                          <TableCell className="td-subject">
                            {sub.subject}
                          </TableCell>
                        </Tooltip>
                      </TableRow>
                    ))}
                  </Table>
                </>
              )}

              {/* Botões de ação */}
              <div className="buttons">
                <button
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                  type="button"
                >
                  <i>
                    <FaEdit />
                  </i>
                  Editar
                </button>

                {editedItem.status !== "Devolvido" && (
                  <button
                    className="btn-edit"
                    onClick={() => setIsReturn(true)}
                    type="button"
                  >
                    <i>
                      <FiCornerDownLeft />
                    </i>
                    Devolver
                  </button>
                )}
              </div>
            </div>
            {editedItem.status === 'Devolvido' && (
              <Box sx={{ marginTop: '0.5rem' }}> {/* Use Box para a margem */}
                <Collapse in={showDevolvidoAlert}> {/* Envolva com Collapse */}
                  <Alert severity="success">
                    Este chamado foi devolvido.
                  </Alert>
                </Collapse>
              </Box>
            )}

            {isReturn && (
              <ConfirmModal
                onConfirm={handleReturn}
                onCancel={() => setIsReturn(false)}
                shouldReturn={true}
                editedItem={editedItem}
                setEditedItem={setEditedItem}
                item={item}
              />
            )}
          </div>
        </>
      )}
    </Component>
  );
};

export default ModalChamado;
