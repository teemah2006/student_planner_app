'use client';
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { LuSquareMenu } from "react-icons/lu";
import { signOut } from "next-auth/react";
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const LinkClasses = " block hover:border-blue-100 hover:rounded hover:border p-2 transition active:bg-blue-100 active:text-blue-700"
    const Links = (
        <>
            <Link href="/Home" className={LinkClasses}>Dashboard</Link>
            <Link href="/Home/Schedule_generator" className={LinkClasses}>Schedule generator</Link>
            <Link href="/Home" className={LinkClasses}>Recommendations</Link>
            <Link href="/Home" onClick={() => signOut()} className={LinkClasses}>Log Out</Link>
        </>
    );
    return (
        <nav className="h-full md:min-h-screen md:w-[25%] lg:w-[20%] w-full bg-blue-700 md:space-x-0  space-y-auto p-4 flex flex-col lg:space-y-12 md:space-y-10">
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