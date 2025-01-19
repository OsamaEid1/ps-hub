"use client";
// React
import React, { FormEvent, useState } from 'react'
// Helpers
import { createNewAdmin } from 'app/helpers/super-admin/createNewAdmin';
import { INITIAL_ADMIN_INFO } from 'app/helpers/constants';
// Components
import MainButton from 'app/@components/ui/form/MainButton';
import Loading from 'app/@components/ui/Loading';
import Popup from 'app/@components/ui/Popup';
import Modal from 'app/@components/ui/Modal';
import MainInput from 'app/@components/ui/form/MainInput';
import DynamicTitle from 'app/@components/global/DynamicTitle';

function AddAdminIntercept() {
    const [adminInfo, setAdminInfo] = useState(INITIAL_ADMIN_INFO);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [isPopupOpened, setIsPopupOpened] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (adminInfo.password !== confirmPassword) {
                throw "الباسورد غير متطابق، أعد كتابته!"
            }

            await createNewAdmin(adminInfo);
            setIsPopupOpened(true);
            handleReset();
        } catch (e : any) {
            setError(e)
        } finally {
            setLoading(false);
        }
    }

    const handleReset = () => {
        setAdminInfo(INITIAL_ADMIN_INFO);
        setConfirmPassword("");
        setError("");
    };

    const toggleModal = () => window.history.back();
        
    return (
        <Modal onToggle={toggleModal}>
            <DynamicTitle title='إضافة مسئول' />
            {isPopupOpened && (
                <Popup
                    text={"تم إنشاء مسئول جديد بنجاح"} 
                    className='bg-green-600 text-white'
                    options={false}
                    onToggle={() => {setIsPopupOpened(state => state = !state); toggleModal();}} 
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
                <h2 className="text-center my-5 font-bold">إضافة مسئول جديد</h2>
                <MainInput id={'name'} type="text" placeholder='الإسم' required
                    value={adminInfo?.name} onChange={(e) => setAdminInfo({...adminInfo, name: e.target.value})}
                    inputStyles='mb-4'
                />
                <MainInput id='email' type="email" placeholder='الإيميل' required
                    value={adminInfo?.email} onChange={(e) => setAdminInfo({...adminInfo, email: e.target.value})}
                    inputStyles='mb-4'
                />
                <MainInput id='password' type="password" placeholder='كلمة السر' required
                    value={adminInfo?.password || ''} onChange={(e) => setAdminInfo({...adminInfo, password: e.target.value})}
                    inputStyles='mb-4'
                />
                <MainInput id='re-password' type="password" placeholder='أعد كتابة كلمة السر' required
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    inputStyles='mb-4'
                />
                <MainInput id='role' type="text" placeholder='المنصب' required
                    value={"مسئول"} disabled
                    inputStyles='mb-4'
                />
                
                <span className='err-msg'>{error}</span>

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
        </Modal>
    )
}

export default AddAdminIntercept