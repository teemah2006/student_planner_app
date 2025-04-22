'use client';

import { useSession } from 'next-auth/react';
import { SetStateAction, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../utils/firebase'; // make sure this file is correctly configured
import EditPlanForm from './editplan';

type SessionType = {
  subject: string;
  topic: string;
  activity: string;
  timeInterval: string;
};

type DayPlan = {
  day: string;
  sessions: SessionType[];
};

export default function StudyPlanViewer() {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);


  const handleSaveChanges = async (editedPlan: SetStateAction<DayPlan[] | null>) => {
  
    if (!session?.user?.email) return;
  
    const docRef = doc(db, "studyPlans", session.user.email);
    await setDoc(docRef, {
      createdAt: new Date(),
      plan: editedPlan,
    }); // overwrite with new data
  
    setPlan(editedPlan);
    setIsEditing(false);
  };
  

  useEffect(() => {
    const fetchPlan = async () => {
      if (session?.user?.email) {
        const docRef = doc(db, 'studyPlans', session.user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Fetched data:', data);
          setPlan(data.plan.dailyPlan);
        } else {
            console.log('No document found for:', session.user.email);
          setPlan(null);
        }
        setLoading(false);
      }
    };

    fetchPlan();
  }, [session]);

  if (status === 'loading' || loading) return <p className='text-gray-500'>Loading your study plan...</p>;
  if (!plan) return <p className='text-gray-500'>No study plan found.</p>;

  const Plan = () => {
    return(
      <>
      {plan.map((day, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-2 text-blue-800">{day.day}</h3>
          <table className="w-full border-collapse text-sm text-gray-700">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Topic</th>
                <th className="p-2 border">Activity</th>
                <th className="p-2 border">Time Interval</th>
              </tr>
            </thead>
            <tbody>
              {day.sessions.map((session, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border">{session.subject}</td>
                  <td className="p-2 border">{session.topic}</td>
                  <td className="p-2 border">{session.activity}</td>
                  <td className="p-2 border">{session.timeInterval}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      </>
    )
    
  }
  

  return (
    
    <div className="p-4 space-y-6 col-span-2">
      <div className='flex justify-between'>
      <h2 className="text-xl font-bold text-black">Your 7-Day Study Plan</h2>
      <button onClick={() => setIsEditing(!isEditing)} className='bg-green-500 cursor-pointer hover:bg-green-700 rounded p-2'>
  {isEditing ? "Cancel Edit" : "Edit Plan"}
</button>
      </div>
      
{isEditing ? 
      <EditPlanForm currentPlan={plan} onSave={handleSaveChanges} />
    : 
      <Plan />
    }
    </div>
  );
}
