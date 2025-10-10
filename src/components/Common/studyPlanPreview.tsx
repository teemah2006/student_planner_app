'use client';
import { StudyPlanProps } from "@/interfaces";
import {CircleX} from "lucide-react";

export function StudyPlanPreview({ plan, onClose }: { plan: StudyPlanProps, onClose: () => void }) {
    return (

        <div id="modal" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 text-black w-[90%] max-h-[90%] overflow-auto p-4 relative">

                {/* Your modal content (study plan) */}
                <div className="p-6 overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold mb-4">Study Plan</h2>
                        <button
                            onClick={() => onClose()}
                        >
                            <CircleX className="h-6 w-6 cursor-pointer" />
                        </button>
                    </div>

                    {plan.dailyPlan.map((dayPlan, dayIndex) => (
                        <div key={dayIndex} className="mb-6">
                            <h2 className="text-xl font-semibold text-center text-blue-800 py-4">{dayPlan.day}</h2>
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-blue-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Time</th>
                                        <th className="py-3 px-4 text-left">Subject</th>
                                        <th className="py-3 px-4 text-left">Topic</th>
                                        <th className="py-3 px-4 text-left">Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dayPlan.sessions.map((session, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="py-2 px-4">{session.timeInterval}</td>
                                            <td className="py-2 px-4">{session.subject}</td>
                                            <td className="py-2 px-4">{session.topic}</td>
                                            <td className="py-2 px-4">{session.activity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}