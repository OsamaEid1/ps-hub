const Modal = ({ children, onToggle, className='' }) => {
    return (
        <div
            className={`
                fixed inset-0 w-screen h-screen flex z-[99] justify-center items-center bg-black/40
                ${className}
            `}
        >
            <div className="shadow-lg shadow-slate-800 rounded-main relative ">
                {/* Start Close Modal */}
                <button
                    type="button"
                    className="absolute top-2 left-1 z-10 bg-transparent
                            hover:bg-gray-200 hover:text-gray-900 duration-300 rounded-full text-sm w-8 h-8
                            inline-flex justify-center items-center"
                    onClick={onToggle}
                >
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
                {/* End Close Modal */}
                <div className="max-h-[80vh] lg:max-h-screen ">
                    {children}
                </div>
            </div>
        </div>
    )
};

export default Modal;