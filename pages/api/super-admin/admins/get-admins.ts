import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Fetch all admins data
            const admins = await prisma.user.findMany({
                where: { role: "ADMIN" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isActive: true,
                    createdAt: true
                },
            });

            // Aggregate counts for active and inactive admins
            const activeAdminsCount = await prisma.user.count({
                where: { role: "ADMIN", isActive: true },
            });

            const inactiveAdminsCount = await prisma.user.count({
                where: { role: "ADMIN", isActive: false },
            });

            res.status(200).json({
                admins,
                activeAdminsCount,
                inactiveAdminsCount,
            });
        } catch (error) {
            console.error('Error fetching admins data:', error);
            res.status(500).json({ error: 'خطأ في السيرفر، حاول لاحقاً أو تواصل مع مدير النظام' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}