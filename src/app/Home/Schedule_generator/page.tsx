"use client";

import { useState } from "react";
import axios from "axios";
import StudyPlan from "../components/studyplan";

interface StudyPlan {
  dailyPlan: {
    day: string;
    date: string;
    activities: {
      time: string[];

    }[];
  }[];
}

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [hours, setHours] = useState(2);
  const [examDate, setExamDate] = useState("");
  const [schedule, setSchedule] = useState<StudyPlan | null>(null);;
  const [loading, setLoading] = useState(false);
  const [preferredTime, setPreferredTime] = useState("")

  const addSubject = () => {
    if (newSubject.trim() !== "") {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const generateSchedule = async () => {
    setLoading(true);
    setSchedule(null);

    try {
      const response = await fetch("/api/generate-schedule", {
        method: "POST",
        body: JSON.stringify( {
        subjects,
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

  setSchedule(data); // Ensure valid data before setting state
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert("Failed to generate schedule. Please try again")
      // setSchedule("Failed to generate schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full static  overflow-hidden mx-auto items-center p-6 md:p-12 bg-white  shadow-md text-black">
      <h2 className="text-xl md:text-2xl font-bold text-center ">AI Study Planner</h2>

      {/* Subject Input */}
      <div className="mt-4 ">
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="border p-2 w-full md:w-[70%] mx-auto rounded"
          placeholder="Enter a subject..."
        />
        <button
          onClick={addSubject}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full md:w-[70%] cursor-pointer hover:bg-blue-700"
        >
          Add Subject
        </button>
      </div>

      {/* Subjects List */}
      <div className="mt-4">
        <h3 className="font-semibold">Selected Subjects:</h3>
        <ul className="list-disc pl-5">
          {subjects.map((subject, index) => (
            <li key={index} className="text-gray-700">{subject}</li>
          ))}
        </ul>
      </div>

      {/* Study Hours & Exam Date */}
      <div className="mt-4">
        <label className="block font-semibold">Study Hours Per Day:</label>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="border p-2 w-full rounded md:w-[70%]"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Preferred time of the day</label>
          <select name="preferredTime" id="preferredTime" className="border p-2 w-full rounded md:w-[70%]"
          onChange={(e) => setPreferredTime(e.target.value)} value={preferredTime}>
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
          className="border p-2 w-full rounded md:w-[70%]"
        />
      </div>

      {/* Generate Schedule Button */}
      <button
        onClick={generateSchedule}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full md:w-[70%] cursor-pointer hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Study Plan"}
      </button>

      {/* Display AI Response */}
      {schedule && 
        <StudyPlan plan={schedule}  />
      }
    </div>
  );
}
