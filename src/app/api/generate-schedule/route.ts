import { NextResponse } from "next/server";
import axios from "axios";
import OpenAI from "openai";

const currentDate = new Date().toISOString().split("T")[0];
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY})
  
export async function POST(req: Request) {
  try {
    const { subjects, hoursPerDay, examDate, preferredTime } = await req.json();

    // OpenAI API Key (Store in .env file)
    // const apiKey = process.env.OPENAI_API_KEY;
    const prompt = `
      Today's date: ${currentDate}
      Create a study schedule for the following details:
      - Subjects: ${subjects.join(", ")}
      - Hours per day: ${hoursPerDay}
      - Exam Date: ${examDate || "No exam date specified"}
      - Preferred time of the day: ${preferredTime}

      Provide a structured study plan for the user,
      add breaks too.
      Format the response as JSON:
      {
        "dailyPlan": [
          {
            "day": "Day 1",
            "date": "14, April 2025",
           "activities": [{"time": [time,subject,activity 1]},],
            
          },
          {
            "day": "Day 2",
            "date": "day 2 date",
            "activities": [{"time": [time,subject,activity 1]},],
            
          }
        ]
      }
    `;

    const response = openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {"role": "system", "content": prompt},
        ],
        temperature: 0.7
      },
    //   {
    //     model: "gpt-4",
    //     messages: [{ role: "system", content: prompt }],
    //     temperature: 0.7,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${apiKey}`,
    //     },
    //   }
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
    return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 });
  }
}
