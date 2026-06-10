import styled from "styled-components";

const Component = styled.div`
  .container {
    width: 28vw;
    height: 80vh;
    margin: 50px auto;
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  h2 {
    color: #000;
    /* font-size: 40px; */
    margin-bottom: 2%;
  }
  p {
    margin-bottom: 5%;
    color: #4f4f4f;
    text-align: center;
    font-size: 15px;
    /* margin-bottom: 5%; */
  }
  .text {
    width: 380px;
    margin-bottom: 32px;
  }
  img {
    max-width: 15%;
    height: auto;
    margin-left: 5%;
  }
  form {
    display: flex;
    flex-direction: column; // Organiza os elementos em coluna
    justify-content: center; // Centraliza verticalmente
    align-items: center;
    min-height: 45vh;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 15px;
    margin-top: 5px;
    background-color: none;
    border: 1px solid #dadada;
    margin-bottom: 30px;
  }

  button {
    width: 25%;
    border-radius: 5px;
    padding: 10px;
    background-color: #2f9e41;
    color: #ffffff;
    border: none;
    cursor: pointer;
  }

  .inputs {
    width: 33%;
  }
  a {
    color: #000;
    text-decoration: none;
    display: flex;
    justify-content: right;
    margin-bottom: 15px;
    font-size: 13px;
  }
  a:hover {
    color: #4f4f4f;
  }

  .error {
    margin-top: 50px;
    color: red;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success {
    margin-top: 50px;
    color: green;
    display: flex;
    align-items: center;
    justify-content: center;
  }



  
  @media (max-width: 1693px) {
    .container {
    }
  }

  @media (max-width: 1419px) {
    .inputs {
      width: 50%;
    }
    input {
      max-width: none;
      min-width: none;
    }
  }

  @media (max-width: 1747px) {
    .inputs {
      width: 50%;
    }
  }

  @media (max-width: 1297px) {
    .inputs {
      width: 50%;
    }
    p {
      font-size: 12px;
    }
    .text {
      width: 300px;
      margin-bottom: 15px;
    }
    button {
      width: 35%;
    }
  }

  @media (max-width: 1283px) {
    .inputs {
      width: 50%;
    }
    h2 {
      color: #000;
      /* font-size: 20px; */
      margin-bottom: 5%;
    }
    .container {
      width: 35vw;
    }
  }

  @media (max-width: 927px) {
    .container {
      width: 80%;
    }
    .inputs {
      width: 47%;
    }
  }

  @media (max-width: 779px) {
    .inputs {
      width: 47%;
    }
  }

  @media (max-width: 682px) {
    a {
      font-size: 10px;
    }
    .inputs {
      width: 47%;
    }
  }

  @media (max-width: 616px) {
    .inputs {
      width: 47%;
    }
  }
  @media (max-width: 560px) {
    .inputs {
      width: 47%;
    }
  }

  @media (max-width: 421px) {
    .inputs {
      width: 50%;
    }
  }
`;
export default Component;
