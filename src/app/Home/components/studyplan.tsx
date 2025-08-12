/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { db, auth } from "../../../../utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useUserStore } from "@/app/api/stores/useUserStore";

interface StudyPlan {
  dailyPlan: {
    day: string,
    sessions:
    {
      subject: string,
      topic: string,
      level: string,
      activity: string,
      timeInterval: string;
    }[]
  }[];
}




export default function StudyPlan({ plan, subjects, examType }: {
  plan: StudyPlan, subjects: {
    subject: string;
    topics: {
      topic: string;
      level: string;
    }[];
  }[],
  examType: string
}) {
  // const [show, setShow] = useState(true);
  // const cancel = () => {
  //     plan = null;
  //     return
  // }
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [resources, setResources] = useState(false);
  const [loadResource, setLoadResource] = useState(false);
  const user: any = auth.currentUser;
  const userProfile = useUserStore((state) => state.user);

  useEffect(() => {
    if (loadResource) {
      toast.loading('please wait while we create your resources')
    }
  }, [loadResource]);

  const savePlanToFirestore = async (plan: StudyPlan) => {
    setLoading(true);



    if (!user) {
      toast.error("User not authenticated");
      return;
    }
    try {
      const uid = user.uid;
      const docRef = doc(db, "studyPlans", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        toast.error("Sorry, you can only save one study plan at a time!");
        setLoading(false);
        setShow(false);
        return;
      }


      await setDoc(docRef, {
        createdAt: new Date(),
        email: user.email,
        plan: plan.dailyPlan,
      });
      toast.success("Study plan saved successfully!");
      setShow(false);
    } catch (error) {
      console.error("Error saving study plan:", error);
      toast.error("Failed to save study plan. Please try again");

    } finally {
      setLoading(false);
    };
    if (resources) {
      setLoadResource(true)
      
      try {
        for (const s of subjects) {
          for (const t of s.topics) {
            if (t.level === 'weak' || t.level === 'moderate') {
              const formData = {
                subject: s.subject,
                weakness: `${userProfile?.educationLevel} ${userProfile?.grade} ${examType}`,
                style: 'visual',
                topics: t.topic,
                auth: user.uid,
                email: user.email,
              }
              const res = await fetch('/api/generate-recommendations', {
                method: 'POST',
                body: JSON.stringify(formData, user.uid),
              });
            } else{
              continue
            }

          }
        };
        setLoadResource(false)
        toast.success('Check your recommended resources in the resource tab')
      } catch (error) {
        console.log(error);
        toast.error('Network error occurred.');
      }

      setResources(false);
    }
  };

  

        

  return (
    show ? (


      <div id="modal" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 text-black w-[90%] max-h-[90%] overflow-auto p-4 relative">

          {/* Your modal content (study plan) */}
          <div className="p-6 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Study Plan</h2>
            {plan.dailyPlan.map((dayPlan, dayIndex) => (
              <div key={dayIndex} className="mb-6">
                <h2 className="text-xl font-semibold text-center text-blue-800 py-4">{dayPlan.day}</h2>
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

          {/* Buttons */}
          <div className="sticky -bottom-4  bg-white w-full z-2 p-2 flex justify-end space-x-4 box-border">
            <div>
              <input
          type="checkbox"
          className="checkbox checkbox-info checkbox-sm"
          checked={resources}
          onChange={() => setResources(!resources)}
        /> <label className="label">do you want relevant study resources? </label>
              </div>
            <button
              className="bg-white border border-gray-600 font-semibold cursor-pointer p-2 rounded text-gray-600 hover:bg-red-700 hover:border-transparent hover:text-white px-4"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-700 cursor-pointer px-4 p-2 font-semibold rounded text-white hover:bg-blue-800"
              onClick={() => savePlanToFirestore(plan)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>) : null



  )
}