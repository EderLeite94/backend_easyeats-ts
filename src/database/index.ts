import mongoose from 'mongoose';
const port: number = parseInt(process.env.PORT || '3000');
const connectDatabase = (): Promise<void> => {
    console.info(`Aplicação rodando na porta ${port}`);
    console.log('Conectando ao banco de dados, aguarde!');
    mongoose.set('strictQuery', true);
    return mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Conectado ao Easy-Eats');
        })
        .catch((err) => console.log(err));
};

export default connectDatabase;
