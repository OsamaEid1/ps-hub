import { useEffect, useState } from 'react'
import { INITIAL_INVOICE_INFO } from 'app/helpers/constants';
import { fetchInvoices } from 'app/helpers/admin/invoice/fetchInvoices';
import useGetUserInfo from '../../user/useGetUserInfo';

function useGetInvoices() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [invoices, setInvoices] = useState([INITIAL_INVOICE_INFO]);

    const {loading: getUserInfoLoading, userInfo} = useGetUserInfo();

    const handleGetInvoices = async () => {
        try {
            if (!getUserInfoLoading && userInfo) {
                const invoices = await fetchInvoices(userInfo.id);
                setInvoices(invoices);
            } else {
                throw "!حدث خطأ أثناء جلب البيانات، حاول ثانيةً"
            }
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!getUserInfoLoading) handleGetInvoices();
    }, [userInfo])
    return {loading, error, invoices }
}


export default useGetInvoices