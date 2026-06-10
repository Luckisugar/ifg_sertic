import request from 'supertest';
import { app } from '../app';

describe('Testa rota GET /', () => {
  it('deve retornar mensagem de status 200 e conteúdo', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Servidor Express rodando na porta 3001!');
  });
});
