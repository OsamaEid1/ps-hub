// React
import { useEffect, useState } from 'react'
// Helpers
import { INITIAL_BUFFET_INFO } from 'app/helpers/constants';
import { fetchBuffetItemById } from 'app/helpers/admin/buffet/fetchBuffetItemById';
import useGetUserInfo from '../../user/useGetUserInfo';


function useGetBuffetItemById(itemId: string) {
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [oldItemInfo, setOldItemInfo] = useState(INITIAL_BUFFET_INFO);
    const [userId, setUserId] = useState<string>("");

    const {loading: userInfoLoading, userInfo} = useGetUserInfo(); 
    const handleGetItem = async () => {
        try {
            if (userInfo?.id) {
                const item = await fetchBuffetItemById(itemId, userInfo.id);
                setOldItemInfo(item);
                setUserId(userInfo.id);
            }
        } catch (error: any) {
            console.error(error)
            setError(
                "حدث خطأ في جلب البيانات، برحاء التأكد من أنك ضغطت على زِر التعديل في صفحة 'إدارة البوفيه'، وحاول ثانيةً بطريقة صحيحة. إذا لم يفلح ذلك قم بإعادة تسجيل الدخول وحاول ثانيةً."
            )
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { if (!userInfoLoading && userInfo?.id) handleGetItem()}, [userInfo])
    return {loading, error, oldItemInfo, userId }
}


export default useGetBuffetItemById