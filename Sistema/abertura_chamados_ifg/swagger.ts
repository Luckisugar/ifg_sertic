import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API Next.js',
      version: '1.0.0',
      description: 'Documentação da API',
    },
  },
  apis: ['./pages/api/**/*.ts'], // Escaneia todas as APIs dentro de "pages/api"
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
