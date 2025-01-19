export const signOut = async () => {
    try {
        // Call the logout API to clear the token from the cookie
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
        });

        if (response.ok) {
            // Redirect the user to the login page or home page after successful logout
            location.href = "/";
        } else {
            console.error('Failed to sign out');
        }
    } catch (error) {
        console.error('Error during sign-out:', error);
    }
};
