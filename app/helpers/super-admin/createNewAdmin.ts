import type { Admin } from "../constants";

export const createNewAdmin = async ({ ...adminInfo } : Admin): Promise<Admin> => {
    const response = await fetch('/api/super-admin/admins/add-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...adminInfo }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data.error;
    }

    return data;
};