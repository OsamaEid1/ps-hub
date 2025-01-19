"use client";
// React
import React, { useEffect, useState } from 'react'
// Components
import MainButton from 'app/@components/ui/form/MainButton';
import Popup from 'app/@components/ui/Popup';
import Loading from 'app/@components/ui/Loading';
import MainInput from 'app/@components/ui/form/MainInput';
// Helpers
import { INITIAL_EDITABLE_ROOM_INFO_STRUCTURE } from "../../../../helpers/constants"; /* */
import { createNewRoom } from 'app/helpers/admin/rooms/createNewRoom';
import useGetUserInfo from 'app/helpers/hooks/user/useGetUserInfo';
import DynamicTitle from 'app/@components/global/DynamicTitle';


const AddRoom = () =>  {
    /*Why we didn't simply just use ID for Room?
    indicates that the id field in your Room model is supposed to be a valid MongoDB ObjectId,
    which has a specific format (24-character hex string).
    However, it appears that the value you're trying to use for the id is invalid.
    */

    const [roomInfo, setRoomInfo] = useState(INITIAL_EDITABLE_ROOM_INFO_STRUCTURE);
    const [reset, setReset] = useState(false);

    const {loading: userInfoLoading, userInfo} = useGetUserInfo();
    useEffect(() => {
        if(!userInfoLoading && userInfo) {
            // Set User's ID as a first prop
            setRoomInfo({...INITIAL_EDITABLE_ROOM_INFO_STRUCTURE, userId: userInfo.id});
        }
    },[userInfo, reset]);

    const [error, setError] = useState();

    const [loading, setLoading] = useState(false);
    const [isPopupOpened, setIsPopupOpened] = useState(false);

    const [isYesChecked, setIsYesChecked] = useState(true);
    const [isNoChecked, setIsNoChecked] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            await createNewRoom({...roomInfo});
            
            handleReset();
            setIsPopupOpened(true);
        } catch (e : any) {
            console.error(e)
            setError(e)
        } finally {
            setLoading(false);
        }
    }

    const handleReset = () => {
        setReset(state => state = !state);
        setIsNoChecked(false);
        setIsYesChecked(true);
    }

    const handleIsActive = () => {
        // Set Active To True
        setIsYesChecked((state) => (state = !state));
        setIsNoChecked((state) => (state = !state));
        
        // Set To Room Info
        setRoomInfo({...roomInfo, isActive: true});
    }
    const handleIsNotActive = () => {
        // Set Active To True
        setIsNoChecked((state) => (state = !state));
        setIsYesChecked((state) => (state = !state));
        
        // Set To Room Info
        setRoomInfo({...roomInfo, isActive: false});
    }
        
    return (
        <>
            <DynamicTitle title='إضافة روم' />
            {isPopupOpened && (
                <Popup
                    text={"تم إنشاء الروم بنجاح ✅"} 
                    className='bg-green-600 text-white'
                    options={false}
                    onToggle={() => setIsPopupOpened(state => state = !state)} 
                />
            )}
            <form
                dir='rtl'
                className='main-card'
                onSubmit={handleSubmit}
            >
                {loading && (
                    <Loading />
                )}
                <h2>إضافة روم جديد</h2>
                <MainInput 
                    inputStyles='mb-4'
                    id={1}
                    type='text'
                    placeholder='رقم/ اسم الروم'
                    value={roomInfo.name}
                    onChange={(e) => setRoomInfo({...roomInfo, name: e.target.value})}
                    required={true}
                />
                <MainInput 
                    inputStyles='mb-4'
                    id={2}
                    type='text'
                    placeholder='محتوياتها/مميزاتها - مثال: PS 4 , GATA , FIFA 2024'
                    arrValue={roomInfo.contents}
                    onChange={(e) => setRoomInfo({...roomInfo, contents: ((e.target.value))?.split(",")})}
                    required={true}
                />
                <MainInput 
                    inputStyles='mb-4'
                    id={3}
                    type="number"
                    placeholder='سعر الساعة الفردي'
                    value={roomInfo.costPerHourForSingle}
                    onChange={(e) => setRoomInfo({...roomInfo, costPerHourForSingle: +(e.target.value).trim()})}
                    required={true}
                />
                <MainInput 
                    inputStyles='mb-4'
                    id={4}
                    type="number"
                    placeholder='سعر الساعة المالتي'
                    value={roomInfo.costPerHourForMulti}
                    onChange={(e) => setRoomInfo({...roomInfo, costPerHourForMulti: +(e.target.value).trim()})}
                    required={true}
                />
                <MainInput 
                    inputStyles='mb-4'
                    id={5}
                    type="number"
                    placeholder='الوقت المسموح فيه بإلغاء الحجز بدون رسوم - مثال:  10 (أو 0 للا)'
                    value={roomInfo.maxFreeTime}
                    onChange={(e) => setRoomInfo({...roomInfo, maxFreeTime: (e.target.value).trim()})}
                    required={true}
                />
                <MainInput 
                    inputStyles='mb-4'
                    id={6}
                    type="text"
                    placeholder='أي ملاحظات إضافية؟ (اختياري)'
                    value={roomInfo.notes} 
                    onChange={(e) => setRoomInfo({...roomInfo, notes: (e.target.value)})}
                    required={false}
                />
                <div className='font-semibold mb-3'>
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
                        <input type="radio" name="yes" id="yes"
                            className='bg-red-500 text-red-500'
                            
                            checked={isYesChecked}
                            onChange={handleIsActive}
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
                        <input type="radio" name="no" id="no"
                            className='bg-red-500 text-red-500 focus:outline-mainBlue'
                            checked={isNoChecked}
                            onChange={handleIsNotActive}
                        />
                    </label>
                </div>
                {isNoChecked && (
                    <MainInput id={'deactivate-reason'} type="text" placeholder='سبب التعطيل؟'
                        value={roomInfo.deActiveReason || ''} onChange={(e) => setRoomInfo({...roomInfo, deActiveReason: (e.target.value)})}
                        inputStyles='mb-2'
                    />
                )}

                {error && (<span className='err-msg mb-2'>{error}</span>)}
                
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