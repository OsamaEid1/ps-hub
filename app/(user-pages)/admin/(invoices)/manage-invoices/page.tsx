"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from "app/@components/ui/Loading"
import { MANAGE_INVOICES_TABLE_HEADS } from 'app/helpers/constants'
import useGetInvoices from 'app/helpers/hooks/admin/invoice/useGetInvoices'
import InvoicesTable from './components/InvoicesTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'
import DynamicTitle from 'app/@components/global/DynamicTitle'



function ManageInvoices() {
    const {loading, error, invoices} = useGetInvoices();
    const [invoicesCount, setInvoicesCount] = useState(0);

    useEffect(() => setInvoicesCount(invoices[0].customerName !== '' ? invoices.length : 0), [invoices])
    

    return (
        <>
            <DynamicTitle title='إدارة الفواتير' />
            <nav
                dir="rtl"
                className="main-top-nav"
            >
                <Link
                    href="add-invoice"
                    className="
                        flex items-center rounded-main duration-300 bg-white hover:bg-slate-200
                        text-black p-2 font-semibold
                    "
                >
                    إضافة فاتورة جديدة &nbsp;
                    <FontAwesomeIcon icon={faFileInvoice} />
                </Link>
                <p>
                    عدد الفواتير: <span className='font-bold text-mainActiveText'>{invoicesCount}</span>
                </p>
            </nav>
            <section className='relative'>
                {loading ? (
                    <Loading className='mt-10' />
                ) : error ? (
                    <span className='err-msg px-6 py-3 border-b border-gray-700 bg-elements duration-300 hover:bg-secondary rounded-main'>
                        {error}
                    </span>
                ) : (
                    <InvoicesTable 
                        heads={[...MANAGE_INVOICES_TABLE_HEADS]}
                        body={invoices}
                        updateInvoicesCount={(length) => setInvoicesCount(length)}
                    />
                )
                } 
            </section>
        </>
    )
}

export default ManageInvoices;