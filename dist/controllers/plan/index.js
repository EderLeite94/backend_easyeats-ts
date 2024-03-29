"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/company/index"));
const router = express_1.default.Router();
router.put('/plan/:id/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.params.id;
    const { plan } = req.body;
    const { id } = plan;
    try {
        const company = yield index_1.default.findById(companyId);
        if (!company) {
            return res.status(422).json({ message: 'Empresa não encontrada' });
        }
        yield company.updateOne({ plan });
        res.json({ message: 'Plano atualizado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.default = router;
