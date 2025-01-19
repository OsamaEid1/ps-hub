"use client";
import React, { useEffect, useState } from "react";
import RoomCard from "app/(user-pages)/admin/(rooms)/display-rooms/@components/RoomCard";
import useGetAllRooms from "app/helpers/hooks/admin/rooms/useGetAllRooms";
import Loading from "app/@components/ui/Loading";
import DynamicTitle from "app/@components/global/DynamicTitle";

export default function DisplayRooms() {
    const [totalRoomsCount, setTotalRoomsCount] = useState<number>(0);
    const [bookedRoomsCount, setBookedRoomsCount] = useState<number>(0);
    const [notBookedRoomsCount, setNotBookedRoomsCount] = useState<number>(0);
    
    const {loading, error, rooms: allRooms} = useGetAllRooms();
    const [activeRooms, setActiveRooms] = useState(allRooms);

    const setRoomsStats = () => {
        let booked = 0;
        let notBookedRooms = 0;

        for (let i = 0; i < activeRooms.length; i++) {
            if (activeRooms[i].isBooked === true) {
                booked += 1;
            } else {
                notBookedRooms += 1;
            }
        }

        setTotalRoomsCount(activeRooms.length);
        setBookedRoomsCount(booked);
        setNotBookedRoomsCount(notBookedRooms);
    }

    const setOnlyActiveRooms = () => {
        const activeRooms = allRooms.filter(room => room.isActive);
        setActiveRooms(activeRooms)
    }

    useEffect(() => {
        if (!loading && !error) {
            if (allRooms[0]?.id) setOnlyActiveRooms();
        }
    },[allRooms.length]);
    useEffect(() => {
        if (activeRooms[0]?.id) {
            setRoomsStats();
        }
    },[activeRooms.length])

    return (
        <>
            <DynamicTitle title='عرض الرومات' />
            <nav
                dir="rtl"
                className="main-top-nav"
            >
                <h2 className="font-bold mb-3 text-xl sm:text-2xl">عرض الرومات والأجهزة</h2>
                <ul className="flex flex-col sm:flex-row gap-3 font-semibold">
                    <li>
                        الرومات المتاحة: <span className='font-bold text-mainActiveText text-nowrap'>{totalRoomsCount}</span> </li>
                    <li className="text-green-500">
                        الغير مشغولة: <span className='font-bold text-mainActiveText text-nowrap'>{notBookedRoomsCount}</span> </li>
                    <li className="text-red-500">
                        المشغولة: <span className='font-bold text-mainActiveText text-nowrap'>{bookedRoomsCount}</span> </li>
                </ul>
            </nav>
            <section dir="rtl" className="min-h-full my-5 grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 relative items-start justify-items-center xsm:justify-items-start">
                {loading ? (
                    <Loading className="mt-8" />
                ) : error ? (
                    <span className='err-msg text-nowrap'>{error}</span>
                ) : activeRooms.map(room => (
                    <RoomCard
                        key={room.id}
                        room={room}
                    />
                ))
                }
            </section>
        </>
    );
}

