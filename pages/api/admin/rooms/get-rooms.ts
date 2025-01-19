import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        method,
        query: { userId }, // Extract userId from query parameters
    } = req;

    if (method === 'GET') {
        try {
            // Fetch rooms related to the userId
            const rooms = await prisma.room.findMany({
                where: {
                    userId: String(userId),
                },
            });

            if (!rooms.length) {
                return res.status(404).json({error : '!ليس لديك أي رومات بعد' });
            }

            // Return the rooms data
            return res.status(200).json(rooms);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            return res.status(500).json({error : 'خطأ في السيرفر، حاول لاحقاً أو تواصل مع مدير النظام' });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
}