import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Admin } from 'app/helpers/constants';
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || 'e87ae886e49904ac30df7b0d6c934d70be9598420512a159cf2d43ccfba7effaa900e801b7';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        let {
            name,
            email,
            password,
            role,
            isActive
        } : Admin = req.body;
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'كل الخانات إجبارية !' });
        }

        
        try {
            // Hash the password with bcrypt before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt

            let newAdmin = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    isActive
                }
            });
            
            if (!newAdmin) {
                return res.status(401).json({ error: 'بيانات غير صالحة!' });
            }

            res.status(201).json({ newAdmin });
        } catch (error) {
            res.status(500).json({ error: 'خطأ في السيرفر، حاول لاحقاً أو تواصل مع مدير النظام' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}