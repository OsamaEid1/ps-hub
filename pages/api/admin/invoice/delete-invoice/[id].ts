import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { id } = req.query;
        const { userId, totalPlayingPrice, totalBuffetPrice, date } = req.body;

        if (!id || !userId || !date || totalPlayingPrice === undefined || totalBuffetPrice === undefined) {
            console.error("Missing required parameters");
            return res.status(400).json({ error: "Missing required parameters" });
        }

        // Parse the date to ensure proper comparison
        const parsedDate = new Date(date);

        await prisma.$transaction(async (prismaTransaction) => {
            // Find the income record within the specified date range
            const incomeRecord = await prismaTransaction.income.findFirst({
                where: {
                    userId: String(userId),
                    periodStart: { lte: parsedDate },
                    periodEnd: { gte: parsedDate },
                },
            });

            if (incomeRecord) {
                // Update the income record by decrementing the values
                await prismaTransaction.income.update({
                    where: { id: incomeRecord.id, userId: String(userId)},
                    data: {
                        playingIncome: {
                            decrement: totalPlayingPrice
                        },
                        buffetIncome: {
                            decrement: totalBuffetPrice
                        },
                        totalIncome: {
                            decrement: totalPlayingPrice + totalBuffetPrice
                        }
                    },
                });
            } else {
                console.warn("No income record found for the specified date range");
            }

            // Delete the invoice
            await prismaTransaction.invoice.delete({
                where: {
                    id: String(id),
                    userId: String(userId),
                },
            });
        });

        return res.status(200).json({ message: "Invoice deleted successfully and income record updated" });

    } catch (error: any) {
        if (error?.code === "P2025") {
            return res.status(404).json({ error: "Invoice item not found or not owned by user" });
        }

        console.error("Failed to process the request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
