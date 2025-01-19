'use client'

import DynamicTitle from "./@components/global/DynamicTitle";

function NotFound() {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <DynamicTitle title='غير موجودة' />
            <h1 className="text-8xl text-red-500 mb-3 font-mono">404</h1>
            <p className="text-mainActiveText text-2xl font-semibold text-center">
                ): لقد ضللت طريقك، هذه الصفحة غير موجودة
            </p>
            <button
                onClick={() => history.back()}
                className={`block w-fit bg-blue-600 text-white hover:bg-blue-700 duration-300 px-3 py-2 
                        font-semibold rounded-full mt-4
                `}
            >
                العودة للخلف
            </button>
        </div>
    );
}

export default NotFound;