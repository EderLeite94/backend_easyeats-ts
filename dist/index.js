"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./database/index"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const index_2 = __importDefault(require("./routes/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '3000');
app.use(express_1.default.json());
//Cors
app.use((0, cors_1.default)());
//Conect database
(0, index_1.default)();
//Routes
(0, index_2.default)(app);
app.listen(port, () => {
    console.info(`Aplicação rodando na porta ${port}`);
});
