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
            return res.status(400).json({error : 'Invalid buffet item ID or user ID' });
        }

        await prisma.buffet.delete({
            where: {
                id: String(id),
                userId: String(userId),
            },
        });

        res.status(200).json({error : 'Buffet Item deleted successfully' });
        
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return res.status(404).json({error : 'Buffet Item not found or not owned by user' });
        }
        
        console.error('Failed to delete buffet item:', error);
        res.status(500).json({error : 'Internal server error' });
    }
}
