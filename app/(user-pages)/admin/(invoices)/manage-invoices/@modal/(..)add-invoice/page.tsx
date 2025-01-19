'use client'
// React
import React, { useEffect, useRef, useState } from "react";
// Helpers
import { BuffetItem, INITIAL_BUFFET_INFO } from "app/helpers/constants";
import useGetBuffet from "app/helpers/hooks/admin/buffet/useGetBuffet";
import { createExternalInvoice } from "app/helpers/admin/invoice/createExternalInvoice";
// Components
import Loading from "app/@components/ui/Loading";
import MainInput from "app/@components/ui/form/MainInput";
import MainButton from "app/@components/ui/form/MainButton";
import Popup from "app/@components/ui/Popup";
import Modal from "app/@components/ui/Modal";
import DynamicTitle from "app/@components/global/DynamicTitle";

// type Props = {
//     room: Room,
//     onToggle: (arg0: Room) => void
// }

function AddInvoiceIntercept() {
    // Popup
    const [isPopupOpened, setIsPopupOpened] = useState(false);
    // Room Info
    const [roomName, setRoomName] = useState('عميل خارجي');
    const [customerName, setCustomerName] = useState<string>("عميل خارجي");
    const [playingMode, setPlayingMode] = useState<"فردي" | "مالتي" | null>(null);
    const [isCustomerPlayed, setIsCustomerPlayed] = useState<boolean>(false);
    const [totalSpentHours, setTotalSpentHours] = useState<number>(0);
    const [totalSpentMins, setTotalSpentMins] = useState<0 | 30>(0);
    const [costPerHour, setCostPerHour] = useState<number>(0);
    // Buffet
    const [selectedItem, setSelectedItem] = useState(INITIAL_BUFFET_INFO);
    const [selectedItemQty, setSelectedItemQty] = useState<number>(0);
    const [isItemWithDiscount, setIsItemWithDiscount] = useState<boolean>(false);
    const [totalBuffetTaken, setTotalBuffetTaken] = useState<BuffetItem[]>([]);
    const [totalBuffetPrice, setTotalBuffetPrice] = useState<number>(0);
    // // Conditionally Form States
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Time
    const handleSetTotalSpentHours = (time: number) => {
        if (time > 0) setTotalSpentHours(time);
        else setTotalSpentHours(0);
    };
    const handleSetTotalSpentMins = (time: number) => {
        if (time === 0 || time === 30) setTotalSpentMins(time);
        else setTotalSpentMins(0);
    };

    // Buffet
    const {loading: buffetLoading, error: buffetError, buffet, userId} = useGetBuffet();
    const [updatedBuffet, setUpdatedBuffet] = useState(buffet);

    useEffect(() => {if (buffet) setUpdatedBuffet(buffet)}, [buffet]);
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const handleSelectBuffetItem = (itemId: string) => {
        const selectedItem = updatedBuffet.find(item => item.id === itemId);
        
        if (selectedItem) setSelectedItem(selectedItem);
    };
    const handleTakeBuffetItem = () => {
        if (isItemWithDiscount) {
            const newTotalBuffetTaken = [...totalBuffetTaken, {name: selectedItem.name, qty: selectedItemQty, price: selectedItem.discountedPrice}];
            setTotalBuffetTaken(newTotalBuffetTaken);
            
            setTotalBuffetPrice( oldTotal => {
                return oldTotal + (+selectedItem.discountedPrice * selectedItemQty);
            });
            // Reset
            setSelectedItem(INITIAL_BUFFET_INFO);
            setSelectedItemQty(0);
            selectRef.current!.value = '0';
        }
        else {
            const newTotalBuffetTaken = [...totalBuffetTaken, {name: selectedItem.name, qty: selectedItemQty, price: selectedItem.price}];
            setTotalBuffetTaken(newTotalBuffetTaken);

            setTotalBuffetPrice( oldTotal => {
                return oldTotal + (+selectedItem.price * selectedItemQty);
            });
            // Reset
            setSelectedItem(INITIAL_BUFFET_INFO);
            setSelectedItemQty(0);
            selectRef.current!.value = '0';
        }
    };

    // Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const totalPlayingPrice =
            totalSpentMins >= 30
                ? totalSpentHours * costPerHour + costPerHour / 2
                : totalSpentHours * costPerHour;
            
        if (totalPlayingPrice > 0 || totalBuffetPrice > 0) {
            let invoice = {
                userId,
                customerName,
                roomName,
                playingMode: playingMode ? playingMode : "لا شئ",
                totalSpentHours,
                totalSpentMins,
                totalBuffetTaken,
                totalPlayingPrice,
                totalBuffetPrice,
                totalPrice: totalPlayingPrice + totalBuffetPrice
            };
    
            try {
                await createExternalInvoice(invoice);
    
                setIsPopupOpened(true);
                resetForm();
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
            
        } else {
            setError('يجب أن يكون العميل قد اشترى شيئاً أو لَعِب !');
            setLoading(false);
        }
    };
    const resetForm = () => {
        setRoomName('عميل خارجي');
        setCustomerName('عميل خارجي');
        setPlayingMode('فردي');
        setIsCustomerPlayed(false);
        setTotalSpentHours(0);
        setTotalSpentMins(0);
        setCostPerHour(0);
        setSelectedItem(INITIAL_BUFFET_INFO);
        setSelectedItemQty(0);
        setIsItemWithDiscount(false);
        setTotalBuffetTaken([]);
        setTotalBuffetPrice(0);
    };

    return (
        <Modal onToggle={() => {history.back()}}>
            <DynamicTitle title='إضافة فاتورة خارجية' />
            <form
                dir="rtl"
                className="main-card flex flex-col gap-3 relative w-fit"
                onSubmit={handleSubmit}
            >
                {isPopupOpened && (
                    <Popup
                        type='success'
                        text={"تم إضافة الفاتورة بنجاح ✅"} 
                        options={false}
                        onToggle={() => {setIsPopupOpened(state => state = !state); history.back();}} 
                    />
                )}
                <h2>إضافة فاتورة خارجية</h2>
                {/* Start Invoice Contents */}
                <div>
                    {/* Customer Name */}
                    <MainInput
                        id={1}
                        placeholder="اسم الروم"
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required={true}
                        inputStyles="mb-5"
                    />
                    {/* Customer Name */}
                    <MainInput
                        id={2}
                        placeholder="اسم العميل"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required={true}
                    />
                    {/* If customer has played or took a food/drink */}
                    <div className="font-semibold select-none mb-2 mt-4">
                        هل لعِب؟ &#8198; &#8198; &#8198;
                        <label htmlFor="yes" className="text-lg cursor-pointer">
                            نعم &#8198;
                            <input
                                type="radio"
                                name="is-played"
                                id="yes"
                                className="focus:outline-mainBlue ml-2"
                                checked={isCustomerPlayed}
                                onChange={() => setIsCustomerPlayed(!isCustomerPlayed)}
                            />
                        </label>
                        &#8198; &#8198; &#8198;
                        <label htmlFor="no" className="text-lg cursor-pointer">
                            لا &#8198;
                            <input
                                type="radio"
                                name="is-played"
                                id="no"
                                className="focus:outline-mainBlue"
                                checked={!isCustomerPlayed}
                                onChange={() => setIsCustomerPlayed(!isCustomerPlayed)}
                            />
                        </label>
                    </div>
                    {isCustomerPlayed && (
                        <>
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
                            <div className="my-3 flex flex-col xsm:flex-row gap-2 xsm:gap-1 bg-primary p-2 rounded-main">
                                <label className="me-3">
                                    سعر الساعة:
                                    <input
                                        id="totalSpentHours"
                                        className="w-12 h-8 text-center rounded-lg font-semibold ms-1 text-base focus:outline-2 focus:outline-mainBlue"
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={costPerHour}
                                        onChange={(e) =>
                                            setCostPerHour(+e.target.value)
                                        }
                                    />
                                </label>
                                <label className="me-3">
                                    ساعات:
                                    <input
                                        id="totalSpentHours"
                                        className="w-12 h-8 text-center rounded-lg font-semibold ms-1 text-base focus:outline-2 focus:outline-mainBlue"
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={totalSpentHours}
                                        onChange={(e) =>
                                            handleSetTotalSpentHours(+e.target.value)
                                        }
                                    />
                                </label>
                                <label>
                                    دقائق:
                                    <input
                                        id="totalSpentMins"
                                        className="w-12 h-8 text-center rounded-lg font-semibold ms-1 text-base focus:outline-2 focus:outline-mainBlue"
                                        type="number"
                                        min={0}
                                        max={30}
                                        step={30}
                                        value={totalSpentMins}
                                        onChange={(e) =>
                                            handleSetTotalSpentMins(+e.target.value)
                                        }
                                    />
                                </label>
                            </div>
                        </>
                    )}
                    {/* Buffet Taken */}
                    <div className="flex-col mt-4 mb-4">
                        <div className="flex justify-between">
                            <select
                                className="text-black rounded-main p-1 cursor-pointer font-medium"
                                onChange={(e) => handleSelectBuffetItem(e.target.value)}
                                ref={selectRef}
                            >
                                <option value="0">-- اختر عنصر --</option>
                                {buffetLoading && (<option disabled={true}>جاري التحميل...</option>)}
                                {buffetError && (<option disabled={true} className="err-msg">{buffetError}</option>)}
                                {!buffetLoading && !buffetError && updatedBuffet.map((item, indx) => (
                                    <option
                                        value={item.id}
                                        key={indx} 
                                        className="text-center"
                                        disabled={item.stock ? false : true}
                                    >
                                        {item.name} - {item.price}ج/{item.discountedPrice}ج {item.stock ? '' : '- نفذ'}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                name="qty"
                                min={0}
                                value={selectedItemQty}
                                max={selectedItem?.stock}
                                onChange={(e) => setSelectedItemQty(
                                    (+e.target.value > selectedItem?.stock) ? selectedItem.stock : +e.target.value
                                )}
                                className="main-input rounded-main text-center mx-3 w-20"
                            />
                        </div>
                        <div className="flex flex-col xsm:flex-row justify-between mt-3">
                            <div className="font-semibold select-none my-2">
                                خصم؟ &#8198; &#8198;
                                <label htmlFor="disc-yes" className="text-lg cursor-pointer">
                                    نعم &#8198;
                                    <input
                                        type="radio"
                                        name="discount"
                                        id="disc-yes"
                                        className="focus:outline-mainBlue ml-2"
                                        checked={isItemWithDiscount}
                                        onChange={() => setIsItemWithDiscount(!isItemWithDiscount)}
                                    />
                                </label>
                                &#8198; 
                                <label htmlFor="disc-no" className="text-lg cursor-pointer">
                                    لا &#8198;
                                    <input
                                        type="radio"
                                        name="discount"
                                        id="disc-no"
                                        className="focus:outline-mainBlue"
                                        checked={!isItemWithDiscount}
                                        onChange={() => setIsItemWithDiscount(!isItemWithDiscount)}
                                    />
                                </label>
                            </div>
                            <MainButton
                                disabled={selectedItemQty ? false : true}
                                onClick={handleTakeBuffetItem}
                                className="py-0 px-4 text-md me-2"
                            >
                                إضافة
                            </MainButton>
                        </div>
                        {/* Display Taken Buffet */}
                        {totalBuffetPrice > 0 && (
                            <ol className="list-decimal list-inside bg-elements my-2 p-2 rounded-main">
                                <span className="parent-text">البوفيه:</span> 
                                {totalBuffetTaken.map((item, i) => (
                                    <li className="child-text" key={i}>{item.name} * {item.qty} = {+item.price * item.qty}ج</li>
                                ))}
                            </ol>
                        )}
                    </div>

                    {loading && <Loading className="rounded-main" />}
                    {error && <span className="err-msg">{error}</span>}

                    {/* Operate The Room */}
                    <MainButton type="submit" className="mx-auto mt-7">
                        إضافة الفاتورة
                    </MainButton>
                </div>
                {/* End Invoice Contents */}
            </form>
        </Modal>
    )
}

export default AddInvoiceIntercept