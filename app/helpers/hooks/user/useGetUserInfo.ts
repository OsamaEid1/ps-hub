import { useEffect, useState } from 'react'
import { getTokenAndSecretKey } from 'app/helpers/auth/getTokenAndSecretKey';
import getUserCardinalities, { DecodedToken } from 'app/helpers/auth/getUserCardinalities';

function useGetUserInfo() {
    const [loading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<DecodedToken  | null>();

    const handleGetUserCardinalities = async () => {
        try {
            const result = await getTokenAndSecretKey();
            if (!result) {
                throw new Error("Error while trying to access unauthorized pages")
            }
            const {token, SECRET_KEY} = result;
            const userInfo = await getUserCardinalities(token, SECRET_KEY);

            setUserInfo(userInfo);
        } catch (error) {
            console.error(error);
            setUserInfo(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleGetUserCardinalities();
    }, [])

    return {loading, userInfo}
}

export default useGetUserInfo