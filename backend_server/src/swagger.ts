import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ultimate Context API',
            version: '1.0.0',
            description: 'API for enriching IP addresses with geolocation, weather, currency, and security context.',
            contact: {
                name: 'API Support',
                url: 'http://localhost:3000',
            },
        },
        servers: [
            {
                url: 'http://localhost:4000/v1',
                description: 'Local Development Server',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
    },
    apis: ['./src/index.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
