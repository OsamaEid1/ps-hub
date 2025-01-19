import { jwtVerify } from 'jose'; // Import jwtVerify from the jose library

export type DecodedToken = {
    id: string;
    name: string;
    role: string;
}

const getUserCardinalities =
    async (token: string, SECRET_KEY: Uint8Array): Promise<DecodedToken | null> => {
        try {
            // Verify the token
            const { payload } = await jwtVerify(token, SECRET_KEY);

            // Extract the properties safely
            /* NOTE: i make them optional because payload may can not get them if token not valid 
                    So firstly get them, then check if they exist.
            */
            const { id, name, role } = payload as { id?: string; name?: string; role?: string };

            // Ensure the properties are present
            if (!id || !name || !role) {
                throw new Error("Token payload missing required fields");
            }

            // Return the decoded payload
            return { id, name, role } ; 
        } catch (error) {
            console.error('Invalid token: ', error);
            return null;
        }
};

export default getUserCardinalities;
