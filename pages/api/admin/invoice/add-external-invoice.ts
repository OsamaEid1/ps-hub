import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') 
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });

    const {
        roomName,
        customerName,
        playingMode,
        totalSpentHours,
        totalSpentMins,
        totalBuffetTaken,
        totalPlayingPrice,
        totalBuffetPrice,
        totalPrice,
        userId,
    } = req.body;

    // // Validate required fields
    // if (!roomName || !customerName || !playingMode || !userId) {
    //     console.error('Missing required fields: ', { roomName, customerName, playingMode, userId });
    //     return res.status(400).json({ error: 'Missing required fields' });
    // }

    // Get today's date for the income period
    const today = new Date();
    // Create the start and end time in the local timezone
    const periodStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const periodEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    // Combine repeated items in `totalBuffetTaken`
    const soldBuffetItems: { name: string; qty: number }[] = [];
    totalBuffetTaken.forEach((item: { name: string; qty: number; price: number }) => {
        const existingItem = soldBuffetItems.find((buffetItem) => buffetItem.name === item.name);
        if (existingItem) {
            existingItem.qty += item.qty; // Increment the quantity
        } else {
            soldBuffetItems.push({ name: item.name, qty: item.qty });
        }
    });

    try {
        const [newInvoice, updatedIncome] = await prisma.$transaction([
            // Create a new invoice
            prisma.invoice.create({
                data: {
                    roomName,
                    customerName,
                    playingMode,
                    totalSpentHours,
                    totalSpentMins,
                    totalBuffetTaken,
                    totalPlayingPrice,
                    totalBuffetPrice,
                    totalPrice,
                    userId: String(userId),
                },
            }),

            // Update or create today's income record
            prisma.income.upsert({
                where: {
                    userId_periodStart_periodEnd: {
                        userId: String(userId),
                        periodStart: periodStart,
                        periodEnd: periodEnd,
                    },
                },
                update: {
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
            }),

            // Decrease the stock for the buffet items
            ...soldBuffetItems.map((item) =>
                prisma.buffet.update({
                    where: {
                        name: item.name, // Assuming name is unique; adjust if using an ID
                    },
                    data: {
                        stock: {
                            decrement: item.qty, // Reduce the stock by the sold quantity
                        },
                    },
                })
            ),
        ]);

        res.status(201).json({
            newInvoice,
            updatedIncome,
            message: 'New Invoice created, stock updated, and Income recorded successfully.',
        });
    } catch (error) {
        console.error('Error while trying to create External Invoice, update stock, or record Income: ', error);
        res.status(500).json({ error: 'حدث خطأ ما، أعد المحاولة وإدخال البيانات بطريقة صحيحة'});
    } finally {
        await prisma.$disconnect();
    }
};