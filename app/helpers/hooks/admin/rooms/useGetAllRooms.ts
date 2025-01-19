import { useEffect, useState } from 'react'
import { INITIAL_ROOM_INFO_STRUCTURE } from 'app/helpers/constants';
import { fetchRooms } from 'app/helpers/admin/rooms/fetchRooms';
import useGetUserInfo from '../../user/useGetUserInfo';

function useGetAllRooms() {
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [rooms, setRooms] = useState([INITIAL_ROOM_INFO_STRUCTURE]);

    const {loading: userInfoLoading, userInfo} = useGetUserInfo();

    const handleGetRooms = async () => {
        try {
            if (userInfo) {
                const room = await fetchRooms(userInfo.id);
                setRooms(room);
            }
        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {if (!userInfoLoading && userInfo) handleGetRooms()}, [userInfo]);

    return {loading, error, rooms }
}


export default useGetAllRooms