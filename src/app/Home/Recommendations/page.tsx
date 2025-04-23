'use client';
import { useEffect, useState } from 'react';
import RecommendationCard from '../components/recommendationCard';
import RecommendationForm from '../components/studyrecommendationForm';

type Recommendation =   {
    title: string,
    topic: string
    link: string,
    type: string,
    description: string,
    suitableFor:string
}

export default function RecommendationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    // fetch from Firebase
    const res = await fetch('/api/getRecommendations'); 
    const data = await res.json();
    setRecommendations(data);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="p-6 w-full  space-y-6 bg-gray-100 h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Study Recommendations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ New Recommendation'}
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
        {recommendations.length === 0 ? (
          <p className="text-gray-600">No recommendations yet. Start by creating one.</p>
        ) : (
          recommendations.map((rec : Recommendation, index) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))
        )}
      </div>
    </div>
  );
}
