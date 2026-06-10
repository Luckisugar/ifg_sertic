import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Container = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

export const Message = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 20px;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: center; /* Centraliza os botões */
  gap: 10px;
`;

export const ConfirmButton = styled.button`
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
`;

export const CancelButton = styled.button`
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
`;