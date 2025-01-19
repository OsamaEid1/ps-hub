import { useEffect, useState } from 'react'

import { fetchBuffet } from 'app/helpers/admin/buffet/fetchBuffet';
import {  INITIAL_BUFFET_INFO } from 'app/helpers/constants';
import useGetUserInfo from '../../user/useGetUserInfo';

function useGetBuffet(initialUserId?: string ) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [buffet, setBuffet] = useState([INITIAL_BUFFET_INFO]);
    const [userId, setUserId] = useState<string>("");

    const {loading: userInfoLoading, userInfo} = useGetUserInfo();

    const handleGetBuffet = async () => {
        try {
            if (initialUserId) {
                const buffet = await fetchBuffet(initialUserId);
                setBuffet(buffet);
                setUserId(initialUserId);
            } else {
                if (userInfo) {
                    const buffet = await fetchBuffet(userInfo.id);
                    setBuffet(buffet);
                    setUserId(userInfo.id);
                }
            }
        } catch (error: any) {
            console.error(error)
            setError(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {if (!userInfoLoading && userInfo) handleGetBuffet()}, [userInfo])
    
        return {loading, error, buffet, userId }
}


export default useGetBuffet