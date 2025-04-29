"use client";
import { useSession } from "next-auth/react";
import StudyPlanViewer from "../components/studyplanfromdb";
import DashboardGrid2 from "../components/dashboardgrid2";
export default function Dashboardpg(){
    const { data: session } = useSession()
    if (!session) {
        return <p>You must be signed in to view this page.</p>;
      }
    
    return (<div className="  overflow-auto h-screen">
      <div className="md:grid md:grid-cols-3">
        <div className="md:col-span-2  md:p-6 p-4">
      <p className="text-blue-900 font-bold text-2xl lg:text-3xl  ">Welcome, {session.user? session.user.name : null}!</p>
      <StudyPlanViewer/>
        </div>
      
      <DashboardGrid2 />
      </div>
       
      </div>)
}