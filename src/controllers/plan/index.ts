import express, { Request, Response } from 'express';
import Company from '../../models/company/index';
import { ICompany } from '../../models/company/index';
const router = express.Router();

router.put('/plan/:id/', async (req: Request, res: Response) => {
    const companyId = req.params.id;
    const { plan } = req.body;
    const { id } = plan    
    
    try {
        const company: ICompany | null = await Company.findById(companyId);
        if (!company) {
            return res.status(422).json({ message: 'Empresa não encontrada' });
        }
        await company.updateOne({ plan });
        res.json({ message: 'Plano atualizado com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})
export default router;