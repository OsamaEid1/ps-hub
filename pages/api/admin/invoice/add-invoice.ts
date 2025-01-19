import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Invoice } from 'app/helpers/constants';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        let {
            customerName,
            roomName,
            playingMode,
            totalSpentHours,
            totalSpentMins,
            totalBuffetTaken,
            totalPlayingPrice,
            totalBuffetPrice,
            totalPrice,
            userId
        } : Invoice = req.body;
        
        if (!customerName || !roomName || !playingMode || !userId) {
            return res.status(400).json({ error: 'كل الخانات إجبارية!' });
        }
        
        try {
            // Create new Invoice from the database
            let newInvoice = await prisma.invoice.create({
                data: {
                    customerName,
                    roomName,
                    playingMode,
                    totalSpentHours: +totalSpentHours,
                    totalSpentMins: +totalSpentMins,
                    totalBuffetTaken,
                    totalPlayingPrice,
                    totalBuffetPrice,
                    totalPrice: +totalPrice,
                    userId
                }
            });
            
            if (!newInvoice) {
                return res.status(401).json({ error: 'بيانات غير صالحة!' });
            }

            res.status(200).json({ newInvoice });
        } catch (error: any) {
            console.error(Error(error));
            res.status(500).json({ error: 'خطأ أثناء إدخال البيانات، أعد إدخال البيانات بطريقة صحيحة أو تواصل مع مدير النظام' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}