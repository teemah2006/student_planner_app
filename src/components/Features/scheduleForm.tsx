"use client";

import { use, useState } from "react";
import StudyPlan from "../Common/studyplan";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import { examPeriods, examTypes } from "@/library/exams";
import { useUserStore } from "@/app/api/stores/useUserStore";
import { useSession } from "next-auth/react";
interface StudyPlan {
  dailyPlan: {
    day: string,
    sessions:
    {
      subject: string,
      topic: string,
      level: string,
      activity: string,
      timeInterval: string;
    }[]
  }[];
}



export default function StudyPlanner() {
  const user = useUserStore((state) => state.user);
  const { data: session } = useSession();
  const userCountry = user ? user.country.toLowerCase().trim() : "";
  const userEducation = user ? user.educationLevel.split("/")[0].trim().toLowerCase() : "";
  const userFieldOfStudy = user ? user.fieldOfStudy?.toLowerCase().trim() : "";
  const [subjects, setSubjects] = useState<
    {
      subject: string;
      topics: {
        topic: string;
        level: string;
      }[];
    }[]
  >([]);
  const [newSubject, setNewSubject] = useState("");
  const [newTopics, setNewTopics] = useState<{ topic: string, level: string }[]>([]);
  const [hours, setHours] = useState(2);
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("")
  const [schedule, setSchedule] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [preferredTime, setPreferredTime] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const levelSpanClass = "space-x-2 lg:space-x-4 mr-4";
  const levelLabelClass = "text-sm md:text-md lg:text-lg"

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  };
  const addSubject = () => {
    if (newSubject) {

      const updated = {
        subject: newSubject,
        topics: newTopics.filter((t) => t.topic.trim() !== ""),
      }
      if (editIndex !== null) {
        const updatedSubjects = [...subjects];
        updatedSubjects[editIndex] = updated;
        setSubjects(updatedSubjects)
        setEditIndex(null)
        toast.success("Subject updated!");
      } else {
        setSubjects([
          ...subjects,
          updated
        ])
        toast.success("Subject added!");
      }
      ;
      // Reset the input fields
      setNewSubject("");
      setNewTopics([{ topic: "", level: "weak" }]);

    } else {
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

  const delTopic = (i: number) => {
    const modifiedTopics = newTopics.filter((_, index) => index !== i)
    setNewTopics(modifiedTopics)
  }

  const addTopic = () => {
    setNewTopics([...newTopics, { topic: "", level: "weak" }]);
  };

  const clearInputs = () => {
    setNewSubject("");
    setNewTopics([{ topic: "", level: "weak" }]);
    setSubjects([]);
    setHours(2);
    setExamDate("");
    setPreferredTime("");
    setStartTime("");
    setSelectedExam("");
  }

  const generateSchedule = async () => {
    setLoading(true);
    setSchedule(null);
    const isFormValid = subjects.length > 0 && hours > 0 && preferredTime !== "";
    if (isFormValid) {
      console.log(subjects)
      try {
        const response = await fetch("/api/generate-schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: session.user.uid,
            subjects: subjects,
            hoursPerDay: hours,
            examType: selectedExam,
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
    } else { toast.error("Failed. Please enter required fields"); setLoading(false) }
  };

  const generateExamOptions = () => {
    const examOptions: string[] = [];
    examPeriods.map((exam, index) => (
      examOptions.push(exam)
    ))
    const localExams =
      examTypes[userCountry as keyof typeof examTypes] &&
      (examTypes[userCountry as keyof typeof examTypes] as { [key: string]: string[] })[userEducation]
        ? (examTypes[userCountry as keyof typeof examTypes] as { [key: string]: string[] })[userEducation]
        :  [];
    localExams.map((exam, index) => (
      examOptions.push(exam)
));

    const internationalExams= 
    examTypes.international[userEducation as keyof typeof examTypes.international]? 
    examTypes.international[userEducation as keyof typeof examTypes.international] : [];
    internationalExams.map((exam, index) => (
      examOptions.push(exam)
    ));

    if(userEducation === 'tertiary' && userFieldOfStudy){
      if(userFieldOfStudy === 'medicine'){
        examTypes.medical.international.map((exam, index) => (
          examOptions.push(exam)
        ));
        const localMedicalExams =
        examTypes.medical.countrySpecific[userCountry as keyof typeof examTypes.medical.countrySpecific]?
        examTypes.medical.countrySpecific[userCountry as keyof typeof examTypes.medical.countrySpecific] : [];
        localMedicalExams.map((exam, index) => (
          examOptions.push(exam)
        ));
      }
    }
    return examOptions;


  }

  return (
    <div className="w-full bg-gray-100   h-screen overflow-auto  p-4 md:p-6 md:p-10   shadow-md text-black">
      <div className="flex-grow-0">
        <h2 className="text-xl md:text-2xl font-bold text-center ">AI Study Planner</h2>

        {/* Subject Input */}
        <div className="mt-4 ">
          <div className="border rounded-xl p-4 space-y-2 bg-white shadow ">
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
              <div key={j} className="w-full flex space-x-4 items-center">
                <input
                  type="text"
                  placeholder={`Topic ${j + 1}`}
                  className={`w-[63%] border px-3 py-2 rounded-md mt-1 disabled:border-gray-500
                 disabled:cursor-not-allowed`}
                  disabled={loading}
                  value={topic.topic}
                  onChange={(e) => {
                    const updatedTopics = [...newTopics];
                    updatedTopics[j].topic = e.target.value;
                    setNewTopics(updatedTopics);
                  }}


                />
                <div className="w-[35%]">
                  <span className={levelSpanClass}>
                    <input
                      type="radio" name={`radio-${j + 1}`} value="weak"
                      disabled={loading}
                      checked={topic.level === "weak"}
                      onChange={(e) => {
                        const updatedTopics = [...newTopics];
                        updatedTopics[j].level = e.target.value;
                        setNewTopics(updatedTopics);
                      }}
                      className="radio radio-xs md:radio-sm lg:radio-md bg-red-100 disabled:cursor-not-allowed border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600" />
                    <label className={levelLabelClass}>Weak</label>
                  </span>
                  <span className={levelSpanClass}>
                    <input
                      type="radio" name={`radio-${j + 1}`}
                      disabled={loading}
                      value="moderate"
                      checked={topic.level === "moderate"}
                      onChange={(e) => {
                        const updatedTopics = [...newTopics];
                        updatedTopics[j].level = e.target.value;
                        setNewTopics(updatedTopics);
                      }}
                      className="radio radio-xs md:radio-sm lg:radio-md disabled:cursor-not-allowed bg-yellow-100 border-yellow-300 checked:bg-yellow-200 checked:text-yellow-600 checked:border-yellow-600" />
                    <label className={levelLabelClass}>Moderate</label>
                  </span>
                  <span className={levelSpanClass}>
                    <input
                      type="radio" name={`radio-${j + 1}`}
                      disabled={loading}
                      value="strong"
                      checked={topic.level === "strong"}
                      onChange={(e) => {
                        const updatedTopics = [...newTopics];
                        updatedTopics[j].level = e.target.value;
                        setNewTopics(updatedTopics);
                      }}
                      className="radio radio-xs md:radio-sm lg:radio-md disabled:cursor-not-allowed bg-green-100 border-green-300 checked:bg-green-200 checked:text-green-600 checked:border-green-600" />
                    <label className={levelLabelClass}>Strong</label>
                  </span>
                </div>

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

            {editIndex !== null ? "Update" : "Add Subject"}
          </button>
        </div>

        {/* Subjects List */}
        <div className="mt-4  ">
          <h3 className="font-semibold">Selected Subjects</h3>
          <div className="grid  md:grid-cols-3  gap-4 grid-cols-2">

            {subjects.length > 0 ? subjects.map((subject, index) => (

              <div key={index}>
                <dl className="list-disc  block">
                  <dt className="text-gray-700 font-semibold capitalize flex gap-2 items-center">{subject.subject} <button className="cursor-pointer disabled:cursor-not-allowed"
                    disabled={loading} onClick={() => editSubject(index)}><AiFillEdit /></button>
                    <button className="cursor-pointer disabled:cursor-not-allowed" disabled={loading} onClick={() => delSubject(index)}><MdDelete /></button></dt>
                  <dd className="text-gray-700">
                    {subject.topics.map((topic, index) => (
                      <li key={index}>{topic.topic} ({topic.level})</li>
                    ))}

                  </dd>
                </dl>
              </div>
            )) : null}

          </div>
        </div>

        {/* Study Hours & Exam Date */}
        <div className="mt-4">
          <label className="block font-semibold">Study Hours Per Day</label>
          <input
            type="number"
            max={12}
            min={1}
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
          <label className="block font-semibold">Exam type</label>
          <select name="examType" id="examType" className={`border p-2 w-full rounded disabled:text-gray-500 disabled:border-gray-500
          disabled:cursor-not-allowed`}
            disabled={loading}
            onChange={(e) => setSelectedExam(e.target.value)} value={selectedExam} >
            <option value="">--select exam type--</option>
            {generateExamOptions().map((exam, index) => (
              <option key={index} value={exam}>{exam}</option>
            ))}
          </select>
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
        <StudyPlan plan={schedule} subjects={subjects} examType={selectedExam} />
      }




    </div>
  );
}
