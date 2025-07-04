"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerOptions = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.swaggerOptions = {
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
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(exports.swaggerOptions);
