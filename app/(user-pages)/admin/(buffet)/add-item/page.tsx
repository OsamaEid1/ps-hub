"use client";
// React
import React, { useEffect, useState } from 'react'
// Helpers
import { INITIAL_BUFFET_INFO } from "../../../../helpers/constants";
import { createNewBuffetItem } from 'app/helpers/admin/buffet/createNewBuffetItem';
import useGetUserInfo from 'app/helpers/hooks/user/useGetUserInfo';

// Components
import MainButton from 'app/@components/ui/form/MainButton';
import Popup from 'app/@components/ui/Popup';
import Loading from 'app/@components/ui/Loading';
import MainInput from 'app/@components/ui/form/MainInput';
import DynamicTitle from 'app/@components/global/DynamicTitle';

const AddRoom = () =>  {
    /*Why we didn't simply just use ID for Buffet?
    indicates that the id field in your Buffet model is supposed to be a valid MongoDB ObjectId,
    which has a specific format (24-character hex string).
    However, it appears that the value you're trying to use for the id is invalid.
    */ /**** */


    // Buffet
    const [buffetItemInfo, setBuffetItemInfo] = useState(INITIAL_BUFFET_INFO);
    const {loading: userInfoLoading, userInfo} = useGetUserInfo();
    useEffect(() => {
        if(!userInfoLoading && userInfo) setBuffetItemInfo({ ...INITIAL_BUFFET_INFO, userId: userInfo.id });
    },[userInfo]);

    
    // Handle Form
    const [isPopupOpened, setIsPopupOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createNewBuffetItem({...buffetItemInfo});

            setBuffetItemInfo(INITIAL_BUFFET_INFO);
            setIsPopupOpened(true);
            setError(null);
        } catch (e : any) {
            console.error(e)
            setError(e)
        } finally {
            setLoading(false);
        }
    };
    const handleReset = () => setBuffetItemInfo({ ...INITIAL_BUFFET_INFO, userId: userInfo?.id || '' });

        
    return (
        <>
            <DynamicTitle title='إضافة عنصر' />
            {isPopupOpened && (
                <Popup
                    type='success'
                    text={"تم إضافة العنصر بنجاح ✅"} 
                    options={false}
                    onToggle={() => setIsPopupOpened(state => state = !state)} 
                />
            )}
            <form
                dir='rtl'
                className='main-card'
                onSubmit={handleSubmit}
            >
                {loading && (<Loading className='rounded-main' />)}
                <h2>إضافة عنصر جديد إلى البوفيه</h2>
                <MainInput type="text" placeholder='الإسم' required
                    value={buffetItemInfo.name} onChange={(e) => setBuffetItemInfo({...buffetItemInfo, name: e.target.value})}
                    inputStyles='mb-4'
                />
                <MainInput type="number" min={0} placeholder='سعر البيع' required
                    value={buffetItemInfo.price} onChange={(e) => setBuffetItemInfo({...buffetItemInfo, price: e.target.value})}
                    inputStyles='mb-4'
                />
                <MainInput type="number" min={0} placeholder='السعر بعد الخصم/للعاملين' required
                    value={buffetItemInfo.discountedPrice} onChange={(e) => setBuffetItemInfo({...buffetItemInfo, discountedPrice: e.target.value})}
                    inputStyles='mb-4'
                />
                <MainInput type="number" min={0} placeholder='المخزون' required
                    value={buffetItemInfo.stock} onChange={(e) => setBuffetItemInfo({...buffetItemInfo, stock: +e.target.value})}
                    inputStyles='mb-4'
                />

                {error && (<span className='err-msg'>{error}</span>)}

                {/* Footer */}
                <div className="text-center">
                    <MainButton type='submit'
                        className='me-3 inline-block'
                    >
                        إضافة
                    </MainButton>
                    <MainButton type='reset'
                        className='bg-red-500 hover:bg-red-600 inline-block'
                        onClick={handleReset}
                    >
                        تفريغ
                    </MainButton>
                </div>
            </form>
        </>
    )
};

export default AddRoom;