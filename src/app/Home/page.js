"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LoginHome(){
    const router = useRouter();
    const {data: session, status} = useSession();

    useEffect(() => {
        if (status !== "loading" && !session) {
          router.push("/authentication");
        }
      }, [session, status, router]);
    
      if (!session) {
        return <p>Redirecting...</p>; 
      }
    

    return (
        <div className="bg-white min-h-screen">
            <p className="text-3xl text-black">Welcome, {session.user.name}!</p>
        </div>
    ) 
}