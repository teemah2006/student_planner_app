"use client";
import { useSession } from "next-auth/react";
import StudyPlanViewer from "../components/studyplanfromdb";
import DashboardGrid2 from "../components/dashboardgrid2";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Dashboardpg(){
    const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authentication");
    }
  }, [status, router]);

    if (status === "loading") {
    return <p>Loading...</p>;
  }
  
    return (<div className="  overflow-auto h-screen">
      <div className="md:grid md:grid-cols-3">
        <div className="md:col-span-2  md:p-6 p-4">
      <p className="text-blue-900 font-bold text-2xl lg:text-3xl  ">Welcome, {session?.user? session.user.name : null}!</p>
      <StudyPlanViewer/>
        </div>
      
      <DashboardGrid2 />
      </div>
       
      </div>)
}