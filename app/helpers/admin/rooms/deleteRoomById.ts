export const deleteRoomById = async (id: string, userId: string) => {
    try {
        const response = await fetch(`/api/admin/rooms/delete-room/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw 'حدث خطأ أثناء حذف الروم، اعد المحاولة';
        }

    } catch (error) {
        console.error('Failed to delete room:', error);
        throw error;
    }
};
