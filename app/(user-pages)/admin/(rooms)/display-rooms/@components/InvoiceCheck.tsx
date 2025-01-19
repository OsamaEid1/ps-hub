'use client'
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainButton from "app/@components/ui/form/MainButton";
import Loading from "app/@components/ui/Loading";
import Modal from "app/@components/ui/Modal"
import Popup from "app/@components/ui/Popup";
import { endTheInvoice } from "app/helpers/admin/invoice/endTheInvoice";
import { fetchInvoiceById } from "app/helpers/admin/invoice/fetchInvoiceById";
import { updateBuffetTakenWithStock } from "app/helpers/admin/invoice/updateBuffetTakenWithStock";
import { Invoice, Room } from "app/helpers/constants";
import { useEffect, useRef, useState } from "react";

type TimeDifference = {
    hours: number;
    minutes: number;
}

function InvoiceCheck({ room, onToggle }) {
    const [isPopupOpened, setIsPopupOpened] = useState(false);
    const [popupText, setPopupText] = useState<string| null>(null);
    const [triggeredRmvItem, setTriggeredRmvItem] = useState({name: '', price: 0, qty: 0});
    const [confirmRmvItem, setConfirmRmvItem] = useState<boolean>(false);
    const [removeItemLoading, setRemoveItemLoading] = useState<boolean>(false);
    const [removeItemErr, setRemoveItemErr] = useState<string | null>(null);

    const [updatedRoom, setUpdatedRoom] = useState(room);

    const [invoice, setInvoice] = useState<null | Invoice>(null);
    const [fetchInvoiceLoading, setFetchInvoiceLoading] = useState<boolean>(false);
    const [fetchInvoiceErr, setFetchInvoiceErr] = useState<null | string>(null);

    const [endInvoiceLoading, setEndInvoiceLoading] = useState<boolean>(false);
    const [endInvoiceErr, setEndInvoiceErr] = useState<null | string>(null);

    const [totalSpentHours, setTotalSpentHours] = useState<number>(0);
    const [totalSpentMins, setTotalSpentMins] = useState<number>(0);
    const [totalPlayingCost, setTotalPlayingCost] = useState<number>(0);

    
    const handleFetchInvoice = async (invoiceId: string, userId: string) => {
        setFetchInvoiceLoading(true);
        try {
            const invoice = await fetchInvoiceById(invoiceId, userId);
            setInvoice(invoice);
        } catch (fetchInvoiceErr: any) {
            console.error(fetchInvoiceErr)
            setFetchInvoiceErr(fetchInvoiceErr);
        } finally {
            setFetchInvoiceLoading(false);
        }
    };

    /* Total Costs Calculations */
    const handleCalcTotalCost = () => {
        if (invoice) {
            if (room.playingMode === 'فردي') {
                const totalCost = calcTotalCost(room.costPerHourForSingle);
                setInvoice({...invoice, totalPrice: totalCost})
            } else {
                const totalCost = calcTotalCost(room.costPerHourForMulti);
                setInvoice({...invoice, totalPrice: totalCost})
            }
        }
    };
    const calcTotalCost = (costPerHour: number) : number => {
        const totalCostForPlaying = calcTotalCostForPlaying(costPerHour);

        return (totalCostForPlaying + (invoice?.totalBuffetPrice || 0));
    };
    const calcTotalCostForPlaying = (costPerHour: number) : number => {
        const { hours, minutes } = getDifferenceTime(room.startTime, room.endTime);
        let totalCostForPlaying = 0;

        if ((hours >= 1) || (minutes > room.maxFreeTime)) {
            totalCostForPlaying = costPerHour * hours;
            // Check For Minutes
            if ((minutes - 30) > room.maxFreeTime) {
                // Increase total cost by one hour cost, Because he passed the max Free time after the first half of hour.
                totalCostForPlaying += costPerHour;
            } else if (minutes > room.maxFreeTime) {
                // Increase total cost by 1/2 hour cost, Because he passed the max free time but didn't passe the half of hour or the max free time after it yet.
                totalCostForPlaying += costPerHour / 2;
            } 
        }

        setTotalSpentHours(hours);
        setTotalSpentMins(minutes);
        setTotalPlayingCost(totalCostForPlaying);
        return totalCostForPlaying;
    };

    const getDifferenceTime = (startTime: string, endTime: string | null): TimeDifference => {
        const parsedStartTime = new Date(startTime);
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const diffInMs = currentDate.getTime() - parsedStartTime.getTime();

        // Convert the time difference to hours and minutes
        let hours = Math.floor(diffInMs / (1000 * 60 * 60));
        let minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (endTime) {
            const parsedEndTime = endTime.split(":");
            const endTimeInHours = +parsedEndTime[0];
            const endTimeInMins = +parsedEndTime[1];
            if (hours >= endTimeInHours) {
                hours = endTimeInHours;
                if (minutes >= endTimeInMins) 
                    minutes = endTimeInMins;
            }

            return { hours, minutes };
        }

        return { hours, minutes };
    };

    useEffect(() => {if (room) handleFetchInvoice(room.openingInvoiceId, room.userId)}, []);
    
    let isCalled = useRef(false);
    useEffect(() => {
        if (!isCalled.current && invoice) {
            isCalled.current = true;
            handleCalcTotalCost()
        };
    }, [invoice]);
    

    const handleEndTheInvoice = async () => {
        setEndInvoiceLoading(true);
        setEndInvoiceErr(null);

        if (invoice && invoice.id) {
            try {
                const {updatedInvoice, updatedRoom, updatedIncome} = await endTheInvoice({
                    invoiceId: invoice.id,
                    totalSpentHours,
                    totalSpentMins,
                    totalPlayingPrice: totalPlayingCost,
                    totalBuffetPrice: invoice.totalBuffetPrice,
                    totalPrice: (totalPlayingCost + invoice?.totalBuffetPrice),
                    roomId: room.id,
                    userId: room.userId,
                });

                setUpdatedRoom(updatedRoom);
                setEndInvoiceLoading(false);
                setIsPopupOpened(true);
            } catch (error: any) {
                setEndInvoiceLoading(false);
                setEndInvoiceErr(error);
            }
        } else {
            setEndInvoiceLoading(false);
            setEndInvoiceErr('حدث خطأ ما، حاول ثانيةً !');
        }
    };

    // Remove Buffet Item
    const handleRemoveBuffetTakenItem = (name: string, price: number, qty: number) => {
        setIsPopupOpened(true);
        setPopupText(`هل تريد حذف ${name} من الفاتورة؟`);
        setTriggeredRmvItem({name, price, qty});
    };

    const handleConfirmRmvItem = async () => {
        setRemoveItemLoading(true);
        setRemoveItemErr(null);
        try {
            if (invoice?.id) {
                const {updatedInvoice,} = await updateBuffetTakenWithStock(false, invoice.id, {
                    name: triggeredRmvItem.name,
                    price: triggeredRmvItem.price,
                    itemQty: triggeredRmvItem.qty,
                    userId: invoice?.userId
                });

                setInvoice(updatedInvoice);
                setIsPopupOpened(false);
            }
        } catch (error) {
            setRemoveItemErr("حدث خطأ أثناء الحذف، حاول ثانيةً !")
        } finally {
            setRemoveItemLoading(false);
        }
    };
    

    return (
        <Modal onToggle={() => onToggle(room)} className="bg-black/80" >
            <div
                className="main-card"
            >
                {(fetchInvoiceLoading || endInvoiceLoading) && (<Loading className="rounded-main" />)}
                <h2 className="text-center my-3">فاتورة روم <span className="text-mainActiveText">#{room.name}</span></h2>
                <p className="parent-text">وضع اللعب: 
                    <span className='child-text'>{room.playingMode}</span>
                </p>
                <div className="relative">
                    {fetchInvoiceErr && (<span className="err-msg">{fetchInvoiceErr}</span>)}
                    {isPopupOpened && (
                        <Popup
                            type={popupText ? 'delete' : 'success'}
                            text={popupText ? popupText : "تم إنهاء الفاتورة بنجاح ✅"} 
                            options={popupText ? true : false}
                            onConfirm={handleConfirmRmvItem}
                            onToggle={popupText ?
                                () => setIsPopupOpened(state => state = !state)
                                : () => {setIsPopupOpened(state => state = !state); onToggle(updatedRoom)}
                            } 
                            className="relative"
                        >
                            {removeItemLoading && <Loading />}
                            {removeItemErr && <p className="bg-black/70 mt-2 text-white p-2 rounded-main">{removeItemErr}</p>}
                        </Popup>
                    )}
                    {invoice && (
                        <>
                            <p className="parent-text">اسم العميل: 
                                <span className="child-text">{invoice.customerName}</span>
                            </p>
                            <p className="parent-text">بدأ من:
                                <span className="child-text">
                                    {new Date(room.startTime).toLocaleTimeString('ar')}
                                </span>
                            </p>
                            <p className="parent-text">مدة اللعب: 
                                <span className="child-text">{totalSpentHours}س & {totalSpentMins}د</span>
                            </p>
                            <p className="parent-text">إجمالي سعر اللعب: 
                                <span className="child-text">{totalPlayingCost}ج</span>
                            </p>
                            {invoice.totalBuffetPrice ? (
                                <>  
                                    <ol className="list-decimal list-inside">
                                        <span className="parent-text">البوفيه:</span> 
                                        {invoice.totalBuffetTaken.map((item, i) => (
                                            <li className="child-text" key={i}>
                                                {item.name} * {item.qty} = {+item.price * item.qty}ج  
                                                <button className="ms-2 p-1 px-2 text-red-500 duration-300 hover:text-white hover:bg-red-500 rounded-full"
                                                    onClick={() => handleRemoveBuffetTakenItem(item.name, +item.price, +item.qty)}
                                                >
                                                <FontAwesomeIcon icon={faTrash} className="cursor-pointer" size="sm" />
                                                </button>
                                            </li>
                                        ))}
                                    </ol>
                                    <p className="parent-text">إجمالي سعر البوفيه: 
                                        <span className="child-text">{invoice.totalBuffetPrice}ج</span>
                                    </p>
                                </>
                            ) : (
                                <p className="parent-text">البوفيه: 
                                    <span className="child-text">لا شئ</span>
                                </p>
                            )}
                            <p className="parent-text mt-3 py-1 px-2 rounded-main bg-slate-300 text-black !font-bold">إجمالي المبلغ: 
                                <span className="font-extrabold ms-1 ">{totalPlayingCost + invoice.totalBuffetPrice}ج</span>
                            </p>

                            {endInvoiceErr && (<span className="err-msg">{endInvoiceErr}</span>)}
                            <MainButton 
                                type="submit"
                                className="mt-5 mx-auto"
                                onClick={handleEndTheInvoice}
                            >
                                إنهاء الفاتورة
                            </MainButton>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default InvoiceCheck;