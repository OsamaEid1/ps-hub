import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        method,
        query: { userId },
    } = req;
    
    if (method === 'GET') {
        try {
            // Fetch buffet related to the userId
            const buffet = await prisma.buffet.findMany({
                where: {
                    userId: String(userId),
                },
            });

            if (!buffet) {
                return res.status(404).json({error: "There is no buffet yet!"});
            }
            
            // Return the buffet data
            return res.status(200).json(buffet);
        } catch (error) {
            console.error("Error while fetching (buffet) table:", error);
            return res.status(500).json({ error: "حدث خطأ ما في السيرفر، أعد المحاولة لاحقاً" });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
