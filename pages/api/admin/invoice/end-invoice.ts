import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') 
        return res.status(405).json({ error: 'Method not allowed. Use PUT.' });

    const { invoiceId, totalSpentHours, totalSpentMins, totalPlayingPrice, totalBuffetPrice, totalPrice, roomId, userId } = req.body;

    if (!invoiceId || !roomId || !userId) {
        console.error('Missing required fields: ', invoiceId, totalSpentHours, totalSpentMins, totalPlayingPrice, totalBuffetPrice, totalPrice, roomId, userId)
        return res.status(400).json({ error: 'Missing required fields'});
    }

    // Get today's date for the income period
    const today = new Date();
    const periodStart = new Date(today.setHours(0, 0, 0, 0)); // Start of the day (midnight)
    const periodEnd = new Date(today.setHours(23, 59, 59, 999)); // End of the day (just before midnight)

    try {
        const [updatedInvoice, updatedRoom, updatedIncome] = await prisma.$transaction([ 
            // Update the invoice
            prisma.invoice.update({
                where: {
                    id: String(invoiceId),
                    userId: String(userId),
                },
                data: {
                    totalSpentHours,
                    totalSpentMins,
                    totalPlayingPrice,
                    totalPrice,
                },
            }),
            
            // Close the room
            prisma.room.update({
                where: {
                    id: String(roomId),
                    userId: String(userId),
                },
                data: {
                    isBooked: false,
                    startTime: null,
                    endTime: null,
                    playingMode: null,
                    openingInvoiceId: null,
                },
            }),

            /*** */ // Check if there's an existing income record for today and update or create a new one
            prisma.income.upsert({
                where: {
                    userId_periodStart_periodEnd: {
                        userId: String(userId),
                        periodStart: periodStart,
                        periodEnd: periodEnd,
                    },
                },
                update: {
                    // Increment the income for today
                    playingIncome: {
                        increment: totalPlayingPrice,
                    },
                    buffetIncome: {
                        increment: totalBuffetPrice,
                    },
                    totalIncome: {
                        increment: totalPrice,
                    },
                },
                create: {
                    userId: String(userId),
                    periodStart: periodStart,
                    periodEnd: periodEnd,
                    playingIncome: totalPlayingPrice,
                    buffetIncome: totalBuffetPrice,
                    totalIncome: totalPrice,
                },
            })
        ]);

        res.status(200).json({
            updatedInvoice,
            updatedRoom,
            updatedIncome,
            message: 'Invoice, Room, and Income updated successfully.',
        });
    } catch (error) {
        console.error('Error while trying to Update Invoice, Room, or Income: ', error);
        res.status(500).json({ error });
    } finally {
        await prisma.$disconnect();
    }
}
