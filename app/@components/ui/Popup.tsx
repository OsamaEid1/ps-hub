import React, { useState } from 'react'

type PopupProps = {
    type?: (string | "normal" | "success" | "delete"),
    text: string, 
    className?: string,
    options?: boolean,
    onConfirm?: () => void,
    onToggle: () => void,
    children?: React.ReactNode
};

function Popup({ type, text, options, onConfirm, onToggle, className, children } : PopupProps) {

    let styles = "bg-gray-500"
    let buttonYesStyles = ""
    let buttonNoStyles = ""
    if (type === "success") {
        styles = "bg-green-600 text-white"
    } else if (type === "delete") {
        buttonYesStyles = "bg-white hover:bg-slate-200 text-red-600"
        buttonNoStyles = "bg-slate-500 hover:bg-slate-600";
        styles = "bg-red-600"
    }

    return (
        <div dir='rtl'
            className="fixed inset-0 w-screen h-screen flex z-50 justify-center items-center bg-black/30"
        >
            <div id="popup-modal"
                className="overflow-y-auto overflow-x-hidden w-fit h-fit max-h-full max-w-full
                    ">
                <div className="relative p-5 w-full max-w-md max-h-full">
                    <div className={`relative rounded-main px-5 ${styles} ${className} font-semibold`}>
                        <button type="button" 
                            className="absolute top-3 end-2.5 bg-transparent
                                    hover:bg-gray-200 hover:text-gray-900 duration-300 rounded-main text-sm w-8 h-8 ms-auto 
                                    inline-flex justify-center items-center
                                " 
                            onClick={onToggle}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal ">
                                {text}
                            </h3>
                            {
                                type != "success" && options && (<>
                                    <button type="button" 
                                        className={`
                                            bg-mainBlue duration main py-2.5 px-5 rounded-main duration-300
                                            hover:bg-mainBlue/80 ${buttonYesStyles}
                                        `}
                                        onClick={onConfirm}
                                        >
                                        نعم
                                    </button>
                                    <button type="button"
                                        className={`
                                                py-2.5 px-5 ms-3 font-medium bg-gray-600
                                                duration-300 hover:bg-gray-600/80
                                                rounded-main ${buttonNoStyles}
                                            `}
                                        onClick={onToggle}
                                        >لا
                                    </button>
                                </>)
                            }
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup