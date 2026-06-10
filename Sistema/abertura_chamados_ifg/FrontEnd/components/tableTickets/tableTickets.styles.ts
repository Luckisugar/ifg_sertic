import styled from "styled-components";

const TableTicket = styled.div`
max-height: 800px;
overflow: auto;

.print-only {
  display: none;
}
.MuiTableHead-root .MuiTableCell-root{
 font-weight: bold;
}
@media print {
  .print-only {
    display: block !important;
  }
}

  .table-tickets {
    width: 100%;
    max-height: 700px;
    overflow-y: auto;
  }
 
  th,
  td {
    border-bottom: 1px solid #d9d9d9;
    white-space: nowrap; 
    
  }
  .table-title{
    cursor: pointer;
  }
  td{
    padding: 15px 15px;
  }
  .td-subject{
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: none;
    white-space: nowrap;
  }
    
.status, .priority {
  width: 120px;
  height: 30px;
  text-align: center;
  font-weight: bold;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center; 
  border-radius: 5px;
  color: #FFF;
}
.strong{
    font-weight:bold;
}
.table-row-head{
    font-weight: bold;
}
.table-row-body:hover{
  background-color: #f4f4f4;
  cursor: pointer;
}
::-webkit-scrollbar-track {
    background-color: #F4F4F4;
}
::-webkit-scrollbar {
    width: 6px;
    background: #F4F4F4;
}
::-webkit-scrollbar-thumb {
    background: #dad7d7;
}
.filters {
  margin-left: 15px;
}

.filters label{
  font-size: 13px;
}
.select-filter, .search-input {
    height: 40px;
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #D9D9D9;
    background-color: #fff;
    margin-right: 20px
}

.select-filter {
    width: 150px;
}

.search-input {
    flex: 1; 
    min-width: 200px; 
}


//component 

.MuiTableRow-root:hover{
cursor: pointer

}


@media (max-width: 1763px){
  .btn-print{
    position: relative;
  }
}
@media(max-width:1617px) {
  .table-tickets {
    max-height: 600px;
  }
  .status, .priority {
  width: 100px;
  height: 30px;
  margin-left: 5px;
  }
}

@media (max-width: 1455px){
  .tabs button{
    width: 200px;
  }
  .button-add{
    width: 140px;
    font-size: 13px;
    right: 0px;
  }
}
@media (max-width: 1226px){
  .table-title{
    font-size: 15px;
  }
  .table-row-body td{
    font-size: 15px;
  }
  .priority{
    width: 80px;
    font-size: 12px;
  }
  .status{
    width: 80px;
    font-size: 12px;
  }
  .send{
  width: 50px;
  }
  .button-add{
    width: 140px;
    font-size: 13px;
  }

}
@media (max-width: 1140px){
  .table-title{
    font-size: 11px;
  }
  .table-row-body td{
    font-size: 11px;
  }
  .priority{
    width: 70px;
    font-size: 12px;
  }
  .button-add{
    width: 120px;
    font-size: 12px;
    position: relative;
    top: 40px;
    left: 5px;
    margin-bottom: 30px;
  }
}
@media (max-width: 890px){
  .table-title{
    font-size: 10px;
  }
  .table-row-body td{
    font-size: 10px;
  }
  .priority{
    width: 65px;
    font-size: 11px;
  }
  .status{
    width: 65px;
    font-size: 11px;
  }
  .tabs button{
    width: 200px;
    font-size: 12px;
  }
}
@media (max-width:621px){
  .tabs button{
    width: 180px;
    font-size: 11px;
  }
  .select-filter{
    margin-bottom: 20px
}
}


`


export default TableTicket