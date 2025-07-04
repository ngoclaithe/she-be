import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SheTech Expense Management API',
      version: '1.0.0',
      description: 'API documentation for SheTech backend',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Đường dẫn tới các file có swagger comment
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);