import styled from "styled-components";

const Component = styled.div`
  width: 75%;
  min-height: 1000px;
  background-color: #fff;
  display: flex;
  color: #000;
  margin-top: 25px;
  margin-left: 10%;
  border-radius: 5px;
  flex-direction: column;
  position: relative;
  
  .appBar {
    margin-top: 40px;
    margin-bottom: 35px;
  }
  .tabs button {
    width: 250px;
    height: 40px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
    //Estilização das abas(andamento, progresso)
  .tab-pending,
  .tab-progress{
    background-color: #fff;
  }
  .tab-print {
    color: #fff;
    background-color: #2f9e41;
  }
  .tabs button.active {
    color: #fff;
    background-color: #2f9e41;
  }

  .button-add {
    width: 150px;
    height: 40px;
    background-color: #2f9e41;
    color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    top: 75px;
    position: absolute;
    right: 85px;
  }

  // ::-webkit-scrollbar-track {
  //   background-color: #f4f4f4;
  // }
  // ::-webkit-scrollbar {
  //   width: 6px;
  //   background: #f4f4f4;
  // }
  // ::-webkit-scrollbar-thumb {
  //   background: #dad7d7;
  // }

  //Estilização chat

  // .container {
  //   width: 550px;
  //   height: 550px;
  //   border: 1px solid #dadada;
  //   position: absolute;
  //   left: 480px;
  //   margin-top: 34px;
  // }

  .text-container {
    margin-top: 50px;
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
  }

  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 110px;
  }
  .icon-chat {
    margin-bottom: 110px;
  }

  p {
    color: #4f4f4f;
    text-align: center;
    margin-bottom: 10px;
    font-size: 15px;
  }

  .filters {
    margin-left: 10px;
    margin-bottom: 25px;
  }

  .filters label {
    font-size: 12px;
    color: #4f4f4f;
    display: none;
  }
  .select-filter,
  .search-input {
    height: 40px;
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    margin-right: 20px;
  }

  .select-filter {
    width: 150px;
  }

  .search-input {
    flex: 1;
    min-width: 200px;
  }

  @media (max-width: 1763px) {
    .btn-print {
      position: relative;
    }
  }
  @media (max-width: 1617px) {
    .status,
    .priority {
      width: 100px;
      height: 30px;
      margin-left: 5px;
    }
  }

  @media (max-width: 1455px) {
    .tabs button {
      width: 200px;
    }
    .button-add {
      width: 140px;
      font-size: 13px;
      right: 0px;
    }
  }
  @media (max-width: 1226px) {
    .priority {
      width: 80px;
      font-size: 12px;
    }
    .status {
      width: 80px;
      font-size: 12px;
    }
    .send {
      width: 50px;
    }
    .button-add {
      width: 140px;
      font-size: 13px;
    }
  }
  @media (max-width: 1140px) {
    .priority {
      width: 70px;
      font-size: 12px;
    }
    .button-add {
      width: 120px;
      font-size: 12px;
      position: relative;
      top: 40px;
      left: 5px;
      margin-bottom: 30px;
    }
  }
  @media (max-width: 890px) {
    .priority {
      width: 65px;
      font-size: 11px;
    }
    .status {
      width: 65px;
      font-size: 11px;
    }
    .tabs button {
      width: 200px;
      font-size: 12px;
    }
  }
  @media (max-width: 621px) {
    .tabs button {
      width: 180px;
      font-size: 11px;
    }
    .select-filter {
      margin-bottom: 20px;
    }
  }
`;

export default Component;
