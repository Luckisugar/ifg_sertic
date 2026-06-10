import styled from "styled-components";

const Component = styled.div`
  width: 75%;
  min-height: 1050px;
  height: 1050px auto;
  background-color: #fff;
  display: flex;
  color: #000;
  margin-top: 25px;
  margin-left: 10%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  .box {
    width: 100%;
    height: 55px;
    display: flex;
    flex-direction: column;
    background-color: #2f9e41;
    border-radius: 7px;
    margin-top: 25px;
  }
  .title-box {
    color: #fff;
    display: flex;
    text-transform: uppercase;
  }
  .box-info {
    width: 100%;
    border-radius: 7px 7px 0px 0px;
  }
  // .content-sub p {
  //   margin-bottom: 7px;
  //   display: flex;
  // }
  // .title-sub {
  //   text-transform: uppercase;
  //   font-weight: bold;
  //   cursor: pointer;
  // }
  // .success {
  //   color: green;
  //   margin-bottom: 35px;
  // }
  // .text-sub {
  //   left: 0;
  //   position: relative;
  //   color: #4f4f4f;
  // }

  
  .box-container {
    width: 100%;
    min-height: 1050px;
    height: auto;
    margin-top: 15px;
    border-radius: 7px 7px 0px 0px;
    border: 1px solid #d9d9d9;
  }
  .title-box {
    margin-top: 15px;
    margin-left: 15px;
  }
  .title-ticket {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
  }
  .text-title {
    position: absolute;
    padding-left: 250px;
    margin-top: 40px;
    color: #4f4f4f;
    font-weight: normal;
  }
  .content-sub {
    display: flex;
    flex-direction: column;
    position: relative;
    margin-top: 20px;
    margin-left: 15px;
  }

  .content-sub h3 {
    margin-left: 0px;
  }

  .container {
    width: 70%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    margin-top: 100px;
    left: 250px;
    right: 50px;
  }
  p {
    text-transform: capitalize;
  }
  .container input,
  select {
    width: 370px;
    height: 40px;
    margin-top: 5px;
    padding-left: 10px;
    border-radius: 5px;
    margin-bottom: 35px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    display: flex;
  }
  // .table-data {
  //   text-transform: capitalize;
  // }

  // .view-sub {
  //   /* border-top:2px solid red ; */
  //   margin-top: 25px;
  // }
  // .line {
  //   width: 98%;
  //   margin-top: 20px;
  //   border-top: 2px solid #efefef;
  // }
  .container textarea {
    width: 370px;
    height: 80px;
    margin-top: 5px;
    margin-bottom: 35px;
  }

  // .inputFields {
  //   display: flex;
  //   flex-direction: column;
  //   position: absolute;
  //   right: 40%;
  // }
  .button-register-container {
    display: flex;
    flex-direction: column;
    justify-content: center; 
    width: 100%; 
    align-items: center;
    margin-top: 25px;
  }

  .button-register {
    background-color: #2f9e41;
  }

  .button-register,
  .button-register-sub,
  .button-save-sub {
    width: 200px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    margin-bottom: 15px;
    font-weight: bold;
  }


  .buttons button {
    width: 200px;
    height: 35px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .button-cancel {
    color: #e93033;
    border: 1px solid #d9d9d9;
    background-color: transparent;
  }
  .button-save{
  color: #fff;
  background-color: #2F9E41;
  }

  .button-save-draft:hover{
    background-color: #2F9E41;
    color: #fff;
    cursor: pointer;
  }
.button-save-draft{
 border: 1px solid #d9d9d9;
    background-color: #fff;
    color: #2F9E41;
    padding: 10px;
    border-radius: 5px;
}
  .button-cancel:hover {
    background-color: #e93033;
    color: #fff;
  }

  table .button {
    width: 50px;
    height: 30px;
    align-items: center;
    margin-left: 5px;
    border-radius: 5px;
    border: none;
    color: #fff;
    cursor: pointer;
  }
  .MuiTableHead-root .MuiTableCell-root{
  font-weight: bold;
  }
  .delete {
    background-color: #e93033;
  }
  .edit {
    background-color: #2f9e41;
  }
  .button-register-sub {
    margin-top: 55px;
    display: flex;
    flex-direction: column;
    background-color: #2f9e41;
  }

  .button-save-sub {
    border: 1px solid #d9d9d9;
    background-color: #fff;
    color: #2f9e41;
    padding: 10px;
  }
  .button-save-sub:hover {
    background-color: #2f9e41;
    color: #fff;
  }
  // .p-description {
  //   width: 520px;
  // }
  // .input-file {
  //   border: 1px solid #e5e5e5;
  // }

  input[type="file"]::file-selector-button {
    background-color: #fff;
    color: #000;
    border: 0px;
    border-right: 1px solid #e5e5e5;
    padding: 10px 15px;
    margin-right: 20px;
    transition: 0.5s;
  }
  span {
    color: red;
  }

  .add-sub {
    width: 230px;
    height: 40px;
    margin-top: 10px;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border-radius: 5px;
    border: 1px solid #83bf02;
    cursor: pointer;
    gap: 10px;
    color: #83bf02;
  }
  .add-sub:hover {
    background-color: #83bf02;
    color: #fff;
  }
  .container-sub {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 10%;
  }
  textarea {
    padding-left: 5px;
    padding-top: 5px;
  }

  //table

  // table {
  //   width: 80%;
  //   border-collapse: collapse;
  // }

  // .table-row-head {
  //   font-weight: bold;
  //   height: 35px;
  //   background-color: #2f9e41;
  //   color: #fff;
  // }

  // .table-row-body:hover {
  //   background-color: #f4f4f4;
  //   cursor: pointer;
  // }

  // th,
  // td {
  //   border-bottom: 1px solid #d9d9d9;
  //   white-space: nowrap;
  // }

  // td {
  //   padding: 5px 5px;
  // }
  // .td-subject {
  //   max-width: 100px;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }

  .table-sub {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow-y: auto;
    max-height: 880px;
    width: 100%;
    box-sizing: border-box;
  }

  /* h3{
    margin-bottom: 10px;
    text-align: center;
    margin-bottom: 35px;
} */
  .table-title {
    margin-top: 150px;
  }
  .table-title-sub {
    margin-top: 40px;
    color: #4f4f4f;
    font-weight: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 35px;
  }
  .divider {
    width: 100%;
    height: 1px;
    background-color: #d9d9d9;
    margin: 50px 0;
  }

  input[type="checkbox"] {
    width: 15px;
    height: 15px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  input[type="radio"] {
    width: 15px;
    height: 15px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  /* Estilos para o checkbox */
  .container-checkbox {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 35px;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
  }

  .checkbox {
    width: 15px;
    height: 15px;
    cursor: pointer;
  }

  .label-checkbox {
    padding-left: 10px;
    color: #000;
  }

  /* Estilos para o radio */
  .container-radio {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    margin-bottom: 35px;
  }

  .radio-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .radio {
    width: 15px;
    height: 15px;
    cursor: pointer;
  }

  .label-radio {
    padding-left: 10px;
    color: #000;
  }

  @media (max-width: 1609px) {
    .container {
      left: 200px;
    }
    .container input,
    select {
      width: 320px;
    }
    .container textarea {
      width: 320px;
    }

    .container-checkbox,
    .container-radio {
      width: 0px;
    }
    .container-radio {
      flex-direction: column;
    }
    .text-title {
      padding-left: 200px;
    }
  }

  @media (max-width: 1401px) {
    .container {
      left: 170px;
    }

    .container input,
    select {
      width: 310px;
    }
    .container textarea {
      width: 310px;
    }
    .add-sub {
      width: 200px;
    }
    .text-title {
      padding-left: 170px;
    }
  }
  @media (max-width: 1333px) {
    .container {
      left: 150px;
    }

    .container input,
    select {
      width: 300px;
    }
    .container textarea {
      width: 300px;
    }
    .container-sub {
      right: 0;
    }
    .text-title {
      padding-left: 150px;
    }
  }

  @media (max-width: 1271px) {
    .container {
      left: 100px;
    }

    .container input,
    select {
      width: 280px;
    }
    .container textarea {
      width: 280px;
    }
    .add-sub {
      width: 200px;
    }
    .text-title {
      padding-left: 100px;
    }
  }

  @media (max-width: 1205px) {
    .container {
      left: 90px;
    }

    .container input,
    select {
      width: 260px;
    }
    .container textarea {
      width: 260px;
    }

    .container-sub {
      right: 2%;
    }
    .text-title {
      padding-left: 85px;
    }
  }
  @media (max-width: 1025px) {
    .container {
      left: 80px;
    }

    .container input,
    select {
      width: 240px;
    }
    .container textarea {
      width: 240px;
    }
  }
  @media (max-width: 955px) {
    .container input,
    select {
      width: 210px;
    }
    .container textarea {
      width: 210px;
    }

    .container-sub {
      left: 60%;
    }
    td {
      font-size: 15px;
    }
  }

  @media (max-width: 685px) {
    .container-sub {
      position: relative;
      left: 0;
    }

    td {
      font-size: 12px;
    }
  }
`;
export default Component;
