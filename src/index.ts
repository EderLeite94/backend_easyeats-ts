import connectDatabase from './database/index'
import companyRoutes from './controllers/company/index';
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import corsOptions from './middlewares/index';
dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '3000');

app.use(express.json());
//Cors
app.use(cors());

//Conect database
connectDatabase();

app.listen(port, () => {
  console.info(`Aplicação rodando em http://localhost:${port}`);
});

app.use('/api/v2', companyRoutes);

