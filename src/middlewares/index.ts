import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
const app = express();

const corsOptions = () => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X_BPI_CONTEXT');
    app.use(cors());
    next();
  });
};

export default corsOptions;
