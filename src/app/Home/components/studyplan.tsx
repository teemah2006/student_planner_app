

interface StudyPlan {
    dailyPlan: {
        day: string;
        date: string;
        activities: {
            time: string[];

        }[];
    }[];
}

export default function StudyPlan({ plan }: { plan: StudyPlan }) {
    return (
        <div className="fixed left-0 top-0  bg-transparent bg-opacity-50 w-screen h-screen flex justify-center
        items-center" id="modal">
            <div className=" bg-white rounded-lg  w-auto   overflow-auto h-[90%]">
                <div className="p-6">

                
                <h2 className="text-xl font-semibold mb-4">📖 Study Plan</h2>
                {plan.dailyPlan.map((day, index) => (
                    <div key={index}>
                        <table className="table-auto">
                            <thead>
                                <tr className="font-semibold text-lg"><td>{day.day} {day.date}</td></tr>
                                <tr>
                                    <th>Time</th>
                                    <th>Subject</th>
                                    <th>Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {day.activities.map((activity, index) =>
                                    <tr key={index}>
                                        <td>{activity.time[0]}</td>
                                        <td>{activity.time[1]}</td>
                                        <td>{activity.time[2]}</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                ))}
                </div>
                <div className="sticky bottom-0 bg-white w-full z-2 p-2 flex justify-end gap-4 box-border">
                    <button className="bg-white border border-gray-600 cursor-pointer p-2 rounded text-gray-600 hover:bg-red-700 hover:border-transparent
                    hover:text-white box-border px-4" 
                    onClick={() => document.getElementById("modal")?.classList.add("hidden")}>Cancel</button>
                    <button className="bg-green-700 cursor-pointer px-4 p-2 rounded text-white  hover:bg-green-800 ">Save</button>
                </div>
            </div>
        </div>
    )
}