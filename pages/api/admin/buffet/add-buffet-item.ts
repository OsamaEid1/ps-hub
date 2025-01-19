import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Buffet, EditableRoom } from 'app/helpers/constants';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        let {
            name,
            price,
            discountedPrice,
            stock,
            userId
        } = req.body;
        
        if (!name || !price || !discountedPrice) {
                return res.status(400).json({ error: 'كل الخانات إجبارية!' });
        }

        price = Number(price);
        discountedPrice = Number(discountedPrice);
        stock = Number(stock);
        try {
            // Fetch newBuffetItem from the database
            let newBuffetItem = await prisma.buffet.create({
                data: {
                    name,
                    price,
                    discountedPrice,
                    stock,
                    userId
                }
            });
            
            if (!newBuffetItem) {
                return res.status(401);
            }

            res.status(200).json({ newBuffetItem });
        } catch (error: any) {
            if (error.code === "P2002") {
                console.error("A buffet item with this name already exists.");
                res.status(500).json({ error: 'هناك عنصر بنفس الإسم، اختر اسماً آخر' });
            } else {
                console.error("An unexpected error occurred:", error);
                res.status(500).json({ error: 'حدث خطأ أثناء إدخال البيانات، أعد إدخال البيانات بطريقة صحيحة أو تواصل مع مدير النظام' });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}