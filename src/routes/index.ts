import companyRoutes from '../controllers/company/index';
import employeesRoutes from '../controllers/employee/index';
import express, { Application, Express } from 'express';
const app: Application = express();

export default function (app: Express) {
    app.use('/api/v2', companyRoutes);
    app.use('/api/v2', employeesRoutes);
}
