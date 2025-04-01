"use client";
import { useSession } from "next-auth/react";
export default function Dashboardpg(){
    const { data: session } = useSession()
    if (!session) {
        return <p>You must be signed in to view this page.</p>;
      }
    
    return <p className="text-black text-2xl">Welcome, {session.user? session.user.name : null}!</p>;
}