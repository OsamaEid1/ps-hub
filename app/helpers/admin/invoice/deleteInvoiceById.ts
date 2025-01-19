export const deleteInvoiceById = async (id: string, userId: string, totalPlayingPrice: number, totalBuffetPrice: number, date: string) => {
    try {
        const response = await fetch(`/api/admin/invoice/delete-invoice/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, totalPlayingPrice, totalBuffetPrice, date }),
        });

        if (!response.ok) 
            throw `Error: ${response.status}`;
    } catch (error) {
        console.error('Failed to delete buffet item: ', error);
        throw error;
    }
};
