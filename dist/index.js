"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./database/index"));
const index_2 = __importDefault(require("./controllers/company/index"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_3 = __importDefault(require("./middlewares/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '3000');
app.use(express_1.default.json());
//Cors
app.use((0, cors_1.default)(index_3.default));
//Conect database
(0, index_1.default)();
app.listen(port, () => {
    console.info(`Aplicação rodando em http://localhost:${port}`);
});
app.use('/api/v2', index_2.default);
