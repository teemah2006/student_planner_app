'use client';
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FaSwatchbook } from "react-icons/fa6";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaBookAtlas } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { BsClockHistory } from "react-icons/bs";


export default function Navbar() {
    const pathName = usePathname();

    const LinkClasses = " block border-transparent cursor-pointer  text-sm  md:text-lg   border hover:border-blue-100 rounded flex gap-2 md:flex-row flex-col  items-center p-[2px] md:p-2 transition "
    const Links = (
        <>
            <Link href="/Home" className={pathName == "/Home" ? LinkClasses + ' bg-blue-100 text-blue-700' : LinkClasses}><FaSwatchbook />Dashboard</Link>
            <Link href="/Home/Schedule_generator" className={pathName == "/Home/Schedule_generator" ? LinkClasses + ' bg-blue-100 text-blue-700' : LinkClasses}><FaArrowsRotate />Study planner</Link>
            <Link href="/Home/Recommendations" className={pathName == "/Home/Recommendations" ? LinkClasses + ' bg-blue-100 text-blue-700' : LinkClasses}><FaBookAtlas />Study resources</Link>
            <Link href="/Home/History" className={pathName == "/Home/History" ? LinkClasses + ' bg-blue-100 text-blue-700' : LinkClasses}><BsClockHistory />History</Link>
            <button  onClick={() => signOut({ callbackUrl: "/authentication" })} className={LinkClasses + ' text-gray-100 flex-row'}><FaArrowRightFromBracket />Log Out</button>

        </>
    );
    return (
        <nav className="h-full md:min-h-screen md:w-[25%] lg:w-[25%] w-full bg-blue-700 md:space-x-0  space-y-auto p-4 flex flex-col lg:space-y-12 md:space-y-10">
            <div className="justify-between flex flex-row">
                <div className="md:text-xl text-xl lg:text-2xl font-bold"><span className="text-white">Study</span><span className="text-yellow-500">Ease</span></div>
                <button onClick={() => signOut({ callbackUrl: "/authentication" })} className={LinkClasses + 'md:hidden text-gray-100 flex-row'}><FaArrowRightFromBracket />Log Out</button>

            </div>

            <div className="hidden md:block lg:text-lg font-bold  flex flex-col md:space-y-6 space-y-2">

                {Links}
            </div>

        </nav>
    )
}

export function MobileNav() {
    const pathName = usePathname();
    
    const LinkClasses = " block  text-sm lg:text-lg md:text-md text-blue-700 md:text-gray-100  rounded flex gap-2 md:flex-row flex-col justify-center items-center p-[2px] md:p-2 transition "
    const Links = (
        <>
            <Link href="/Home" className={pathName == "/Home" ? LinkClasses + 'border-b-4 border-blue-700' : LinkClasses}><FaSwatchbook />Dashboard</Link>
            <Link href="/Home/Schedule_generator" className={pathName == "/Home/Schedule_generator" ? LinkClasses + 'border-b-4 border-blue-700' : LinkClasses}><FaArrowsRotate />planner</Link>
            <Link href="/Home/Recommendations" className={pathName == "/Home/Recommendations" ? LinkClasses + 'border-b-4 border-blue-700' : LinkClasses}><FaBookAtlas />resources</Link>
            <Link href="/Home/History" className={pathName == "/Home/History" ? LinkClasses + 'border-b-4 border-blue-700' : LinkClasses}><BsClockHistory />History</Link>
        </>
    );
    return (
        <div className="md:hidden lg:text-lg font-semibold block w-full justify-between items-center  flex flex-row  h-full p-2 sticky  bottom-0 bg-white z-2 ">
            {Links}
        </div>
    )
}