"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const port = parseInt(process.env.PORT || '3000');
const connectDatabase = () => {
    console.info(`Aplicação rodando na porta ${port}`);
    console.log('Conectando ao banco de dados, aguarde!');
    mongoose_1.default.set('strictQuery', true);
    return mongoose_1.default.connect(process.env.MONGODB_URI)
        .then(() => {
        console.log('Conectado ao Easy-Eats');
    })
        .catch((err) => console.log(err));
};
exports.default = connectDatabase;
