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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../../models/company/index"));
const router = express_1.default.Router();
// Register company
router.post('/auth/company/sign-up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { info: { cnpj, fantasyName, email, }, security: { password, confirmPassword } } = req.body;
    // create password
    const salt = yield bcrypt_1.default.genSalt(12);
    const passwordHash = yield bcrypt_1.default.hash(password, salt);
    // Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
    if (!cnpj) {
        return res.status(422).json({ error: 'O CNPJ é obrigatório!' });
    }
    if (!fantasyName) {
        return res.status(422).json({ error: 'O Nome da empresa é obrigatório!' });
    }
    if (!email) {
        return res.status(422).json({ error: 'O E-mail é obrigatório!' });
    }
    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatória!' });
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem!' });
    }
    // check if company exists
    const cnpjExists = yield index_1.default.findOne({ 'info.cnpj': cnpj });
    if (cnpjExists !== null) {
        return res.status(422).json({ error: 'CNPJ já cadastrado!' });
    }
    const company = {
        info: {
            cnpj,
            fantasyName,
            email
        },
        security: {
            password: passwordHash,
            accountCreateDate: now
        }
    };
    try {
        yield index_1.default.create(company);
        res.status(201).json({
            message: 'Empresa cadastrada com sucesso!',
            company,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Read - Company
router.get('/listcompany', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield index_1.default.find();
        res.status(200).json(company);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// Get - Company ID
router.get('/listcompany/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const company = yield index_1.default.findOne({ _id: id });
        if (!company) {
            res.status(422).json({ message: 'Empresa não cadastrada!' });
            return;
        }
        res.status(200).json(company);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
//Login Company
router.post('/auth/company/sign-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { info: { cnpj }, security: { password } } = req.body;
    if (!cnpj) {
        return res.status(422).json({ message: ' O CNPJ é obrigatorio!' });
    }
    if (!password) {
        return res.status(422).json({ message: 'A senha é obrigatoria!' });
    }
    //check if company exists
    const company = yield index_1.default.findOne({ 'info.cnpj': cnpj });
    if (!company) {
        return res.status(404).json({ message: 'Empresa não encontrada!' });
    }
    //check if password match
    const checkPassword = yield bcrypt_1.default.compare(password, company.security.password);
    if (!checkPassword) {
        return res.status(422).json({ message: 'Senha invalida!' });
    }
    try {
        const secret = process.env.SECRET;
        const token = jsonwebtoken_1.default.sign({
            id: company.info._id,
        }, secret || '');
        res.status(200).json({
            message: 'Autenticação realizada com sucesso',
            token,
            company
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
}));
// Update - Company ID other information
router.patch('/company/update-by-id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { info, address: addressInfo, owner } = req.body;
    const { cnpj, fantasyName, email, cellPhone, companyName } = info;
    const { zipCode, address, locationNumber, district, city, state } = addressInfo;
    const { firstName, surname, cpf, role } = owner;
    try {
        const updateCompany = yield index_1.default.updateOne({ _id: id }, req.body);
        const company = yield index_1.default.find(Object.assign({}, req.body));
        if (updateCompany.matchedCount === 0) {
            res.status(422).json({ message: 'A empresa não foi encontrada!' });
        }
        res.status(200).json({ message: 'Empresa atualizada com sucesso!', company });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
router.put('/rate-us/:id/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.params.id;
    const { rating: { howRatedUs } } = req.body;
    const company = yield index_1.default.findById(companyId);
    if (!company) {
        return res.status(422).json({ message: 'Empresa não encontrada' });
    }
    if (howRatedUs < 1 || howRatedUs > 5) {
        return res.status(422).json({ message: 'A avaliação deve estar entre 1 e 5' });
    }
    try {
        yield company.updateOne({ rating: howRatedUs });
        res.json({ message: 'Avaliação atualizada com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.default = router;
