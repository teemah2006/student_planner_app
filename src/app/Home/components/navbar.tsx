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
import { CgProfile } from "react-icons/cg";
import { signOut as logOut } from "firebase/auth";
import { auth } from "../../../../utils/firebase";
import { useUserStore } from "@/app/api/stores/useUserStore";
export default function Navbar() {
    const pathName = usePathname();

    async function handleLogout() {
        await logOut(auth);
        signOut({ callbackUrl: "/authentication" })
        useUserStore.getState().clearUser();
    }

    const LinkClasses = "text-gray-100 block border-transparent cursor-pointer  text-sm  md:text-lg   border hover:border-blue-100 rounded flex gap-2 md:flex-row flex-col  items-center p-[2px] md:p-2 transition "
    const ActiveLinks = " bg-blue-100 text-blue-700 block border-transparent cursor-pointer  text-sm  md:text-lg   border hover:border-blue-100 rounded flex gap-2 md:flex-row flex-col  items-center p-[2px] md:p-2 transition "
    const Links = (
        <>
            <Link href="/Home" className={pathName == "/Home" ? ActiveLinks: LinkClasses}><FaSwatchbook />Dashboard</Link>
            <Link href="/Home/Schedule_generator" className={pathName == "/Home/Schedule_generator" ? ActiveLinks : LinkClasses}><FaArrowsRotate />Study planner</Link>
            <Link href="/Home/Recommendations" className={pathName == "/Home/Recommendations" ?ActiveLinks: LinkClasses}><FaBookAtlas />Study resources</Link>
            <Link href="/Home/History" className={pathName == "/Home/History" ? ActiveLinks : LinkClasses}><BsClockHistory />History</Link>
            <button onClick={() => handleLogout()} className={LinkClasses + ' text-gray-100 flex-row'}><FaArrowRightFromBracket />Log Out</button>

        </>
    );
    return (
        <nav className="flex flex-col justify-between md:min-h-screen md:w-[25%] bg-blue-700">
            <div className="h-full   w-full  md:space-x-0  space-y-auto p-4 flex flex-col lg:space-y-12 md:space-y-10">


                <div className="justify-between flex flex-row">
                    <div className="md:text-xl text-xl lg:text-2xl font-bold"><span className="text-white">Study</span><span className="text-yellow-500">Ease</span></div>
                    <button onClick={() => handleLogout()} className={LinkClasses + 'md:hidden text-gray-100 flex-row'}><FaArrowRightFromBracket />Log Out</button>

                </div>

                <div className="hidden md:block lg:text-lg   flex flex-col md:space-y-6 space-y-2">

                    {Links}
                </div>
            </div>
            <div className="border-t-2 border-t-blue-100 rounded">
                <Link href="/Home/Profile" className={pathName == "/Home/Profile" ? ActiveLinks: LinkClasses}><CgProfile />Profile</Link>

            </div>

        </nav>
    )
}

export function MobileNav() {
    const pathName = usePathname();

    const LinkClasses = " block text-sm lg:text-lg md:text-md text-gray-700 md:text-gray-100  rounded flex gap-2 md:flex-row flex-col justify-center items-center p-[2px] md:p-2 transition ";
    const ActiveLink = "block text-sm lg:text-lg md:text-md text-blue-700 md:text-gray-100 border-b-4 border-blue-700  rounded flex gap-2 md:flex-row flex-col justify-center items-center p-[2px] md:p-2 transition"
    const Links = (
        <>
            <Link href="/Home" className={pathName == "/Home" ? ActiveLink : LinkClasses}><FaSwatchbook />Dashboard</Link>
            <Link href="/Home/Schedule_generator" className={pathName == "/Home/Schedule_generator" ? ActiveLink : LinkClasses}><FaArrowsRotate />planner</Link>
            <Link href="/Home/Recommendations" className={pathName == "/Home/Recommendations" ? ActiveLink : LinkClasses}><FaBookAtlas />resources</Link>
            <Link href="/Home/History" className={pathName == "/Home/History" ? ActiveLink : LinkClasses}><BsClockHistory />History</Link>
            <Link href="/Home/Profile" className={pathName == "/Home/Profile" ? ActiveLink : LinkClasses}><CgProfile />Profile</Link>

        </>
    );
    return (
        <div className="md:hidden block w-full justify-between items-center  flex flex-row  h-full p-2 sticky  bottom-0 bg-white z-2 ">
            {Links}
        </div>
    )
}