import bcrypt from 'bcrypt'
import { randomInt } from 'crypto'; 


export const hashPassword = async(password: string): Promise<string> => {

    const complexity = randomInt(10, 16); //criando tamanhos de salt diferente para os usuarios.

    return bcrypt.hash(password, complexity);
}