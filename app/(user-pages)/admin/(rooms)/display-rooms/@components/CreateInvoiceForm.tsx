'use client'
// React
import React, { useState } from "react";
// Helpers
import { createNewInvoice } from "app/helpers/admin/invoice/createNewInvoice";
import { updateRoomById } from "app/helpers/admin/rooms/updateRoomById";
import { Room } from "app/helpers/constants";
// Components
import Loading from "app/@components/ui/Loading";
import MainButton from "app/@components/ui/form/MainButton";
import MainInput from "app/@components/ui/form/MainInput";
import Modal from "app/@components/ui/Modal";
import Popup from "app/@components/ui/Popup";

type Props = {
    room: Room,
    onToggle: (updatedRoom: Room) => void
}

function CreateInvoiceForm({ room, onToggle } : Props) {
    // Popup
    const [isPopupOpened, setIsPopupOpened] = useState(false);
    // Room
    const [updatedRoom, setUpdatedRoom] = useState(room);
    const [customerName, setCustomerName] = useState<string>("عميل خارجي");
    const [playingMode, setPlayingMode] = useState<"فردي" | "مالتي">("فردي");
    const [playingTime, setPlayingTime] = useState<"open" | "fixed">("open");
    const [endTimeInHours, setEndTimeInHours] = useState<number>(0);
    const [endTimeInMins, setEndTimeInMins] = useState<0 | 30>(0);
    // Conditionally Form States
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSetEndTimeInMins = (time: number) => {
        if (time === 0 || time === 30) setEndTimeInMins(time);
        else setEndTimeInMins(0);
    };
    const handleSetEndTimeInHours = (time: number) => {
        if (time > 0) setEndTimeInHours(time);
        else setEndTimeInHours(0);
    };

    const handleOperateTheRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const updatedRoomInfo = {
            ...room,
            isBooked: true,
            playingMode,
            startTime: '' + new Date(),
            endTime:
                playingTime === "fixed"
                ? `${endTimeInHours}:${endTimeInMins}`
                : null,
        };
        const invoice = {
            customerName,
            roomName: room.name,
            playingMode,
            totalSpentHours: 0,
            totalSpentMins: 0,
            totalBuffetTaken: [],
            totalPlayingPrice: 0,
            totalBuffetPrice: 0,
            totalPrice: 0,
            userId: room.userId,
        };

        let isInvoiceCreatedSuccessfully = false; /*** try-catch block can't get useState Changes, so we used normal variable */
        try {
            // Update the room state first
            const createdInvoice = await createNewInvoice(invoice);
            if (createdInvoice && room.id) {
                // If invoice creation succeeded, then update the room
                isInvoiceCreatedSuccessfully = true;
                await updateRoomById({
                        ...updatedRoomInfo, openingInvoiceId: createdInvoice.id
                }, room.id);
            } 

            setUpdatedRoom({...updatedRoomInfo, openingInvoiceId: createdInvoice.id});
            setLoading(false);
            setIsPopupOpened(true);
        } catch (error: any) {
            /**** */ // If Updating Room API call failed then this var remaining false, so we don't need to Roll-Back to the previous state for the Room table, But if the var is true that means that the Room API called Successfully so we must Roll-Back for cleaning any changes to the Room table.
            if (isInvoiceCreatedSuccessfully && room.id) {
                // Roll-Back to the pervious Room state
                await updateRoomById(room, room.id);
            }

            if (error.startsWith("Unexpected token") 
                || error.startsWith("Error: 404")
            ) {
                setError(
                    "حدث خطأ أثناء محاولة تحديث الروم أو إنشاء الفاتورة، حاول ثانيةً أو أعد تسجيل الدخول"
                );
            } else {
                setError(error)
            }
            console.error("API Error: ", error);
            setLoading(false);
        }
    };

    return (
        <Modal onToggle={() => onToggle(room)}>
            <form
                dir="rtl"
                className="main-card flex flex-col gap-3relative"
                onSubmit={handleOperateTheRoom}
            >
                {isPopupOpened && (
                    <Popup
                        type='success'
                        text={"تم تشغيل الرروم بنجاح ✅"} 
                        options={false}
                        onToggle={() => {setIsPopupOpened(state => state = !state); onToggle(updatedRoom)}} 
                    />
                )}
                <h2 className="text-center mb-3">تشغيل روم #{room.name}</h2>
                {/* Start Invoice Contents */}
                <div>
                    {/* Customer Name */}
                    <MainInput
                        id={1}
                        placeholder="اسم العميل"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required={true}
                    />
                    {/* Playing Mode */}
                    <div className="font-semibold select-none mb-2 mt-4">
                        وضع اللعب &#8198; &#8198; &#8198;
                        <label htmlFor="single" className="text-lg cursor-pointer">
                            فردي &#8198;
                            <input
                                type="radio"
                                name="play-mode"
                                id="single"
                                className="focus:outline-mainBlue ml-2"
                                checked={playingMode === "فردي"}
                                onChange={() => setPlayingMode("فردي")}
                            />
                        </label>
                        &#8198; &#8198; &#8198;
                        <label htmlFor="multi" className="text-lg cursor-pointer">
                            مالتي &#8198;
                            <input
                                type="radio"
                                name="play-mode"
                                id="multi"
                                className="focus:outline-mainBlue"
                                checked={playingMode === "مالتي"}
                                onChange={() => setPlayingMode("مالتي")}
                            />
                        </label>
                    </div>
                    {/* Playing Time */}
                    <div className="font-semibold select-none my-2">
                        مدة اللعب &#8198; &#8198; &#8198;
                        <label htmlFor="open" className="text-lg cursor-pointer">
                            مفتوح &#8198;
                            <input
                                type="radio"
                                name="play-time"
                                id="open"
                                className="focus:outline-mainBlue ml-2"
                                checked={playingTime === "open"}
                                onChange={() => setPlayingTime("open")}
                            />
                        </label>
                        &#8198; &#8198; &#8198;
                        <label htmlFor="fixed" className="text-lg cursor-pointer">
                            مُحدد &#8198;
                            <input
                                type="radio"
                                name="play-time"
                                id="fixed"
                                className="focus:outline-mainBlue"
                                checked={playingTime === "fixed"}
                                onChange={() => setPlayingTime("fixed")}
                            />
                        </label>
                    </div>
                    {playingTime === "fixed" && (
                        <div className="my-3 text-center bg-primary p-2 rounded-main">
                            <label className="me-3">
                                ساعات:
                                <input
                                    id="endTimeInHours"
                                    className="w-10 text-center rounded-lg font-semibold ms-1 text-base focus:outline-2 focus:outline-mainBlue"
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={endTimeInHours}
                                    onChange={(e) =>
                                        handleSetEndTimeInHours(+e.target.value)
                                    }
                                />
                            </label>
                            <label>
                                دقائق:
                                <input
                                    id="endTimeInMins"
                                    className="w-10 text-center rounded-lg font-semibold ms-1 text-base focus:outline-2 focus:outline-mainBlue"
                                    type="number"
                                    min={0}
                                    max={30}
                                    step={30}
                                    value={endTimeInMins}
                                    onChange={(e) =>
                                        handleSetEndTimeInMins(+e.target.value)
                                    }
                                />
                            </label>
                        </div>
                    )}

                    {loading && <Loading className="rounded-main" />}
                    {error && <span className="err-msg">{error}</span>}

                    {/* Operate The Room */}
                    <MainButton type="submit" className="mx-auto mt-7">
                        تشغيل
                    </MainButton>
                </div>
                {/* End Invoice Contents */}
            </form>
        </Modal>
    );
}

export default CreateInvoiceForm;
