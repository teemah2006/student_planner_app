"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Calendar, BookOpen, SquareArrowOutUpRight, Goal } from "lucide-react"
import { StudyPlanPreview } from "../Common/studyPlanPreview";
import { useState } from "react";
import { useRouter } from "next/navigation";
const plan = {
  dailyPlan: [
    {
      day: "Day 1",
      sessions: [
        {
          timeInterval: "10:00 AM - 10:30 AM",
          subject: "National Values",
          topic: "People, Places and Objects to respect",
          activity: "Discuss the importance of respect and list people, places, and objects to respect in Nigeria",
          level: "Intermediate"
        },
        {
          timeInterval: "10:30 AM - 11:00 AM",
          subject: "National Values",
          topic: "People, Places and Objects to respect",
          activity: "Create a poster illustrating people, places and objects that deserve respect",
          level: "Beginner"
        },
        {
          timeInterval: "11:00 AM - 11:15 AM",
          subject: "Break",
          topic: "",
          activity: "Take a 15-minute break to stretch and enjoy a snack.",
          level: ""
        },
        {
          timeInterval: "11:15 AM - 11:45 AM",
          subject: "National Values",
          topic: "Values that Show Good Morals",
          activity: "Watch a short video on good morals and discuss what you learned.",
          level: ""
        }
      ]
    },
    {
      day: "Day 2",
      sessions: [
        {
          activity: "Role-play scenarios demonstrating good and bad moral choices with a friend or family member.",
          level: "moderate",
          subject: "National Values",
          timeInterval: "10:00am - 10:30am",
          topic: "Values that Show Good Morals"
        },
        {
          activity: "Create a list of good and bad morals and share it with your family.",
          level: "moderate",
          subject: "National Values",
          timeInterval: "10:30am - 11:00am",
          topic: "Values that Show Good Morals"
        },
        {
          activity: "Go outside for a quick game of catch or jump rope for 15 minutes.",
          level: "",
          subject: "Break",
          timeInterval: "11:00am - 11:15am",
          topic: ""
        },
        {
          activity: "Discuss with a family member the qualities that make a family strong and happy.",
          level: "strong",
          subject: "National Values",
          timeInterval: "11:15am - 11:45am",
          topic: "Qualities of a Good Family"
        }
      ]
    },
    {
      day: "Day 3",
      sessions: [
        {
          activity: "Draw a family tree and write down the qualities of each family member.",
          level: "strong",
          subject: "National Values",
          timeInterval: "10:00am - 10:30am",
          topic: "Qualities of a Good Family"
        },
        {
          activity: "Role-play a family meeting discussing how to improve family relationships.",
          level: "strong",
          subject: "National Values",
          timeInterval: "10:30am - 11:00am",
          topic: "Qualities of a Good Family"
        },
        {
          activity: "Take a 15-minute break to listen to your favorite songs and dance.",
          level: "",
          subject: "Break",
          timeInterval: "11:00am - 11:15am",
          topic: ""
        },
        {
          activity: "Review key points about respect and prepare a short presentation.",
          level: "weak",
          subject: "National Values",
          timeInterval: "11:15am - 11:45am",
          topic: "People, Places and Objects to Respect"
        }
      ]
    },
    {
      day: "Day 4",
      sessions: [
        {
          activity: "Discuss with a family member about a respected leader in your community and why they are respected.",
          level: "weak",
          subject: "National Values",
          timeInterval: "10:00am - 10:30am",
          topic: "People, Places and Objects to Respect"
        },
        {
          activity: "Write a short story that includes examples of good and bad morals.",
          level: "moderate",
          subject: "National Values",
          timeInterval: "10:30am - 11:00am",
          topic: "Values that Show Good Morals"
        },
        {
          activity: "Spend 15 minutes doing a fun puzzle or coloring a picture.",
          level: "",
          subject: "Break",
          timeInterval: "11:00am - 11:15am",
          topic: ""
        },
        {
          activity: "Discuss the importance of each quality and how they apply to your family.",
          level: "strong",
          subject: "National Values",
          timeInterval: "11:15am - 11:45am",
          topic: "Qualities of a Good Family"
        }
      ]
    },
    {
      day: "Day 5",
      sessions: [
        {
          activity: "Create a chart of good and bad moral values and decorate it.",
          level: "moderate",
          subject: "National Values",
          timeInterval: "10:00am - 10:30am",
          topic: "Values that Show Good Morals"
        },
        {
          activity: "Share your chart with your family and explain the importance of good morals.",
          level: "moderate",
          subject: "National Values",
          timeInterval: "10:30am - 11:00am",
          topic: "Values that Show Good Morals"
        },
        {
          activity: "Take a 15-minute break to relax and have a healthy snack.",
          level: "",
          subject: "Break",
          timeInterval: "11:00am - 11:15am",
          topic: ""
        },
        {
          activity: "Write a letter to a family member explaining why they are important to you.",
          level: "strong",
          subject: "National Values",
          timeInterval: "11:15am - 11:45am",
          topic: "Qualities of a Good Family"
        }
      ]
    },
    {
      day: "Day 6",
      sessions: [
        {
          activity: "Review all the key points learned and prepare for a fun quiz with family.",
          level: "weak",
          subject: "National Values",
          timeInterval: "10:00am - 10:30am",
          topic: "People, Places and Objects to Respect"
        },
        {
          activity: "Play a game where you identify scenarios as good or bad morals.",
          level: "moderate",
          subject: "National Values",
          timeInterval: "10:30am - 11:00am",
          topic: "Values that Show Good Morals"
        },
        {
          activity: "Enjoy a 15-minute dance party to your favorite songs.",
          level: "",
          subject: "Break",
          timeInterval: "11:00am - 11:15am",
          topic: ""
        },
        {
          activity: "Prepare a presentation about your family's qualities to share at a family gathering.",
          level: "strong",
          subject: "National Values",
          timeInterval: "11:15am - 11:45am",
          topic: "Qualities of a Good Family"
        }
      ]
    },
    {
      day: "Day 7",
      sessions: [
        {
          activity: "Review all topics covered during the week and take a short quiz with family.",
          level: "all",
          subject: "National Values",
          timeInterval: "10:00am - 10:30am",
          topic: "Review All Topics"
        },
        {
          activity: "Discuss the most important points about respect, morals, and family qualities.",
          level: "all",
          subject: "National Values",
          timeInterval: "10:30am - 11:00am",
          topic: "Final Revision"
        },
        {
          activity: "Take a final 15-minute break to relax and reflect on what you've learned.",
          level: "",
          subject: "Break",
          timeInterval: "11:00am - 11:15am",
          topic: ""
        },
        {
          activity: "Practice presenting your knowledge confidently to a family member.",
          level: "all",
          subject: "National Values",
          timeInterval: "11:15am - 11:45am",
          topic: "Confidence Building"
        }
      ]
    },
  ]
};

export default function LandingPage() {
    const router = useRouter();
    const [showPreview, setShowPreview] = useState(false);
    const closePreview = () => setShowPreview(false);
  return (
    
    <div className="min-h-screen bg-white text-gray-800">
        {showPreview && <StudyPlanPreview plan={plan} onClose={closePreview}/>}
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
          {/* Left side */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Plan Smarter. Study Better. <br /> With <span className="text-yellow-300">StudyEase AI</span>.
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Personalized 7-day timetables, curriculum-guided activities, smart recommendations, and email reminders 30 minutes before your session.
            </p>
            <div className="mt-6 flex gap-4">
              <Button className="bg-white text-blue-600 font-semibold rounded-xl px-6 shadow-lg cursor-pointer" onClick={() => router.push("/authentication")}>
                Get Started Free
              </Button>
              <Button variant={'outline'} className="border-white text-white hover:bg-white hover:text-blue-600 rounded-xl px-6 cursor-pointer" onClick={() => router.push("/authentication")}>
                See How It Works
              </Button>
            </div>
          </div>

          {/* Right side */}
          <div>
            <div className="flex justify-between items-center w-full">
                <h2 className="text-xl font-semibold mb-4 p-2">Study Plan Preview</h2>
                <div>
                    <SquareArrowOutUpRight className="ml-2 text-blue-100 cursor-pointer"
                    onClick={()=> setShowPreview(true)}/>
                </div>
                
            </div>
            
            <div className="flex-1 flex justify-center items-start">
            <div 
            className="overflow-y-auto w-[320px] h-[220px] md:w-[400px] md:h-[280px] bg-white 
            rounded-2xl shadow-xl flex items-start justify-center text-blue-600 font-bold hover:scale-[1.02] transition-transform duration-300">
              <div className="p-4">
                {plan.dailyPlan.map((dayPlan, dayIndex) => (
                  <div key={dayIndex} className="mb-6">
                    <h2 className="text-lg font-semibold text-center text-blue-800 py-4">{dayPlan.day}</h2>
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose StudyEase AI?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="shadow-md border-none bg-blue-50 rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Calendar className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">AI-Powered Timetables</h3>
              <p>Create a personalized 7-day study plan tailored to your strengths and study hours.</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-none bg-blue-50 rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Curriculum-Guided</h3>
              <p>Get study activities aligned with your curriculum for more effective learning.</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-none bg-blue-50 rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Goal className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Recommendations (Auto & Manual)</h3>
              <p>Enable auto recommendations when previewing a timetable, 
                or generate manual recommendations for any topic. YouTube resource integration available.</p>
            </CardContent>
          </Card>


          <Card className="shadow-md border-none bg-blue-50 rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Mail className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Smart Reminders</h3>
              <p>Never miss a session with email reminders 30 minutes before your study time.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <ul className="steps steps-vertical lg:steps-horizontal">
            <li className="step step-info">Create your free account</li>
            <li className="step step-info">Add subjects and topics you want to study</li>
            <li className="step step-info">Generate your timetable. Preview it — check the box to auto-generate recommendations if you like — then save.</li>
            <li className="step step-info">Get a personalized timetable with reminders</li>
          </ul>
          
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-2">Take Control of Your Learning Today</h2>
        <p className="mb-6 text-gray-700">Sign up and create a smarter study routine today.</p>
        <Button className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg" onClick={() => router.push("/authentication")}>
          Start Free
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} StudyEase AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// import React from "react";
// import Image from "next/image";
// import { Images } from "../../../public/Media/Image";
// import { useRouter } from "next/navigation";

// export default function Landing() {
//     const router = useRouter();
//     return (
//         <div className="grid lg:grid-cols-2 lg:grid-rows-none grid-rows-2 lg:justify-items-between  w-full min-h-screen md:gap-16 gap-10">
        
//                 <Image src={Images.studying} alt="student image" className="" loading="lazy" />
//             <div id="description" className="lg:my-auto mb-2 lg:mx-auto mx-4">
//                 <h2 className="text-[25px] lg:text-[40px] md:text-[35px] font-bold"><span className="text-black">Maximize your study time with</span> <span className="text-blue-700">AI-powered planning!</span></h2>
//                 <div className="text-black lg:text-2xl text-sm md:text-xl lg:mt-10 mt-6">Enter your subjects and available hours, and let our smart study planner generate a personalized schedule just for you. Get tailored material recommendations, stay organized,
//                     and make learning stress-free. Start now and study smarter!
//                 </div>
//                 <div className=" w-[100%] flex justify-center mt-4 lg:mt-6">
//                     <button className="lg:p-6 p-[12px] md:p-[15px] bg-blue-700 rounded-xl lg:mt-12  cursor-pointer font-bold hover:bg-blue-900 "
//                         onClick={() => router.push("/authentication")}>
//                         GET STARTED
//                     </button>
//                 </div>

//                 {/* <p className="text-right my-2 md:text-lg text-md text-blue-700 italic">Built with love by Fatimah for Epex 2025</p> */}

//             </div>
//         </div>
//     )
// }