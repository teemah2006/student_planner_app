"use client";
import { useSession } from "next-auth/react";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function ResourceViewer() {
    const { data: session } = useSession()
    const searchParams = useSearchParams();
    const videoUrl = searchParams.get('video');
    const videoTitle = searchParams.get('title');
    const description = searchParams.get('desc')
    if (!session) {
        return <p>You must be signed in to view this page.</p>;
    };

    if (!videoUrl){
        return <p>No video link found</p>
    }


   


    return (<div className="  overflow-auto h-screen bg-white text-black w-full p-4 md:p-8">
        <Link href="/Home/Recommendations" className="text-gray-500 text-lg md:text-xl flex space-x-4 items-center"><IoIosArrowBack className="inline"/>Back</Link>

            <div className="md:col-span-2  md:p-6 p-4">

                <h1 className="font-bold text-xl md:2xl mb-6">Study Video</h1>
                {videoUrl && (
                    <iframe
                        width="100%"
                        height="400"
                        src={videoUrl.replace("watch?v=", "embed/")}
                        title="YouTube video"
                        className="border rounded "
                        allowFullScreen
                    />
                )}
                <div className="mt-6 grid gap-4">
                <h3 className="text-lg md:text-2xl font-semibold text-blue-800">Video title: {videoTitle}</h3>
                <p className="text-md md:text-lg text-gray-600">{description}</p>
                </div>
                

            </div>


    </div>)
}