/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useState, useEffect , useCallback } from "react";
import Link from "next/link";
import RecommendationCard from "./recommendationCard";
import { useSession } from "next-auth/react";
import { getDoc,  doc, } from "firebase/firestore";
import { db } from "../../../../utils/firebase";
import { SessionType } from "./studyplanfromdb";


export default function DashboardGrid2() {
    const [recommendations, setRecommendations] = useState([]);
    const { data: session } = useSession();
    const [todaySessions, setTodaySessions] = useState<SessionType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    function convertTo24Hr(time: string): string {
        const [timePart, modifier] = time.split(/(am|pm)/);
        const [rawHours, minutes] = timePart.split(':');
        let hours = rawHours;

        if (hours === '12') {
            hours = '00';
        }

        if (modifier.toUpperCase() === 'PM') {
            hours = String(parseInt(hours, 10) + 12);
        }

        return `${hours}:${minutes}`;
    }

    const calculateCurrentDay = (createdAt: any ) => {
        const startDate = createdAt.toDate();
        const today = new Date();
        console.log(startDate, today)
      
        const diffInMs = today.getTime() - startDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const day = diffInDays + 1
        if(day > 7){
            if (day % 7 === 0){
                return `Day 7`
            } else if (day % 7 !== 0){
                return `Day ${day % 7}`
            }
        }
        
        return `Day ${day}`; // +1 because first day = Day 1
      };
      

    const fetchStudyPlans = useCallback(() => async () => {
        if (session?.user?.email) {
            const docRef = doc(db, 'studyPlans', session.user.email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('Fetched data:', data);

                
                    if (data) {
                      const currentDayName = calculateCurrentDay(data.createdAt);
                      console.log(currentDayName)
                  
                      const todayPlan = data.plan.find((dayObj: any) => dayObj.day === currentDayName);
                  
                      if (todayPlan) {
                        console.log(todayPlan)
                        const sortedPlan = todayPlan.sessions.sort((a: any, b: any) => {
                            // assuming timeInterval is in a format like "08:00 AM - 09:00 AM"
                            // we compare based on the start time (before the hyphen)
                            const startTimeA = a.timeInterval.split(' - ')[0].trim();
                            const startTimeB = b.timeInterval.split(' - ')[0].trim();
    
                            const dateA = new Date(`1970-01-01T${convertTo24Hr(startTimeA)}:00`);
                            const dateB = new Date(`1970-01-01T${convertTo24Hr(startTimeB)}:00`);
    
                            return dateA.getTime() - dateB.getTime();
                        });
                        const filteredPlan = sortedPlan.filter((session: any) => {
                            const startTime = session.timeInterval.split(' - ')[0].trim();
                            const [hours, minutes] = convertTo24Hr(startTime).split(':').map(Number);
                            const now = new Date();
                            const nowMinutes = now.getHours() * 60 + now.getMinutes();
                            const sessionMinutes = hours * 60 + minutes;
                            return sessionMinutes > nowMinutes;
                          });
                          console.log(filteredPlan)
                        setTodaySessions(filteredPlan);
                      } else {
                        setTodaySessions([]);
                      }
                    }
                
            } else {
                console.log('No document found for:', session.user.email);
                setTodaySessions([]);
            }
        }
    },[session?.user?.email]);

    const fetchRecommendations = useCallback(() => async () => {
        setIsLoading(true)
        const res = await fetch('/api/getRecommendations');
        const data = await res.json();
        if (res.status !== 200 || data?.error) {
            // If there's an error in the response
            console.error(data?.error || 'Error fetching recommendations');
            alert("We couldn't fetch recommendations. Please try again later.");
        } else {
            console.log('fetched reco from db: ', data)
            setRecommendations(data.flatMap((item: any) => Object.keys(item)
                .filter((key) => !isNaN(Number(key))) // only keys like "0", "1", "2", etc.
                .map((key) => item[key])));
            
        }
        setIsLoading(false)
    },[]);

    useEffect(() => {
        // Fetch upcoming study plans
        fetchStudyPlans();

        // Fetch a few recommendations (maybe 3-4 max)
        fetchRecommendations();
    },[fetchStudyPlans, fetchRecommendations]);
    return (
        <div className="border bg-white w-full h-full min-h-screen md:p-12 hidden md:block grid grid-rows-2 gap-y-7">
            {/* Upcoming Study Sessions */}
            <section className="">
                <h2 className="text-2xl font-semibold mb-4 text-black">Upcoming Study Sessions</h2>
                {todaySessions.length > 0 ? (
                    <div className="plans-preview">
                        {todaySessions.map((session, index) => (
                            <div key={index}>
                                {/* <h3 className="font-semibold text-lg mb-2 text-blue-800">{plan.day}</h3> */}
                               
                                    <li  className="border p-3 rounded-xl hover:bg-gray-100 transition mb-4 ">
                                        <p className="font-medium text-blue-800">{session.subject}</p>
                                        <p className="text-sm text-gray-500">{session.timeInterval}</p>
                                    </li>
                              
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-300">No upcoming sessions for today.</p>
                )}
            </section>

            {/* Recommendations Preview */}
            <section className="">
                <h2 className="text-2xl font-semibold mb-4 text-black">Recommended Resources</h2>
                {isLoading? 
                <div className="flex h-[100%] flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-500">Loading recommendations...</p>
              </div> : 
                    recommendations.length > 0 ? (
                        <div className="space-y-3">
                            {recommendations.slice(0, 4).map((rec, index) => (
                                <RecommendationCard key={index} recommendation={rec} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-300">No recommendations available yet.</p>
                    )
                }
                
                <Link href="/Home/Recommendations" className="text-blue-600 hover:underline text-sm">View All Recommendations</Link>
            </section>

        </div>
    );
}
