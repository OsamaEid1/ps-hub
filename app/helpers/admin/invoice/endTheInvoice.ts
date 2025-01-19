type InfoProp = {
    invoiceId: string;
    totalSpentHours: number;
    totalSpentMins: number;
    totalPlayingPrice: number;
    totalBuffetPrice: number;
    totalPrice: number;
    roomId: string;
    userId: string;
}

export const endTheInvoice = async (info: InfoProp) => {
    try {
        const response = await fetch('/api/admin/invoice/end-invoice', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(info),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text: ', errorText);
            throw new Error('حدث خطأ ما، حاول ثانيةً');
        }

        const updatedData = await response.json();
        return updatedData;
    } catch (error: any) {
        throw error.message;
    }
}