const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

// Determine the protocol based on the environment
const protocol = isProduction ? 'https' : 'http';

// Construct the URL based on the environment
const url = `${protocol}://${process.env.DB_HOST}:${process.env.APP_PORT}/api/v1`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Description of your API',
    },
    servers: [
      {
        url: url,
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            in: 'header',
            name: 'Authorization',
            description: 'Bearer token to access these api endpoints',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],    
  },
  apis: [path.join(__dirname, '../routes/**/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
