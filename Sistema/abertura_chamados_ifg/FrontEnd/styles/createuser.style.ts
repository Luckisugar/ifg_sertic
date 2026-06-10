import styled from "styled-components";
import { styled as mui } from '@mui/system';
import * as m from '@mui/material';

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
    
  /* Responsividade */
  @media (min-width: 1300px) {
    width: 75%;
    padding: 30px;
    gap: 2rem;
  }
  @media (max-width: 1080px) {
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
export const Form = styled.form`
  width: 100%;
  max-width: 400px;
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

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
  }

  input,
  select {
    width: 370px;
    height: 40px;
    margin-top: 5px;
    padding-left: 10px;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    display: flex;
  }

  input:focus,
  select:focus {
    border-color: #28a745;
    box-shadow: 0 0 5px rgba(114, 226, 162, 0.5);
  }

  /* Responsividade Inputs */
  @media (max-width: 768px) {
    input,
    select {
      max-width: 75%;
      padding: 0.5rem;
    }
  }

  @media (max-width: 1024px) {
    input,
    select {
      max-width: 75%;
      padding: 0.8rem;
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

  /* Responsividade Button */

  @media (max-width: 425px) {
    width: 80px;
    padding: 0.5rem 1.2rem;
  }
  @media (max-width: 768px) {
    width: 140px;
    padding: 0.5rem 1.2rem;
  }

  @media (max-width: 1024px) {
    width: 200px;
    padding: 0.8rem 1.5rem;
  }
`;

export const Alert = styled(m.Alert)`
  width: "100%"; 
  mt: 2;
  fontSize: "1rem"; 
  textAlign: "center"; 
  maxWidth: 400;
`;
