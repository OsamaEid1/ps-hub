import { PrismaClient } from '@prisma/client';
import { BuffetItem } from 'app/helpers/constants';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { name, price, itemQty, userId } = req.body;
        const { invoiceId, add } = req.query;

        // Check if the required fields are present
        if (!invoiceId || !name || !price || !itemQty || !userId) {
            console.error("هناك بيانات ناقصة", name, price, itemQty, userId);
            return res.status(400).json({ error: "حدث خطأ ما، حاول ثانيةً!" });
        }

        try {
            const result = await prisma.$transaction(async (prisma) => {
                const existingInvoice = await prisma.invoice.findUnique({
                    where: {
                        id: String(invoiceId),
                        userId: String(userId),
                    },
                    select: {
                        totalBuffetTaken: true,
                        totalBuffetPrice: true,
                    },
                });

                if (!existingInvoice) {
                    throw new Error("الفاتورة غير موجودة!");
                }

                const totalBuffetTaken = Array.isArray(existingInvoice.totalBuffetTaken)
                    ? (existingInvoice.totalBuffetTaken as BuffetItem[])
                    : [];

                let updatedBuffetTaken: BuffetItem[] = [];
                let updatedTotalBuffetPrice = 0;

                if (add == 'true') {
                    // Add the buffet item
                    updatedBuffetTaken = [
                        ...totalBuffetTaken,
                        { name, price, qty: itemQty },
                    ];
                    updatedTotalBuffetPrice =
                        (existingInvoice.totalBuffetPrice || 0) + price * itemQty;

                    // Decrease the stock
                    const updatedBuffetItem = await prisma.buffet.update({
                        where: {
                            name: name,
                            userId: String(userId),
                        },
                        data: {
                            stock: {
                                decrement: itemQty,
                            },
                        },
                    });

                    // Update the invoice
                    const updatedInvoice = await prisma.invoice.update({
                        where: {
                            id: String(invoiceId),
                            userId: String(userId),
                        },
                        data: {
                            totalBuffetTaken: updatedBuffetTaken,
                            totalBuffetPrice: updatedTotalBuffetPrice,
                        },
                    });
    
                    return {updatedInvoice, updatedBuffetItem}
                } else {
                    // Remove the buffet item
                    let removed = false;
                    for (let i = 0; i < totalBuffetTaken.length; i++) {
                        if (!removed && totalBuffetTaken[i].name === name && totalBuffetTaken[i].qty == itemQty && totalBuffetTaken[i].price == price) {
                            removed = true;
                            continue;
                        } else updatedBuffetTaken.push(totalBuffetTaken[i]);
                    }
                    updatedTotalBuffetPrice =
                        (existingInvoice.totalBuffetPrice || 0) - price * itemQty;

                    // Increase the stock
                    const updatedBuffetItem = await prisma.buffet.update({
                        where: {
                            name: name,
                            userId: String(userId),
                        },
                        data: {
                            stock: {
                                increment: itemQty,
                            },
                        },
                    });
                    // Update the invoice
                    const updatedInvoice = await prisma.invoice.update({
                        where: {
                            id: String(invoiceId),
                            userId: String(userId),
                        },
                        data: {
                            totalBuffetTaken: updatedBuffetTaken,
                            totalBuffetPrice: updatedTotalBuffetPrice,
                        },
                    });
    
                    return {updatedInvoice, updatedBuffetItem}
                }

            });

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error happened during updating the invoice: ", error);
            return res.status(500).json({ error: "حدث خطأ أثناء معالجة الطلب" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}