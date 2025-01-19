export const isPasswordValid = async (userId: string, password: string) => {
    try {
        const response = await fetch("/api/auth/check-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, password }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.valid === 'true')
                return true;
            else return false;
        } else {
            const errorData = await response.json();
            throw errorData.error;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};
