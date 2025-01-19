"use client";
// React
import { useEffect, useState } from "react";
// Helpers
import useGetUserInfo from "app/helpers/hooks/user/useGetUserInfo";
import { adminSidebarLinks, superAdminSidebarLinks } from "app/helpers/constants";
// Components
import Header from "../@components/layout/Header"
import Sidebar from "../@components/layout/Sidebar";


export default function AdminLayout({
        children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const {loading, userInfo} = useGetUserInfo();

    const [sidebarLinks, setSidebarLinks] = useState<[string, string][]>([]);
    useEffect(() => {
        if (!loading && userInfo) {
            if (userInfo.role === 'SUPER_ADMIN') {
                setSidebarLinks(Object.entries(superAdminSidebarLinks));
            } else if (userInfo.role === 'ADMIN') {
                setSidebarLinks(Object.entries(adminSidebarLinks));
            } else {
                setSidebarLinks([]);
            }
        }
    }, [userInfo]);

    return (
        <>
            <Header username={userInfo?.name} />
            <Sidebar links={sidebarLinks} />ّ
            <section className="sm:w-[85vw] px-8">
                {children}
            </section>
        </>
    );
}
