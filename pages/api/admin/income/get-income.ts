import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { userId, all, startDate, endDate} = req.query;

            // Case 1: Return all records
            if (all === "true") {
                const allRecords = await prisma.income.findMany({
                    where: { userId: String(userId) },
                    orderBy: { createdAt: "desc" }
                });

                // Calculate total aggregates for all records
                const aggregates = await prisma.income.aggregate({
                    where: { userId: String(userId) },
                    _sum: {
                        playingIncome: true,
                        buffetIncome: true,
                        totalIncome: true,
                    },
                });

                return res.status(200).json({
                    records: allRecords,
                    summary: {
                        playingIncome: aggregates._sum.playingIncome || 0,
                        buffetIncome: aggregates._sum.buffetIncome || 0,
                        totalIncome: aggregates._sum.totalIncome || 0,
                    },
                });
            }

            // Case 2: Custom date range
            if (startDate && endDate) {
                const start = new Date(startDate as string);
                const end = new Date(endDate as string);

                const customRecords = await prisma.income.findMany({
                    where: {
                        userId: String(userId),
                        OR: [
                            { periodStart: { gte: start, lte: end } },        // periodStart between startDate and endDate
                            { periodEnd: { gte: start, lte: end } },          // periodEnd between startDate and endDate
                        ],
                    },
                });
                
                // Calculate total aggregates for custom date range
                const aggregates = await prisma.income.aggregate({
                    where: { 
                        userId: String(userId),
                        OR: [
                            { periodStart: { gte: start, lte: end } },        // periodStart between startDate and endDate
                            { periodEnd: { gte: start, lte: end } },          // periodEnd between startDate and endDate
                        ],
                    },
                    _sum: {
                        playingIncome: true,
                        buffetIncome: true,
                        totalIncome: true,
                    },
                });

                return res.status(200).json({
                    records: customRecords,
                    summary: {
                        playingIncome: aggregates._sum.playingIncome || 0,
                        buffetIncome: aggregates._sum.buffetIncome || 0,
                        totalIncome: aggregates._sum.totalIncome || 0,
                    },
                });
            }

            // Case 3: Default behavior (last 30 records)
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);

            const recentRecords = await prisma.income.findMany({
                where: {
                    userId: String(userId),
                    periodStart: { gte: last30Days },
                },
                orderBy: { periodStart: "asc" },
                take: 30, // Fetch only the last 30 records
            });
            

            return res.status(200).json({
                records: recentRecords,
                summary: {
                    playingIncome: recentRecords.reduce((sum, record) => sum + record.playingIncome, 0),
                    buffetIncome: recentRecords.reduce((sum, record) => sum + record.buffetIncome, 0),
                    totalIncome: recentRecords.reduce((sum, record) => sum + record.totalIncome, 0),
                },
            });
        } catch (error) {
            console.error("Error retrieving income data:", error);
            res.status(500).json({ error: "Failed to retrieve income data." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}