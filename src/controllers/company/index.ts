import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Company from '../../models/company/index';
import { ICompany } from '../../models/company/index';
const router = express.Router();

// Register company
router.post('/auth/company/sign-up', async (req: Request, res: Response) => {
    const {
        info: {
            cnpj,
            fantasyName,
            email,
        },
        security: {
            password,
            confirmPassword
        }
    } = req.body;
    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));

    if (!cnpj) {
        return res.status(422).json({ error: 'O CNPJ é obrigatório!' });
    }

    if (!fantasyName) {
        return res.status(422).json({ error: 'O Nome da empresa é obrigatório!' });
    }

    if (!email) {
        return res.status(422).json({ error: 'O E-mail é obrigatório!' });
    }

    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatória!' });
    }

    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem!' });
    }

    // check if company exists
    const cnpjExists = await Company.findOne({ 'info.cnpj': cnpj });
    if (cnpjExists !== null) {
        return res.status(422).json({ error: 'CNPJ já cadastrado!' });
    }
    const company = {
        info: {
            cnpj,
            fantasyName,
            email
        },
        security: {
            password: passwordHash,
            accountCreateDate: now
        }
    };
    try {
        await Company.create(company);

        res.status(201).json({
            message: 'Empresa cadastrada com sucesso!',
            company,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Read - Company
router.get('/listcompany', async (req: Request, res: Response) => {
    try {
        const company = await Company.find();
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get - Company ID
router.get('/listcompany/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const company = await Company.findOne({ _id: id });

        if (!company) {
            res.status(422).json({ message: 'Empresa não cadastrada!' });
            return;
        }

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Login Company
router.post('/auth/company/sign-in', async (req: Request, res: Response) => {
    const {
        info: {
            cnpj
        },
        security: {
            password
        }
    } = req.body;

    if (!cnpj) {
        return res.status(422).json({ message: ' O CNPJ é obrigatorio!' });
    }
    if (!password) {
        return res.status(422).json({ message: 'A senha é obrigatoria!' });
    }
    //check if company exists
    const company: ICompany | null = await Company.findOne({ 'info.cnpj': cnpj });

    if (!company) {
        return res.status(404).json({ message: 'Empresa não encontrada!' });
    }
    //check if password match
    const checkPassword: boolean = await bcrypt.compare(password, company.security.password)
    if (!checkPassword) {
        return res.status(422).json({ message: 'Senha invalida!' });
    }
    try {
        const secret: string | undefined = process.env.SECRET;
        const token: string = jwt.sign({
            id: company.info._id,
        },
            secret || '',
        );
        res.status(200).json({
            message: 'Autenticação realizada com sucesso',
            token,
            company
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
});

// Update - Company ID other information
router.patch('/company/update-by-id/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { info, address: addressInfo, owner } = req.body;
    const { cnpj, fantasyName, email, cellPhone, companyName } = info;
    const { zipCode, address, locationNumber, district, city, state } = addressInfo;
    const { firstName, surname, cpf, role }= owner;

    try {
        const updateCompany = await Company.updateOne({ _id: id }, req.body);
        const company = await Company.find({ _id: id  })[0];
        if (updateCompany.matchedCount === 0) {
            res.status(422).json({ message: 'A empresa não foi encontrada!' });
        }
        res.status(200).json({ message: 'Empresa atualizada com sucesso!', company });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.put('/rate-us/:id/', async (req: Request, res: Response) => {
    const companyId = req.params.id;
    const { rating: { howRatedUs } } = req.body;
    const company: ICompany | null = await Company.findById(companyId);

    if (!company) {
        return res.status(422).json({ message: 'Empresa não encontrada' });
    }
    if (howRatedUs < 1 || howRatedUs > 5) {
        return res.status(422).json({ message: 'A avaliação deve estar entre 1 e 5' });
    }

    try {
        await company.updateOne({ rating: howRatedUs });
        res.json({ message: 'Avaliação atualizada com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})
export default router;
