"use client";
import { useSession } from "next-auth/react";
import StudyPlanViewer from "../components/studyplanfromdb";
export default function Dashboardpg(){
    const { data: session } = useSession()
    if (!session) {
        return <p>You must be signed in to view this page.</p>;
      }
    
    return (<div className="p-12 overflow-auto h-screen">
      <p className="text-black text-2xl">Welcome, {session.user? session.user.name : null}!</p>
        <StudyPlanViewer/>
      </div>)
}