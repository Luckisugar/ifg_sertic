import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: { // <- TEM que ser 'definition' (sem 'swaggerDefinition')
    openapi: "3.0.0",
    info: {
      title: "Ticket API - Express(NODE)",
      version: "1.0.0",
      description: "Documentação da API",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./src/Routes/**/*.ts"],
};

export default swaggerOptions;
