export const updateUserById = async (updatedUserInfo, id: string) => {
    try {
        const response = await fetch(`/api/user/update-user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUserInfo),
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw data.error;
        }

        return data.updatedUser;
    } catch (error) {
        console.error('Failed to update user: ', error);
        throw error;
    }
};