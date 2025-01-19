import React from 'react'

type SelectProps = {
    defaultOpt?: string,
    options: any[],
    className?: string,
    onSelect: () => void
}

function Select({ defaultOpt, options, onSelect, className } : SelectProps) {
    return (
    <select name="sort-admins" id="sort-admins"
        className={`text-black border-main py-1 px-1 text-center font-semibold rounded-main ${className}`}
    >
        {defaultOpt && (<option value={0}>{defaultOpt}</option>)}
        {options?.map((option, index) => (
            <option key={index} value={option}>{option}</option>
        ))}
    </select>
    )
}

export default Select