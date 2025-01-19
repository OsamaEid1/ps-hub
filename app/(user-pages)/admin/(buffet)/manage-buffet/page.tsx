"use client"
// React
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
// Helpers
import Loading from "app/@components/ui/Loading"
import useGetBuffet from 'app/helpers/hooks/admin/buffet/useGetBuffet'
import { MANAGE_BUFFET_TABLE_HEADS } from 'app/helpers/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBurger, faMugHot } from '@fortawesome/free-solid-svg-icons'
// Components
import BuffetTable from './components/BuffetTable'
import DynamicTitle from 'app/@components/global/DynamicTitle'


function ManageBuffet() {
    const [totalBuffetCount, setTotalBuffetCount] = useState<number>(0);
    const [stockBuffetCount, setInStockBuffetCount] = useState<number>(0);
    const [outStockBuffetCount, setOutStockBuffetCount] = useState<number>(0);
    
    const {loading, error, buffet, userId} = useGetBuffet();

    // Calculate Buffet Stats
    useEffect(() => {
        if (buffet[0] && buffet[0].name !== "") {
            let inStockBuffet = 0;
            let outStockBuffet = 0;
            for (let i = 0; i < buffet.length; i++) {
                if (buffet[i].stock) {
                    inStockBuffet += 1;
                } else {
                    outStockBuffet += 1;
                }
                
            }
            setInStockBuffetCount(inStockBuffet);
            setTotalBuffetCount(buffet.length);
            setOutStockBuffetCount(outStockBuffet);
        }
    },[buffet]);

    return (
        <>
            <DynamicTitle title='إدارة البوفيه' />
            <nav
                dir="rtl"
                className="main-top-nav"
            >
                <Link
                    href="add-item"
                    className="
                        flex items-center rounded-main duration-300 bg-white hover:bg-slate-200
                        text-black p-2 font-semibold
                    "
                >
                    إضافة عنصر جديد &nbsp;
                    <FontAwesomeIcon icon={faMugHot} />/
                    <FontAwesomeIcon icon={faBurger} />
                </Link>
                <ul className="flex gap-3 font-semibold">
                    <li className='text-sm sm:text-base'>
                        عدد العناصر: <span className='font-bold text-mainActiveText'>{totalBuffetCount}</span> </li>
                    <li className="text-sm sm:text-base text-green-500">
                        في المخزون: <span className='font-bold text-mainActiveText'>{stockBuffetCount}</span> </li>
                    <li className="text-sm sm:text-base text-red-500">
                        خارج المخزون: <span className='font-bold text-mainActiveText'>{outStockBuffetCount}</span> </li>
                </ul>
            </nav>
            <section className='relative'>
                {loading ? (
                    <Loading className='mt-10' />
                ) : error ? (
                    <span className='err-msg px-6 py-3 border-b border-gray-700 bg-elements duration-300 hover:bg-secondary rounded-main'>
                        {error}
                    </span>
                ) : (
                    <BuffetTable 
                        heads={[...MANAGE_BUFFET_TABLE_HEADS]}
                        body={buffet}
                        userId={userId}
                    />
                    )
                } 
            </section>
        </>
    );
}

export default ManageBuffet