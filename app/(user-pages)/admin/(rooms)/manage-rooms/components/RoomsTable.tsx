"use client"
// React
import React, { useEffect, useState } from 'react'
// FontAwesome
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
// Helpers
import { useRouter } from 'next/navigation';
import { deleteRoomById } from 'app/helpers/admin/rooms/deleteRoomById';
import useGetUserInfo from 'app/helpers/hooks/user/useGetUserInfo';
// Components
import Popup from 'app/@components/ui/Popup';
import Loading from 'app/@components/ui/Loading';
import CheckAuthorityPopup from 'app/@components/global/CheckAuthorityPopup';

type RoomsTable = {
    heads: string[],
    body: any
}

function RoomsTable({ heads, body } : RoomsTable) {
    // Popup
    const [isPopupOpened, setIsPopupOpened] = useState(false);
    const [popupType, setPopupType] = useState<string>("normal");
    const [popupText, setPopupText] = useState<string>("");
    // Action Handles
    const [actionType, setActionType] = useState<"" | "edit" | "delete">("");
    const [triggeredRoomId, setTriggeredRoomId] = useState<string>("");
    // Room
    const [rooms, setRooms] = useState<string[]>(body);
    // Check Authority
    const [isCheckingAuthorityPopupOpened, setIsCheckingAuthorityPopupOpened] = useState(false);
    const [isAuthorizationSucceed, setIsAuthorizationSucceed] = useState(false);
    // Deleting Handles
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingError, setDeletingError] = useState<string | null>(null);
    // Get User Info
    const {loading: userInfoLoading, userInfo} = useGetUserInfo();

    // Form Handle
    const handleActionConfirm = async () => {
        if (actionType === "edit") {
            setIsCheckingAuthorityPopupOpened(true);
        } else if (actionType === "delete") {
            setIsCheckingAuthorityPopupOpened(true);
        }
    };
    const handleConfirmDelete = async () => {
        setIsDeleting(true);

        try {
            if (userInfo) {
                await deleteRoomById(triggeredRoomId, userInfo.id);

                setPopupType("success");
                setPopupText("تم حذف الروم بنجاح ✅");
                setIsPopupOpened(true);

                
                const updatedRooms = body.filter((room) => room.id != triggeredRoomId);
                setRooms(updatedRooms);
            }
        } catch (e : any) {
            console.error(e)
            setDeletingError("حدث خطأ أثناء محاولة حذف الروم، أو أن هذه الروم محذوفة بالفعل!، حاول ثانيةً !");
        } finally {
            setIsDeleting(false);
        }
    };

    // Confirm Functions
    const handleEditRoom = (name: string, id:string) => {
        setIsPopupOpened(true);
        setPopupText(`هل أنت متأكد من أنك تريد تعديل هذه الروم (${name})؟`);

        setActionType("edit");
        setTriggeredRoomId(id);
    };
    const handleDeleteRoom = (name: string, id:string) => {
        setIsPopupOpened(true);
        setPopupText(`هل أنت متأكد من أنك تريد حذف هذه الروم (${name})؟`);
        setPopupType("delete");
        
        setActionType("delete");
        setTriggeredRoomId(id);
    };

    // Handle Confirm The Action After Success Authorization
    const router = useRouter();
    useEffect(() => {
        if (isAuthorizationSucceed) {
            if (actionType === 'delete') {
                handleConfirmDelete();
            } else if (actionType === 'edit') {
                setIsPopupOpened(false);
                router.push(`/admin/edit-room/${triggeredRoomId}`);
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
        setTriggeredRoomId("");

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
                    onConfirm={handleActionConfirm}
                    onToggle={handlePopupToggle}
                    className="bg-gray-500 text-white"
                >
                    {isDeleting && <Loading />}
                    {deletingError && (
                        <div className="bg-black/80 p-2 rounded-main mt-2">
                            <span className="text-red-700 font-bold">
                                {deletingError}
                            </span>
                        </div>
                    )}
                </Popup>
            )}
            {isCheckingAuthorityPopupOpened && (
                <CheckAuthorityPopup
                    onToggle={() => setIsCheckingAuthorityPopupOpened(false)}
                    userId={userInfo?.id}
                    setIsAuthorizationSucceed={setIsAuthorizationSucceed}
                />
            )}
            <div
                dir="rtl"
                className="relative overflow-x-auto my-10 rounded-main text-center"
            >
                <table className="w-full text-base">
                    <thead className="uppercase bg-secondary text-base">
                        <tr>
                            {heads &&
                                heads.map((head: string, i: number) => (
                                    <th
                                        key={head[0] + i}
                                        scope="col"
                                        className="px-6 py-3"
                                    >
                                        {head}
                                    </th>
                                ))}
                            <th key={"20"} scope="col" className="px-6 py-3">
                                أكشن
                            </th>
                        </tr>
                    </thead>
                    <tbody className="border-t-2 border-gray-700 py-10">
                        {rooms &&
                            rooms.map((item: any, i: number) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-700 bg-elements duration-300 hover:bg-secondary hover:text-mainActiveText"
                                >
                                    <th scope="col" className="px-6 py-3">
                                        {item.name}
                                    </th>
                                    <th
                                        className={`px-6 py-4 ${
                                            item.isActive
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {item.isActive ? "مُفعّل" : "مُعطّل"}
                                    </th>
                                    <td className={`px-6 py-d`}>
                                        {item.isActive
                                            ? "لايوجد"
                                            : item.deActiveReason}
                                    </td>
                                    <td
                                        scope="col"
                                        className="px-6 py-3"
                                        title={item.contents}
                                    >
                                        {item.contents}
                                    </td>
                                    <td scope="col" className="px-6 py-3">
                                        ${item.costPerHourForSingle}
                                    </td>
                                    <td scope="col" className="px-6 py-3">
                                        ${item.costPerHourForMulti}
                                    </td>
                                    <td scope="col" className="px-6 py-3">
                                        {item.maxFreeTime}د
                                    </td>
                                    <td scope="col" className="px-6 py-3">
                                        {item.notes ? item.notes : "لا يوجد"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-5 text-base">
                                            <button
                                                title="Edit"
                                                className="
                                                py-1 px-2 rounded-full cursor-pointer duration-300 hover:bg-mainBlue
                                            "
                                                onClick={() => {
                                                    handleEditRoom(
                                                        item.name,
                                                        item.id
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                            <button
                                                title="Delete"
                                                className="text-red-500 py-1 px-2 rounded-full cursor-pointer duration-300 hover:bg-white"
                                                onClick={() =>
                                                    handleDeleteRoom(
                                                        item.name,
                                                        item.id
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );   
}

export default RoomsTable