export const deleteBuffetItemById = async (id: string, userId: string) => {
    try {
        const response = await fetch(`/api/admin/buffet/delete-item/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw `Error: ${response.status}`;
        }

    } catch (error) {
        console.error('Failed to delete buffet item: ', error);
        throw error;
    }
};
