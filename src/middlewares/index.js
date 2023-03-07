"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: process.env.ORIGIN_CLOUD || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
exports.default = corsOptions;
