"use client";
import { useSession } from "next-auth/react";
import StudyPlanViewer from "../components/studyplanfromdb";
export default function Dashboardpg(){
    const { data: session } = useSession()
    if (!session) {
        return <p>You must be signed in to view this page.</p>;
      }
    
    return (<div className="md:p-12 p-6  overflow-auto h-screen">
      <p className="text-black text-2xl ">Welcome, {session.user? session.user.name : null}!</p>
      <div className="md:grid md:grid-cols-3">
      <StudyPlanViewer/>
      </div>
       
      </div>)
}