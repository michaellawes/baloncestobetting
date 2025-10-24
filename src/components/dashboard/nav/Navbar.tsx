import { Auth } from "./Auth";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export interface NavbarProps {
    title: string,
    isLoggedIn: boolean,
    balance: number;
}

export function Navbar(props: NavbarProps) {
    const { title, isLoggedIn, balance } = props;
    return (
        <nav className="bg-sky-600 text-white">
            <div className="container mx-auto px-4 md:flex items-center gap-6">
                <a href="#" className="py-5 px-2 text-white flex-1 font-bold">{title}</a>
                <span className="py-2 px-3 block">{balance}</span>

                <Menu as="div" className="relative inline-block">
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20">
                        <Auth/>
                    </MenuButton>

                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                        <div className="py-1">
                            {isLoggedIn && (
                                <MenuItem>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden">
                                Beg for VC</a>
                            </MenuItem>
                            )}
                            {isLoggedIn && (
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                                    >
                                        Parlays
                                    </a>
                                </MenuItem>
                            )}
                            {isLoggedIn && (
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                                    >
                                        Log Out
                                    </a>
                                </MenuItem>
                            )}
                            {!isLoggedIn && (
                                <form action="#" method="POST">
                                    <MenuItem>
                                        <button
                                            type="submit"
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                                        >
                                            Sign out
                                        </button>
                                    </MenuItem>
                                </form>
                            )}
                        </div>
                    </MenuItems>
                </Menu>
            </div>
        </nav>
    )
}
