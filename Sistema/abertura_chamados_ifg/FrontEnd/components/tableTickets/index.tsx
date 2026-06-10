import { FaSortDown, FaSortUp } from "react-icons/fa";
import TableTicket from "./tableTickets.styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Collapse,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import dynamic from "next/dynamic";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import logoIfg from "../../public/Assets/logoIfg.png";
import { LuAArrowDown, LuAArrowUp } from "react-icons/lu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
type Field = {
  key: string;
  label: string;
};

type Item = {
  id: number;
  date: string;
  applicant: string;
  subject: string;
  location: string;
  request: string;
  status: string;
  priority: string;
};

type TableListProps = {
  visible: Field[]; // Campos da tabela
  data: Item[]; // Dados que serão exibidos
  excludeFields?: string[]; // Campos que deverão ser excluídos
  handleOrder: (key: string, order: string) => void; // Função de ordenação
  filterData: () => Item[]; // Função de filtragem
  statusColors: { [key: string]: string }; // Cores para status
  priorityColors: { [key: string]: string }; // Cores para prioridade
  setItem: (item: Item) => void; // Função para definir o item selecionado
  setIsModalVisible: (visible: boolean) => void; // Função para definir se o modal está visível
  fildName: string; // Nome do campo para ordenação
  order: number; // Ordem de ordenação (1 ou -1)
  contentDocument: any;
  selectedFilter: string;
};

export default function TableTickets({
  visible,
  selectedFilter,
  data,
  excludeFields,
  handleOrder,
  filterData,
  statusColors,
  priorityColors,
  setItem,
  setIsModalVisible,
  fildName,
  order,
  contentDocument,
}: TableListProps) {
  const filteredData = useMemo(() => filterData(), [data, filterData]);
  const [openRows, setOpenRows] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const selectedFilterLabel = useMemo(() => {
    const field = visible.find((item) => item.key == selectedFilter);
    return field ? field.label : selectedFilter;
  }, [selectedFilter, visible]);

  const handleToggleRow = (id: number) => {
    setOpenRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, rowsPerPage]);
  // console.log(paginatedData);
  return (
    <TableTicket>
      <div ref={contentDocument}>
        <div className="print-only">
          <img src={logoIfg.src} alt="logo ifg" />
          <h2>Relatório de Chamados </h2>
          {selectedFilter && (
            <p>
              Filtro aplicado:{" "}
              <span>{selectedFilterLabel.toLocaleUpperCase()}</span>
            </p>
          )}
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="no-print" />
              {visible
                .filter((field) => !excludeFields?.includes(field.key))
                .map((field, index) => (
                  <TableCell
                    key={index}
                    onClick={() =>
                      handleOrder(
                        field.key.toLowerCase(),
                        order !== 1 ? "desc" : "asc"
                      )
                    }
                    className="table-title"
                  >
                    {field.label}{" "}
                    {fildName === field.key ? (
                      order === 1 ? (
                        <FaSortDown color="#d9d9d9" />
                      ) : (
                        <FaSortUp color="#d9d9d9" />
                      )
                    ) : null}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((chamado: any) => (
              <React.Fragment key={chamado.id}>
                <TableRow
                  key={chamado.id}
                  onClick={() => {
                    setItem(chamado);
                    setIsModalVisible(true);
                  }}
                >
                  {chamado.child ? (
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="no-print"
                    >
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRow(chamado.id);
                        }}
                      >
                        {openRows.includes(chamado.id) ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  ) : (
                    <TableCell className="no-print" />
                  )}

                  {visible
                    .filter((field) => !excludeFields?.includes(field.key))
                    .map((field, index) => (
                      <TableCell key={index}>
                        {field.key === "status" || field.key === "priority" ? (
                          <div
                            style={{
                              backgroundColor:
                                field.key === "status"
                                  ? statusColors[chamado[field.key]]
                                  : priorityColors[chamado[field.key]],
                            }}
                            className={field.key}
                          >
                            {chamado[field.key]}
                          </div>
                        ) : field.key === "subject" ? (
                          <Tooltip
                            title={chamado[field.key]}
                            suppressHydrationWarning
                          >
                            <div className="td-subject">
                              {chamado[field.key]}
                            </div>
                          </Tooltip>
                        ) : (
                          chamado[field.key]
                        )}
                      </TableCell>
                    ))}
                </TableRow>
                {openRows.includes(chamado.id) &&
                  chamado.child.map((sub) => (
                    <TableRow
                      key={sub.id}
                      sx={{ backgroundColor: "#fafafa" }}
                      onClick={() => {
                        setItem(sub);
                        setIsModalVisible(true);
                      }}
                    >
                      <TableCell className="no-print" />

                      {visible
                        .filter((field) => !excludeFields?.includes(field.key))
                        .map((field, index) => (
                          <TableCell key={index}>
                            {field.key === "status" ||
                            field.key === "priority" ? (
                              <div
                                style={{
                                  backgroundColor:
                                    field.key === "status"
                                      ? statusColors[sub[field.key]]
                                      : priorityColors[sub[field.key]],
                                }}
                                className={field.key}
                              >
                                {sub[field.key]}
                              </div>
                            ) : field.key === "subject" ? (
                              <Tooltip title={sub[field.key]}>
                                <div className="td-subject">
                                  {sub[field.key]}
                                </div>
                              </Tooltip>
                            ) : (
                              sub[field.key]
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          className="no-print"

          sx={{
            marginTop: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>
    </TableTicket>
  );
}
