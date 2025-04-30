'use client';

import { useSession } from 'next-auth/react';
import { SetStateAction, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../utils/firebase'; // make sure this file is correctly configured
import EditPlanForm from './editplan';
import Link from 'next/link';

export type SessionType = {
  subject: string;
  topic: string;
  activity: string;
  timeInterval: string;
};

export type DayPlan = {
  day: string;
  sessions: SessionType[];
};
const deletePlan = async (userId: string ) => {
  const planRef = doc(db, "studyPlans", userId);
  await deleteDoc(planRef);
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

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this plan? ');
    if (!confirmed) {
      return
    };

    try {
      const userId = session?.user?.email
      await deletePlan(userId? userId : '')
      setPlan(null);
      setIsEditing(false);
      alert('Study plan deleted!')
    } catch (error) {
      console.log('error deleting plan', error)
      alert('something went wrong while deleting.')
    }
  }


  useEffect(() => {
    const fetchPlan = async () => {
      if (session?.user?.email) {
        try{
          const docRef = doc(db, 'studyPlans', session.user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Fetched data:', data);
          setPlan(data.plan);
        } else {
          console.log('No document found for:', session.user.email);
          setPlan(null);
        }
        setLoading(false);
        } catch(err){
          console.log('error fetching data',err)
          alert('Oops! An error occured, try checking your connection.')
        }
        
      }
    };

    fetchPlan();
  }, [session]);

  if (status === 'loading' || loading) return <div className="flex h-[100%] flex-col items-center justify-center">
  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  <p className="mt-2 text-gray-500">Loading your study plan...</p>
</div>;
  if (!plan) return <p className='text-gray-500'>No study plan found. <Link href="/Home/Schedule_generator" className="text-blue-500 underline">Tap here to create</Link></p>;

  const Plan = () => {
    return (
      <>
        {plan.map((day, index) => (
          <div key={index} className="border rounded-lg md:p-4 p-2 shadow-sm overflow-auto w-full">
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

    <div className=" overflow-auto space-y-4  p-4">
      
      <div className='flex justify-between items-center'>
        <h2 className="text-xl lg:text-2xl font-bold text-black">Your 7-Day Study Plan</h2>
        <div className='flex justify-between md:space-x-4'>
          <button onClick={() => setIsEditing(!isEditing)} className='bg-blue-600 md:inline hidden cursor-pointer hover:bg-blue-800 rounded p-2'>
            {isEditing ? "Cancel Edit" : "Edit Plan"}
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className='bg-transparent mr-2 md:hidden inline cursor-pointer text-blue-500 underline'>
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="bg-blue-100 text-blue-800 px-4 py-2 md:inline hidden rounded  hover:bg-blue-200  cursor-pointer"
          >
            Delete Plan
          </button>
          <button
            onClick={handleDelete}
            className="bg-transparent text-red-500 underline  md:hidden inline    cursor-pointer"
          >
            Delete
          </button>
        </div>


      </div>

      {isEditing ?
        <EditPlanForm currentPlan={plan} onSave={handleSaveChanges} />
        :
        <Plan />
      }
    </div>
  );
}
