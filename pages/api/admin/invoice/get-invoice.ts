import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient(); 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, userId } = req.query;

    try {
        const invoice = await prisma.invoice.findFirst({
            where: {
                id: String(id),
                userId: String(userId),
            },
        });

        if (!invoice) {
            return res.status(404).json({ error: "هذه الفاتورة غير موجودة!", id });
        }

        return res.status(200).json(invoice);
    } catch (error) {
        console.error("Error Happened While Trying To Fetch Invoice Data, ", error)
        return res.status(500).json({ error: "حدث خطأ في السيرفر أثناء محاولة جلب الفاتورة، حاول ثانيةً أو راجع مدير النظام" });
    }
}
