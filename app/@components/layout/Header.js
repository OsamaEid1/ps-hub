"use client";
import { signOut } from "app/helpers/auth/signOut";
import MainButton from "../ui/form/MainButton";

const Header = ({ username }) => {
    return (
        <header
            className="w-[85vw] flex items-center justify-between
                        py-3 px-1 xsm:px-8 bg-secondary"
        >
            <MainButton onClick={signOut} className="!px-2 xsm:!px-3">
                تسجيل خروج
            </MainButton>
            <h3 dir="rtl" className="text-red-500 font-semibold ">
                {username || ""}
            </h3>
        </header>
    );
};

export default Header;
