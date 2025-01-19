"use client"
// React
import React, { useEffect, useState } from 'react'
// FontAwesome
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
// Helpers
import { useRouter } from 'next/navigation';
import { deleteBuffetItemById } from 'app/helpers/admin/buffet/deleteItem';
// Components
import Popup from 'app/@components/ui/Popup';
import Loading from 'app/@components/ui/Loading';
import CheckAuthorityPopup from 'app/@components/global/CheckAuthorityPopup';

type BuffetTable = {
    heads: string[],
    body: any,
    userId: string
}


function BuffetTable({ heads, body, userId } : BuffetTable) {
    // Popup
    const [isPopupOpened, setIsPopupOpened] = useState(false);
    const [popupType, setPopupType] = useState<string>("normal");
    const [popupText, setPopupText] = useState<string>("");
    // Trigger The Action
    const [actionType, setActionType] = useState<"" | "edit" | "delete">("");
    const [triggeredBuffetId, setTriggeredBuffetId] = useState<string>("");
    // Check Authority
    const [isCheckingAuthorityPopupOpened, setIsCheckingAuthorityPopupOpened] = useState(false);
    const [isAuthorizationSucceed, setIsAuthorizationSucceed] = useState(false);
    // Deleting Action States
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingError, setDeletingError] = useState<string | null>(null);

    // Handle Action
    const router = useRouter();
    const handleActionConfirm = async () => {
        if (actionType === "edit") {
            setIsCheckingAuthorityPopupOpened(true);
        } else if (actionType === "delete") {
            setIsCheckingAuthorityPopupOpened(true);
        }
    }
    // Delete Item
    const handleDeleteBuffet = (name: string, id: string) => {
        setIsPopupOpened(true);
        setPopupText(`هل أنت متأكد من أنك تريد حذف هذه العنصر (${name})؟`);
        setPopupType("delete");

        setActionType("delete");
        setTriggeredBuffetId(id);
    };
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteBuffetItemById(triggeredBuffetId, userId);

            setPopupType("success");
            setPopupText("تم حذف العنصر بنجاح ✅");
            setIsPopupOpened(true);
        } catch (e : any) {
            console.error(e)
            setDeletingError("!حدث خطأ أثناء محاولة حذف هذا العنصر، أو أنه محذوف بالفعل !");
        } finally {
            setIsDeleting(false);
        }
    };
    // Edit Item
    const handleEditBuffet = (name: string, id:string) => {
        setIsPopupOpened(true);
        setPopupText(`هل أنت متأكد من أنك تريد تعديل هذه العنصر (${name})؟`);

        setActionType("edit");
        setTriggeredBuffetId(id);
    };

    // Handle Confirm The Action After Success Authorization
    useEffect(() => {
        if (isAuthorizationSucceed) {
            if (actionType === "edit") {
                router.push(`/admin/edit-item/${triggeredBuffetId}`);
                handlePopupToggle();
            } else if (actionType === "delete") {
                handleConfirmDelete();
            }
        }
    }, [isAuthorizationSucceed]);

    // Popup
    const handlePopupToggle = () => {
        // Reset
        setIsPopupOpened(state => state = !state);
        setPopupType("normal");
        setPopupText("");

        setActionType("");
        setTriggeredBuffetId("");

        setDeletingError(null);
        setIsAuthorizationSucceed(false);

        if (actionType === "delete") 
            location.reload();
    };

    return (
        <>
            {isPopupOpened && (
                <Popup 
                    type={popupType}
                    text={popupText}
                    options={true}
                    onConfirm={handleActionConfirm}
                    onToggle={handlePopupToggle} 
                    className="bg-gray-500 text-white"
                >
                    {isDeleting && (
                        <Loading className='rounded-main' />
                    )}
                    {deletingError && (
                        <div className='bg-black/80 p-2 rounded-main mt-2'>
                            <span className="text-red-700 font-bold">{deletingError}</span>
                        </div>
                    )}
                </Popup>
            )}
            {isCheckingAuthorityPopupOpened && (
                <CheckAuthorityPopup
                    onToggle={() => setIsCheckingAuthorityPopupOpened(false)}
                    userId={userId}
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
                    {body && (
                        body.map((item: any, i: number) => (
                            <tr key={i} className="border-b border-gray-700 bg-elements duration-300 hover:bg-secondary">
                                <th scope="col" className="px-6 py-3">
                                    {item.name}
                                </th>
                                <td scope="col" className="px-6 py-3" title={item.price}>
                                    {item.price}ج
                                </td>
                                <td scope="col" className="px-6 py-3">
                                    {item.discountedPrice}ج
                                </td>
                                <td scope="col" className="px-6 py-3">
                                    {item.stock}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-5 text-base">
                                        <button
                                            title="Edit"
                                            className='
                                                py-1 px-2 rounded-full cursor-pointer duration-300 hover:bg-mainBlue
                                            '
                                            onClick={() => {handleEditBuffet(item.name, item.id)}}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button
                                            title="Delete"
                                            className="text-red-500 py-1 px-2 rounded-full cursor-pointer duration-300 hover:bg-white"
                                            onClick={() => handleDeleteBuffet(item.name, item.id)}
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

export default BuffetTable