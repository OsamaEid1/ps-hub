'use client'
type ButtonProps = {
    type?: "button" | "submit" | "reset";
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string
};

type reactNode = {
    children: React.ReactNode
};

function MainButton({ type="button", disabled=false, className, onClick, children} : ButtonProps & reactNode ) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`block w-fit bg-blue-600 text-white hover:bg-blue-700 duration-300 px-3 py-2 
                        font-semibold rounded-full ${className} 
                        ${disabled ? "!bg-gray-600 cursor-not-allowed" : ""}
                `}
            >
            { children }
        </button>
    )
}

export default MainButton