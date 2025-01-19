import { Room } from "app/helpers/constants";

export const updateRoomById = async (updatedRoomInfo: Room, id: string) => {
    try {
        const response = await fetch(`/api/admin/rooms/update-room/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRoomInfo),
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw data.error;
        }

        return data.updatedRoom;
    } catch (error) {
        console.error('Failed to update room:', error);
        throw error;
    }
};