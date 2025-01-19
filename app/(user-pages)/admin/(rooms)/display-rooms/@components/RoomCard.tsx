"use client"
export const dynamic = "force-dynamic";
import React, { useState } from 'react'
import TimeCounter from "./TimeCounter";
import MainButton from '../../../../../@components/ui/form/MainButton';
import CreateInvoiceForm from './CreateInvoiceForm';
import InvoiceCheck from './InvoiceCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import IncreaseTimeRoom from './IncreaseTimeRoom';
import AddBuffetItemToRunningRoom from 'app/(user-pages)/admin/(rooms)/display-rooms/@components/AddBuffetItemToRunningRoom';



function RoomCard({ room }) {
    const [bookTheRoom, setBookTheRoom] = useState<boolean>(false);
    const [showInvoice, setShowInvoice] = useState<boolean>(false);
    const [showDropMenu, setShowDropMenu] = useState<boolean>(false);
    const [showAddBuffetItemToInvoice, setShowAddBuffetItemToInvoice] = useState<boolean>(false);
    const [showIncreaseTime, setShowIncreaseTime] = useState<boolean>(false);

    const [updatedRoom, setUpdatedRoom] = useState(room);

    return (
        <>
            <div
                className={`w-full p-5 xsm:p-3 sm:p-5 md:p-3 lg:p-5 bg-elements rounded-main
                    ${updatedRoom.isBooked ? 'outline outline-1 outline-green-500 shadow-md shadow-green-400' : ''}
                `}
            >
                {/* Start Dropdown Menu */}
                {updatedRoom.isBooked && (
                    <div className='relative z-30 text-left -mt-2 -ml-2'>
                        <button
                            className={`z-10 text-xl font-bold w-9 h-9 rounded-full duration-300 hover:bg-secondary ${showDropMenu ? 'bg-secondary shadow-xl' : ''}`}
                            onClick={() => setShowDropMenu(state => state = !state)}
                        >
                            <FontAwesomeIcon icon={faEllipsis} />
                        </button>
                        {showDropMenu && (
                            <ul
                                className='-z-10 bg-secondary shadow-xl p-2 rounded-main rounded-tl-none w-fit absolute left-2'
                            >
                                <li
                                    className='cursor-pointer duration-300 hover:bg-elements hover:text-mainActiveText rounded-main p-1 font-medium'
                                    onClick={() => setShowAddBuffetItemToInvoice(true)}
                                >
                                        إضافة مشروب/أكل
                                </li>
                                {updatedRoom?.endTime && (
                                    <li
                                        className='cursor-pointer duration-300 hover:bg-elements hover:text-mainActiveText rounded-main p-1 font-medium'
                                        onClick={() => setShowIncreaseTime(true)}
                                    >
                                        زيادة الوقت
                                    </li>
                                )}
                            </ul>
                        )}
                    </div> 
                )}
                {/* End Dropdown Menu */}
                <h3 className="font-bold text-xl text-center mb-4">روم <span className='text-mainActiveText font-extrabold'>#{updatedRoom.name}</span></h3>
                <div className="parent-text">تحتوي على:
                    <div className='child-text !text-sm xsm:!text-base sm:!text-sm xl:!text-base'>({updatedRoom.contents.join().replaceAll(",", "-")})</div>
                </div>
                <p className="parent-text">سعر الساعة الفردي:
                    <span className='child-text'>{updatedRoom.costPerHourForSingle}ج</span>
                </p>
                <p className="parent-text">سعر الساعة المالتي:
                    <span className='child-text'>{updatedRoom.costPerHourForMulti}ج</span>
                </p>
                {updatedRoom.isBooked ? (
                    <>
                        <p className="font-semibold">
                            بدأ من: 
                            <span className="child-text">
                                {new Date(updatedRoom.startTime).toLocaleTimeString('ar')}
                            </span>
                        </p>
                        <p className="font-semibold">
                            ينتهي بعد: 
                            <span className="child-text">
                                {updatedRoom.endTime ? updatedRoom.endTime + ' ساعة' : 'الوقت مفتوح'}
                            </span>
                        </p>
                        <TimeCounter
                            className="my-3" 
                            startTime={updatedRoom.startTime} 
                            endTime={updatedRoom.endTime}
                            roomName={updatedRoom.name}
                        />
                        <MainButton
                            className='mt-4 mx-auto'
                            onClick={() => setShowInvoice(true)}
                        >
                            تفاصيل الحساب
                        </MainButton>
                    </>
                ): (
                    <>
                        <p className="font-semibold">
                            مشغولة؟ 
                            <span className="font-bold text-mainActiveText ms-1">
                                لأ
                            </span>
                        </p>
                        <MainButton
                            className="mt-5 mx-auto"
                            onClick={() => setBookTheRoom(true)}
                        >
                            تشغيل 
                        </MainButton>
                    </>
                )}
            </div>
            {bookTheRoom && (
                <CreateInvoiceForm 
                    room={updatedRoom}
                    onToggle={(updatedRoom) => {setBookTheRoom(state => state = !state); setUpdatedRoom(updatedRoom)}}
                />
            )}
            {showInvoice && (
                <InvoiceCheck 
                    room={updatedRoom}
                    onToggle={(updatedRoom) => {setShowInvoice(state => state = !state); setUpdatedRoom(updatedRoom)}}
                />
            )}
            {showAddBuffetItemToInvoice && (
                <AddBuffetItemToRunningRoom
                    userId={updatedRoom.userId}
                    invoiceId={updatedRoom.openingInvoiceId}
                    onToggle={() => {setShowAddBuffetItemToInvoice(state => state = !state); setShowDropMenu(false)}}
                    roomName={updatedRoom.name}
                />
            )}
            {showIncreaseTime && (
                <IncreaseTimeRoom
                    onToggle={(updatedRoom) => {setShowIncreaseTime(state => state = !state); setShowDropMenu(false); setUpdatedRoom(updatedRoom)}}
                    room={updatedRoom}
                />
            )}
        </>
    )
}

export default RoomCard