"use client"
// React
import React, { useState } from 'react'
// FontAwesome
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import Popup from 'app/@components/ui/Popup';
import Loading from 'app/@components/ui/Loading';
import { updateUserById } from 'app/helpers/user/updateUserById';

type Props = {
    heads: string[],
    body: any,
    updateAdminsCount: (length: number) => void
    updateActiveAdminsCount: (length: number) => void
    updateInactiveAdminsCount: (length: number) => void
}


function AdminsTable({ heads, body, updateAdminsCount, updateActiveAdminsCount, updateInactiveAdminsCount } : Props) {
    const [admins, setAdmins] = useState(body);
    
    const [isPopupOpened, setIsPopupOpened] = useState<boolean>(false);
    const [popupType, setPopupType] = useState<string>("normal");
    const [popupText, setPopupText] = useState<string>("");
    
    const [actionType, setActionType] = useState<"" | "toggleActivation" | "delete">("");
    const [triggeredAdminId, setTriggeredAdminId] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    
    /* Future Feature */
    // // Delete Admin Operations
    // const handleDeleteAdmin = (name: string, id: string) => {
    //     setIsPopupOpened(true);
    //     setPopupText(`هل أنت متأكد من أنك تريد حذف هذا المسئول (${name})؟`);
    //     setPopupType("delete");

    //     setActionType("delete");
    //     setTriggeredAdminId(id);
    // };
    // const confirmDelete = async () => {
    //     setLoading(true);
    //     setError(null);

    //     try {
    //         // await deleteBuffetItemById(triggeredAdminId);

    //         setPopupType("success");
    //         setPopupText("تم حذف العنصر بنجاح ✅");
    //         setIsPopupOpened(true);
    //     } catch (e : any) {
    //         console.error(e)
    //         setError("!حدث خطأ أثناء محاولة حذف هذا العنصر، أو أنه محذوف بالفعل !");
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // Admin Activation Toggle Operations
    const handleToggleActivation = (name: string, id:string) => {
        setIsPopupOpened(true);
        setPopupText(`هل أنت متأكد من أنك تريد تغيير حالة المسئول: (${name})؟`);

        setActionType("toggleActivation");
        setTriggeredAdminId(id);
    };
    const confirmToggleAdminActivation = async () => {
        setLoading(true);
        setError(null);

        // Get Triggered Admin
        let admin = admins.find(admin => admin.id === triggeredAdminId);
        // Update the status
        try {
            const updatedAdmin = await updateUserById({...admin, isActive: !admin.isActive}, admin.id);
            // Update the state
            const updatedAdmins = admins.map(admin => admin.id === updatedAdmin.id ? updatedAdmin : admin);
            setAdmins(updatedAdmins);
            handleUpdateAdminsCountsStats(updatedAdmins);
            // Reset
            handlePopupToggle();
        } catch (error: any) {
            setError("حدث خطأ ما، حاول ثانيةً أو أعد تحميل الصفحة");
        } finally {
            setLoading(false);
        }
    }; 
    const handleUpdateAdminsCountsStats = (updatedAdmins) => {
        const activeCount = updatedAdmins.filter(admin => admin.isActive).length;
        const inactiveCount = updatedAdmins.length - activeCount;

        updateActiveAdminsCount(activeCount);
        updateInactiveAdminsCount(inactiveCount);
    }

    // Popup
    const handleOnConfirm = () => {
        if (actionType === 'toggleActivation') confirmToggleAdminActivation();
        // else confirmDelete();
    };
    const handlePopupToggle = () => {
        // Reset
        setIsPopupOpened(state => state = !state);
        setPopupType("normal");
        setPopupText("");

        setActionType("");
        setTriggeredAdminId("");

        setError(null);
    };

    return (
        <>
            {isPopupOpened && (
                <Popup 
                    type={popupType}
                    text={popupText}
                    options={true}
                    onConfirm={handleOnConfirm}
                    onToggle={handlePopupToggle} 
                    className="bg-gray-500 text-white"
                >
                    {loading && (
                        <Loading className='rounded-main' />
                    )}
                    {error && (
                        <div className='bg-black/80 p-2 rounded-main mt-2
                        '>
                            <span className="text-red-700 font-bold">{error}</span>
                        </div>
                    )}
                </Popup>
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
                            {/* <th key={"20"} scope="col" className="px-6 py-3">
                                أكشن
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className='border-t-2 border-gray-700 py-10'>
                    {(admins.length === 0) ? (
                        <tr className='border-b border-gray-700 bg-elements'>لا يوجد أي مسئولين حتى الآن.</tr>
                    ) 
                    : (
                        admins.map((admin: any, i: number) => (
                            <tr key={i} className="border-b border-gray-700 bg-elements duration-300 hover:bg-secondary hover:text-mainActiveText">
                                <th scope="col" className="px-6 py-3 whitespace-pre-line">
                                    {`${new Date(admin.createdAt).toLocaleDateString("ar")}\n${new Date(admin.createdAt).toLocaleTimeString("ar")}`}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    {admin.name || "لا يوجد"}
                                </th>
                                <td scope="col" className="px-6 py-3">
                                    {admin.email || "لا يوجد"}
                                </td>
                                <td scope="col" className="px-6 py-3 relative">
                                    <label className="inline-flex items-center me-5 cursor-pointer" title='بدّل الحالة'>
                                        <input type="checkbox" value="" className="sr-only peer"
                                            checked={admin.isActive}
                                            onClick={() => handleToggleActivation(admin.name, admin.id)}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                    </label>
                                </td>
                                {/* <td className="px-6 py-4">
                                    <button
                                        title="Delete"
                                        className="text-red-500 py-1 px-2 rounded-full cursor-pointer duration-300 hover:bg-white"
                                        onClick={() => handleDeleteAdmin(admin.name, admin.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td> */}
                            </tr>
                    )))}
                    </tbody>
                </table>
            </div>
        </>
    );   
}

export default AdminsTable