import styled from "styled-components";

const Component = styled.div`
  .container {
    width: 35vw;
    height: 90vh;
    margin: 50px auto;
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  h1 {
    color: #1c5e27;
    font-size: 40px;
    margin-bottom: 10%;
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
    min-height: 50vh;
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
    margin-bottom: 10px;
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

  a{
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

  alert {
  width: "100%"; 
  mt: 2;
  fontSize: "1rem"; 
  textAlign: "center"; 
  maxWidth: 400;
  }
  
  @media (max-width: 1268px) {
    .container {
      width: 40%;
    }
    h1 {
      font-size: 30px;
    }
    .error {
      margin-top: 15px;
      margin-left: 105px;
      font-size: 12px;
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

  @media (max-width: 927px) {
    .container {
      width: 80%;
    }
    .inputs {
      width: 47%;
    }
    .error {
      margin-left: 180px;
    }
  }

  @media (max-width: 779px) {
    h1 {
      font-size: 35px;
    }
    .inputs {
      width: 47%;
    }
    .error {
      margin-left: 150px;
    }
  }

  @media (max-width: 682px) {
    a {
      font-size: 10px;
    }
    h1 {
      font-size: 35px;
    }
    .inputs {
      width: 47%;
    }
    .error {
      margin-left: 140px;
    }
  }

  @media (max-width: 616px) {
    h1 {
      font-size: 33px;
    }
    .inputs {
      width: 47%;
    }
    .error {
      margin-left: 130px;
    }
  }
  @media (max-width: 560px) {
    h1 {
      font-size: 30px;
    }
    .inputs {
      width: 47%;
    }
    .error {
      margin-left: 120px;
    }
  }

  @media (max-width: 421px) {
    h1 {
      font-size: 25px;
    }
    .inputs {
      width: 50%;
    }
    .error {
      margin-left: 100px;
    }
  }
`;
export default Component;
