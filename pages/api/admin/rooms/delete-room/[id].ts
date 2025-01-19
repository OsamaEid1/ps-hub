import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({error : 'Method not allowed' });
    }

    try {
        const { id } = req.query;
        const { userId } = req.body;

        if (!id || !userId) {
            return res.status(400).json({error : 'Invalid room ID or user ID' });
        }

        await prisma.room.delete({
            where: {
                id: String(id),
                userId: String(userId),
            },
        });

        res.status(200).json({message : 'Room deleted successfully' });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return res.status(404).json({error : 'Room not found or not owned by user' });
        }
        
        console.error('Failed to delete room:', error);
        res.status(500).json({error : 'Internal server error' });
    }
}
