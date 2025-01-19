'use client'
// React
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
// Components
import AdminsTable from './components/AdminsTable';
// Helpers
import useGetAdmins from 'app/helpers/hooks/super-admin/useGetAdmins';
import Loading from 'app/@components/ui/Loading';
import { MANAGE_ADMINS_TABLE_HEADS } from 'app/helpers/constants';
import DynamicTitle from 'app/@components/global/DynamicTitle';

function ManageAdmins() {
    const { loading, error, admins, totalAdminsCount, activeAdminsCount, inactiveAdminsCount } = useGetAdmins();

    const [updatedTotalAdminsCount, setUpdatedTotalAdminsCount] = useState(0);
    const [updatedActiveAdminsCount, setUpdatedActiveAdminsCount] = useState(0);
    const [updatedInactiveAdminsCount, setUpdatedInactiveAdminsCount] = useState(0);

    useEffect(() => {
      if (!loading && !error && admins) {
        setUpdatedTotalAdminsCount(totalAdminsCount);
        setUpdatedActiveAdminsCount(activeAdminsCount);
        setUpdatedInactiveAdminsCount(inactiveAdminsCount);
      }
    }, [admins])
    

  return (
    <>
      <DynamicTitle title='إدارة المسئولين' />
      <nav 
        dir='rtl'
        className='main-top-nav'
      >
        <Link
          href="add-admin"
          className="rounded-main bg-white hover:bg-slate-300 text-black p-2 font-semibold"
        >
          إضافة مسئول &nbsp;
          <FontAwesomeIcon icon={faUserPlus} />
        </Link>
        <div className='flex flex-col sm:flex-row gap-3'>
          <p className=''>عدد المسئولين: <span className=' font-bold'>{updatedTotalAdminsCount}</span></p>
          <p className=''>عدد المسئولين النشطين: <span className='text-green-500 font-bold'>{updatedActiveAdminsCount}</span></p>
          <p className=''>عدد المسئولين الغير نشطين: <span className='text-red-500 font-bold'>{updatedInactiveAdminsCount}</span></p>
        </div>
      </nav>
        <section className='relative'>
          {loading ? (
              <Loading className='mt-10' />
          ) : error ? (
              <span className='err-msg'>{error}</span>
          ) : (
              <AdminsTable 
                  heads={[...MANAGE_ADMINS_TABLE_HEADS]}
                  body={admins}
                  updateAdminsCount={(count) => setUpdatedTotalAdminsCount(count)}
                  updateActiveAdminsCount={(count) => setUpdatedActiveAdminsCount(count)}
                  updateInactiveAdminsCount={(count) => setUpdatedInactiveAdminsCount(count)}
              />
            )
          } 
        </section>
    </>
  )
}

export default ManageAdmins