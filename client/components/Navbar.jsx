'use client'
import { useState } from "react";
import Image from "next/image";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-lg p-4 md:px-10">
            <div className="flex items-center justify-between">
                {/* Left - Logo */}
                <div className="relative h-10 w-32">
                    <Image
                        src="/AirbnbLogo.jpeg"  // Ensure the image file name is correct
                        fill
                        style={{ objectFit: "contain", objectPosition: "left" }}
                        alt="Airbnb Logo"
                    />
                </div>

                {/* Middle - Search Bar */}
                <div className="flex items-center md:border-2 rounded-full py-2 md:shadow-md bg-gray-100">
                    <input
                        className="flex-grow pl-5 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 rounded-l-full"
                        type="text"
                        placeholder="Start your search"
                    />
                    <button className="hidden md:inline bg-red-400 text-white rounded-r-full p-2 transition-all duration-200 ease-in-out hover:bg-red-500">
                        🔍
                    </button>
                </div>

                {/* Right - Menu */}
                <div className="flex items-center space-x-6 text-gray-600">
                    <p className="hidden md:inline cursor-pointer text-sm hover:text-gray-900">Airbnb your home</p>
                    <div className="relative">
                        <button
                            onClick={toggleMenu}
                            className="flex items-center space-x-2 border-2 p-2 rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out"
                        >
                            <span className="text-lg">🌍</span>
                            <span className="text-sm">Menu</span>
                        </button>
                        {/* Dropdown menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                                <ul className="space-y-2 p-3 text-sm">
                                    <li>
                                        <a href="/profile" className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                                            Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/login" className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                                            Login
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/signup" className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                                            Sign Up
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/logout" className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                                            Log Out
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/help" className="block text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                                            Help
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
