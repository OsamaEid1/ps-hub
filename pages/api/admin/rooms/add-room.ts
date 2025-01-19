import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { EditableRoom } from 'app/helpers/constants';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        let {
            name,
            contents,
            isActive,
            deActiveReason,
            costPerHourForSingle,
            costPerHourForMulti,
            maxFreeTime,
            notes,
            userId
        } : EditableRoom = req.body;
        
        if (!name || !contents?.length || !costPerHourForSingle || !costPerHourForMulti) {
            return res.status(400).json({ error: 'كل الخانات إجبارية ما عدا خانة اللاحظات!' });
        }

        costPerHourForSingle = Number(costPerHourForSingle);
        costPerHourForMulti = Number(costPerHourForMulti);
        maxFreeTime = Number(maxFreeTime);

        try {
            let newRoom = await prisma.room.create({
                data: {
                    name,
                    isActive,
                    deActiveReason,
                    contents,
                    costPerHourForSingle,
                    costPerHourForMulti,
                    maxFreeTime,
                    notes,
                    userId
                }
            });
            
            if (!newRoom) {
                return res.status(401).json({ error: 'بيانات غير صالحة!' });
            }

            res.status(200).json({ newRoom });
        } catch (error: any) {
            if (error.code === "P2002") {
                console.error("A room with this name already exists.");
                res.status(500).json({ error: 'هناك روم بنفس الإسم، اختر اسماً آخر' });
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