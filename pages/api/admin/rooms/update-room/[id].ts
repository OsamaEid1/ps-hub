import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { EditableRoom, Room } from 'app/helpers/constants';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {  // Change to 'PUT' for updates
        let { id } = req.query; 
        
        let {
            name,
            contents,
            isActive,
            deActiveReason,
            isBooked,
            startTime,
            endTime,
            playingMode,
            costPerHourForSingle,
            costPerHourForMulti,
            maxFreeTime,
            notes,
            userId,
            openingInvoiceId
        } : Room = req.body;

        // Check if the required fields are present
        if (!id || !name || !contents?.length || !costPerHourForSingle || !costPerHourForMulti) {
            return res.status(400).json({ error: 'كل الخانات إجبارية ما عدا خانة اللاحظات!' });
        }
        
        // Convert costs to numbers
        costPerHourForSingle = Number(costPerHourForSingle);
        costPerHourForMulti = Number(costPerHourForMulti);
        maxFreeTime = Number(maxFreeTime);
        
        try {
            // Update the room in the database
            const updatedRoom = await prisma.room.update({
                where: { id: String(id) },  // Use the ID from the query
                data: {
                    name,
                    isBooked,
                    startTime,
                    endTime,
                    playingMode,
                    isActive,
                    deActiveReason,
                    contents,
                    costPerHourForSingle,
                    costPerHourForMulti,
                    maxFreeTime,
                    notes,
                    userId,
                    openingInvoiceId
                }
            });

            // Check if the update was successful
            if (!updatedRoom) {
                return res.status(404).json({ error: 'لم يتم العثور على الروم المحددة!' });
            }

            res.status(200).json({ updatedRoom });
        } catch (error: any) {
            console.error(Error("Error in using Prisma while trying update the room, ",error));
            res.status(500).json({ error: 'خطأ في السيرفر، حاول لاحقاً أو تواصل مع مدير النظام' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);  // Change to allow PUT method
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}