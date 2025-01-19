'use client'
// React
import { useEffect, useRef, useState } from "react";
// Helpers
import useGetBuffet from "app/helpers/hooks/admin/buffet/useGetBuffet";
import { INITIAL_BUFFET_INFO } from "app/helpers/constants";
import { updateBuffetTakenWithStock } from "app/helpers/admin/invoice/updateBuffetTakenWithStock";
// Components
import Modal from "app/@components/ui/Modal";
import Loading from "app/@components/ui/Loading";
import MainButton from "app/@components/ui/form/MainButton";
import Popup from "app/@components/ui/Popup";

type Props = {
    userId: string,
    invoiceId: string,
    roomName: string,
    onToggle: () => void
}

function AddBuffetItemToRunningRoom({ userId, invoiceId, roomName, onToggle}: Props) {
    const [isPopupOpened, setIsPopupOpened] = useState(false);

    const [addToInvoiceLoading, setAddToInvoiceLoading] = useState<boolean>(false);
    const [addToInvoiceError, setAddToInvoiceError] = useState<null | string>(null);

    const [selectedItem, setSelectedItem] = useState(INITIAL_BUFFET_INFO);
    const [selectedItemQty, setSelectedItemQty] = useState<number>(0);

    // Buffet
    const {loading: buffetLoading, error: buffetError, buffet} = useGetBuffet(userId);
    const [updatedBuffet, setUpdatedBuffet] = useState(buffet);
    useEffect(() => {
        if (buffet) 
            setUpdatedBuffet(buffet);
    }, [buffet])
    
    const handleSelectBuffetItem = (itemId: string) => {
        const selectedItem = updatedBuffet.find(item => item.id === itemId);
        
        if (selectedItem) setSelectedItem(selectedItem);
    };

    // Update
    const selectRef = useRef<HTMLSelectElement | null>(null); /*** Essential type for Select ele */
    const handleResetAfterSuccessUpdating = (updatedBuffetItem) => {
        setAddToInvoiceLoading(false);
        setIsPopupOpened(true);
        setSelectedItem(INITIAL_BUFFET_INFO);
        setSelectedItemQty(0);
        selectRef.current!.value = '0'; /*** The "!" operator is a way to tell TypeScript that you're sure a value is not null or undefined at that point, and it can safely be accessed. */

        for (let i = 0; i < updatedBuffet.length; i++) {
            if (updatedBuffet[i].name === updatedBuffetItem.name) {
                updatedBuffet[i].stock = updatedBuffetItem.stock;
                break;
            }
        };
    };
    const handleAddItemToInvoice = async () => {
        setAddToInvoiceLoading(true);
        setAddToInvoiceError(null);

        try {
            const {updatedInvoice, updatedBuffetItem} = await updateBuffetTakenWithStock(true, invoiceId, {
                name: selectedItem.name,
                price: +selectedItem.price,
                itemQty: selectedItemQty,
                userId: selectedItem.userId
            });

            handleResetAfterSuccessUpdating(updatedBuffetItem);
        } catch (error: any) {
            setAddToInvoiceLoading(false);
            setAddToInvoiceError(error);
        }
    };

    return (
        <Modal onToggle={onToggle}>
            <form className="main-card">
                <h3 className="text-center mb-4">إضافة مشروب / أكل على روم <span className="text-mainActiveText">#{roomName}</span></h3>
                {(addToInvoiceLoading || buffetLoading) && (<Loading className="rounded-main" />)}
                {isPopupOpened && (
                    <Popup
                        type='success'
                        text={"تم إضافة العنصر على الفاتورة بنجاح ✅"} 
                        options={false}
                        onToggle={() => setIsPopupOpened(state => state = !state)} 
                    />
                )}
                {buffetError && (<span className="err-msg">{buffetError}</span>)}
                {updatedBuffet && (
                    <div className="flex">
                        <select
                            className="text-black rounded-main p-1 cursor-pointer font-medium"
                            onChange={(e) => handleSelectBuffetItem(e.target.value)}
                            ref={selectRef}
                        >
                            <option value="0">-- اختر عنصر --</option>
                            {updatedBuffet.map((item, indx) => (
                                <option
                                    value={item.id}
                                    key={indx} 
                                    className="text-center"
                                    disabled={item.stock ? false : true}
                                    /**** Option ele doesn't support 'onClick' even in its children also! */
                                    >
                                        {item.name} - {item.price}ج {item.stock ? '' : '- نفذ'}
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
                        <MainButton
                            disabled={selectedItemQty ? false : true}
                            onClick={handleAddItemToInvoice}
                        >
                            إضافة
                        </MainButton>
                    </div>
                )}
                {addToInvoiceError && (<span className="err-msg">{addToInvoiceError}</span>)}
            </form>
        </Modal>
    )
}

export default AddBuffetItemToRunningRoom