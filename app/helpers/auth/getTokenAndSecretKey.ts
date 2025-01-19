import Cookies from 'js-cookie';


const encoder = new TextEncoder();
const SECRET_KEY = encoder.encode(process.env.SECRET_KEY || 'e87ae886e49904ac30df7b0d6c934d70be9598420512a159cf2d43ccfba7effaa900e801b7ce807deaa37150dd606b301da11b87441a1ecf0beee5243296313f');

export const getTokenAndSecretKey = async () => {
    const token = Cookies.get('token');

    try {
        if (!token) {
            throw new Error("Token or secret key not found in cookies");
        }

        return { token, SECRET_KEY };
    } catch(error) {
        console.error(error);
        return null;
    };
};