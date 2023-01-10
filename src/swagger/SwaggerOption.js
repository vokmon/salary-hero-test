const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Salary Hero Code Challenge API Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger for Salary Hero Code Challenge API Swagger",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type:   'http',
          scheme: 'basic'
        }
      }
    }
  },
  security: [ { basicAuth: [] } ],
  apis: ["./src/routes/*.js"],
};

export default options;