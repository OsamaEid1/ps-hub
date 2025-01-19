"use client";
// Next
// import type { Metadata } from "next";
// Components

// export const metadata: Metadata = {
//     title: "PS Hub | Super Admin",
// };

export default function ManageAdminsLayout({
    children,
    modal
    }: Readonly<{
    children: React.ReactNode;
    modal?: React.ReactNode;
    }>) {

        return (
            <>
                {modal}
                {children}
            </>
        );
}
