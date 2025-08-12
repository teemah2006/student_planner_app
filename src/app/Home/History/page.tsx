"use client";
import { useSession } from "next-auth/react";
export default function HistoryPg(){
    const { data: session } = useSession()
        if (!session) {
            return <p>You must be signed in to view this page.</p>;
          }
    return(
        <div className="min-h-screen w-full bg-gray-100 text-black">
            Your study history will show here.
        </div>
    )
}