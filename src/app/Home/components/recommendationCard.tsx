'use client';

type Recommendation =   {
    title: string,
    topic: string
    link: string,
    type: string,
    description: string,
    suitableFor:string
}


    



export default function RecommendationCard({recommendation , deleteReco } : {recommendation: Recommendation, deleteReco?: ((link:string) => void)} ) {

  
  const handleDelete = () => {
    if (deleteReco){
      deleteReco(recommendation.link)
    } else{
      return
    }
    
  }
    return (
      <div className="border p-4 overflow-auto rounded-md shadow hover:shadow-md transition bg-white space-2">
        <h3 className="text-lg font-semibold text-blue-800">{recommendation.title}</h3>
        <p className="text-sm text-gray-600">{recommendation.description}</p>
        <a
          href={recommendation.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View Resource
        </a>
        <div className="w-full flex justify-between">
        <div className="text-xs text-gray-500 italic">
          Type: {recommendation.type} | Best for: {recommendation.suitableFor}
        </div>
        {deleteReco? 
        <button className="bg-transparent text-red-500 underline text-sm cursor-pointer" onClick={handleDelete}>
        Delete resource
      </button> : null
        }
        
        </div>
        
      </div>
    );
  }
  