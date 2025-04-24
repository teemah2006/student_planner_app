import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "../../../../utils/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const currentDate = new Date().toISOString().split("T")[0];
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function isLinkValid(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, { method: "HEAD" }); // HEAD request is faster
        return res.ok;
    } catch (error) {
        console.error(`Invalid link: ${url}`, error);
        return false;
    }
}



export async function POST(req: Request) {

    try {
        const { subject, topics, weaknesses, style, examDate } = await req.json();
        // console.log("Received in API:",  subjects );


        const prompt = `
      Today's date: ${currentDate}
      
You are a smart assistant that provides only REAL, VERIFIED useful study resources based on the user's subject, specific topics, weaknesses, learning style, and exam date.

Return only resources from **trusted platforms** such as:
- YouTube (only verified playlists or videos with working links)
- Khan Academy
- OpenStax
- StudyBlue
- Quizlet
- Official educational websites (.org, .edu)



ONLY include links that are currently active and publicly accessible. Do **not invent** links. Only include actual links that work right now. Test the link before including it. If you're unsure a link is valid, do NOT include it.

Each "link" field must begin with "https://" and lead to a real, reputable resource like YouTube, OpenStax, or Khan Academy.


Respond in this exact JSON format:

[
  {
    "title": "Name of the resource",
    "topic": "the topic the resource covers"
    "link": "https://actual-link.com",
    "type": "video | book | article | tool",
    "description": "Brief summary of what the resource covers",
    "suitableFor": "visual | auditory | kinesthetic"
  },
  ...
]

Only include 4-6 well-targeted resources.

User Details:
- Subject: ${subject}
- Topics: ${topics}
- Weaknesses: ${weaknesses}
- Learning Style: ${style}
- Exam Date: ${examDate ? examDate : null}




    `;

        const response = openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { "role": "system", "content": prompt },
            ],
            temperature: 0.7
        },

            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );


        let data = (await response).choices[0].message.content;

        // Step 1: Clean the AI response
        if (data) {
            if (data.startsWith("```") && data.endsWith("```")) {
                data = data.slice(3, -3).trim();
            }
            if (data.startsWith("json")) {
                data = data.replace(/^json\s*/, "");
            }

            const session = await getServerSession(authOptions);
            if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

            const userEmail = session.user.email;
            // Step 2: Parse the cleaned JSON
            const parsed = JSON.parse(data);
            const validRecommendations = [];

            for (const rec of parsed) {
                const isValid = await isLinkValid(rec.link);
                if (isValid) validRecommendations.push(rec);
            }


            // Step 3: Save to Firebase
            try {
                if (validRecommendations.length > 0) {
                    await addDoc(collection(db, 'recommendations'), {
                       ...validRecommendations,
                      email: userEmail,
                      createdAt: serverTimestamp(),
                    });
                  } else{
                    return NextResponse.json({ error: 'Error saving recommendation. Invalid URIs generated. please try again!' }, { status: 500 })
                  }
                  
                console.log('fetched reco:', data)
                return NextResponse.json({ success: true }, { status: 200 });
            } catch (err) {
                console.error(err);
                return NextResponse.json({ error: 'Error saving recommendation' }, { status: 500 })
            }

        } else {
            return NextResponse.json({ error: "failed to generate recommendation. Please try again!" }, { status: 500 });
        }

    } catch (error) {
        console.error('Error generating or saving recommendation:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

}
