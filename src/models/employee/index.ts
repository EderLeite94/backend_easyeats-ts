import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployees {
    info: {
        cpf: string;
        firstName: string;
        surname: string;
        socialName?: string;
        dateOfBirth: Date;
        cellPhone?: string;
        role: string;
        email?: string;
        gender: string;
        salary: number;
        admissionDate?: Date;
        resignationDate?: Date;
        profilePicture?: string
    };
    address: {
        zipCode?: string;
        address?: string;
        locationNumber?: string;
        district?: string;
        city?: string;
        state?: string
    };
    security: {
        password: string;
        accountCreateDate: Date
    };
    company: {
        cnpj: string
    }
}
export type EmployeesDocument = IEmployees & Document;

const EmployeesSchema: Schema = new Schema(
    {
        info: {
            cpf: { type: String, required: true },
            firstName: { type: String, required: true },
            surname: { type: String, required: true },
            socialName: { type: String },
            dateOfBirth: { type: String, required: true },
            cellPhone: { type: String },
            role: { type: String, required: true },
            email: { type: String },
            gender: { type: String },
            salary: { type: Number },
            admissionDate: { type: Date, required: true },
            resignationDate: { type: Date },
            profilePicture: { type: String}
        },
        address: {
            zipCode: { type: String },
            address: { type: String },
            locationNumber: { type: String },
            district: { type: String },
            city: { type: String },
            state: { type: String },
        },
        security: {
            password: { type: String, required: true },
            accountCreateDate: { type: Date, required: true },
        },
        company: {
            cnpj: { type: String, required: true }
        }
    })
const Employees = mongoose.model<EmployeesDocument>('Employees', EmployeesSchema);

export default Employees;