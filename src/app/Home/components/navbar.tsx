'use client';
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { LuSquareMenu } from "react-icons/lu";
import { signOut } from "next-auth/react";
import { FaSwatchbook } from "react-icons/fa6";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaBookAtlas } from "react-icons/fa6";
import { usePathname } from "next/navigation";
export default function Navbar() {
    const pathName = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const LinkClasses = " block border-transparent border hover:border-blue-100 rounded flex gap-2 items-center  p-2 transition "
    const Links = (
        <>
            <Link href="/Home" className={pathName=="/Home"? LinkClasses + ' bg-blue-100 text-blue-700':LinkClasses }><FaSwatchbook />Dashboard</Link>
            <Link href="/Home/Schedule_generator" className={pathName=="/Home/Schedule_generator"? LinkClasses + ' bg-blue-100 text-blue-700':LinkClasses }><FaArrowsRotate />Schedule generator</Link>
            <Link href="/Home/Recommendations" className={pathName=="/Home/Recommendations"? LinkClasses + ' bg-blue-100 text-blue-700':LinkClasses }><FaBookAtlas />Recommendations</Link>
            <Link href="/Home" onClick={() => signOut()} className={LinkClasses}><FaArrowRightFromBracket />Log Out</Link>
        </>
    );
    return (
        <nav className="h-full md:min-h-screen md:w-[25%] lg:w-[25%] w-full bg-blue-700 md:space-x-0  space-y-auto p-4 flex flex-col lg:space-y-12 md:space-y-10">
            <div className="justify-between flex flex-row">
                <div className="md:text-xl text-xl lg:text-2xl font-bold"><span className="text-white">Study</span><span className="text-yellow-500">Ease</span></div>
                <div className="md:hidden">
                    <button className="fill-blue-100 cursor-pointer" type="button" onClick={() => (setIsOpen(!isOpen))}>
                        <LuSquareMenu className="text-3xl" />
                    </button>
                </div>
            </div>

            <div className="hidden md:block lg:text-lg font-bold  flex flex-col md:space-y-6 space-y-2">

                {Links}
            </div>

            {
                isOpen && (
                    <div className="md:hidden lg:text-lg font-bold block  flex flex-col space-y-4 mt-6">
                        {Links}
                    </div>
                )
            }


        </nav>
    )
}