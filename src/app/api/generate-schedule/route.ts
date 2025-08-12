/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { adminDb } from "../../../../utils/firebaseAdmin";
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
    const { uid, subjects, hoursPerDay, examType, examDate, preferredTime, startTime } = await req.json();
    // console.log("Received in API:",  subjects );
    const recRef = adminDb.collection("accounts").doc(uid);
    const snapshot = await recRef.get();
    const user = snapshot.data();
    // console.log(user)
    
    const prompt = `
Today's date: ${currentDate}

You are a helpful AI study assistant.

The user wants a personalized 7-day study plan.

User Profile:
- Age: ${user?.age}
- Country: ${user?.country}
- Region: ${user?.region}
- Education Level: ${user?.educationLevel}
- Exam Type: ${examType ? examType : "Not provided"}
- Study hours per day: ${hoursPerDay}
- Preferred time of day: ${preferredTime}
${startTime ? `- Start time: ${startTime}` : ""}
${examDate ? `- Exam date: ${examDate}` : ""}

Subjects and Topics:
${subjects.map(
  (subject: { subject: string; topics: { topic: string, level: string }[]; }, i: number) => {
     const weak = subject.topics.filter(t => t.level === "weak").map(t => t.topic);
    const moderate = subject.topics.filter(t => t.level === "moderate").map(t => t.topic);
    const strong = subject.topics.filter(t => t.level === "strong").map(t => t.topic);

   return `${i + 1}. ${subject.subject}
   Weak Topics: ${weak.length > 0 ? weak.join(", ") : "None"}
   Moderate Topics: ${moderate.length > 0 ? moderate.join(", ") : "None"}
   Strong Topics: ${strong.length > 0 ? strong.join(", ") : "None"}`;
  }).join("\n")}

Personalization Rules:
1. Tailor study activities to the exam type and education level.
2. Prioritize weak topics first, then moderate, then strong.
3. Suggest specific activities for each topic (e.g., "review past questions", "watch tutorial", "practice timed test").
4. Adapt session lengths and break frequency for the user's age.
5. Include culturally relevant resources or tips based on country and region.
6. If exam date is provided, prioritize time-sensitive topics.

Instructions:
- Create a 7-day study schedule in *valid JSON* format.
- Use all subjects and topics provided.
- Spread study hours across the preferred time of day.
- Always include lowercase modifiers in time: 10:00am - 11:00am
- Mention subject, topics, level, activity, and timeInterval for each session.
- Include break sessions with relaxing or energizing suggestions when necessary based on the user's age.
- Make the plan encouraging and motivating for the user.

- Example response in *valid JSON* :

{
  "dailyPlan": [
    {
      "day": "Day 1",
      "sessions": [
        {
          "subject": "Math",
          "topic": "Algebra",
          "level": "weak",
          "activity": "Review WAEC past questions and solve 10 practice problems",
          "timeInterval": "9:00am - 10:00am"
        },
        {
          "subject": "English",
          "topic": "Comprehension",
          "level": "weak",
          "activity": "Practice 3 comprehension passages from WAEC 2022",
          "timeInterval": "10:15am - 11:00am"
        },
        {
          "subject": "Break",
          "topic": ,
          "level": ,
          "activity": "Take a 15-minute walk and drink water",
          "timeInterval": "11:00am - 11:15am"
        }
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
    } else{
      console.log(data)
      return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 });}
  } catch (error) {
    console.log(error)
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
