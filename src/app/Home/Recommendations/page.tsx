'use client';
import { useEffect, useState } from 'react';
import RecommendationCard from '../components/recommendationCard';
import RecommendationForm from '../components/studyrecommendationForm';
import { setDoc , collection, serverTimestamp, doc , query, where , getDocs , updateDoc } from 'firebase/firestore';
import { db } from '../../../../utils/firebase';
import { useSession } from 'next-auth/react';

type Recommendation =   {
    // [x: string]: any;
    title: string,
    topic: string
    link: string,
    type: string,
    description: string,
    suitableFor:string
}

export default function RecommendationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const { data: session, status } = useSession();

  const fetchRecommendations = async () => {
    // fetch from Firebase
    const res = await fetch('/api/getRecommendations'); 
    const data = await res.json();
    if (res.status !== 200 || data?.error) {
      // If there's an error in the response
      console.error(data?.error || 'Error fetching recommendations');
      // Optionally, display an error message to the user
      alert("We couldn't fetch recommendations. Please try again later.");
    } else {
      console.log('fetched reco from db: ', data)
    setRecommendations(data.flatMap((item: any) => Object.keys(item)
    .filter((key) => !isNaN(Number(key))) // only keys like "0", "1", "2", etc.
    .map((key) => item[key])));
    }
    
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const deleteRecommendation = async (link: string) =>{
    const confirmed = confirm('Are you sure you want to delete this recommendation? ');
    if (!confirmed){
      return
    };
    const updatedRecommendations: Recommendation[] = [];
    recommendations?.map((rec: any) => (
      rec.link !== link? updatedRecommendations.push(rec) : null
    ));
   
      try {
        // Step 1: Query documents for the current user
        const q = query(
          collection(db, "recommendations"),
          where("email", "==", session?.user?.email)
        );
        const querySnapshot = await getDocs(q);
    
        // Step 2: Go through each user's doc
        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          const docId = docSnapshot.id;
    
          // Step 3: Extract only the recommendation array (i.e., numeric keys like "0", "1", etc.)
          const recommendationsArray = Object.keys(data)
            .filter((key) => !isNaN(Number(key)))
            .map((key) => data[key]);
    
          // Step 4: Filter out the recommendation with the matching link
          const filteredRecommendations = recommendationsArray.filter(
            (rec: any) => rec.link !== link
          );
    
          // Step 5: If length changed, update the document
          if (filteredRecommendations.length !== recommendationsArray.length) {
            const newData: any = {};
            filteredRecommendations.forEach((rec, index) => {
              newData[index] = rec; // Reassign with numeric keys: "0", "1", etc.
            });
    
            await updateDoc(doc(db, "recommendations", docId), newData);
            setRecommendations(updatedRecommendations)
          }
        }
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Sorry. An error occurred. Couldn't delete.");
      }
    };
    

  

  return (
    <div className="p-6 w-full  space-y-6 bg-gray-100 h-screen overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-800">Study Recommendations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 md:block hidden text-white md:px-4 px-2 md:py-2 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ New Recommendation'}
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 md:hidden  text-white px-4 py-2 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ New'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 shadow rounded-md">
          <RecommendationForm
            onSuccess={() => {
              fetchRecommendations(); // refresh after successful creation
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations?.length === 0 ? (
          <p className="text-gray-600">No recommendations yet. Start by creating one.</p>
        ) : (
          recommendations?.map((rec: Recommendation, index) => (
            <RecommendationCard key={index} recommendation={rec} deleteReco={deleteRecommendation}/>
          ))
        )}
      </div>
    </div>
  );
}
