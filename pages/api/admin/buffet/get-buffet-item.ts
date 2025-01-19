import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient(); // Ensure prisma is properly initialized

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, userId } = req.query;

    try {
        const item = await prisma.buffet.findFirst({
            where: {
                id: String(id),
                userId: String(userId),
            },
        });

        if (!item) {
            throw `Can't find the item with this id ${id}`;
        }

        return res.status(200).json(item);
    } catch (error) {
        console.error("Error Happened While Trying To Fetch Room Data, ", error)
        return res.status(500).json(error);
    }
}
