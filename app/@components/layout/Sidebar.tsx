import Image from "next/image"
import NavLink from "../ui/NavLink"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const Sidebar = ({ links }) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);

    return (
        <div className="w-[15vw] absolute sm:fixed right-0 top-0 h-[64px] sm:h-screen sm:bottom-0 bg-secondary flex justify-center items-center">
            <button className="text-white sm:hidden mx-auto focus:outline-none" onClick={() => setShowMenu(true)}>
                <FontAwesomeIcon icon={faBars} color="white" size="lg" />
            </button>
            <aside
                className={`${showMenu ? 'bg-secondary fixed inset-0 z-[555] text-center sm:static' : 'hidden mt-[500px] sm:mt-0'}
                    sm:flex sm:flex-col sm:items-center sm:justify-center text-white font-semibold
                    p-5 max-w-full
                `}
            >
                <button className="block ml-auto sm:hidden focus:outline-none" onClick={() => setShowMenu(false)}>
                    <FontAwesomeIcon icon={faClose} color="white" size="lg" />
                </button>
                <Image src="/logo.png" width={75} height={75} alt="Logo" className="mx-auto" />
                <h2 className='pb-5 sm:text-lg md:text-xl lg:text-2xl text-nowrap'>PS Hub</h2>
                <ul>
                    {links?.map((link: string[], index: number) => (
                        <li key={index} className="p-3">
                            <NavLink
                                exact
                                href={link[1]}
                                className="p-1 px-2 sm:py-2 sm:px-3 rounded-full duration-300 hover:bg-elementHover hover:text-mainActiveText block text-center"
                                onClick={showMenu ? () => setShowMenu(false) : ''}
                            >
                                {link[0]}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="absolute bottom-1 text-sm text-placeholderText">
                <p>
                    © Created By <a href="https://osamaeid1.github.io/Portfolio/" target="_blank" className='text-red-800 duration-300 hover:text-red-500 underline'>Osama</a>
                </p>
            </div>
        </div>
    )
}

export default Sidebar