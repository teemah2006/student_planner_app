/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useState } from "react";



export default function EditPlanForm({ currentPlan, onSave }: { currentPlan: any, onSave: (updatedPlan: any) => void }) {
  const [editedPlan, setEditedPlan] = useState(currentPlan || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (dayIndex: number,sessionIndex: number, field: string, value: string) => {
    const updatedPlan = [...editedPlan];
  updatedPlan[dayIndex] = {
    ...updatedPlan[dayIndex],
    sessions: updatedPlan[dayIndex].sessions.map((session: any, i: number) =>
      i === sessionIndex ? { ...session, [field]: value } : session
    ),
  };
   
    setEditedPlan(updatedPlan);
  };

  const handleSave = () => {
    setIsSaving(true);
    onSave(editedPlan);
    setIsSaving(false)

  };
  if (!Array.isArray(editedPlan)) {
    return <div>Loading plan...</div>;
  }
  console.log("Edited Plan:", editedPlan);

  return (
    <div className="space-y-4">
        
      {editedPlan.map((day: any, index: number) => (
        <div key={index} className="border rounded-lg md:p-4 p-2 shadow-sm w-full overflow-auto">
        <h3 className="font-semibold text-lg mb-2 text-blue-800">{day.day}</h3>
        <table className="w-full border-collapse text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Topic</th>
              <th className="p-2 border">Activity</th>
              <th className="p-2 border">Time Interval</th>
            </tr>
          </thead>
          <tbody>
            {day.sessions.map((session: any, i: number) => (
              <tr key={i} className="border-t">
                <td className="p-2 border"><input type="text" value={session.subject}
              onChange={(e) => handleChange(index,i, "subject", e.target.value)} className="border p-2 rounded w-full"/></td>
                <td className="p-2 border"><input type="text" value={session.topic}
              onChange={(e) => handleChange(index,i, "topic", e.target.value)} className="border p-2 rounded w-full"/></td>
                <td className="p-2 border"><input type="text" value={session.activity}
              onChange={(e) => handleChange(index,i, "activity", e.target.value)} className="border p-2 rounded w-full"/></td>
                <td className="p-2 border"><input type="text" value={session.timeInterval}
              onChange={(e) => handleChange(index,i, "timeInterval", e.target.value)} className="border p-2 rounded w-full"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        
      ))}

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 font-semibold rounded hover:bg-blue-700 cursor-pointer"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
