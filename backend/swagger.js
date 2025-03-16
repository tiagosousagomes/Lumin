const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const dotenv = require('dotenv')


dotenv.config()
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentação da API Lumin",
      contact: {
        name: "Developer",
      },
    },
    servers: [
      {
        url: process.env.URL_SWAGGER // URL do seu servidor principal
      },
    ],
  },
  apis: ["./docs/*.yaml"], // Caminho para os arquivos .yaml
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = {swaggerUi, specs}
