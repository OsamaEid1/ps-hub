"use client"
import { usePathname } from "next/navigation";
import Link from 'next/link';
import PropTypes from 'prop-types';

NavLink.propTypes = {
    href: PropTypes.string.isRequired,
    exact: PropTypes.bool
};

export default function NavLink({ href, exact, children, className, ...props }) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname?.startsWith(href);


    return (
        <>
            <Link 
                href={href} 
                prefetch={true} 
                dir="rtl" 
                className={`${isActive ? "active" : ""} ${className}`} 
                {...props}
            >
                {children}
            </Link>
        </>
    );
}