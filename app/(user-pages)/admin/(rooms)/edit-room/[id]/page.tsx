"use client";
// React
import React, { useEffect, useState } from 'react'
// Helpers
import useGetRoomById from 'app/helpers/hooks/admin/rooms/useGetRoomById';
import { INITIAL_EDITABLE_ROOM_INFO_STRUCTURE } from 'app/helpers/constants';
import { updateRoomById } from 'app/helpers/admin/rooms/updateRoomById';
import { notFound } from 'next/navigation';
// Components
import MainButton from 'app/@components/ui/form/MainButton';
import Popup from 'app/@components/ui/Popup';
import Loading from 'app/@components/ui/Loading';
import MainInput from 'app/@components/ui/form/MainInput';
import DynamicTitle from 'app/@components/global/DynamicTitle';
import CheckAuthorityPopup from 'app/@components/global/CheckAuthorityPopup';

function EditRoom({ params }) {    
    if(!params.id) history.back();


    // Room
    const [isPopupOpened, setIsPopupOpened] = useState(false);
    const [updatingRoomLoading, setUpdatingRoomLoading] = useState(false);
    const [updatingRoomError, setUpdatingRoomError] = useState<string | null>(null);
    // Get The Room States
    const {loading: fetchRoomLoading, error, oldRoomInfo, userId} = useGetRoomById(params.id);
    // Check Authority
    const [isCheckingAuthorityPopupOpened, setIsCheckingAuthorityPopupOpened] = useState(true);
    const [isAuthorizationSucceed, setIsAuthorizationSucceed] = useState(false);
    // Update The Room States
    const [updatedRoomInfo, setUpdatedRoomInfo] = useState(INITIAL_EDITABLE_ROOM_INFO_STRUCTURE);

    useEffect(() => {
        if (!fetchRoomLoading && !error) setUpdatedRoomInfo(oldRoomInfo);
        else if (!fetchRoomLoading && error) notFound(); /*** Next.js App Router provides a notFound() function that you can use to trigger the not-found.js page from within your server-side or client-side components. */
    },[fetchRoomLoading, oldRoomInfo]);

    // Form Handle
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isAuthorizationSucceed) {
            // Check if user didn't changes any value /**** */
            if (JSON.stringify(updatedRoomInfo) === JSON.stringify(oldRoomInfo)) {
                alert("لم يتم تغيير أي بيانات!");
                return;
            }
            
            setUpdatingRoomLoading(true);
            try {
                await updateRoomById({...updatedRoomInfo, userId: userId}, params.id);
                setIsPopupOpened(true);
                handleReset();
            } catch (e : any) {
                setUpdatingRoomError("حدث خطأ أثناء محاولة تحديث الروم، حاول ثانيةً");
            } finally {
                setUpdatingRoomLoading(false);
            }
        } else {
            alert('يجب تأكيد هويتك أولاً؛ لذا أعد تحميل الصفحة وأكد هويتك')
        }
    };
    const handleReset = () => {
        setUpdatedRoomInfo(updatedRoomInfo);
        setUpdatingRoomError(null)
    };

    // Popup
    const handlePopupToggle = () => {
        setIsPopupOpened(state => state = !state);
        history.back();
    };

    return (
        <>
            <DynamicTitle title={`تعديل روم ${oldRoomInfo.name}`} />
            {isPopupOpened && (
                <Popup
                    type='success'
                    text={"تم تحديث الروم بنجاح ✅"} 
                    className='bg-green-600 text-white'
                    options={false}
                    onToggle={handlePopupToggle} 
                />
            )}
            {isCheckingAuthorityPopupOpened && (
                <CheckAuthorityPopup
                    onToggle={() => setIsCheckingAuthorityPopupOpened(false)}
                    userId={userId}
                    setIsAuthorizationSucceed={setIsAuthorizationSucceed}
                />
            )}
            <form
                dir='rtl'
                className='main-card'
                onSubmit={handleSubmit}
            >
            {fetchRoomLoading ? (
                <Loading />
            ) : (error) ?  (
                <span className='err-msg'>{error}</span>
            ) : (
                <>
                    {updatingRoomLoading && (<Loading />)}
                    <h2>تعديل روم <span className='text-mainActiveText'>{oldRoomInfo.name}</span></h2>
                    <MainInput 
                        inputStyles='mb-4'
                        id='name'
                        type="text" placeholder='رقم/اسم الروم' required
                        value={updatedRoomInfo.name} onChange={(e) => setUpdatedRoomInfo({...updatedRoomInfo, name: (e.target.value).trim()})}
                    />
                    <MainInput 
                        inputStyles='mb-4'
                        id='content'
                        type="text"
                        placeholder='محتوياتها/مميزاتها - يجب فصل كل ميزة عن الأخرى بفاصلة (,) " (PS 4 , GATA , FIFA 2024)' required
                        arrValue={updatedRoomInfo.contents}
                        onChange={(e) => setUpdatedRoomInfo({...updatedRoomInfo, contents: ((e.target.value).trim())?.split(",")})}
                        className='text-sm'
                    />
                    <MainInput 
                        inputStyles='mb-4'
                        id='single-cost'
                        type="number" placeholder='سعر الساعة الفردي' required
                        value={updatedRoomInfo.costPerHourForSingle} onChange={(e) => setUpdatedRoomInfo({...updatedRoomInfo, costPerHourForSingle: +(e.target.value).trim()})}
                    />
                    <MainInput 
                        inputStyles='mb-4'
                        id='multi-cost'
                        type="number" placeholder='سعر الساعة المالتي' required
                        value={updatedRoomInfo.costPerHourForMulti} onChange={(e) => setUpdatedRoomInfo({...updatedRoomInfo, costPerHourForMulti: +(e.target.value).trim()})}
                    />
                    <MainInput 
                        inputStyles='mb-4'
                        id='free'
                        type="number" placeholder='الوقت المسموح فيه بإلغاء الحجز بدون رسوم - مثال:  10 (أو 0 لعدم التفعيل)' required
                        value={updatedRoomInfo.maxFreeTime} onChange={(e) => setUpdatedRoomInfo({...updatedRoomInfo, maxFreeTime: (e.target.value).trim()})}
                    />
                    <MainInput 
                        inputStyles='mb-4'
                        id='note'
                        type="text" placeholder='أي ملاحظات إضافية؟ (اختياري)'
                        value={updatedRoomInfo.notes} onChange={(e) => setUpdatedRoomInfo({...updatedRoomInfo, notes: (e.target.value).trim()})}
                        required={false}
                    />
                    <div className='font-semibold mb-4'>
                        &#8198;
                        متاح؟
                        &#8198;
                        &#8198;
                        &#8198;
                        <label htmlFor='yes'
                            className='text-lg cursor-pointer'
                        >
                            أه
                            &#8198;
                            <input 
                                type="radio" name="yes" id="yes"
                                className='bg-red-500 text-red-500'
                                
                                checked={updatedRoomInfo.isActive}
                                onChange={() => 
                                    setUpdatedRoomInfo({
                                        ...updatedRoomInfo,
                                        isActive: true,
                                        deActiveReason: ""
                                })}
                            />
                        </label>
                        &#8198;
                        &#8198;
                        &#8198;
                        <label htmlFor="no"
                            className='text-lg cursor-pointer'
                        >
                            لا
                            &#8198;
                            <input
                                type="radio" name="no" id="no"
                                className='bg-red-500 text-red-500'
                                checked={!updatedRoomInfo.isActive}
                                onChange={() => setUpdatedRoomInfo({...updatedRoomInfo, isActive: false})}
                            />
                        </label>
                    </div>
                    {!updatedRoomInfo.isActive && (
                        <MainInput 
                            inputStyles='mb-4'
                            id='is-active'
                            type="text" placeholder='سبب التعطيل؟' required
                            value={updatedRoomInfo.deActiveReason || ''}
                            onChange={(e) => setUpdatedRoomInfo({...updatedRoomInfo, deActiveReason: (e.target.value).trim()})}
                        />
                    )}
                    {updatingRoomError && (
                        <span className="text-red-500">{updatingRoomError}</span>
                    )}
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
        </>
    )
}

export default EditRoom