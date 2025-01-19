import { useEffect, useState } from 'react'
import { fetchRoomById } from 'app/helpers/admin/rooms/fetchRoomById';
import { INITIAL_EDITABLE_ROOM_INFO_STRUCTURE } from 'app/helpers/constants';
import useGetUserInfo from '../../user/useGetUserInfo';


function useGetRoomById(roomId: string) {
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [oldRoomInfo, setOldRoomInfo] = useState(INITIAL_EDITABLE_ROOM_INFO_STRUCTURE);
    const [userId, setUserId] = useState<string>("");

    const {loading: userInfoLoading, userInfo} = useGetUserInfo();

    const handleGetRoom = async () => {
        try {
            if (userInfo) {
                const room = await fetchRoomById(roomId, userInfo.id);
                setOldRoomInfo(room);
                setUserId(userInfo.id);
            } 
        } catch (error: any) {
            console.error(error)
            setError(
                "حدث خطأ في جلب البيانات، برحاء التأكد من أنك ضغطت على زِر التعديل في صفحة 'إدارة الرومات'، وحاول ثانيةً بطريقة صحيحة. إذا لم يفلح ذلك قم بإعادة تسجيل الدخول وحاول ثانيةً."
            )
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {if (!userInfoLoading && userInfo) handleGetRoom()}, [userInfoLoading])
    return {loading, error, oldRoomInfo, userId }
}


export default useGetRoomById