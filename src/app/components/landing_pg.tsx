"use client";
import React from "react";
import Image from "next/image";
import { Images } from "../Media/Image";
import { useRouter } from "next/navigation";

export default function Landing() {
    const router = useRouter();
    return (
        <div className="grid lg:grid-cols-2 lg:grid-rows-none grid-rows-2 justify-items-between  w-full min-h-screen  gap-16">
            <div>
                <Image src={Images.student} alt="student image" className="h-[100%]" loading="lazy" />
            </div>
            <div id="description" className="my-auto mx-auto">
                <h2 className="text-[30px] lg:text-[40px] font-bold"><span className="text-black">Maximize your study time with</span> <br /> <span className="text-blue-700">AI-powered planning!</span></h2>
                <div className="text-black lg:text-2xl text-lg mt-10">Enter your subjects and available hours, and let our smart study planner generate a personalized schedule just for you. Get tailored material recommendations, stay organized,
                    and make learning stress-free. Start now and study smarter!
                </div>

                <button className="p-6 bg-blue-700 rounded-xl lg:mt-12 mt-6 cursor-pointer font-bold hover:bg-blue-900 " 
                onClick={() => router.push("/authentication")}>
                    GET STARTED
                </button>
            </div>
        </div>
    )
}