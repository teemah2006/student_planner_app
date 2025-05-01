"use client";
import { db } from "../../../../utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
  const [show, setShow] = useState(true);
  const savePlanToFirestore = async (plan: StudyPlan) => {
    setLoading(true);



    if (!session?.user?.email) {
      alert("You must be logged in to save your plan.");
      return;
    }

    const docRef = doc(db, 'studyPlans', session.user.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      alert('sorry, you can only save one study plan at a time!');
      setLoading(false);
      setShow(false);
      return
    }

    try {
      await setDoc(doc(db, "studyPlans", session.user.email), {
        createdAt: new Date(),
        plan: plan.dailyPlan,
      });
      alert("Study plan saved successfully! 📚");
      setShow(false);
    } catch (error) {
      console.error("Error saving study plan:", error);
      alert("Failed to save study plan. Please try again");
    } finally {
      setLoading(false);

    }
  };

  return (
    show ? (


      <div id="modal" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 text-black w-[90%] max-h-[90%] overflow-auto p-4 relative">
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Your modal content (study plan) */}
          <div className="p-6">
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
          <div className="sticky -bottom-2 bg-white w-full z-2 p-2 flex justify-end space-x-4 box-border">
            <button
              className="bg-white border border-gray-600 font-semibold cursor-pointer p-2 rounded text-gray-600 hover:bg-red-700 hover:border-transparent hover:text-white px-4"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-700 cursor-pointer px-4 p-2 font-semibold rounded text-white hover:bg-blue-800"
              onClick={() => savePlanToFirestore(plan)}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>) : null



  )
}