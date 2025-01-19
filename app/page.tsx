"use client"
// React
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// helpers
import { signIn } from "./helpers/auth/signIn";
// components
import MainButton from "app/@components/ui/form/MainButton";
import Loading from "app/@components/ui/Loading";
import MainInput from "./@components/ui/form/MainInput";
import DynamicTitle from "./@components/global/DynamicTitle";

const SignIn = () => {
    const [password, setPass] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const [loading, setIsLoading] = useState(false);
    const [successOP, setSuccessOp] = useState(false);

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user = await signIn(email, password);
            // Handle redirection based on user role
            if (user.role === "ADMIN") {
                setSuccessOp(true);
                router.replace('/admin/display-rooms');
            } else if (user.role === 'SUPER_ADMIN') {
                setSuccessOp(true);
                router.replace('/super-admin/manage-admins');
            } else {
                setSuccessOp(true);
                alert('ليس لديك صلاحية للدخول، راجع مدير النظم!');
                window.location.reload();
            }
        } catch (error: any) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };


    return(
        <>
            <DynamicTitle title='تسجيل الدخول' />
            <div dir="ltr" className="h-screen flex justify-center items-center relative">
                {(loading || successOP) && (<Loading />)}
                <div className="
                        text-lg bg-secondary w-fit max-w-[300px] flex flex-col justify-center items-center
                        py-3 px-5 rounded-main
                    ">
                    <Image src={"/logo.png"} width={100} height={100} alt="Logo" />
                    <h2 className="font-extrabold mt-2 mb-5">تسجيل الدخول</h2>
                    <form className="flex flex-col text-center" onSubmit={handleSubmit}>
                        <MainInput 
                            id="email"
                            type="email" 
                            placeholder="الإيميل" 
                            inputStyles="mb-4 text-left xl:w-[250px]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required={true} 
                        />
                        <MainInput 
                            id="pass"
                            type="password" 
                            placeholder="كلمة السر"
                            inputStyles="text-left"
                            value={password}
                            onChange={(e) => setPass(e.target.value)}
                            required={true}
                        />
                        {error && <span className="err-msg mt-2">{ error }</span>}
                        <MainButton
                            type="submit"
                            className="
                                w-fit mx-auto mt-5
                                font-semibold py-1 px-2
                            "
                            disabled={loading || successOP}
                        >
                            تسجيل
                        </MainButton>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignIn