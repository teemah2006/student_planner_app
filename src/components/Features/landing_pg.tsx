"use client";
import React from "react";
import Image from "next/image";
import { Images } from "../../../public/Media/Image";
import { useRouter } from "next/navigation";

export default function Landing() {
    const router = useRouter();
    return (
        <div className="grid lg:grid-cols-2 lg:grid-rows-none grid-rows-2 lg:justify-items-between  w-full min-h-screen md:gap-16 gap-10">
        
                <Image src={Images.studying} alt="student image" className="" loading="lazy" />
            <div id="description" className="lg:my-auto mb-2 lg:mx-auto mx-4">
                <h2 className="text-[25px] lg:text-[40px] md:text-[35px] font-bold"><span className="text-black">Maximize your study time with</span> <span className="text-blue-700">AI-powered planning!</span></h2>
                <div className="text-black lg:text-2xl text-sm md:text-xl lg:mt-10 mt-6">Enter your subjects and available hours, and let our smart study planner generate a personalized schedule just for you. Get tailored material recommendations, stay organized,
                    and make learning stress-free. Start now and study smarter!
                </div>
                <div className=" w-[100%] flex justify-center mt-4 lg:mt-6">
                    <button className="lg:p-6 p-[12px] md:p-[15px] bg-blue-700 rounded-xl lg:mt-12  cursor-pointer font-bold hover:bg-blue-900 "
                        onClick={() => router.push("/authentication")}>
                        GET STARTED
                    </button>
                </div>

                {/* <p className="text-right my-2 md:text-lg text-md text-blue-700 italic">Built with love by Fatimah for Epex 2025</p> */}

            </div>
        </div>
    )
}