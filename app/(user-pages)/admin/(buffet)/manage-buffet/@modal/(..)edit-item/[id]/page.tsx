"use client";
// React
import React, { useEffect, useState } from 'react'
// Helpers
import { INITIAL_BUFFET_INFO } from 'app/helpers/constants';
import { updateBuffetItemById } from 'app/helpers/admin/buffet/updateBuffetItemById';
import useGetBuffetItemById from 'app/helpers/hooks/admin/buffet/useGetBuffetItemInfoById';
// Components
import MainButton from 'app/@components/ui/form/MainButton';
import Popup from 'app/@components/ui/Popup';
import Loading from 'app/@components/ui/Loading';
import MainInput from 'app/@components/ui/form/MainInput';
import Modal from 'app/@components/ui/Modal';
import DynamicTitle from 'app/@components/global/DynamicTitle';

function EditItemIntercept({ params }) {    
    if(!params.id) history.back();

    // Conditionally Form States
    const [isPopupOpened, setIsPopupOpened] = useState(false);
    const [updatingItemLoading, setUpdatingItemLoading] = useState(false);
    const [updatingItemError, setUpdatingItemError] = useState<string | null>(null);

    // BuffetItem
    const [updatedItemInfo, setUpdatedItemInfo] = useState(INITIAL_BUFFET_INFO);
    const {loading: fetchItemLoading, error, oldItemInfo, userId} = useGetBuffetItemById(params.id);
    useEffect(() => setUpdatedItemInfo(oldItemInfo) ,[oldItemInfo]);

    // Handle Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if user didn't changes any value /**** */
        if (JSON.stringify(updatedItemInfo) === JSON.stringify(oldItemInfo)) {
            alert("لم يتم تغيير أي بيانات!");
            return;
        }
        
        setUpdatingItemLoading(true);
        try {
            await updateBuffetItemById({...updatedItemInfo, id: params.id, userId});
            setIsPopupOpened(true);
            handleReset();
        } catch (error : any) {
            setUpdatingItemError(error);
        } finally {
            setUpdatingItemLoading(false);
        }
    };
    const handleReset = () => {
        setUpdatedItemInfo(oldItemInfo);
        setUpdatingItemError(null)
    };
    // Popup
    const handlePopupToggle = () => {
        setIsPopupOpened(state => state = !state);
        history.back();
    };

    return (
        <Modal onToggle={() => history.back()}>
            <DynamicTitle title='تعديل عنصر' />
            {isPopupOpened && (
                <Popup
                    type='success'
                    text={"تم تعديل العنصر بنجاح ✅"} 
                    options={false}
                    onToggle={() => {handlePopupToggle(); history.back()}} 
                />
            )}
            <form
                dir='rtl'
                className='main-card'
                onSubmit={handleSubmit}
            >
                {fetchItemLoading ? (
                    <Loading className='rounded-main' />
                ) : (error) ?  (
                    <span className='err-msg'>{error}</span>
                ) : (
                    <>
                        <h2 className='flex justify-center gap-2'>تعديل <span className='text-mainActiveText'>{oldItemInfo.name}</span></h2>
                        <MainInput type="text" placeholder='الإسم' required
                            value={updatedItemInfo.name} onChange={(e) => setUpdatedItemInfo({...updatedItemInfo, name: e.target.value})}
                            inputStyles='mb-4'
                            />
                        <MainInput type="number" min={0} placeholder='سعر البيع' required
                            value={updatedItemInfo.price} onChange={(e) => setUpdatedItemInfo({...updatedItemInfo, price: e.target.value})}
                            inputStyles='mb-4'
                        />
                        <MainInput type="number" min={0} placeholder='السعر بعد الخصم/للعاملين' required
                            value={updatedItemInfo.discountedPrice} onChange={(e) => setUpdatedItemInfo({...updatedItemInfo, discountedPrice: e.target.value})}
                            inputStyles='mb-4'
                        />
                        <MainInput type="number" min={0} placeholder='المخزون' required
                            value={updatedItemInfo.stock} onChange={(e) => setUpdatedItemInfo({...updatedItemInfo, stock: +e.target.value})}
                            inputStyles='mb-4'
                        />
                        
                        {updatingItemLoading && (<Loading className='rounded-main' />)}
                        {updatingItemError && (<span className='err-msg'>{updatingItemError}</span>)}
                        
                        {/* Footer */}
                        <div className="text-center">
                            <MainButton type='submit'
                                className='me-3 inline-block'
                            >
                                تعديل
                            </MainButton>
                            <MainButton type='reset'
                                className='bg-red-500 hover:bg-red-600 inline-block'
                                onClick={handleReset}
                            >
                                تفريغ
                            </MainButton>
                        </div>

                    </>
                )}
            </form>
        </Modal>
    )
}

export default EditItemIntercept