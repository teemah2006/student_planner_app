/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "../../../../utils/firebase";
import { collection, addDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { getServerSession } from "next-auth";
import { getAuth } from "firebase/auth";
import { adminDb } from "../../../../utils/firebaseAdmin";

const youtubeApiKey = process.env.YOUTUBE_API_KEY;

const currentDate = new Date().toISOString().split("T")[0];
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function isLinkValid(url: string): Promise<boolean> {
    try {
        const headResponse = await fetch(url, { method: 'HEAD' });

        if (headResponse.ok) {
            // If HEAD request is successful, optionally do a small GET check
            const getResponse = await fetch(url);
            const text = await getResponse.text();

            // Check for common error words inside the page
            const pageLower = text.toLowerCase();
            if (
                pageLower.includes('page not found') ||
                pageLower.includes('404') ||
                pageLower.includes('expired') ||
                pageLower.includes('not available') ||
                pageLower.includes('error')
            ) {
                console.log(`Invalid page content detected for: ${url}`);
                return false;
            }

            return true;
        } else {
            console.log(`HEAD request failed for: ${url}`);
            return false;
        }
    } catch (error) {
        console.error('Error checking link:', error);
        return false;
    }
}
const fetchRecommendations = async (apiKey: string | undefined, query: string | undefined) => {
    console.log("apikey", apiKey, query)

    // More explicit validation
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
        throw new Error('Missing or invalid API key');
    }

    if (!query || typeof query !== 'string' || query.trim() === '') {
        throw new Error('Missing or invalid query parameter');
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        throw error;
    }
};


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
        const { subject, topics, weakness, style, examDate } = await req.json();
        const session = await getServerSession();
        const validRecommendations: string | any[] | DocumentData = []

        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (style === "visual") {
            const query = `${subject} ${topics} ${weakness}`;

            // Add validation before the function call
            if (!query) {
                throw new Error('Query parameter is required');
            }

            const videos = await fetchRecommendations(youtubeApiKey?.toString(), query);

            // const videos = await fetchRecommendations(youtubeApiKey?.toString(), query);
            console.log('Recommended videos:', videos);



            for (const video of videos) {
                if (validRecommendations.length < 3) {
                    validRecommendations.push({
                        title: video.snippet.title,
                        description: video.snippet.description,
                        suitableFor: 'visual',
                        link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                        type: 'video',
                        subject: subject,
                        topicSent: topics
                    });
                }


                console.log(`Title: ${video.snippet.title}`);
                console.log(`URL: https://www.youtube.com/watch?v=${video.id.videoId}`);
            }

        }


        const prompt = `
              Today's date: ${currentDate}

        You are a smart assistant that provides only REAL, VERIFIED useful study resources based on the user's subject, specific topics, weaknesses, learning style, and exam date.

        Return only resources from **trusted platforms** such as:
        - OpenStax
        - StudyBlue
        - Quizlet
        - Official educational websites (.org, .edu)
        + (NO YouTube, NO Vimeo, NO other video platforms)



       - ONLY include links that are currently active and publicly accessible. 
- Do **not invent** links. Only include actual links that work right now. Test the link before including it. 
- If you're unsure a link is valid, do NOT include it.
+ DO NOT include YouTube links, or any video content. 
+ Only include articles, textbooks, official study tools, or educational websites.
+ Ignore any video recommendations — the assistant (you) will fetch videos separately.



        Respond in this exact JSON format:

        [
          {
            "title": "Name of the resource",
            "topic": "the topic the resource covers"
            "link": "https://actual-link.com",
            "type": "video | book | article | tool",
            "description": "Brief summary of what the resource covers",
            "suitableFor": "visual | auditory | kinesthetic",
            "subject": ${subject},
            "topicSent": ${topics}
          },
          ...
        ]

        Only include 4-6 well-targeted resources.

        User Details:
        - Subject: ${subject}
        - Topics: ${topics}
        - Weaknesses: ${weakness}
        - Learning Style: ${style}
        - Exam Date: ${examDate ? examDate : null}




            `.trim();



        let data = await fetchWithRetry(prompt, 3, 1500);
        // Step 1: Clean the AI response
        if (data) {
            if (data.startsWith("```") && data.endsWith("```")) {
                data = data.slice(3, -3).trim();
            }
            if (data.startsWith("json")) {
                data = data.replace(/^json\s*/, "");
            }

            // Step 2: Parse the cleaned JSON
            const parsed = JSON.parse(data);
            for (const rec of parsed) {
                if (await isLinkValid(rec.link)) {
                    validRecommendations.push(rec)
                }
            }

        }
        if (validRecommendations.length > 0) {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User not authenticated in Firebase");
            }
            const userRecRef = adminDb.collection('users').doc(user.uid).collection('recommendations');
            await addDoc(collection(db, 'recommendations'), {
                ...validRecommendations,
                uid: user.uid,
                createdAt: serverTimestamp(),
            });

            console.log('Fetched recommendations:', validRecommendations);
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'No valid recommendations generated.' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error generating or saving recommendation:', error);
        return NextResponse.json({ error: 'Something went wrong, try checking your connection.' }, { status: 500 });
    }
}




