import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient(); // Ensure prisma is properly initialized

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        if (req.method === 'PUT') {  // Change to 'PUT' for updates
            let {
                id,
                name,
                price,
                discountedPrice,
                stock,
                userId
            } = req.body;

            // Check if the required fields are present
            if (!id || !name || !price || !discountedPrice) {
                return res.status(400).json({error: "كل الخانات إجبارية!"});
            }

            price = Number(price);
            discountedPrice = Number(discountedPrice);
            stock = Number(stock);


            try {
                // Update the buffet in the database
                const updatedItem = await prisma.buffet.update({
                    where: { id: String(id) },  // Use the ID from the query
                    data: {
                        name,
                        price,
                        discountedPrice,
                        stock,
                        userId
                    }
                });

                if (!updatedItem) {
                    return res.status(404).json({error: "هذا العنصر غير موجود!"});
                }

            return res.status(200).json(updatedItem);
        } catch (error) {
            console.error("Error Happened While Trying To Fetch Room Data, ", error)
            return res.status(500).json(error)
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}