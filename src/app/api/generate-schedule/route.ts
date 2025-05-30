/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import OpenAI from "openai";

const currentDate = new Date().toISOString().split("T")[0];
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY})

    async function fetchWithRetry(prompt: string, retries = 3, delay = 1000) {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          });
    
          return response.choices[0].message.content;
        } catch (error: any) {
          const status = error?.status || error?.response?.status;
    
          if (status === 429 || status >= 500) {
            // Transient error – retry
            console.warn(`Attempt ${attempt + 1} failed. Retrying...`);
            await new Promise((res) => setTimeout(res, delay));
          } else {
            // Critical error – don’t retry
            throw error;
          }
        }
      }
      throw new Error("Max retries reached. Failed to fetch from OpenAI.");
    }
    
  
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

   

    let data = await fetchWithRetry(prompt, 3, 1500);

    
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

// import { NextRequest, NextResponse } from "next/server";
// import { adminAuth, adminDb } from "../../../../utils/firebaseAdmin";
// export async function DELETE(req: NextRequest) {
//   const authHeader = req.headers.get("authorization");
//   const token = authHeader?.split("Bearer ")[1];

//   if (!token) {
//     return NextResponse.json({ error: "No token provided" }, { status: 401 });
//   }

//   const body = await req.json();
//   const { recommendationId } = body;

//   if (!recommendationId) {
//     return NextResponse.json({ error: "No recommendation ID provided" }, { status: 400 });
//   }

//   try {
//     const decodedToken = await adminAuth.verifyIdToken(token);
//     const uid = decodedToken.uid;

//     const recRef = adminDb
//       .collection("users")
//       .doc(uid)
//       .collection("recommendations")
//       .doc(recommendationId);
    
  

//     // await recRef.delete();

//     return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
//   } catch (err) {
//     console.error("Delete error:", err);
//     return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
//   }
// }
