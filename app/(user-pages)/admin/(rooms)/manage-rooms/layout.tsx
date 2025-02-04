"use client";

export default function ManageRoomsLayout({
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
