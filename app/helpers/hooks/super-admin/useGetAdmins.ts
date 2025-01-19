import { useEffect, useState } from 'react'
import { INITIAL_ADMIN_INFO } from 'app/helpers/constants';
import { fetchAdmins } from 'app/helpers/super-admin/fetchAdmins';


function useGetAdmins() {
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [admins, setAdmins] = useState([INITIAL_ADMIN_INFO]);
    const [totalAdminsCount, setTotalAdminsCount] = useState<number>(0);
    const [activeAdminsCount, setActiveAdminsCount] = useState<number>(0);
    const [inactiveAdminsCount, setInactiveAdminsCount] = useState<number>(0);

    const handleGetAdmins = async () => {
        try {
            const {admins, activeAdminsCount, inactiveAdminsCount} = await fetchAdmins();

            setAdmins(admins);
            setTotalAdminsCount(admins.length);
            setActiveAdminsCount(activeAdminsCount);
            setInactiveAdminsCount(inactiveAdminsCount);
        } catch (error: any) {
            console.error(Error('Error while fetching admins data, msg: ', error));
            setError("حدث خطأ أثناء جلب بيانات المسئولين، حاول ثانيةً");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetAdmins();
    }, [])

    return {loading, error, admins, totalAdminsCount, activeAdminsCount, inactiveAdminsCount }
}


export default useGetAdmins