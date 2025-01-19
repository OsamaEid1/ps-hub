import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        let { id } = req.query; 
        
        let {
            name,
            email,
            password,
            isActive,
            role,
            createdAt
        } = req.body;

        // Check if the required fields are present
        if (!id || !name || !email) {
            return res.status(400).json({ error: 'كل الخانات إجبارية!' });
        }

        
        try {
            let updatedUser;
            if (password) {
                // Update the user in the database
                updatedUser = await prisma.user.update({
                    where: { id: String(id) },  // Use the ID from the query
                    data: {
                        name,
                        email,
                        password,
                        isActive,
                        role,
                        createdAt
                    }
                });
            } else {
                // Update the user in the database
                updatedUser = await prisma.user.update({
                    where: { id: String(id) },  // Use the ID from the query
                    data: {
                        name,
                        email,
                        isActive,
                        role,
                        createdAt
                    }
                });
            }

            // Check if the update was successful
            if (!updatedUser) {
                return res.status(404).json({ error: 'لم يتم العثور على المستخدم!' });
            }

            res.status(200).json({ updatedUser });
        } catch (error: any) {
            console.error(Error("Error in using Prisma while trying update the user: ", error));
            res.status(500).json({ error: 'خطأ في السيرفر، حاول لاحقاً أو تواصل مع مدير النظام' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);  // Change to allow PUT method
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}