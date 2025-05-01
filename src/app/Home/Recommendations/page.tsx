'use client';
import { useEffect, useState } from 'react';
import RecommendationCard from '../components/recommendationCard';
import RecommendationForm from '../components/studyrecommendationForm';
import { setDoc , collection, doc , query, where , getDocs } from 'firebase/firestore';
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
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false)

  const fetchRecommendations = async () => {
    // fetch from Firebase
    setLoading(true);
    const res = await fetch('/api/getRecommendations'); 
    const data = await res.json();
    if (res.status !== 200 || data?.error) {
      // If there's an error in the response
      console.error(data?.error || 'Error fetching recommendations');
      // Optionally, display an error message to the user
    alert("We couldn't fetch recommendations. Please try again later.");
    setLoading(false);
    } else {
      console.log('fetched reco from db: ', data)
    setRecommendations(data.flatMap((item: { [x: string]: string | Recommendation[]; }) => Object.keys(item)
    .filter((key) => !isNaN(Number(key))) // only keys like "0", "1", "2", etc.
    .map((key) => item[key])));
    setLoading(false);
    }
    
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const deleteRecommendation = async (link: string) => {
    const confirmed = confirm('Are you sure you want to delete this recommendation?');
    if (!confirmed) {
      return;
    }
  
    try {
      // Step 1: Query documents for the current user
      const q = query(
        collection(db, "recommendations"),
        where("email", "==", session?.user?.email)
      );
      const querySnapshot = await getDocs(q);
  
      // Step 2: Go through each user's document
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        const docId = docSnapshot.id;
  
        // Step 3: Extract only the recommendation array (assuming it's indexed by numeric keys)
        const recommendationsArray = Object.keys(data)
          .filter((key) => !isNaN(Number(key)))  // Ensure keys are numeric (e.g., "0", "1", "2")
          .map((key) => data[key]);
  
        // Step 4: Filter out the recommendation with the matching link
        const filteredRecommendations = recommendationsArray.filter(
          (rec) => rec.link !== link
        );
  
        // Step 5: If the array length changed, update the document
        if (filteredRecommendations.length !== recommendationsArray.length) {
          const newData: {[key: string]: string| Recommendation} = {};


        // Preserve non-numeric fields like email, id, etc.
          for (const key in data) {
            if (isNaN(Number(key))) {
              newData[key] = data[key];
            }
          }

        // Now add back the cleaned recommendations
        filteredRecommendations.forEach((rec, index) => {
          newData[index] = rec;
        });

        await setDoc(doc(db, "recommendations", docId), newData, { merge: false });
        await fetchRecommendations();
        }
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Sorry. An error occurred. Couldn't delete.");
    }
  };
  
    

  

  return (
    <div className="md:p-6 p-4 w-full  space-y-6 bg-gray-100 h-screen overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-800">AI Study Recommendations</h1>
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
        {loading ? 
         <div className="flex flex-col items-center h-[100%] w-full justify-center">
         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
         <p className="mt-2 text-gray-500">Loading Recommendations...</p>
       </div> :
         (
          recommendations?.length === 0 ? (
            <p className="text-gray-600">No recommendations yet. Start by creating one.</p>
          ) : (
            recommendations?.map((rec: Recommendation, index) => (
              <RecommendationCard key={index} recommendation={rec} deleteReco={deleteRecommendation}/>
            ))
          )
         )
        }
        
      </div>
    </div>
  );
}
