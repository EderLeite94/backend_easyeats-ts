import connectDatabase from './database/index'
import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index';
import corsMiddleware from './middlewares/index';
dotenv.config();
const app = express();
const port: number = parseInt(process.env.PORT || '3000');

app.use(express.json());
//Cors
app.use(corsMiddleware());
//Conect database
connectDatabase();
//Routes
routes(app)
app.listen(port, () => {
  console.info(`Aplicação rodando na porta ${port}`);
});


