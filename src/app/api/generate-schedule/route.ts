import { NextResponse } from "next/server";
import OpenAI from "openai";

const currentDate = new Date().toISOString().split("T")[0];
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY})
  
export async function POST(req: Request) {
  
  try {
    const { subjects, hoursPerDay, examDate, preferredTime } = await req.json();
    // console.log("Received in API:",  subjects );

    
    const prompt = `
      Today's date: ${currentDate}
      
You are a helpful AI study assistant.

The user wants to generate a personalized 7-day study plan. Here are their details:

Study hours per day: ${hoursPerDay}
Preferred time of day: ${preferredTime}
${examDate ? `Exam date: ${examDate}` : ""}

Subjects and Topics:
${subjects.map(
  (subject: { subject: string; topics: string[]; }, i: number) =>
    `${i + 1}. ${subject.subject}\n   Topics: ${subject.topics.join(", ")}`
).join("\n")}

Instructions:
- Create a 7-day study schedule.
- Use all subjects and topics provided.
- Spread the study hours across the preferred time of day.
- Mention subject, topics, and time duration for each session.
- include break sessions
- Try to prioritize subjects/topics that may have upcoming exams (if exam date is provided).
- Return the response in *valid JSON* like this:

{
  "dailyPlan": [
    {
      "day": "Day 1",
      "sessions": [
        {
          "subject": "Math",
          "topic": "Algebra",
          "activity": "solve questions"
          "timeInterval": 10:00am - 11:00am,
        },
        ...
      ]
    },
    ...
  ]
}


    `.trim();

    const response = openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {"role": "user", "content": prompt},
        ],
        temperature: 0.7
      }
    );

    let data = (await response).choices[0].message.content;
    
    if (data){
      if (data.startsWith("```") && data.endsWith("```")) {
        data = data.slice(3, -3).trim(); // Remove first and last 3 characters
      }
      
      if (data.startsWith("json") ) {
        data = data.replace(/^json\s*/, ""); // Remove "json" and any spaces/newlines after it
      }
      return NextResponse.json(JSON.parse(data.trim()));
    } else{return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 });}
  } catch (error) {
    // alert(`Failed to generate schedule: ${error}`)
    return NextResponse.json({ error: `Failed to generate schedule ${error}` }, { status: 500 });
  }
}
