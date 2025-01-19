"use client"
// React
import React, { useEffect, useState } from 'react'
// FontAwesome
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import Popup from 'app/@components/ui/Popup';
import Loading from 'app/@components/ui/Loading';
import { deleteInvoiceById } from 'app/helpers/admin/invoice/deleteInvoiceById';
import CheckAuthorityPopup from 'app/@components/global/CheckAuthorityPopup';

type Props = {
    heads: string[],
    body: any,
    updateInvoicesCount: (length) => void
}


function InvoicesTable({ heads, body, updateInvoicesCount } : Props) {
    const [invoices, setInvoices] = useState(body);

    const [isPopupOpened, setIsPopupOpened] = useState(false);
    const [popupType, setPopupType] = useState<string>("normal");
    const [popupText, setPopupText] = useState<string>("");
    
    // const [actionType, setActionType] = useState<"" | "edit" | "delete">("");
    const [triggeredInvoice, setTriggeredInvoice] = useState({id: '', totalPlayingPrice: 0, totalBuffetPrice: 0, date: ""});
    // Check Authority
    const [isCheckingAuthorityPopupOpened, setIsCheckingAuthorityPopupOpened] = useState(false);
    const [isAuthorizationSucceed, setIsAuthorizationSucceed] = useState(false);
    // Handle Deleting The Invoice
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingError, setDeletingError] = useState<string | null>(null);

    // const router = useRouter();
    // const handleActionConfirm = async () => {
    //     if (actionType === "edit") {
    //         router.push(`/admin/${actionType}-item/${triggeredBuffetId}`);
    //     } else if (actionType === "delete") {
    //         handleConfirmDelete();
    //     }
    // }
    // const handleEditBuffet = (name: string, id:string) => {
    //     setIsPopupOpened(true);
    //     setPopupText(`هل أنت متأكد من أنك تريد تعديل هذه العنصر (${name})؟`);

    //     setActionType("edit");
    //     setTriggeredBuffetId(id);
    // };
    
    const removeInvoice = (id: string) => {
        const updatedInvoices = invoices.filter(invoice => invoice.id != id);
        setInvoices(updatedInvoices);
        updateInvoicesCount(updatedInvoices.length);
    }
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteInvoiceById(triggeredInvoice.id, invoices[0].userId, triggeredInvoice.totalPlayingPrice, triggeredInvoice.totalBuffetPrice, triggeredInvoice.date);

            // Remove From The Local State
            removeInvoice(triggeredInvoice.id);
            // Set Popup values
            setIsPopupOpened(true);
            setPopupType("success");
            setPopupText("تم حذف الفاتورة بنجاح ✅");
        } catch (e : any) {
            setDeletingError("!حدث خطأ أثناء محاولة حذف الفاتورة، أو أنها محذوفة بالفعل !");
        } finally {
            setIsDeleting(false);
        }
    };
    const handleDeleteInvoice = (date: string, id:string, totalPlayingPrice: number, totalBuffetPrice: number) => {
        setIsPopupOpened(true);
        setPopupText(`هل أنت متأكد من أنك تريد حذف فاتورة تاريخ: ${`${new Date(date).toLocaleDateString("ar")}\n${new Date(date).toLocaleTimeString("ar")}`}؟`);
        setPopupType("delete");
        
        setTriggeredInvoice({
            id,
            totalPlayingPrice,
            totalBuffetPrice,
            date
        });
    };

    // Handle Confirm The Action After Success Authorization
    useEffect(() => {
        if (isAuthorizationSucceed) handleConfirmDelete();
        
    }, [isAuthorizationSucceed]);

    // Reset
    const handlePopupToggle = () => {
        // Reset
        setIsPopupOpened(state => state = !state);
        setPopupType("normal");
        setPopupText("");

        setTriggeredInvoice({id: '', totalPlayingPrice: 0, totalBuffetPrice: 0, date: ""});
        
        setIsAuthorizationSucceed(false);
        setDeletingError(null);
    };

    return (
        <>
            {isPopupOpened && (
                <Popup 
                    type={popupType}
                    text={popupText}
                    options={true}
                    onConfirm={() => setIsCheckingAuthorityPopupOpened(true)}
                    onToggle={handlePopupToggle} 
                    className="bg-gray-500 text-white"
                >
                    {isDeleting && (
                        <Loading className='rounded-main' />
                    )}
                    {deletingError && (
                        <div className='bg-black/80 p-2 rounded-main mt-2
                        '>
                            <span className="text-red-700 font-bold">{deletingError}</span>
                        </div>
                    )}
                </Popup>
            )}
            {isCheckingAuthorityPopupOpened && (
                <CheckAuthorityPopup
                    onToggle={() => setIsCheckingAuthorityPopupOpened(false)}
                    userId={invoices[0].userId}
                    setIsAuthorizationSucceed={setIsAuthorizationSucceed}
                />
            )}
            <div
                dir='rtl'
                className="relative overflow-x-auto my-10 rounded-main text-center"
            >
                <table className="w-full text-base">
                    <thead className="uppercase bg-secondary text-base">
                        <tr>
                            {heads && (
                                heads.map((head: string, i: number) => (
                                    <th key={head[0] + i} scope="col" className="px-6 py-3">
                                        {head}
                                    </th>
                            )))}
                            <th key={"20"} scope="col" className="px-6 py-3">
                                أكشن
                            </th>
                        </tr>
                    </thead>
                    <tbody className='border-t-2 border-gray-700 py-10'>
                    {invoices && (
                        invoices.map((item: any, i: number) => (
                            <tr key={i} className="border-b border-gray-700 bg-elements duration-300 hover:bg-secondary hover:text-mainActiveText">
                                <th scope="col" className="px-6 py-3 whitespace-pre-line">
                                    {`${new Date(item.createdAt).toLocaleDateString("ar")}\n${new Date(item.createdAt).toLocaleTimeString("ar")}`}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    {item.roomName || "لا يوجد"}
                                </th>
                                <td scope="col" className="px-6 py-3">
                                    {item.customerName || "لا يوجد"}
                                </td>
                                <td scope="col" className="px-6 py-3">
                                    {item.playingMode || "لا يوجد"}
                                </td>
                                <td scope="col" className="px-6 py-3">
                                    {`${item.totalSpentHours}س : ${item.totalSpentMins}د`}
                                </td>
                                <td scope="col" className="px-6 py-3">
                                    {item.totalBuffetPrice ? (
                                        <>  
                                            <ol className="list-decimal list-inside">
                                                {item.totalBuffetTaken.map((item, i) => (
                                                    <li key={i}>{item.name} * {item.qty} = {+item.price * item.qty}ج</li>
                                                ))}
                                            </ol>
                                        </>
                                    ) : (
                                        <span>لا شئ</span>
                                    )}
                                </td>
                                <td scope="col" className="px-6 py-3 font-semibold">
                                    {item.totalPrice}ج
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-5 text-base">
                                        {/* <button
                                            title="Edit"
                                            className='
                                                py-1 px-2 rounded-full cursor-pointer duration-300 text-white hover:bg-mainBlue
                                            '
                                            // onClick={() => {handleEditBuffet(item.name, item.id)}}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button> */}
                                        <button
                                            title="Delete"
                                            className="text-red-500 py-1 px-2 rounded-full cursor-pointer duration-300 hover:bg-white"
                                            onClick={() => handleDeleteInvoice(item.createdAt, item.id, item.totalPlayingPrice, item.totalBuffetPrice)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </>
    );   
}

export default InvoicesTable