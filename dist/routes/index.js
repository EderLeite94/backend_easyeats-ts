"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../controllers/company/index"));
const index_2 = __importDefault(require("../controllers/employee/index"));
const index_3 = __importDefault(require("../controllers/plan/index"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
function default_1(app) {
    app.use('/api/v2', index_1.default);
    app.use('/api/v2', index_2.default);
    app.use('/api/v2', index_3.default);
}
exports.default = default_1;
