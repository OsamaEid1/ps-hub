import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, password } = req.body;

        if (!userId && !password) {
            return res.status(400).json({ error: 'برجاء كلمة السر' });
        }

        try {
            // Fetch user from the database
            let user = await prisma.user.findUnique({
                where: { 
                    id: String(userId)
                },
            });
            
            if (!user) 
                return res.status(401).json({ error: 'حدث خطأ ما، أعد تحميل الصفحة أو أعد تسجيل الدخول' });
            
            // Verify the password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'خطأ في كلمة السر، أعد المحاولة' });
            }

            res.status(200).json({ valid: 'true' });
        } catch (error) {
            console.error("Something happened while checking the user password! ", error)
            res.status(500).json({ error: 'حدث خطأ ما، حاول ثانيةً أو راجع مدير النظام!' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}