import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Clear the token cookie by setting it to expire immediately
        res.setHeader('Set-Cookie', cookie.serialize('token', '', {
            httpOnly: true, // Ensures the cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Secure cookie in production
            sameSite: 'strict', // Prevents CSRF attacks
            expires: new Date(0), // Set expiration to 1970, effectively deleting the cookie
            path: '/', // Make sure the cookie is removed globally
        }));

        // Respond with a success message
        return res.status(200).json({ message: 'Signed out successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
