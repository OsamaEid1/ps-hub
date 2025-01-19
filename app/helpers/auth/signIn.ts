export const signIn = async (email: string, password: string) => {
    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
    
        if (response.ok) {
            const data = await response.json();
            return data.user;
        } else {
            const errorData = await response.json();
            throw errorData.error;
        }
        
    } catch (error) {
        console.log(error);
        throw error;
    }
};