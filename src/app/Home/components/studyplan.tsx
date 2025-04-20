"use client";
import { db } from "../../../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react"; // if you're using NextAuth
import { useState } from "react";




interface StudyPlan {
    dailyPlan: {
        day: string,
      sessions: 
        {
          subject: string,
          topic: string,
          activity: string,
          timeInterval: string;
        }[]
    }[];
}


export default function StudyPlan({ plan }: { plan: StudyPlan }) {
    // const [show, setShow] = useState(true);
    // const cancel = () => {
    //     plan = null;
    //     return
    // }
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const savePlanToFirestore = async (plan: StudyPlan) => {
      setLoading(true);
      

    
      if (!session?.user?.email) {
        alert("You must be logged in to save your plan.");
        return;
      }
    
      try {
        await setDoc(doc(db, "studyPlans", session.user.email), {
          createdAt: new Date(),
          plan: plan,
        });
        alert("Study plan saved successfully! 📚");
      } catch (error) {
        console.error("Error saving study plan:", error);
        alert("Failed to save study plan.");
      } finally{
        setLoading(false);
      }
    };

    return (
        <div className=" bg-white rounded-lg shadow-lg border border-gray-200 text-black h-screen  p-4  overflow-auto " >
            {plan ? 
                <div id="modal">
                <div className="p-6">
                
                <h2 className="text-xl font-semibold mb-4"> Study Plan</h2>
                {plan.dailyPlan.map((dayPlan, dayIndex) => (
        <div key={dayIndex} className="mb-6">
          <h2 className="text-xl font-semibold text-center text-blue-800 py-4">
            {dayPlan.day}
          </h2>
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Topic</th>
                <th className="py-3 px-4 text-left">Activity</th>
              </tr>
            </thead>
            <tbody>
              {dayPlan.sessions.map((session, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-4">{session.timeInterval}</td>
                  <td className="py-2 px-4">{session.subject}</td>
                  <td className="py-2 px-4">{session.topic}</td>
                  <td className="py-2 px-4">{session.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
                </div>
                <div className="sticky bottom-0 bg-white w-full z-2 p-2 flex justify-end gap-4 box-border">
                    <button className="bg-white border border-gray-600 cursor-pointer p-2 rounded text-gray-600 hover:bg-red-700 hover:border-transparent
                    hover:text-white box-border px-4" 
                    >Cancel</button>
                    <button className="bg-green-700 cursor-pointer px-4 p-2 rounded text-white  hover:bg-green-800 "
                    onClick={() => savePlanToFirestore(plan)}>{loading? "Saving..." : "Save"}</button>
                </div>
                </div> : 
                <div className="text-md text-gray-300">Generated study plan  will appear here</div>
            }
        </div>
    )
}