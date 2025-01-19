import { Buffet } from "app/helpers/constants";

export const createNewBuffetItem = async ({ ...buffetItem } : Buffet) => {
    const response = await fetch('/api/admin/buffet/add-buffet-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...buffetItem }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data.error;
    }

    return data;
};