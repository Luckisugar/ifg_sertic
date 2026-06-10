import { v4 as uuidv4 } from 'uuid';

export const criaSenha = (): string => {
  const specialChars = "!@#$%^&*";
  return (
    uuidv4().replace(/-/g, '').slice(0, 6) +
    specialChars[Math.floor(Math.random() * specialChars.length)] +
    uuidv4().replace(/-/g, '').slice(6, 8)
  );
};
