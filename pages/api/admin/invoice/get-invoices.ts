import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient(); 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    try {
        const invoices = await prisma.invoice.findMany({
            where: {
                userId: String(userId),
            },
        });

        if (!invoices) {
            console.error('There is no any invoices for user: ', userId)
            return res.status(404).json({ error: "لا توجد أي فواتير بعد!" });
        }

        return res.status(200).json(invoices);
    } catch (error) {
        console.error("Error Happened While Trying To Fetch Invoice Data, ", error)
        return res.status(500).json({ error: "حدث خطأ في السيرفر أثناء محاولة جلب الفواتير حاول ثانيةً أو راجع مدير النظام" });
    }
}
