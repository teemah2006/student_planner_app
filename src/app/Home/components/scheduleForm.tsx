"use client";

import { useState } from "react";
import StudyPlan from "../components/studyplan";

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



export default function StudyPlanner() {
  const [subjects, setSubjects] = useState([{ subject: "", topics: [""] }]);
  const [newSubject, setNewSubject] = useState("");
  const [newTopics, setNewTopics] = useState([""]);
  const [hours, setHours] = useState(2);
  const [examDate, setExamDate] = useState("");
  const [schedule, setSchedule] = useState<StudyPlan | null>(null);;
  const [loading, setLoading] = useState(false);
  const [preferredTime, setPreferredTime] = useState("")

  const addSubject = () => {
    if(newSubject){
      setSubjects([
        ...subjects,
        {
          subject: newSubject,
          topics: newTopics.filter((topic) => topic.trim() !== ""),
        },
      ]);
      // Reset the input fields
      setNewSubject("");
      setNewTopics([""]);
    }
    
  };

  const addTopic = () => {
    const Topics = [...newTopics];
    Topics.push("");
    setNewTopics(Topics);
  };

  const clearInputs = () => {
    setNewSubject("");
    setNewTopics([""]);
    setSubjects([{ subject: "", topics: [""] }]);
    setHours(2);
    setExamDate("");
    setPreferredTime("")
  }
  
  const generateSchedule = async () => {
    setLoading(true);
    setSchedule(null);

    if(subjects.length > 1){
      console.log(subjects.slice(1))
      try {
      const response = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( {
        subjects: subjects.slice(1),
        hoursPerDay: hours,
        examDate,
        preferredTime,
      })
    })

      const data = await response.json();
      

  if (!data || !data.dailyPlan) {
    alert("Failed to generate schedule. Please try again")
    return;
  }


    setSchedule(data); 
  console.log(data)

  // Ensure valid data before setting state
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert("Failed to generate schedule. Please try again")
      // setSchedule("Failed to generate schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  } else{alert("Failed to generate schedule. Please enter subjects");setLoading(false)}
} ;

  return (
    <div className="w-full bg-gray-100   h-screen overflow-auto   p-6 md:p-10   shadow-md text-black">
      <div className="flex-grow-0">
      <h2 className="text-xl md:text-2xl font-bold text-center ">AI Study Planner</h2>

      {/* Subject Input */}
      <div className="mt-4 ">
        <div  className="border rounded-xl p-4 space-y-2 bg-white shadow ">
          <input
            type="text"
            placeholder="Enter subject"
            className="w-full border px-3 py-2 rounded-md"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
        {newTopics.map((topic, j) => (
            <input
              key={j}
              type="text"
              placeholder={`Topic ${j + 1}`}
              className="w-full border px-3 py-2 rounded-md mt-1"
              value={topic}
              onChange={(e) => {const updatedTopics = [...newTopics];
                updatedTopics[j] = e.target.value;
                setNewTopics(updatedTopics);}}
            />
          ))}
          <button
            type="button"
            onClick={() => addTopic()}
            className="text-blue-500 text-sm underline mt-2 cursor-pointer"
          >
            + Add topic
          </button>
        </div>

        <button
          onClick={addSubject}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full  cursor-pointer hover:bg-blue-700"
        >
          Add Subject
        </button>
      </div>

      {/* Subjects List */}
      <div className="mt-4  ">
        <h3 className="font-semibold">Selected Subjects:</h3>
        <div className="grid  md:grid-cols-3  gap-4 grid-cols-2">
          
          {subjects.length > 1? subjects.slice(1).map((subject, index) => (
            <div key={index}>
            <dl  className="list-disc  block">
            <dt  className="text-gray-700 font-semibold capitalize">{subject.subject}</dt>
            <dd  className="text-gray-700">
            {subject.topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
            </dd>
            </dl>
            </div>
          )): null}
      
        </div>
      </div>

      {/* Study Hours & Exam Date */}
      <div className="mt-4">
        <label className="block font-semibold">Study Hours Per Day:</label>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Preferred time of the day</label>
          <select name="preferredTime" id="preferredTime" className="border p-2 w-full rounded "
          onChange={(e) => setPreferredTime(e.target.value)} value={preferredTime} required>
            <option value="">--select preferred time of the day--</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Exam Date (Optional):</label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="border p-2 w-full rounded "
        />
      </div>
          
      {/* Generate Schedule Button */}
      <div className="flex justify-between  ">
      <button className="mt-4 bg-blue-100 mr-2  text-blue-800 p-2 md:px-4 md:py-2 rounded w-full   cursor-pointer hover:bg-blue-200"
      onClick={clearInputs}>
            Clear inputs
          </button>
          <button
        onClick={generateSchedule}
        className="mt-4 bg-blue-600 text-white p-2 md:px-4 md:py-2 rounded w-full  cursor-pointer hover:bg-blue-800"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Study Plan"}
      </button>
      </div>
      
      </div>
      {/* Display AI Response */}

      {schedule &&
        <StudyPlan plan={schedule}  />
      }
        
      

      
    </div>
  );
}
