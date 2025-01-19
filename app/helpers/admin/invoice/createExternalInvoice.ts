import { Invoice } from "app/helpers/constants";

export const createExternalInvoice = async (invoice : Invoice) => {
    try {
        const response = await fetch('/api/admin/invoice/add-external-invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...invoice }),
        });
        const data = await response.json();
        
        if (!response.ok) 
            throw data.error;
        

        return data.newInvoice;
    } catch (error: any) {
        console.error("Create External Invoice error: ", error);
        throw error;
    }
};