"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CompanySchema = new mongoose_1.Schema({
    info: {
        cnpj: { type: String, required: true, validate: /\d{14}/ },
        fantasyName: { type: String, required: true },
        email: { type: String, required: true },
        cellPhone: { type: String },
        companyName: { type: String }
    },
    address: {
        zipCode: { type: String },
        address: { type: String },
        locationNumber: { type: String },
        district: { type: String },
        city: { type: String },
        state: { type: String },
    },
    owner: {
        firstName: { type: String },
        surname: { type: String },
        cpf: { type: String },
        role: { type: String }
    },
    security: {
        password: { type: String, required: true },
        accountCreateDate: { type: Date, required: true },
    },
    rating: {
        howRatedUs: { type: Number }
    },
    plan: {
        id: { type: Number }
    }
});
const Company = mongoose_1.default.model('Company', CompanySchema);
exports.default = Company;
