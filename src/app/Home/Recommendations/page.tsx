/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import RecommendationCard from '../../../components/Common/recommendationCard';
import RecommendationForm from '../../../components/Common/studyrecommendationForm';
import { setDoc, collection, doc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../utils/firebase';
import { useSession } from 'next-auth/react';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';
import  { useRouter } from 'next/navigation';

type Recommendation = {
  // [x: string]: any;
  title: string,
  topic: string
  link: string,
  type: string,
  description: string,
  suitableFor: string,
  topicSent: string,
  docId: string
}

export default function RecommendationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingg, setLoadingg] = useState(false);
  const topics: any[] = [];
  const [activeTopic, setActiveTopic] = useState<string | null>('All');
  const [recFromDb, setRecFromDb] = useState<Recommendation[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  const getTopics = () => {
    if (recFromDb) {
      for (const rec of recFromDb) {
        if (rec.topicSent) {
          if (!topics.includes(rec.topicSent.trim())) {
            console.log(rec.topicSent.toLowerCase().trim())
            topics.push(rec.topicSent.trim())
          }
        }

      }
    }

  }

  const fetchRecommendations = async (token: string) => {
    setLoadingg(true);

    try {
      const res = await fetch("/api/getRecommendations", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (res.status !== 200 || data?.error) {
        console.error(data?.error || 'Error fetching recommendations');
        alert("We couldn't fetch recommendations. Please try again later.");
        setLoadingg(false);
        return;
      }

      // console.log('Fetched recommendations from DB:', data);

      // Flatten out the recommendations and attach the document ID to each
      const allRecsWithDocId = data.flatMap((item: { id: string;[key: string]: any }) =>
        Object.keys(item)
          .filter(key => !isNaN(Number(key)))
          .map(key => ({
            ...item[key],
            docId: item.id // attach document ID to each recommendation
          }))
      );

      setRecommendations(allRecsWithDocId);
      setRecFromDb(allRecsWithDocId);
      setLoadingg(false);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("An error occurred while fetching.");
      setLoadingg(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("User not authenticated.");
        setLoadingg(false);
        router.push('/authentication')
        return;
      }
      try {
        const token = await user.getIdToken();
        await fetchRecommendations(token); // ✅ Pass token here
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoadingg(false);
      }

    })
    return () => unsubscribe();
  }, [router]);



  const deleteRecommendation = async (link: string, id: string) => {
    const confirmed = confirm("Are you sure you want to delete this?");
    if (!confirmed) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch("/api/recommendations", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link: link, recommendationId: id }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to delete recommendation.");
      } else {
        toast.success("Deleted successfully!");
        await fetchRecommendations(token);
        setActiveTopic('All') // Refresh list
      }
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error("Error deleting. Please try again.");
    }
  };




  // if (loading) return <p>Loading auth...</p>;


  return (
    <div className="md:p-6 p-4 w-full  space-y-6 bg-gray-100 h-screen overflow-auto">
      <div className="flex justify-between space-x-2 items-center">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-800">AI Study Recommendations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 md:block hidden text-white font-semibold md:px-4 px-2 md:py-2 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ New Recommendation'}
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 md:hidden  text-white px-4 py-2 py-2 font-semibold rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ New'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 shadow rounded-md">
          <RecommendationForm
            onSuccess={async () => {
              const user = auth.currentUser;
              if (user) {
                const token = await user.getIdToken();
                await fetchRecommendations(token);
              }
              getTopics() // refresh after successful creation
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div >
        {loadingg ?
          <div className="flex flex-col items-center h-[100%] w-full justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading Recommendations...</p>
          </div> :
          <>
            {getTopics()}
            <div className='flex space-x-2 md:space-x-4 mb-8 overflow-auto border-gray-300 border-b-1 px-4  w-full text-blue-600'>
              <button
                onClick={async () => {
                  setActiveTopic('All');
                  const user = auth.currentUser;
                  if (user) {
                    const token = await user.getIdToken();
                    await fetchRecommendations(token);
                  }
                }}
                className={`cursor-pointer p-2 font-semibold   ${activeTopic === 'All'
                  ? ' text-blue-800 border-b-2 '
                  : '  hover:text-blue-800 '}`}>All</button>
              {topics?.map((topic, index) => (
                <button className={`cursor-pointer p-2 font-semibold capitalize${activeTopic === topic
                  ? '  text-blue-800 border-b-2'
                  : '  hover:text-blue-800 '}`} key={index} onClick={() => {
                    setActiveTopic(topic);
                    const filteredRecommendations = recFromDb?.filter((rec) => rec.topicSent?.trim() === topic)
                    setRecommendations(filteredRecommendations ? filteredRecommendations : recommendations)
                  }}>{topic}</button>
              ))}
            </div>
            {recommendations?.length > 0 && (
              <div className="flex w-[100%] text-left items-center space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    className='checkbox checkbox-info checkbox-sm'
                    onChange={() => {
                      if (selectAll) {
                        setSelectedIds([]);
                      } else {
                        const allIds = recommendations.map((rec) => rec.link);
                        setSelectedIds(allIds);
                      }
                      setSelectAll(!selectAll);
                    }}
                  />
                  <span className='text-gray-700 cursor-pointer'>{selectAll? 'Deselect All': 'Select All'}</span>
                </label>

                <button
                  className="cursor-pointer text-gray-700 px-4 py-1 rounded hover:text-red-700 transition disabled:hidden "
                  disabled={selectedIds.length === 0}
                  onClick={async () => {
                    const confirmed = confirm(`Delete ${selectedIds.length} selected items?`);
                    if (!confirmed) return;

                    const user = auth.currentUser;
                    if (!user) return;
                    const token = await user.getIdToken();

                    for (const id of selectedIds) {
                      const rec = recommendations.find((r) => r.link === id);
                      if (rec) {
                        await fetch("/api/recommendations", {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ link: rec.link, recommendationId: rec.docId }),
                        });
                      }
                    }

                    toast.success("Deleted selected items");
                    setSelectedIds([]);
                    setSelectAll(false);
                    await fetchRecommendations(token);
                  }}
                >
                  Delete Selected
                </button>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">

              {recommendations?.length === 0 ? (
                <p className="text-gray-600">No recommendations yet. Start by creating one.</p>
              ) : (
                recommendations?.map((rec: Recommendation, index) => (
                  <RecommendationCard
    key={index}
    recommendation={rec}
    deleteReco={deleteRecommendation}
    isSelected={selectedIds.includes(rec.link)}
    toggleSelect={(id: string) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }}
  />
                ))
              )}
            </div>
          </>
        }

      </div>
    </div>
  );
}
