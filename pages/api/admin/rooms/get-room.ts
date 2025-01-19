import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient(); // Ensure prisma is properly initialized

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, userId } = req.query;  /**** roomId and userId from the query string */

    try {
        const room = await prisma.room.findFirst({
            where: {
                id: String(id),
                userId: String(userId),
            },
        });

        return res.status(200).json(room);
    } catch (error) {
        console.error("Error Happened While Trying To Fetch Room Data, ", error)
        return res.status(500).json({ error: "حدث خطأ أثناء محاولة جلب الروم، حاول ثانيةً أو راجع مدير النظام" });
    }
}
