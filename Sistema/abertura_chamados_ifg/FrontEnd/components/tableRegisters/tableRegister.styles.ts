import styled from "styled-components"; 

const Table = styled.div`

    max-height: 300px;
    max-width: 520px;
    margin-left: 65%;
    margin-top: 50px;
    margin-right: auto;
 //tabela
table{
 width: auto;
  max-width: 520px auto;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  left: 50%;
}
thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

th,
  td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: center;
    word-wrap: break-word; 
  }

  thead {
    background-color: #28a745;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  tr:nth-child(even) {
    background-color:#ffffff;
  }


  tbody {
    display: block;
    max-height: 350px;	 
    overflow-y: auto;

  }
   

`
export default Table;