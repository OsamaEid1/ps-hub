import { Invoice } from "app/helpers/constants";

export const createNewInvoice = async (invoice : Invoice) => {
    try {
        const response = await fetch('/api/admin/invoice/add-invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...invoice }),
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw data.error;
        }

        return data.newInvoice;
    } catch (error: any) {
        console.error("Add error: ", error);
        throw error;
    }
};