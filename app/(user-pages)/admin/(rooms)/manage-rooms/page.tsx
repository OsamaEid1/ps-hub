"use client"
// React
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
// Helpers
import { MANAGE_ROOMS_Table_HEADS } from 'app/helpers/constants'
import useGetAllRooms from 'app/helpers/hooks/admin/rooms/useGetAllRooms'
// Components
import Loading from "app/@components/ui/Loading"
import RoomsTable from './components/RoomsTable'
import DynamicTitle from 'app/@components/global/DynamicTitle'


function ManageRooms() {
    const [totalRoomsCount, setTotalRoomsCount] = useState<number>(0);
    const [activeRoomsCount, setActiveRoomsCount] = useState<number>(0);
    const [inActiveRoomsCount, setInActiveRoomsCount] = useState<number>(0);
    
    const {loading, error, rooms} = useGetAllRooms();

    useEffect(() => {
        if (!loading && !error) {
            if (rooms[0]?.id) {
                let activeRooms = 0;
                let inActiveRooms = 0;
                for (let i = 0; i < rooms.length; i++) {
                    if (rooms[i].isActive === true) {
                        activeRooms += 1;
                    } else {
                        inActiveRooms += 1;
                    }
                    
                }
                setActiveRoomsCount(activeRooms);
                setTotalRoomsCount(rooms.length);
                setInActiveRoomsCount(inActiveRooms);
            }
        }
    },[rooms.length]);

    return (
        <>
            <DynamicTitle title='إدارة الرومات' />
            <nav
                dir="rtl"
                className="main-top-nav"
            >
                <Link
                    href="add-room"
                    className="
                        flex items-center rounded-main duration-300 bg-white hover:bg-slate-200
                        text-black p-2 font-semibold
                    "
                >
                    إضافة روم جديدة &nbsp;
                    <svg
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 487.2 487.2"
                        className="w-5 h-5"
                        xmlSpace="preserve"
                        >
                        <g>
                            <g>
                                <g>
                                    <path
                                    d="M0,322.5V88.3c0-18.4,14.9-33.4,33.4-33.4H380c18.4,0,33.4,14.9,33.4,33.4v134.5c-5.3-0.7-10.7-1.1-16.1-1.1
                                            c-10.1,0-20,1.3-29.4,3.6V100.4H45.5v209.5h235.6c-2.8,10.3-4.4,21-4.4,32.2c0,4.6,0.3,9.2,0.8,13.7H244V393h26.5
                                            c4.4,0,8,3.6,8,8v23.2c0,4.4-3.6,8-8,8H142.7c-4.4,0-8-3.6-8-8V401c0-4.4,3.6-8,8-8h26.5v-37.2H33.3C14.9,355.8,0,340.9,0,322.5z
                                            M487.2,342.1c0,49.8-40.4,90.2-90.2,90.2s-90.2-40.4-90.2-90.2s40.4-90.2,90.2-90.2S487.2,292.4,487.2,342.1z M441,342.1
                                            c0-6.7-5.4-12.2-12.2-12.2h-19.6v-19.6c0-6.7-5.4-12.2-12.2-12.2c-6.7,0-12.2,5.4-12.2,12.2v19.6h-19.6
                                            c-6.7,0-12.2,5.4-12.2,12.2c0,6.7,5.4,12.2,12.2,12.2h19.6v19.6c0,6.7,5.4,12.2,12.2,12.2c6.7,0,12.2-5.4,12.2-12.2v-19.6h19.6
                                            C435.5,354.3,441,348.9,441,342.1z"
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>
                </Link>
                <ul className="flex gap-3 font-semibold">
                    <li>
                        عدد الرومات: <span className='font-bold text-mainActiveText'>{totalRoomsCount}</span> </li>
                    <li className="text-green-500">
                        المُفعّلة: <span className='font-bold text-mainActiveText'>{activeRoomsCount}</span> </li>
                    <li className="text-red-500">
                        المُعطّلة: <span className='font-bold text-mainActiveText'>{inActiveRoomsCount}</span> </li>
                </ul>
                {/* Future Feature <div>
                    ترتيب حسب حالة الروم: &nbsp;
                    <Select options={MANAGE_ROOMS_SELECT_OPTIONS} onSelect={handleOnSelect}
                        className="duration-300 hover:bg-slate-200"
                    />
                </div> */}
            </nav>
            <section className='relative'>
                {loading ? (
                    <Loading className='mt-10' />
                ) : error ? (
                    <span className='err-msg'>{error}</span>
                ) : (
                    <RoomsTable 
                        heads={[...MANAGE_ROOMS_Table_HEADS]}
                        body={rooms}
                    />
                    )
                } 
            </section>
        </>
    );
}

export default ManageRooms