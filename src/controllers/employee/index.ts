import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Employees from '../../models/employee/index';
import Company from '../../models/company/index';
const router = express.Router();

//Register Employees
router.post('/employee/register', async (req: Request, res: Response) => {
    const {
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
            complement,
            city,
            state,
            uf,
        },
        security: {
            password,
            confirmPassword,
        },
        company: {
            cnpj,
        }
    } = req.body;
    //Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
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
            complement,
            city,
            state,
            uf,
        },
        security: {
            password: passwordHash,
            confirmPassword,
            accountCreateDate: now
        },
        company: {
            cnpj,
        }
    }
    if (!cpf) {
        return res.status(422).json({ error: 'O CPF é obrigatorio!' })
    }
    if (!firstName) {
        return res.status(422).json({ error: 'O Nome é obrigatorio!' })
    }
    if (!surname) {
        return res.status(422).json({ error: 'O sobre nome é obrigatorio!' })
    }

    if (!email) {
        return res.status(422).json({ error: 'O E-mail é obrigatorio!' })
    }
    if (!cnpj) {
        return res.status(422).json({ error: 'O CNPJ do responsavel é obrigatorio!' })
    }
    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatoria' })
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem!' })
    }
    // check if employees exists
    const cpfExists = await Employees.findOne({ 'info.cpf': cpf })
    if (cpfExists) {
        return res.status(422).json({ error: 'CPF já cadastrado!' })
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem!' })
    }
    try {
        const company = await Company.findOne({ 'info.cnpj': cnpj });
        await Employees.create(employees)
        res.status(201).json({
            message: 'Colaborador cadastrado com sucesso!',
            employees
        })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})
// Get - Employees ID
router.get('/employee/get-by-id/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const employee = await Employees.findOne({ _id: id })
        const company = await Company.findOne({ cnpj: employee.company.cnpj })
        if (!id) {
            res.status(422).json({ message: 'Colaborador não encontrado!' })
            return
        }
        res.status(200).json({
            employee,
            company
        })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})
// Get - Employees
router.get('/employee/get-all/', async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '5');
    const name = String(req.query.name || '');

    const nameFilter = name ? { firstName: { $regex: new RegExp(name, 'i') } } : {};

    const employees = await Employees.find(nameFilter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-accountcreatedate')
        .exec();

    const totalCount = await Employees.countDocuments(nameFilter);

    res.json({
        employees,
        totalCount
    });
})
router.patch('/employee/update-by-id/:id', async (req: Request, res: Response)=>{
    const id: string = req.params.id;
    const {
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
            complement,
            city,
            state,
            uf,
        }
    } = req.body;

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
            complement,
            city,
            state,
            uf,
        }
    };
    try {
        const updateEmployee = await Employees.updateOne({ _id: id }, employee);
        if (updateEmployee.matchedCount === 0) {
            res.status(422).json({ message: 'Colaborador não encontrado!' });
        }
        res.status(200).json({ message: 'Colaborador atualizado com sucesso!', employee });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
export default router;