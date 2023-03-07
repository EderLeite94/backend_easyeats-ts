import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany {
  updateOne(arg0: { rating: number; }): unknown;
  info: {
    _id: any;
    cnpj: string;
    fantasyName: string;
    email: string;
    cellPhone?: string;
    nameCorporate?: string;
  }
  address: {
    zipCode?: string;
    address?: string;
    locationNumber?: string;
    complement?: string;
    city?: string;
    state?: string;
    uf?: string;
  };
  owner: {
    firstName?: string;
    surname?: string;
    cpf?: string;
    role?: string;
  };
  security: {
    password: string;
    accountCreateDate: Date
  };
  rating: {
    howRatedUs: number
  }
}

export type CompanyDocument = ICompany & Document;

const CompanySchema: Schema = new Schema(
  {
    info: {
      cnpj: { type: String, required: true, unique: true },
      fantasyName: { type: String, required: true },
      email: { type: String, required: true },
      cellPhone: { type: String },
      nameCorporate: { type: String }
    },
    address: {
      zipCode: { type: String },
      address: { type: String },
      locationNumber: { type: String },
      complement: { type: String },
      city: { type: String },
      state: { type: String },
      uf: { type: String }
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
      howRatedUs: { type: Number, default: 0 }
    }
  },
);

export interface ICompanyWithId extends ICompany {
  _id: string;
}

const Company = mongoose.model<CompanyDocument>('Company', CompanySchema);

export default Company;
