"use client";
import { useSession } from "next-auth/react";
import StudyPlanner from "@/components/Features/scheduleForm";
export default function ScheduleGenerator(){
    const { data: session } = useSession()
    if (!session) {
        return <p>You must be signed in to view this page.</p>;
      }
    
    return (
      <StudyPlanner/>
      )
}