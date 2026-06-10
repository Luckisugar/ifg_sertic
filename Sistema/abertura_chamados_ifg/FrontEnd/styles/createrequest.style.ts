import styled from "styled-components";
import { styled as mui } from '@mui/system';
import * as m from '@mui/material';

// Container principal da página
export const Container = styled.div`
  width: min(75%, 1200px);
  min-height: 80vh;
  background: #fff;
  color: #000;
  margin: 1% 10% 1% 10%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 1.5rem;

  h1 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #333;
  }
  input {
    border-radius: 5px;
    border: 1px solid #d9d9d9;
    padding: 8px;
  }
  .success {
    color: green;
  }
  .error{
    color: red;
  }
  /* Responsividade */
  @media (min-width: 1300px) {
    width: 75%;
    padding: 25px;
    gap: 1rem;
  }
  @media (max-width: 1080px) {
    width: 75%;
    padding: 20px;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    width: 75%;
    padding: 15px;
    gap: 0.5rem;
    h1 {
      font-size: 1.3rem;
    }
  }

  @media (max-width: 480px) {
    width: 75%;
    padding: 10px;
    gap: 0.5rem;
  }
`;

// Formulário de cadastro
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espaçamento entre elementos */
  margin-bottom: 50px;
  /* Responsividade */
  @media (min-width: 1300px) {
    gap: 2rem;
  }
  @media (max-width: 1080px) {
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

// Grupo de inputs
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
  }

  input,
  select {
    width: 100%;
    max-width: 500px;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    margin-bottom: 15px;
  }

  input:focus,
  select:focus {
    border-color: #28a745;
    box-shadow: 0 0 5px rgba(114, 226, 162, 0.5);
  }

  textarea {
    font-family: Arial, Helvetica, sans-serif;
    margin-top: 5px;
    resize: none;
    height: 80px;
    width: 100%;
    overflow: auto;
    width: 100%;
    padding-left: 5px;
    padding-top: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    input,
    select {
      max-width: 100%;
      padding: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    input,
    select {
      padding: 0.6rem;
    }
  }
`;

// Botão de submissão
export const ButtonSubmit = mui(m.Button)`
  width: 155px;
  height: 38px;
  border: none;
  border-radius: 5px;
  background-color: #2f9e41;
  color: #fff;
  cursor: pointer;

  /* Responsividade */
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0.8rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.7rem 1.2rem;
  }
`;

// Divisão para separar as seções
export const Section = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

// Tabela de locais cadastrados
export const Table = styled.table`
  width: auto;
  max-width: 520px;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  th,
  td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
    word-wrap: break-word;
  }

  th {
    background-color: #28a745;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  td {
    text-align: center;
  }

  tr:nth-child(even) {
    background-color: #ffffff;
  }

  /* Contêiner com scroll vertical */
  tbody {
    display: block;
    max-height: 350px;
    overflow-y: auto;

    /* Responsividade */
    @media (max-width: 412px) {
      max-height: 350px;
    }

    @media (min-width: 413px) and (max-width: 768px) {
      max-height: 400px;
    }

    @media (min-width: 769px) and (max-width: 820px) {
      max-height: 600px;
    }

    @media (min-width: 821px) and (max-width: 1080px) {
      max-height: 300px;
    }

    @media (min-width: 1081px) {
      max-height: 500px;
    }
  }

  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  tbody td,
  thead th {
    width: 85%; /* Ajuste para a largura das colunas */
  }
`;

// Botão de exclusão na tabela
export const DeleteButton = styled.button`
  color: #dc3545;
  cursor: pointer;
  background-color: transparent;
  border: none;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input {
    width: 16px;
    height: 16px;
  }
`;
export const ActiveButton = styled.button<{ $st_ativo: boolean }>`
  cursor: pointer;
  background-color: ${({ $st_ativo }) => ($st_ativo ? "#dc3545" : "#28a745")}; /* Vermelho para "Desativar", verde para "Ativar" */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const TableRow = styled.tr<{ $st_ativo: boolean }>`
  background-color: ${({ $st_ativo }) => ($st_ativo ? "#d4edda" : "#f8d7da")}; /* Vermelho claro para inativo, verde claro para ativo
  transition: background 0.3s ease;
  font-color: ##4f4f4f;
`;
export const Alert = styled(m.Alert)`
  width: "100%"; 
  mt: 2;
  fontSize: "1rem"; 
  textAlign: "center"; 
  maxWidth: 400;
`;