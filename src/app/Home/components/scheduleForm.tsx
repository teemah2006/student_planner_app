"use client";

import { useState } from "react";
import StudyPlan from "../components/studyplan";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
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
  const [subjects, setSubjects] = useState<{ subject: string, topics: string[] }[] | []>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newTopics, setNewTopics] = useState([""]);
  const [hours, setHours] = useState(2);
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("")
  const [schedule, setSchedule] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [preferredTime, setPreferredTime] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addSubject = () => {
    if(newSubject){

      const updated = {
          subject: newSubject,
          topics: newTopics.filter((topic) => topic.trim() !== ""),
        }
      if(editIndex !== null){
        const updatedSubjects = [...subjects];
        updatedSubjects[editIndex] = updated;
        setSubjects(updatedSubjects)
        setEditIndex(null)
         toast.success("Subject updated!");
      } else{
         setSubjects([
        ...subjects,
        updated
      ])
       toast.success("Subject added!");
      }
     ;
      // Reset the input fields
      setNewSubject("");
      setNewTopics([""]);
     
    } else{
       toast.error("Please enter a subject");
    }
    console.log(subjects)
  };

  const editSubject = (i: number) => {
  const selectedSubject = subjects[i];
  if (selectedSubject) {
    setNewSubject(selectedSubject.subject);
    setNewTopics(selectedSubject.topics);
    setEditIndex(i)
  }
};

const delSubject = (i: number) => {
  const newSubjects = subjects.filter((_, index) => index !== i);
  setSubjects(newSubjects);
};

const delTopic = (i: number) =>{
  const modifiedTopics = newTopics.filter((_, index) => index !== i)
  setNewTopics(modifiedTopics)
}

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
    setPreferredTime("");
    setStartTime("");
  }
  
  const generateSchedule = async () => {
    setLoading(true);
    setSchedule(null);
    const isFormValid = subjects.length > 0 && hours > 0 && preferredTime !== "";
    if(isFormValid){
      console.log(subjects)
      try {
      const response = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( {
        subjects: subjects,
        hoursPerDay: hours,
        examDate,
        preferredTime,
        startTime,
      })
    })

      const data = await response.json();
      

  if (!data || !data.dailyPlan) {
    toast.error("Failed to generate schedule. Please try again")
    return;
  }

    setSchedule(data);
    
    console.log(data)

  // Ensure valid data before setting state
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast.error("Failed to generate schedule. Please try again")
      // setSchedule("Failed to generate schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  } else{toast.error("Failed. Please enter required fields");setLoading(false)}
} ;

  return (
    <div className="w-full bg-gray-100   h-screen overflow-auto  p-4 md:p-6 md:p-10   shadow-md text-black">
      <div className="flex-grow-0">
      <h2 className="text-xl md:text-2xl font-bold text-center ">AI Study Planner</h2>
      
      {/* Subject Input */}
      <div className="mt-4 ">
        <div  className="border rounded-xl p-4 space-y-2 bg-white shadow ">
          <input
            type="text"
            placeholder="Enter subject"
            className="w-full border px-3 py-2 rounded-md disabled:border-gray-500  disabled:cursor-not-allowed"
            disabled={loading}
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            required
          />
        {newTopics.map((topic, j) => (
          <div key={j} className="w-full flex">
              <input
              
              type="text"
              placeholder={`Topic ${j + 1}`}
              className={`w-[98%] border px-3 py-2 rounded-md mt-1 disabled:border-gray-500
                 disabled:cursor-not-allowed`}
              disabled={loading}
              value={topic}
              onChange={(e) => {const updatedTopics = [...newTopics];
                updatedTopics[j] = e.target.value;
                setNewTopics(updatedTopics);}}
                
            />
            <button className="cursor-pointer disabled:cursor-not-allowed bg-white" disabled={loading} onClick={() => delTopic(j)}><MdDelete /></button>
          </div>
            
          ))}
          <button
            type="button"
            onClick={() => addTopic()}
            className="text-blue-500 text-sm underline mt-2 cursor-pointer  disabled:cursor-not-allowed"
            disabled={loading}
          >
            + Add topic
          </button>
        </div>

        <button
          onClick={addSubject}
          disabled={loading}
          className={`mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold cursor-pointer 
            disabled:cursor-not-allowed disabled:hover:bg-blue-600 hover:bg-blue-700 `}
        >

          {editIndex !== null? "Update": "Add Subject"}
        </button>
      </div>

      {/* Subjects List */}
      <div className="mt-4  ">
        <h3 className="font-semibold">Selected Subjects</h3>
        <div className="grid  md:grid-cols-3  gap-4 grid-cols-2">
          
          {subjects.length > 0? subjects.map((subject, index) => (
            
            <div key={index}>
            <dl  className="list-disc  block">
            <dt  className="text-gray-700 font-semibold capitalize flex gap-2 items-center">{subject.subject} <button className="cursor-pointer disabled:cursor-not-allowed"
            disabled={loading} onClick={() => editSubject(index)}><AiFillEdit /></button>
            <button className="cursor-pointer disabled:cursor-not-allowed" disabled={loading} onClick={() => delSubject(index)}><MdDelete /></button></dt>
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
        <label className="block font-semibold">Study Hours Per Day</label>
        <input
          type="number"
          value={hours}
          disabled={loading}
          onChange={(e) => setHours(Number(e.target.value))}
          className={`border p-2 w-full rounded disabled:text-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed`}
          required
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Preferred time of the day</label>
          <select name="preferredTime" id="preferredTime" className={`border p-2 w-full rounded disabled:text-gray-500 disabled:border-gray-500
          disabled:cursor-not-allowed`}
          disabled={loading}
          onChange={(e) => setPreferredTime(e.target.value)} value={preferredTime} required>
            <option value="">--select preferred time of the day--</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
      </div>
      <div className="mt-4">
        <label className="block font-semibold">Start time (Optional)</label>
        <input
          type="time"
          disabled={loading}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={`border p-2 w-full rounded disabled:text-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed`}
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Exam Date (Optional)</label>
        <input
          type="date"
          disabled={loading}
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className={`border p-2 w-full rounded disabled:text-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed`}
        />
      </div>
          
      {/* Generate Schedule Button */}
      <div className="flex justify-between  ">
      <button className="mt-4 bg-blue-100 mr-2  text-blue-800 p-2 md:px-4 md:py-2 rounded w-full font-semibold  cursor-pointer hover:bg-blue-200 
      disabled:hover:bg-blue-100 disabled:cursor-not-allowed"
      onClick={clearInputs} disabled={loading}>
            Clear inputs
          </button>
          <button
        onClick={generateSchedule}
        className="mt-4 bg-blue-600 text-white p-2 md:px-4 md:py-2 rounded w-full font-semibold 
        cursor-pointer hover:bg-blue-700 disabled:cursor-wait disabled:hover:bg-blue-600"
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
