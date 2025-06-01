"use client";
import React from "react";
import Image from "next/image";
import { Images } from "../Media/Image";
import { useRouter } from "next/navigation";

export default function Landing() {
    const router = useRouter();
    return (
        <div className="grid lg:grid-cols-2 lg:grid-rows-none grid-rows-2 lg:justify-items-between   w-full min-h-screen gap-16">
            <div>
                <Image src={Images.student} alt="student image" className="h-[100%] w-full object-cover" loading="lazy" />
            </div>
            <div id="description" className="lg:my-auto mb-2 lg:mx-auto mx-4">
                <h2 className="text-[30px] lg:text-[40px] md:text-[35px] font-bold"><span className="text-black">Maximize your study time with</span> <br /> <span className="text-blue-700">AI-powered planning!</span></h2>
                <div className="text-black lg:text-2xl text-lg md:text-xl mt-10">Enter your subjects and available hours, and let our smart study planner generate a personalized schedule just for you. Get tailored material recommendations, stay organized,
                    and make learning stress-free. Start now and study smarter!
                </div>

                <button className="lg:p-6 p-[12px] md:p-[15px] bg-blue-700 rounded-xl lg:mt-12 mt-6 cursor-pointer font-bold hover:bg-blue-900 " 
                onClick={() => router.push("/authentication")}>
                    GET STARTED
                </button>
            {/* <p className="text-right my-2 md:text-lg text-md text-blue-700 italic">Built with love by Fatimah for Epex 2025</p> */}

            </div>
        </div>
    )
}