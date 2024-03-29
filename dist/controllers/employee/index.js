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
const index_1 = __importDefault(require("../../models/employee/index"));
const index_2 = __importDefault(require("../../models/company/index"));
const router = express_1.default.Router();
//Register Employees
router.post('/employee/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { info, address: addressInfo, security, company } = req.body;
    const { cpf, firstName, surname, socialName, dateOfBirth, cellPhone, role, email, admissionDate } = info;
    const { zipCode, address, locationNumber, district, city, state, } = addressInfo;
    const { password, confirmPassword } = security;
    const { cnpj } = company;
    //Create password
    const salt = yield bcrypt_1.default.genSalt(12);
    const passwordHash = yield bcrypt_1.default.hash(password, salt);
    //Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
    const employees = {
        info: {
            cpf,
            firstName,
            surname,
            socialName,
            dateOfBirth,
            cellPhone,
            role,
            email,
            admissionDate
        },
        address: {
            zipCode,
            address,
            locationNumber,
            district,
            city,
            state
        },
        security: {
            password: passwordHash,
            confirmPassword,
            accountCreateDate: now
        },
        company: {
            cnpj,
        }
    };
    if (!cpf) {
        return res.status(422).json({ error: 'O CPF é obrigatorio!' });
    }
    if (!firstName) {
        return res.status(422).json({ error: 'O Nome é obrigatorio!' });
    }
    if (!surname) {
        return res.status(422).json({ error: 'O sobre nome é obrigatorio!' });
    }
    if (!email) {
        return res.status(422).json({ error: 'O E-mail é obrigatorio!' });
    }
    if (!cnpj) {
        return res.status(422).json({ error: 'O CNPJ do responsavel é obrigatorio!' });
    }
    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatoria' });
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem!' });
    }
    // check if employees exists
    const cpfExists = yield index_1.default.findOne({ 'info.cpf': cpf });
    if (cpfExists) {
        return res.status(422).json({ error: 'CPF já cadastrado!' });
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem!' });
    }
    try {
        const company = yield index_2.default.findOne({ 'info.cnpj': cnpj });
        yield index_1.default.create(employees);
        res.status(201).json({
            message: 'Colaborador cadastrado com sucesso!',
            employees
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
// Get - Employees ID
router.get('/employee/get-by-id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const employee = yield index_1.default.findOne({ _id: id });
        const company = yield index_2.default.findOne({ cnpj: employee.company.cnpj });
        if (!id) {
            res.status(422).json({ message: 'Colaborador não encontrado!' });
            return;
        }
        res.status(200).json({
            employee,
            company
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
// Get - Employees
router.get('/employee/get-all/:companyCNPJ/:name?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyCNPJ } = req.params;
    const page = req.query.page || '1';
    const limit = req.query.limit || '5';
    const name = req.query.name || '';
    const companyFilter = companyCNPJ ? { 'company.cnpj': { $regex: new RegExp(companyCNPJ, 'i') } } : {};
    const nameFilter = name ? { 'info.firstName': { $regex: new RegExp(name, 'i') } } : {};
    try {
        const employees = yield index_1.default.find(Object.assign(Object.assign({}, nameFilter), companyFilter))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort('-accountcreatedate')
            .exec();
        const totalCount = yield index_1.default.countDocuments(Object.assign({}, companyFilter));
        const totalCountFiltered = yield index_1.default.countDocuments(Object.assign({}, nameFilter));
        res.json({
            employees,
            totalCount,
            totalCountFiltered
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Colaborador não encontrado!' });
    }
}));
//Update employee 
router.patch('/employee/update-by-id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { info, address: addressInfo } = req.body;
    const { cpf, firstName, surname, socialName, dateOfBirth, cellPhone, role, email, admissionDate, resignationDate } = info;
    const { zipCode, address, locationNumber, district, city, state } = addressInfo;
    const employee = { info, address };
    try {
        const updateEmployee = yield index_1.default.updateOne({ _id: id }, employee);
        if (updateEmployee.matchedCount === 0) {
            res.status(422).json({ message: 'Colaborador não encontrado!' });
        }
        res.status(200).json({ message: 'Colaborador atualizado com sucesso!', employee });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.default = router;
