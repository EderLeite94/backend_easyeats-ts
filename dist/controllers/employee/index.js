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
    const { info: { cpf, firstName, surname, socialName, dateOfBirth, cellPhone, role, email, admissionDate }, address: { zipCode, address, locationNumber, district, city, state }, security: { password, confirmPassword, }, company: { cnpj, } } = req.body;
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
router.get('/employee/get-all/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '5');
    const name = String(req.query.name || '');
    const nameFilter = name ? { firstName: { $regex: new RegExp(name, 'i') } } : {};
    const employees = yield index_1.default.find(nameFilter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-accountcreatedate')
        .exec();
    const totalCount = yield index_1.default.countDocuments(nameFilter);
    res.json({
        employees,
        totalCount
    });
}));
router.patch('/employee/update-by-id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { info: { cpf, firstName, surname, socialName, dateOfBirth, cellPhone, role, email, admissionDate, resignationDate }, address: { zipCode, address, locationNumber, district, city, state } } = req.body;
    const employee = {
        info: {
            cpf,
            firstName,
            surname,
            socialName,
            dateOfBirth,
            cellPhone,
            role,
            email,
            admissionDate,
            resignationDate
        },
        address: {
            zipCode,
            address,
            locationNumber,
            district,
            city,
            state
        }
    };
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
