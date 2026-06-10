import MenuAdmin from "../components/menuAdmin";
import ModalChamado from "../components/modal";
import TableTickets from "../components/tableTickets";
import Topo from "../components/topo";
import Link from "next/link";
import React, { useRef, useState,useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { IoList } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import data from "../../chamadosAbertos.json";
import useAuth from "../services/auth/useAuth";
import Component from "../styles/home.styles";
import { LuTickets } from "react-icons/lu";
import { PiList } from "react-icons/pi";

interface Chamado {
  id: number;
  date: string;
  applicant: string;
  subject: string;
  location: string;
  request: string;
  status: string;
  priority: string;
}
export default function Home() {
  // const router = useRouter();
  
  
  const [order, setOrder] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [chamados, setChamados] = useState<Chamado[]>(data);
  const [fildName, setFildName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [item, setItem] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = React.useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const { usuario, loading } = useAuth();
  const [print, setPrint] = useState(false);

// useEffect(() => {
//   async function fetchData() {
//     try {
//       const response = await buscaSolicitacaoPai(1);
//       const locaisArray = response.chamados || [];

//       const chamadosFormatados: Chamado[] = locaisArray.map((item: any) => ({
//         id: item.id,
//         date: item.dataSolicitacao,
//         applicant: item.solicitante?.nome || "Desconhecido",
//         subject: item.assunto,
//         location: item.local?.nome || "Sem local",
//         request: item.descricao,
//         status: item.status,
//         priority: item.prioridadeAtual || "Sem prioridade",
//       }));

//       setChamados(chamadosFormatados);
//     } catch (err: unknown) {
//       if (
//         typeof err === "object" &&
//         err !== null &&
//         "error" in err &&
//         typeof (err as any).error === "string"
//       ) {
//         setError((err as { error: string }).error);
//       } else {
//         setError("Erro desconhecido");
//       }
//     }
//   }

//   fetchData();
// }, []);

  //const { usuario, loading } = useAuth();

  const visible = [
    { key: "date", label: "DATA" },
    { key: "applicant", label: "SOLICITANTE" },
    { key: "subject", label: "ASSUNTO" },
    { key: "location", label: "LOCAL" },
    { key: "request", label: "SOLICITAÇÃO" },
    { key: "status", label: "STATUS" },
    { key: "priority", label: "PRIORIDADE" },
  ];

  const statusColors: Record<string, string> = {
    Aberto: "rgba(255,165,0,0.7)",
    Cancelado: "rgba(218,55,58,1.0)",
    Finalizado: "rgba(47,158,65,1.0)",
    Progresso: "rgba(30,144,255,1.0)",
    Devolvido: "rgba(255,0,0,1.0)",
  };

  const priorityColors: Record<string, string> = {
    Baixa: "rgba(76, 175,80, 0.7)",
    Média: "rgba(255, 193,7, 0.7)",
    Alta: "rgba(255, 76,19, 0.7)",
    Crítica: "rgba(244, 67,54, 0.8)",
  };
  const pageStyle = `
  @media print {
  *{
    background: none !important;
    color: #000 !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  body *{
    visibility: visible;
  }
  #section-to-print, #section-to-print * {
    visibility: visible;
  }
  #section-to-print {
    position: absolute;
    left: 0;
    top: 0;
  }
}
  @page {
   size: A4;
   margin: 0;
  
 }

 .no-print {
   display: none !important; 
 }
  td .priority, .status{
  display: flex;
  padding: 5px 5px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  color: #fff;
  }
 table {
   width: 100%;
   border-collapse: collapse; 
   top:85px;
   background-color: #fff;
 }
 table td, th{ 
   padding: 15px 15px; 
   border-bottom: 1px solid #d9d9d9;
 }
 table .table-row-head{
   font-weight: bold;
  //  font-size: 11px;
   white-space: nowrap;
 }

//  div {
//    width: 70px;
//    font-size: 12px;
//    margin-left: 10px;
//  }
.td-subject{
   max-width: 80px;
   overflow: hidden;
   white-space: nowrap;
   font-size: 12px;
   text-overflow: ellipsis;
}
img{
width: 200px;
height: 100px;
margin-bottom: 15px;
}
h2{
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 25px;
}
p{
margin-bottom: 35px;
text-align: center;
font-size: 12px;
}
span{
font-weight: bold;
}
.table-list-container{
background-color: #fff;
}
`;
 
  const handleChange = (newValue: number) => {
    setValue(newValue);
    setSearchTerm('');
    setSelectedFilter('')
  };
  // useEffect(() => {
  //   setChamados(sortData(chamados, fildName, order === 1 ? 'asc' : 'desc'));
  // },[fildName,order])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filterData = () => {
    return chamados.filter((chamado) => {
      if (!selectedFilter) {
        return chamados;
      }

      const fieldValue = chamado[selectedFilter as keyof Chamado]
        ?.toString()
        .toLowerCase();

      return fieldValue?.includes(searchTerm.toLowerCase());
    });
  };
  function sortData(array: any[], field: string, order = "asc") {
    return array.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === "date") {
        valA = new Date(valA.split("/").reverse().join("-"));
        valB = new Date(valB.split("/").reverse().join("-"));
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  // const FilterTable = () => (
  //   <div className="filters">
  //     <label>Filtro de Busca</label>

  //     <div >
  //       <select
  //         onChange={(e) => setSelectedFilter(e.target.value)}
  //         value={selectedFilter}
  //         className="select-filter"
  //       >
  //         <option value="">Selecione o filtro</option>
  //         <option value="status">Status</option>
  //         <option value="priority">Prioridade</option>
  //         <option value="applicant">Solicitante</option>
  //         <option value="date">Data</option>
  //         <option value="subject">Assunto</option>
  //         <option value="request">Solicitação</option>
  //         <option value="location">Local</option>
  //       </select>

  //         <input
  //         type="text"
  //         placeholder="Buscar chamado..."
  //         value={searchTerm}
  //         onChange={handleSearch}
  //         className="search-input"
  //       />
  //     </div>
  //   </div>
  // );
  const handleOrder = (fieldName: string, order: string = "desc") => {
    setChamados((prevChamados) => [
      ...sortData(prevChamados, fieldName, order),
    ]);
    setFildName(fieldName);
    setOrder(order === "asc" ? -1 : 1);
  };


  const contentDocument = useRef<HTMLTableElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: contentDocument,
    documentTitle: `Relatorio de chamados`,
    pageStyle: pageStyle,
    onAfterPrint: () => console.log("Printing completed"),
  });
  // console.log(chamados)
  function renderTabContent() {
    switch (value) {
      case 0:
        return (
          <>
            <div className="table-tickets">
              <div className="filters">
                <label>Filtro de Busca</label>

                <div>
                  <input
                    type="text"
                    placeholder="Buscar chamado..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />

                    <select
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    value={selectedFilter}
                    className="select-filter"
                  >
                    <option value="">Selecione o filtro</option>
                    <option value="status">Status</option>
                    <option value="priority">Prioridade</option>
                    <option value="applicant">Solicitante</option>
                    <option value="date">Data</option>
                    <option value="subject">Assunto</option>
                    <option value="request">Solicitação</option>
                    <option value="location">Local</option>
                  </select>
                </div>
              </div>

              <TableTickets
                visible={visible}
                selectedFilter={selectedFilter}
                data={data}
                handleOrder={handleOrder}
                filterData={filterData}
                statusColors={statusColors}
                priorityColors={priorityColors}
                setItem={setItem}
                setIsModalVisible={setIsModalVisible}
                fildName={fildName}
                order={order}
                contentDocument={contentDocument} 
                />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="table-tickets">
              <div className="filters">
                <label>Filtro de Busca</label>

                <div>
                  <input
                    type="text"
                    placeholder="Buscar chamado..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />

                   <select
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    value={selectedFilter}
                    className="select-filter"
                  >
                    <option value="" >Selecione o filtro</option>
                    <option value="applicant">Solicitante</option>
                    <option value="date">Data</option>
                    <option value="subject">Assunto</option>
                    <option value="request">Solicitação</option>
                    <option value="location">Local</option>
                  </select>
                </div>
              </div>
              <TableTickets
                visible={visible}
                data={data}
                selectedFilter={selectedFilter}
                excludeFields={["priority", "status"]}
                handleOrder={handleOrder}
                filterData={filterData}
                statusColors={statusColors}
                priorityColors={priorityColors}
                setItem={setItem}
                setIsModalVisible={setIsModalVisible}
                fildName={fildName}
                order={order}
                contentDocument={contentDocument}
              />
            </div>
          </>
        );
      // case 2:
      //   return (
      //     <>
      //     <div className="container">
      //     <div className="text-container">
      //     </div>
      //     <div className="center">
      //       <i className="icon-chat"><BsChatLeftText size={95} color="#d9d9d9"/></i>
      //       <p>Inicie um novo Chat ou acesse os chats disponiveis para ver as mensagens!</p>
      //       </div>
      //     </div>
      //     <Chat user={'admin'}/>
      //   </>
      //   )
      default:
    }
  }
  // const { usuario, loading } = useAuth();

  return (
    <>
      <MenuAdmin user={usuario?.nome} matricula={usuario?.matricula} />
      {isModalVisible && (
        <ModalChamado onClose={() => setIsModalVisible(false)} item={item} visible={visible} statusColors={statusColors}
        priorityColors={priorityColors} />
      )}
      <Topo
        name="Chamados"
        icon={
          <i>
            <PiList />
          </i>
        }
      />
      <Component>
        <Link href="/createTicket" className="button-add">
          <i>
            <FaPlus />
          </i>{" "}
          Novo Chamado
        </Link>
        <div className="appBar">
          <div className="tabs">
            <button
              className={value === 0 ? "active" : "tab-pending"}
              onClick={() => handleChange(0)}
            >
              Chamados em andamento
            </button>
            <button
              className={value === 1 ? "active" : "tab-progress"}
              onClick={() => handleChange(1)}
            >
              Chamados pendentes
            </button>
            <button className="tab-print" onClick={() => { setPrint(!print); handlePrint(); }} >
              Exportar para PDF
            </button>

            {/* <button className={value === 2 ? "active" : "tab-chat"} onClick={() => handleChange(2)}>Chat</button> */}
          </div>
        </div>
        <div>{renderTabContent()}</div>
      </Component>
    </>
  );
}
