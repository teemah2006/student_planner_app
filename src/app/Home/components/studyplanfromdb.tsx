'use client';

import { useSession , getSession } from 'next-auth/react';
import { SetStateAction, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../../../utils/firebase'; // make sure this file is correctly configured
import EditPlanForm from './editplan';
import Link from 'next/link';
import { onAuthStateChanged } from "firebase/auth";
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Images } from '@/app/Media/Image';
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
  const [deleting, setDeleting] = useState(false);
  const sessionTwo =  getSession()


  const handleSaveChanges = async (editedPlan: SetStateAction<DayPlan[] | null>) => {

    if (!auth.currentUser) return;

    try{
      const user = auth.currentUser;
      const docRef = doc(db, "studyPlans", user?.uid? user?.uid: '');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()){
     // overwrite with new data
        const planData = docSnap.data();
        await setDoc(docRef, {
          createdAt: planData.createdAt,
          plan: editedPlan,
        });
      } 

    setPlan(editedPlan);
    setIsEditing(false);
    toast.success('Changes saved sucessfully!')
    } catch{
      toast.error('Something went wrong please try again.')
    }

    
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this plan? ');
    if (!confirmed) {
      return
    };

    setDeleting(true)

    try {
      const user = auth.currentUser;
      const uid = user?.uid;
      // const userId = session?.user?.email
      await deletePlan(uid? uid : '')
      setPlan(null);
      setIsEditing(false);
      toast.success('Study plan deleted!')
      setDeleting(false);
    } catch (error) {
      console.log('error deleting plan', error)
      toast.error('something went wrong while deleting.')
      setDeleting(false);
    }
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "studyPlans", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched data:", data);
          setPlan(data.plan);
        } else {
          console.log("No document found for:", user.uid);
          setPlan(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Oops! An error occurred, try checking your connection.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === 'loading' || loading) return <div className="flex h-[100%] flex-col items-center justify-center">
  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  <p className="mt-2 text-gray-500">Loading your study plan...</p>
</div>;
  if (!plan) 
  return <div className='flex flex-col items-center justify-center  h-screen'> <h3 className='text-gray-700 text-xl'>No Study plan found</h3> <Image src={Images.noData} alt='no data' />
  <Link href="/Home/Schedule_generator" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg">Tap here to create</Link>
  </div>

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
      
      <div className=''>
        <h2 className="text-xl lg:text-2xl font-bold text-black">Your 7-Day Study Plan</h2>
        <div className='flex float-right justify-between space-x-2 my-4 md:space-x-4'>
          <button onClick={() => setIsEditing(!isEditing)} 
          className='bg-blue-600 font-semibold md:text-md text-sm disabled:cursor-not-allowed  cursor-pointer hover:bg-blue-700 rounded p-2'
          disabled={deleting}>
            {isEditing ? "Cancel Edit" : "Edit Plan"}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-blue-100 disabled:cursor-not-allowed text-blue-800 md:px-4 md:py-2 p-2 md:text-md text-sm font-semibold rounded  hover:bg-blue-200  cursor-pointer"
          >
           {deleting? 'Deleting...' : 'Delete Plan'} 
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
