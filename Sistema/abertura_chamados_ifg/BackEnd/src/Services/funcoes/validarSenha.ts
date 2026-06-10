import bcrypt from "bcrypt";

const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
export default validatePassword;