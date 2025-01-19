type ItemInfoProp = {
    name: string;
    price: number;
    itemQty: number;
    userId: string;
}

export const updateBuffetTakenWithStock = async (add: boolean, invoiceId: string, buffetItemInfo: ItemInfoProp) => {
    try {
        const response = await fetch(`/api/admin/invoice/update-buffet-taken-and-stock?invoiceId=${invoiceId}&add=${add}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(buffetItemInfo),
        });

        if (!response.ok) {
            // Log raw text for debugging
            const errorText = await response.text();
            console.error(`Error while ${add ? 'adding' : 'removing'} buffet item to the invoice: ${errorText}`);
            throw new Error('حدث خطأ ما، حاول ثانيةً');
        }

        const updatedData = await response.json();
        return updatedData;
    } catch (error: any) {
        throw error.message;
    }
}